import {testList, ignoredTests} from '../build/reftests';
// @ts-ignore
import {default as platform} from 'platform';
// @ts-ignore
import Promise from 'es6-promise';
import {ScreenshotRequest} from './types';

// @ts-ignore
window.Promise = Promise;
const testRunnerUrl = location.href;
const hasHistoryApi = typeof window.history !== 'undefined' && typeof window.history.replaceState !== 'undefined';

const uploadResults = (canvas: HTMLCanvasElement, url: string) => {
    return new Promise((resolve: () => void, reject: (error: string) => void) => {
        // @ts-ignore
        const xhr = 'withCredentials' in new XMLHttpRequest() ? new XMLHttpRequest() : new XDomainRequest();

        xhr.onload = () => {
            if (typeof xhr.status !== 'number' || xhr.status === 200) {
                resolve();
            } else {
                reject(`Failed to send screenshot with status ${xhr.status}`);
            }
        };
        xhr.onerror = reject;

        const request: ScreenshotRequest = {
            screenshot: canvas.toDataURL(),
            test: url,
            platform: {
                name: platform.name,
                version: platform.version
            },
            devicePixelRatio: window.devicePixelRatio || 1,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        };

        xhr.open('POST', 'http://localhost:8000/screenshot', true);
        xhr.send(JSON.stringify(request));
    });
};

testList
    .filter((test) => {
        return !Array.isArray(ignoredTests[test]) || ignoredTests[test].indexOf(platform.name || '') === -1;
    })
    .forEach((url) => {
        describe(url, function () {
            this.timeout(60000);
            this.retries(2);
            const windowWidth = 800;
            const windowHeight = 600;
            const testContainer = document.createElement('iframe');
            testContainer.width = windowWidth.toString();
            testContainer.height = windowHeight.toString();
            testContainer.style.visibility = 'hidden';
            testContainer.style.position = 'fixed';
            testContainer.style.left = '10000px';

            before((done) => {
                testContainer.onload = () => done();

                testContainer.src = url + '?selenium&run=false&reftest&' + Math.random();
                if (hasHistoryApi) {
                    // Chrome does not resolve relative background urls correctly inside of a nested iframe
                    try {
                        history.replaceState(null, '', url);
                    } catch (e) {}
                }

                document.body.appendChild(testContainer);
            });
            after(() => {
                if (hasHistoryApi) {
                    try {
                        history.replaceState(null, '', testRunnerUrl);
                    } catch (e) {}
                }
                document.body.removeChild(testContainer);
            });

            it('Should render untainted canvas', async () => {
                const contentWindow = testContainer.contentWindow;
                if (!contentWindow) {
                    throw new Error('Window not found for iframe');
                }

                contentWindow.addEventListener('unhandledrejection', (event) => {
                    console.error(event.reason);
                    throw new Error(`unhandledrejection: ${JSON.stringify(event.reason)}`);
                });

                const canvas: HTMLCanvasElement = await contentWindow
                    // @ts-ignore
                    .html2canvas(contentWindow.forceElement || contentWindow.document.documentElement, {
                        removeContainer: true,
                        backgroundColor: '#ffffff',
                        proxy: 'http://localhost:8081/proxy',
                        // @ts-ignore
                        ...(contentWindow.h2cOptions || {})
                    });

                try {
                    (canvas.getContext('2d') as CanvasRenderingContext2D).getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                } catch (e) {
                    throw new Error('Canvas is tainted');
                }

                // @ts-ignore
                if (window.__karma__) {
                    return uploadResults(canvas, url);
                }
            });
        });
    });
