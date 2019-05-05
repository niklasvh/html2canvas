import {CacheStorage} from '../cache-storage';
import {URL} from 'url';

export const proxy = 'http://example.com/proxy';

export const createMockContext = (origin: string, opts = {}) => {
    const context = {
        location: {
            href: origin
        },
        document: {
            createElement(_name: string) {
                let _href = '';
                return {
                    set href(value: string) {
                        _href = value;
                    },
                    get href() {
                        return _href;
                    },
                    get protocol() {
                        return new URL(_href).protocol;
                    },
                    get hostname() {
                        return new URL(_href).hostname;
                    },
                    get port() {
                        return new URL(_href).port;
                    }
                };
            }
        }
    };

    CacheStorage.setContext(context as Window);
    return CacheStorage.create('test', {
        imageTimeout: 0,
        useCORS: false,
        allowTaint: false,
        proxy,
        ...opts
    });
};
