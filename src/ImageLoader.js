/* @flow */
'use strict';

import type Options from './index';
import type Logger from './Logger';

export type ImageElement = Image | HTMLCanvasElement;
type ImageCache = {[string]: Promise<?ImageElement>};

import FEATURES from './Feature';

export default class ImageLoader {
    origin: string;
    options: Options;
    _link: HTMLAnchorElement;
    cache: ImageCache;
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
                return this.addImage(src, src);
            }
        } else {
            if (this.options.allowTaint === true || isInlineImage(src) || this.isSameOrigin(src)) {
                return this.addImage(src, src);
            } else if (typeof this.options.proxy === 'string' && !this.isSameOrigin(src)) {
                // TODO proxy
            }
        }
    }

    loadCanvas(node: HTMLCanvasElement): string {
        const key = String(this._index++);
        this.cache[key] = Promise.resolve(node);
        return key;
    }

    hasImageInCache(key: string): boolean {
        return typeof this.cache[key] !== 'undefined';
    }

    addImage(key: string, src: string): string {
        if (__DEV__) {
            this.logger.log(`Added image ${key.substring(0, 256)}`);
        }

        const imageLoadHandler = (supportsDataImages: boolean): Promise<Image> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
                if (!supportsDataImages) {
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
            });
        };

        this.cache[key] = isInlineImage(src)
            ? FEATURES.SUPPORT_BASE64_DRAWING.then(imageLoadHandler)
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

    ready(): Promise<ImageStore> {
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
                this.logger.log('Finished loading images', images);
            }
            return new ImageStore(keys, images);
        });
    }
}

export class ImageStore {
    _keys: Array<string>;
    _images: Array<?ImageElement>;

    constructor(keys: Array<string>, images: Array<?ImageElement>) {
        this._keys = keys;
        this._images = images;
    }

    get(key: string): ?ImageElement {
        const index = this._keys.indexOf(key);
        return index === -1 ? null : this._images[index];
    }
}

const INLINE_SVG = /^data:image\/svg\+xml/i;
const INLINE_BASE64 = /^data:image\/.*;base64,/i;

const isInlineImage = (src: string): boolean => INLINE_BASE64.test(src);

const isSVG = (src: string): boolean =>
    src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);
