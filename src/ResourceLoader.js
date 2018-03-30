/* @flow */
'use strict';

import type Options from './index';
import type Logger from './Logger';

export type ImageElement = Image | HTMLCanvasElement;
export type Resource = ImageElement;
type ResourceCache = {[string]: Promise<Resource>};

import FEATURES from './Feature';
import {Proxy} from './Proxy';

export default class ResourceLoader {
    origin: string;
    options: Options;
    _link: HTMLAnchorElement;
    cache: ResourceCache;
    logger: Logger;
    _index: number;
    _window: WindowProxy;

    constructor(options: Options, logger: Logger, window: WindowProxy) {
        this.options = options;
        this._window = window;
        this.origin = this.getOrigin(window.location.href);
        this.cache = {};
        this.logger = logger;
        this._index = 0;
    }

    loadImage(src: string): ?string {
        if (this.hasResourceInCache(src)) {
            return src;
        }
        if (isBlobImage(src)) {
            this.cache[src] = loadImage(src, this.options.imageTimeout || 0);
            return src;
        }

        if (!isSVG(src) || FEATURES.SUPPORT_SVG_DRAWING) {
            if (this.options.allowTaint === true || isInlineImage(src) || this.isSameOrigin(src)) {
                return this.addImage(src, src, false);
            } else if (!this.isSameOrigin(src)) {
                if (typeof this.options.proxy === 'string') {
                    this.cache[src] = Proxy(src, this.options).then(src =>
                        loadImage(src, this.options.imageTimeout || 0)
                    );
                    return src;
                } else if (this.options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES) {
                    return this.addImage(src, src, true);
                }
            }
        }
    }

    inlineImage(src: string): Promise<Resource> {
        if (isInlineImage(src)) {
            return loadImage(src, this.options.imageTimeout || 0);
        }
        if (this.hasResourceInCache(src)) {
            return this.cache[src];
        }
        if (!this.isSameOrigin(src) && typeof this.options.proxy === 'string') {
            return (this.cache[src] = Proxy(src, this.options).then(src =>
                loadImage(src, this.options.imageTimeout || 0)
            ));
        }

        return this.xhrImage(src);
    }

    xhrImage(src: string): Promise<Resource> {
        this.cache[src] = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        reject(
                            `Failed to fetch image ${src.substring(
                                0,
                                256
                            )} with status code ${xhr.status}`
                        );
                    } else {
                        const reader = new FileReader();
                        reader.addEventListener(
                            'load',
                            () => {
                                // $FlowFixMe
                                const result: string = reader.result;
                                resolve(result);
                            },
                            false
                        );
                        reader.addEventListener('error', (e: Event) => reject(e), false);
                        reader.readAsDataURL(xhr.response);
                    }
                }
            };
            xhr.responseType = 'blob';
            if (this.options.imageTimeout) {
                const timeout = this.options.imageTimeout;
                xhr.timeout = timeout;
                xhr.ontimeout = () =>
                    reject(
                        __DEV__ ? `Timed out (${timeout}ms) fetching ${src.substring(0, 256)}` : ''
                    );
            }
            xhr.open('GET', src, true);
            xhr.send();
        }).then(src => loadImage(src, this.options.imageTimeout || 0));

        return this.cache[src];
    }

    loadCanvas(node: HTMLCanvasElement): string {
        const key = String(this._index++);
        this.cache[key] = Promise.resolve(node);
        return key;
    }

    hasResourceInCache(key: string): boolean {
        return typeof this.cache[key] !== 'undefined';
    }

    addImage(key: string, src: string, useCORS: boolean): string {
        if (__DEV__) {
            this.logger.log(`Added image ${key.substring(0, 256)}`);
        }

        const imageLoadHandler = (supportsDataImages: boolean): Promise<Image> =>
            new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
                if (!supportsDataImages || useCORS) {
                    img.crossOrigin = 'anonymous';
                }

                img.onerror = reject;
                img.src = src;
                if (img.complete === true) {
                    // Inline XML images may fail to parse, throwing an Error later on
                    setTimeout(() => {
                        resolve(img);
                    }, 500);
                }
                if (this.options.imageTimeout) {
                    const timeout = this.options.imageTimeout;
                    setTimeout(
                        () =>
                            reject(
                                __DEV__
                                    ? `Timed out (${timeout}ms) fetching ${src.substring(0, 256)}`
                                    : ''
                            ),
                        timeout
                    );
                }
            });

        this.cache[key] =
            isInlineBase64Image(src) && !isSVG(src)
                ? // $FlowFixMe
                  FEATURES.SUPPORT_BASE64_DRAWING(src).then(imageLoadHandler)
                : imageLoadHandler(true);
        return key;
    }

    isSameOrigin(url: string): boolean {
        return this.getOrigin(url) === this.origin;
    }

    getOrigin(url: string): string {
        const link = this._link || (this._link = this._window.document.createElement('a'));
        link.href = url;
        link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
        return link.protocol + link.hostname + link.port;
    }

    ready(): Promise<ResourceStore> {
        const keys: Array<string> = Object.keys(this.cache);
        const values: Array<Promise<?Resource>> = keys.map(str =>
            this.cache[str].catch(e => {
                if (__DEV__) {
                    this.logger.log(`Unable to load image`, e);
                }
                return null;
            })
        );
        return Promise.all(values).then((images: Array<?Resource>) => {
            if (__DEV__) {
                this.logger.log(`Finished loading ${images.length} images`, images);
            }
            return new ResourceStore(keys, images);
        });
    }
}

export class ResourceStore {
    _keys: Array<string>;
    _resources: Array<?Resource>;

    constructor(keys: Array<string>, resources: Array<?Resource>) {
        this._keys = keys;
        this._resources = resources;
    }

    get(key: string): ?Resource {
        const index = this._keys.indexOf(key);
        return index === -1 ? null : this._resources[index];
    }
}

const INLINE_SVG = /^data:image\/svg\+xml/i;
const INLINE_BASE64 = /^data:image\/.*;base64,/i;
const INLINE_IMG = /^data:image\/.*/i;

const isInlineImage = (src: string): boolean => INLINE_IMG.test(src);
const isInlineBase64Image = (src: string): boolean => INLINE_BASE64.test(src);
const isBlobImage = (src: string): boolean => src.substr(0, 4) === 'blob';

const isSVG = (src: string): boolean =>
    src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);

const loadImage = (src: string, timeout: number): Promise<Image> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
        if (img.complete === true) {
            // Inline XML images may fail to parse, throwing an Error later on
            setTimeout(() => {
                resolve(img);
            }, 500);
        }
        if (timeout) {
            setTimeout(
                () => reject(__DEV__ ? `Timed out (${timeout}ms) loading image` : ''),
                timeout
            );
        }
    });
};
