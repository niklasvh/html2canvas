/* @flow */
'use strict';

import type Options from './index';
import type Logger from './Logger';

export type ImageElement = Image | HTMLCanvasElement;
type ImageCache<T> = {[string]: Promise<T>};

import FEATURES from './Feature';
import {Proxy} from './Proxy';

// $FlowFixMe
export default class ImageLoader<T> {
    origin: string;
    options: Options;
    _link: HTMLAnchorElement;
    cache: ImageCache<T>;
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
        if (this.hasImageInCache(src)) {
            return src;
        }

        if (isSVG(src)) {
            if (this.options.allowTaint === true || FEATURES.SUPPORT_SVG_DRAWING) {
                return this.addImage(src, src, false);
            }
        } else {
            if (
                this.options.allowTaint === true ||
                isInlineBase64Image(src) ||
                this.isSameOrigin(src)
            ) {
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

    inlineImage(src: string): Promise<Image> {
        if (isInlineImage(src)) {
            return loadImage(src, this.options.imageTimeout || 0);
        }
        if (this.hasImageInCache(src)) {
            return this.cache[src];
        }
        if (!this.isSameOrigin(src) && typeof this.options.proxy === 'string') {
            return (this.cache[src] = Proxy(src, this.options).then(src =>
                loadImage(src, this.options.imageTimeout || 0)
            ));
        }

        return this.xhrImage(src);
    }

    xhrImage(src: string): Promise<Image> {
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
                        // $FlowFixMe
                        reader.addEventListener('load', () => resolve(reader.result), false);
                        // $FlowFixMe
                        reader.addEventListener('error', e => reject(e), false);
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

    hasImageInCache(key: string): boolean {
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

    ready(): Promise<ImageStore<T>> {
        const keys = Object.keys(this.cache);
        return Promise.all(
            keys.map(str =>
                this.cache[str].catch(e => {
                    if (__DEV__) {
                        this.logger.log(`Unable to load image`, e);
                    }
                    return null;
                })
            )
        ).then(images => {
            if (__DEV__) {
                this.logger.log(`Finished loading ${images.length} images`, images);
            }
            return new ImageStore(keys, images);
        });
    }
}

export class ImageStore<T> {
    _keys: Array<string>;
    _images: Array<?T>;

    constructor(keys: Array<string>, images: Array<?T>) {
        this._keys = keys;
        this._images = images;
    }

    get(key: string): ?T {
        const index = this._keys.indexOf(key);
        return index === -1 ? null : this._images[index];
    }
}

const INLINE_SVG = /^data:image\/svg\+xml/i;
const INLINE_BASE64 = /^data:image\/.*;base64,/i;
const INLINE_IMG = /^data:image\/.*/i;

const isInlineImage = (src: string): boolean => INLINE_IMG.test(src);
const isInlineBase64Image = (src: string): boolean => INLINE_BASE64.test(src);

const isSVG = (src: string): boolean =>
    src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);

const loadImage = (src: string, timeout: number) => {
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
