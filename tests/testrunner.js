import {expect} from 'chai';
import parseRefTest from '../scripts/parse-reftest';
import reftests from './reftests';
import querystring from 'querystring';
import platform from 'platform';
import Promise from 'promise-polyfill';

const DOWNLOAD_REFTESTS = false;
const query = querystring.parse(location.search.replace(/^\?/, ''));

const downloadResult = (filename, data) => {
    const downloadUrl = URL.createObjectURL(new Blob([data], {type: 'text/plain'}));
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;

    setTimeout(() => {
        a.click();
        URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
    }, 100);

    document.body.appendChild(a);
};

const assertPath = (result, expected, desc) => {
    expect(result.length).to.equal(expected.length, `${desc} path length`);

    expected.forEach((e, i) => {
        const r = result[i];
        expect(r.type).to.equal(e.type, `${desc} type`);
        if (Array.isArray(r)) {
            assertPath(r, e, desc);
        } else {
            switch (r.type) {
                case 'Circle':
                    expect(r.x).to.be.closeTo(e.x, 10, `${desc} Circle #${i + 1} x`);
                    expect(r.y).to.be.closeTo(e.y, 10, `${desc} Circle #${i + 1} y`);
                    expect(r.r).to.be.closeTo(e.r, 5, `${desc} Circle #${i + 1} r`);
                    break;
                case 'Vector':
                    expect(r.x).to.be.closeTo(e.x, 10, `${desc} vector #${i + 1} x`);
                    expect(r.y).to.be.closeTo(e.y, 10, `${desc} vector #${i + 1} y`);
                    break;
                case 'BezierCurve':
                    expect(r.x0).to.be.closeTo(e.x0, 10, `${desc} beziercurve #${i + 1} x0`);
                    expect(r.y0).to.be.closeTo(e.y0, 10, `${desc} beziercurve #${i + 1} y0`);
                    expect(r.x1).to.be.closeTo(e.x1, 10, `${desc} beziercurve #${i + 1} x1`);
                    expect(r.y1).to.be.closeTo(e.y1, 10, `${desc} beziercurve #${i + 1} y1`);
                    expect(r.cx0).to.be.closeTo(e.cx0, 10, `${desc} beziercurve #${i + 1} cx0`);
                    expect(r.cy0).to.be.closeTo(e.cy0, 10, `${desc} beziercurve #${i + 1} cy0`);
                    expect(r.cx1).to.be.closeTo(e.cx1, 10, `${desc} beziercurve #${i + 1} cx1`);
                    expect(r.cy1).to.be.closeTo(e.cy1, 10, `${desc} beziercurve #${i + 1} cy1`);
                    break;
                default:
                    throw new Error(`Unknown path type ${r.type}`);
            }
        }
    });
};

(() => {
    const testRunnerUrl = location.href;
    const hasHistoryApi =
        typeof window.history !== 'undefined' && typeof window.history.replaceState !== 'undefined';

    if (typeof reftests === 'undefined') {
        it('Test harness prerequisite check', () => {
            throw new Error(
                'No reftests list defined, run "npm run create-reftest-list" to create it'
            );
        });
    } else {
        Object.keys(reftests.testList)
            .filter(test => {
                return (
                    !Array.isArray(reftests.ignoredTests[test]) ||
                    reftests.ignoredTests[test].indexOf(query.browser) === -1
                );
            })
            .forEach(url => {
                describe(url, function() {
                    this.timeout(60000);
                    this.retries(2);
                    const windowWidth = 800;
                    const windowHeight = 600;
                    const testContainer = document.createElement('iframe');
                    const REFTEST = reftests.testList[url];
                    testContainer.width = windowWidth;
                    testContainer.height = windowHeight;
                    testContainer.style.visibility = 'hidden';
                    testContainer.style.position = 'fixed';
                    testContainer.style.left = '10000px';

                    before(done => {
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
                    it('Should render untainted canvas', () => {
                        return testContainer.contentWindow
                            .html2canvas(
                                testContainer.contentWindow.forceElement ||
                                    testContainer.contentWindow.document.documentElement,
                                {
                                    removeContainer: true,
                                    backgroundColor: '#ffffff',
                                    proxy: 'http://localhost:8081/proxy',
                                    ...(testContainer.contentWindow.h2cOptions || {})
                                }
                            )
                            .then(canvas => {
                                try {
                                    canvas
                                        .getContext('2d')
                                        .getImageData(0, 0, canvas.width, canvas.height);
                                } catch (e) {
                                    return Promise.reject('Canvas is tainted');
                                }

                                const delta = 10;

                                if (REFTEST && query.refTest === 'true') {
                                    const RESULTS = parseRefTest(result);
                                    REFTEST.forEach(({action, line, ...args}, i) => {
                                        const RESULT = RESULTS[i];
                                        expect(RESULT.action).to.equal(action, `Line ${line}`);

                                        const desc = `Line ${line} ${action}`;

                                        switch (action) {
                                            case 'Window':
                                                expect(RESULT.width).to.equal(
                                                    args.width,
                                                    `${desc} width`
                                                );
                                                expect(RESULT.height).to.be.closeTo(
                                                    args.height,
                                                    delta,
                                                    `${desc} height`
                                                );
                                                break;

                                            case 'Rectangle':
                                                expect(RESULT.x).to.equal(args.x, `${desc} x`);
                                                expect(RESULT.y).to.equal(args.y, `${desc} y`);
                                                expect(RESULT.width).to.equal(
                                                    args.width,
                                                    `${desc} width`
                                                );
                                                expect(RESULT.height).to.be.closeTo(
                                                    args.height,
                                                    delta,
                                                    `${desc} height`
                                                );
                                                break;

                                            case 'Fill':
                                                expect(RESULT.color).to.equal(
                                                    args.color,
                                                    `${desc} color`
                                                );
                                                break;

                                            case 'Opacity':
                                                expect(RESULT.opacity).to.equal(
                                                    args.opacity,
                                                    `${desc} opacity`
                                                );
                                                break;

                                            case 'Text':
                                                expect(RESULT.font).to.equal(
                                                    args.font,
                                                    `${desc} font`
                                                );
                                                break;

                                            case 'T':
                                                expect(RESULT.x).to.be.closeTo(
                                                    args.x,
                                                    10,
                                                    `${desc} x`
                                                );
                                                expect(RESULT.y).to.be.closeTo(
                                                    args.y,
                                                    10,
                                                    `${desc} y`
                                                );
                                                expect(RESULT.text).to.equal(
                                                    args.text,
                                                    `${desc} text`
                                                );
                                                break;

                                            case 'Transform':
                                                expect(RESULT.x).to.be.closeTo(
                                                    args.x,
                                                    10,
                                                    `${desc} x`
                                                );
                                                expect(RESULT.y).to.be.closeTo(
                                                    args.y,
                                                    10,
                                                    `${desc} y`
                                                );
                                                expect(RESULT.matrix).to.equal(
                                                    args.matrix,
                                                    `${desc} matrix`
                                                );
                                                break;

                                            case 'Repeat':
                                                expect(RESULT.x).to.be.closeTo(
                                                    args.x,
                                                    10,
                                                    `${desc} x`
                                                );
                                                expect(RESULT.y).to.be.closeTo(
                                                    args.y,
                                                    10,
                                                    `${desc} y`
                                                );
                                                expect(RESULT.width).to.be.closeTo(
                                                    args.width,
                                                    3,
                                                    `${desc} width`
                                                );
                                                expect(RESULT.height).to.be.closeTo(
                                                    args.height,
                                                    3,
                                                    `${desc} height`
                                                );
                                                expect(RESULT.imageSrc).to.equal(
                                                    args.imageSrc,
                                                    `${desc} imageSrc`
                                                );
                                                assertPath(RESULT.path, args.path, desc);
                                                break;

                                            case 'Gradient':
                                                expect(RESULT.x).to.be.closeTo(
                                                    args.x,
                                                    10,
                                                    `${desc} x`
                                                );
                                                expect(RESULT.y).to.be.closeTo(
                                                    args.y,
                                                    10,
                                                    `${desc} y`
                                                );
                                                expect(RESULT.x0).to.be.closeTo(
                                                    args.x0,
                                                    5,
                                                    `${desc} x0`
                                                );
                                                expect(RESULT.y0).to.be.closeTo(
                                                    args.y0,
                                                    5,
                                                    `${desc} y0`
                                                );
                                                expect(RESULT.x1).to.be.closeTo(
                                                    args.x1,
                                                    5,
                                                    `${desc} x1`
                                                );
                                                expect(RESULT.y1).to.be.closeTo(
                                                    args.y1,
                                                    5,
                                                    `${desc} y1`
                                                );
                                                expect(RESULT.stops).to.equal(
                                                    args.stops,
                                                    `${desc} stops`
                                                );
                                                expect(RESULT.width).to.equal(
                                                    args.width,
                                                    `${desc} width`
                                                );
                                                expect(RESULT.height).to.equal(
                                                    args.height,
                                                    `${desc} height`
                                                );

                                                break;

                                            case 'Draw image':
                                                expect(RESULT.imageSrc).to.equal(
                                                    args.imageSrc,
                                                    `${desc} stops`
                                                );
                                                expect(RESULT.sx).to.equal(args.sx, `${desc} sx`);
                                                expect(RESULT.sy).to.equal(args.sy, `${desc} sy`);
                                                expect(RESULT.dx).to.equal(args.dx, `${desc} dx`);
                                                expect(RESULT.dy).to.equal(args.dy, `${desc} dy`);
                                                expect(RESULT.sw).to.equal(args.sw, `${desc} sw`);
                                                expect(RESULT.sh).to.equal(args.sh, `${desc} sh`);
                                                expect(RESULT.dw).to.equal(args.dw, `${desc} dw`);
                                                expect(RESULT.dh).to.equal(args.dh, `${desc} dh`);
                                                break;

                                            case 'Clip':
                                                assertPath(RESULT.path, args.path, desc);
                                                break;

                                            case 'Shape':
                                                expect(RESULT.color).to.equal(
                                                    args.color,
                                                    `${desc} color`
                                                );
                                                assertPath(RESULT.path, args.path, desc);
                                                break;

                                            default:
                                                console.log(RESULT);
                                                throw new Error(`Unrecognized action ${action}`);
                                        }
                                    });
                                } else if (DOWNLOAD_REFTESTS) {
                                    downloadResult(
                                        url
                                            .slice(url.lastIndexOf('/') + 1)
                                            .replace(/\.html$/i, '.txt'),
                                        result
                                    );
                                }

                                if (window.__karma__) {
                                    const MAX_CHUNK_SIZE = 75000;

                                    const sendScreenshot = (tries, body, server) => {
                                        return new Promise((resolve, reject) => {
                                            const xhr =
                                                'withCredentials' in new XMLHttpRequest()
                                                    ? new XMLHttpRequest()
                                                    : new XDomainRequest();

                                            xhr.onload = () => {
                                                if (
                                                    typeof xhr.status !== 'number' ||
                                                    xhr.status === 200
                                                ) {
                                                    resolve();
                                                } else {
                                                    reject(
                                                        `Failed to send screenshot with status ${xhr.status}`
                                                    );
                                                }
                                            };
                                            xhr.onerror = reject;

                                            xhr.open('POST', server, true);
                                            xhr.send(body);
                                        }).catch(e => {
                                            if (tries > 0) {
                                                // Older edge browsers and some safari browsers have issues sending large xhr through saucetunnel
                                                const data = canvas.toDataURL();
                                                const totalCount = Math.ceil(
                                                    data.length / MAX_CHUNK_SIZE
                                                );
                                                return Promise.all(
                                                    Array.apply(
                                                        null,
                                                        Array(totalCount)
                                                    ).map((x, part) =>
                                                        sendScreenshot(
                                                            0,
                                                            JSON.stringify({
                                                                screenshot: data.substr(
                                                                    part * MAX_CHUNK_SIZE,
                                                                    MAX_CHUNK_SIZE
                                                                ),
                                                                part,
                                                                totalCount,
                                                                test: url,
                                                                platform: {
                                                                    name: platform.name,
                                                                    version: platform.version
                                                                }
                                                            }),
                                                            'http://localhost:8000/screenshot/chunk'
                                                        )
                                                    )
                                                );
                                            }

                                            return Promise.reject(e);
                                        });
                                    };
                                    return sendScreenshot(
                                        1,
                                        JSON.stringify({
                                            screenshot: canvas.toDataURL(),
                                            test: url,
                                            platform: {
                                                name: platform.name,
                                                version: platform.version
                                            }
                                        }),
                                        'http://localhost:8000/screenshot'
                                    );
                                }
                            });
                    });
                });
            });
    }
})();
