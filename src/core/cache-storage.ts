import {FEATURES} from './features';
import {Logger} from './logger';

export class CacheStorage {
    private static _caches: {[key: string]: Cache} = {};
    private static _link?: HTMLAnchorElement;
    private static _origin = 'about:blank';
    private static _current: Cache | null = null;

    static create(name: string, options: ResourceOptions): Cache {
        return (CacheStorage._caches[name] = new Cache(name, options));
    }

    static destroy(name: string): void {
        delete CacheStorage._caches[name];
    }

    static open(name: string): Cache {
        const cache = CacheStorage._caches[name];
        if (typeof cache !== 'undefined') {
            return cache;
        }

        throw new Error(`Cache with key "${name}" not found`);
    }

    static getOrigin(url: string): string {
        const link = CacheStorage._link;
        if (!link) {
            return 'about:blank';
        }

        link.href = url;
        link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
        return link.protocol + link.hostname + link.port;
    }

    static isSameOrigin(src: string): boolean {
        return CacheStorage.getOrigin(src) === CacheStorage._origin;
    }

    static setContext(window: Window): void {
        CacheStorage._link = window.document.createElement('a');
        CacheStorage._origin = CacheStorage.getOrigin(window.location.href);
    }

    static getInstance(): Cache {
        const current = CacheStorage._current;
        if (current === null) {
            throw new Error(`No cache instance attached`);
        }
        return current;
    }

    static attachInstance(cache: Cache): void {
        CacheStorage._current = cache;
    }

    static detachInstance(): void {
        CacheStorage._current = null;
    }
}

export interface ResourceOptions {
    imageTimeout: number;
    useCORS: boolean;
    allowTaint: boolean;
    proxy?: string;
}

export class Cache {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _cache: {[key: string]: Promise<any>};
    private readonly _options: ResourceOptions;
    private readonly id: string;

    constructor(id: string, options: ResourceOptions) {
        this.id = id;
        this._options = options;
        this._cache = {};
    }

    addImage(src: string): Promise<void> {
        const result = Promise.resolve();
        if (this.has(src)) {
            return result;
        }

        if (isBlobImage(src) || isRenderable(src)) {
            (this._cache[src] = this.loadImage(src)).catch(() => {
                // prevent unhandled rejection
            });
            return result;
        }

        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    match(src: string): Promise<any> {
        return this._cache[src];
    }

    private async loadImage(key: string) {
        const isSameOrigin = CacheStorage.isSameOrigin(key);
        const useCORS =
            !isInlineImage(key) && this._options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES && !isSameOrigin;
        const useProxy =
            !isInlineImage(key) &&
            !isSameOrigin &&
            !isBlobImage(key) &&
            typeof this._options.proxy === 'string' &&
            FEATURES.SUPPORT_CORS_XHR &&
            !useCORS;
        if (
            !isSameOrigin &&
            this._options.allowTaint === false &&
            !isInlineImage(key) &&
            !isBlobImage(key) &&
            !useProxy &&
            !useCORS
        ) {
            return;
        }

        let src = key;
        if (useProxy) {
            src = await this.proxy(src);
        }

        Logger.getInstance(this.id).debug(`Added image ${key.substring(0, 256)}`);

        return await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
            if (isInlineBase64Image(src) || useCORS) {
                img.crossOrigin = 'anonymous';
            }
            img.src = src;
            if (img.complete === true) {
                // Inline XML images may fail to parse, throwing an Error later on
                setTimeout(() => resolve(img), 500);
            }
            if (this._options.imageTimeout > 0) {
                setTimeout(
                    () => reject(`Timed out (${this._options.imageTimeout}ms) loading image`),
                    this._options.imageTimeout
                );
            }
        });
    }

    private has(key: string): boolean {
        return typeof this._cache[key] !== 'undefined';
    }

    keys(): Promise<string[]> {
        return Promise.resolve(Object.keys(this._cache));
    }

    private proxy(src: string): Promise<string> {
        const proxy = this._options.proxy;

        if (!proxy) {
            throw new Error('No proxy defined');
        }

        const key = src.substring(0, 256);

        return new Promise((resolve, reject) => {
            const responseType = FEATURES.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    if (responseType === 'text') {
                        resolve(xhr.response);
                    } else {
                        const reader = new FileReader();
                        reader.addEventListener('load', () => resolve(reader.result as string), false);
                        reader.addEventListener('error', (e) => reject(e), false);
                        reader.readAsDataURL(xhr.response);
                    }
                } else {
                    reject(`Failed to proxy resource ${key} with status code ${xhr.status}`);
                }
            };

            xhr.onerror = reject;
            const queryString = proxy.indexOf('?') > -1 ? '&' : '?';
            xhr.open('GET', `${proxy}${queryString}url=${encodeURIComponent(src)}&responseType=${responseType}`);

            if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
                xhr.responseType = responseType;
            }

            if (this._options.imageTimeout) {
                const timeout = this._options.imageTimeout;
                xhr.timeout = timeout;
                xhr.ontimeout = () => reject(`Timed out (${timeout}ms) proxying ${key}`);
            }

            xhr.send();
        });
    }
}

const INLINE_SVG = /^data:image\/svg\+xml/i;
const INLINE_BASE64 = /^data:image\/.*;base64,/i;
const INLINE_IMG = /^data:image\/.*/i;

const isRenderable = (src: string): boolean => FEATURES.SUPPORT_SVG_DRAWING || !isSVG(src);
const isInlineImage = (src: string): boolean => INLINE_IMG.test(src);
const isInlineBase64Image = (src: string): boolean => INLINE_BASE64.test(src);
const isBlobImage = (src: string): boolean => src.substr(0, 4) === 'blob';

const isSVG = (src: string): boolean => src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);
