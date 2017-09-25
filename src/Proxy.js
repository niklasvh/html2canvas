/* @flow */
'use strict';

import type Options from './index';

import FEATURES from './Feature';

export const Proxy = (src: string, options: Options): Promise<string> => {
    if (!options.proxy) {
        return Promise.reject(__DEV__ ? 'No proxy defined' : null);
    }
    const proxy = options.proxy;

    return new Promise((resolve, reject) => {
        const responseType =
            FEATURES.SUPPORT_CORS_XHR && FEATURES.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
        const xhr = FEATURES.SUPPORT_CORS_XHR ? new XMLHttpRequest() : new XDomainRequest();
        xhr.onload = () => {
            if (xhr instanceof XMLHttpRequest) {
                if (xhr.status === 200) {
                    if (responseType === 'text') {
                        resolve(xhr.response);
                    } else {
                        const reader = new FileReader();
                        // $FlowFixMe
                        reader.addEventListener('load', () => resolve(reader.result), false);
                        // $FlowFixMe
                        reader.addEventListener('error', e => reject(e), false);
                        reader.readAsDataURL(xhr.response);
                    }
                } else {
                    reject(
                        __DEV__
                            ? `Failed to proxy resource ${src.substring(
                                  0,
                                  256
                              )} with status code ${xhr.status}`
                            : ''
                    );
                }
            } else {
                resolve(xhr.responseText);
            }
        };

        xhr.onerror = reject;
        xhr.open('GET', `${proxy}?url=${encodeURIComponent(src)}&responseType=${responseType}`);

        if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
            xhr.responseType = responseType;
        }

        if (options.imageTimeout) {
            const timeout = options.imageTimeout;
            xhr.timeout = timeout;
            xhr.ontimeout = () =>
                reject(__DEV__ ? `Timed out (${timeout}ms) proxying ${src.substring(0, 256)}` : '');
        }

        xhr.send();
    });
};
