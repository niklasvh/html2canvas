/* @flow */
'use strict';

import type NodeContainer from './NodeContainer';
import type Options from './index';
import type Logger from './Logger';

type ImageCache = {[string]: Promise<Image>};

export default class ImageLoader {
    origin: string;
    options: Options;
    _link: HTMLAnchorElement;
    cache: ImageCache;
    logger: Logger;

    constructor(options: Options, logger: Logger) {
        this.options = options;
        this.origin = this.getOrigin(window.location.href);
        this.cache = {};
        this.logger = logger;
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
            /*
            if (cors) {
             img.crossOrigin = 'anonymous';
            }
            */
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
        return Promise.all(keys.map(str => this.cache[str])).then(images => {
            if (__DEV__) {
                this.logger.log('Finished loading images', images);
            }
            return new ImageStore(keys, images);
        });
    }
}

export class ImageStore {
    _keys: Array<string>;
    _images: Array<HTMLImageElement>;

    constructor(keys: Array<string>, images: Array<HTMLImageElement>) {
        this._keys = keys;
        this._images = images;
    }

    get(key: string): ?HTMLImageElement {
        const index = this._keys.indexOf(key);
        return index === -1 ? null : this._images[index];
    }
}
