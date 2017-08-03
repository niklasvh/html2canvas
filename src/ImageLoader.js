/* @flow */
'use strict';

import type Options from './index';
import type Logger from './Logger';

export type ImageElement = Image | HTMLCanvasElement;
type ImageCache = {[string]: Promise<?ImageElement>};

export default class ImageLoader {
    origin: string;
    options: Options;
    _link: HTMLAnchorElement;
    cache: ImageCache;
    logger: Logger;
    _index: number;

    constructor(options: Options, logger: Logger) {
        this.options = options;
        this.origin = this.getOrigin(window.location.href);
        this.cache = {};
        this.logger = logger;
        this._index = 0;
    }

    loadImage(src: string): ?string {
        if (this.hasImageInCache(src)) {
            return src;
        }

        if (this.options.allowTaint === true || this.isInlineImage(src) || this.isSameOrigin(src)) {
            return this.addImage(src, src);
        } else if (typeof this.options.proxy === 'string' && !this.isSameOrigin(src)) {
            // TODO proxy
        }
    }

    loadCanvas(node: HTMLCanvasElement): string {
        const key = String(this._index++);
        this.cache[key] = Promise.resolve(node);
        return key;
    }

    isInlineImage(src: string): boolean {
        return /data:image\/.*;base64,/i.test(src);
    }

    hasImageInCache(key: string): boolean {
        return typeof this.cache[key] !== 'undefined';
    }

    addImage(key: string, src: string): string {
        if (__DEV__) {
            this.logger.log(`Added image ${key.substring(0, 256)}`);
        }
        this.cache[key] = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
            if (img.complete === true) {
                resolve(img);
            }
        });
        return key;
    }

    isSameOrigin(url: string): boolean {
        return this.getOrigin(url) === this.origin;
    }

    getOrigin(url: string): string {
        const link = this._link || (this._link = document.createElement('a'));
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
