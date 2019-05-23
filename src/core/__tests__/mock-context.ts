import {CacheStorage} from '../cache-storage';
import {URL} from 'url';
import {Logger} from '../logger';

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
    Logger.create('test');
    return CacheStorage.create('test', {
        imageTimeout: 0,
        useCORS: false,
        allowTaint: false,
        proxy,
        ...opts
    });
};
