(function(){
    "use strict;";
    var wd = require('wd'),
        http = require("http"),
        https = require("https"),
        url = require("url"),
        path = require("path"),
        base64_arraybuffer = require('base64-arraybuffer'),
        PNG = require('pngjs').PNG,
        Promise = require('bluebird'),
        _ = require('lodash'),
        humanizeDuration = require("humanize-duration"),
        fs = require("fs");

    var utils = require('./utils');
    var colors = utils.colors;

    Promise.promisifyAll(fs);

    var port = 8080;

    function getPixelArray(base64) {
        return new Promise(function(resolve, reject) {
            const arraybuffer = base64_arraybuffer.decode(base64);
            new PNG().parse(arraybuffer, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.data);
                }
            });
        });
    }

    function calculateDifference(h2cPixels, screenPixels) {
        var len = h2cPixels.length, index = 0, diff = 0;
        for (; index < len; index++) {
            if (screenPixels[index] - h2cPixels[index] !== 0) {
                diff++;
            }
        }
        return (100 - (Math.round((diff/h2cPixels.length) * 10000) / 100));
    }

    function captureScreenshots(browser) {
        return function() {
            return Promise.props({
                dataUrl: browser.waitForElementByCss(".html2canvas", 15000).then(function(node) {
                    return browser.execute("return arguments[0].toDataURL('image/png').substring(22)", [node]);
                }),
                screenshot: browser.takeScreenshot()
            });
        };
    }

    function analyzeResults(test) {
        return function(result) {
            return Promise.all([getPixelArray(result.dataUrl), getPixelArray(result.screenshot)]).spread(calculateDifference).then(function(accuracy) {
                return {
                    testCase: test,
                    accuracy: accuracy,
                    dataUrl: result.dataUrl,
                    screenshot: result.screenshot
                };
            });
        };
    }

    function runTestWithRetries(browser, test, retries) {
        retries = retries || 0;
        return runTest(browser, test)
            .timeout(60000)
            .catch(Promise.TimeoutError, function() {
                if (retries < 3) {
                    console.log(colors.violet, "Retry", (retries + 1), test);
                    return runTestWithRetries(browser, test, retries + 1);
                } else {
                    throw new Error("Couldn't run test after 3 retries");
                }
            });
    }

    function runTest(browser, test) {
        return Promise.resolve(browser
            .then(utils.loadTestPage(browser, test, port))
            .then(captureScreenshots(browser))
            .then(analyzeResults(test)));
    }

    exports.tests = function(browsers, singleTest) {
        var path = "tests/cases";
        return (singleTest ? Promise.resolve([singleTest]) : utils.getTests(path)).then(function(tests) {
            return Promise.map(browsers, function(settings) {
                var browser = utils.initBrowser(settings);
                var name = [settings.browserName, settings.version, settings.platform].join("-");
                var count = 0;
                return Promise.using(browser, function() {
                    return Promise.map(tests, function(test, index, total) {
                        console.log(colors.green, "STARTING", "(" + (++count) + "/" + total + ")", name, test, colors.clear);
                        var start = Date.now();
                        return runTestWithRetries(browser, test).then(function(result) {
                            console.log(colors.green, "COMPLETE", humanizeDuration(Date.now() - start), "(" + count + "/" + total + ")", name, result.testCase.substring(path.length), result.accuracy.toFixed(2) + "%", colors.clear);
                        });
                    }, {concurrency: 1})
                        .settle()
                        .catch(function(error) {
                            console.log(colors.red, "ERROR", name, error.message);
                            throw error;
                        });
                });
            }, {concurrency: 3});
        });
    };
})();
