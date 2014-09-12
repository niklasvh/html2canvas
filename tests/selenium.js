(function(){
    "use strict;";
    var Bacon = require('baconjs').Bacon,
        wd = require('wd'),
        http = require("http"),
        https = require("https"),
        url = require("url"),
        path = require("path"),
        base64_arraybuffer = require('base64-arraybuffer'),
        PNG = require('png-js'),
        fs = require("fs");

    var port = 8080,
        colors = {
            red: "\x1b[1;31m",
            blue: "\x1b[1;36m",
            violet: "\x1b[0;35m",
            green: "\x1b[0;32m",
            clear: "\x1b[0m"
        };

    function mapStat(item) {
        return Bacon.combineTemplate({
            stat: Bacon.fromNodeCallback(fs.stat, item),
            item: item
        });
    }

    function isDirectory(item) {
        return item.stat.isDirectory();
    }

    function getItem(item) {
        return item.item;
    }

    function isFile(item) {
        return !isDirectory(item);
    }

    function arrayStream(arr) {
        return Bacon.fromArray(arr);
    }

    function getTests(path) {
        var items = Bacon.fromNodeCallback(fs.readdir, path).flatMap(arrayStream).map(function(name) {
            return path + "/" + name;
        }).flatMap(mapStat);
        return items.filter(isFile).map(getItem).merge(items.filter(isDirectory).map(getItem).flatMap(getTests));
    }


    function getPixelArray(base64) {
        return Bacon.fromCallback(function(callback) {
            var arraybuffer = base64_arraybuffer.decode(base64);
            (new PNG(arraybuffer)).decodePixels(callback);
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

    function findResult(testName, tests) {
        var item = null;
        return tests.some(function(testCase) {
            item = testCase;
            return testCase.test === testName;
        }) ? item : null;
    }

    function compareResults(oldResults, newResults, browser) {
        var improved = [],
            regressed = [],
            newItems = [];

        newResults.forEach(function(testCase){
            var testResult = testCase.result,
                oldResult = findResult(testCase.test, oldResults),
                oldResultValue = oldResult ? oldResult.result : null,
                dataObject = {
                    amount: (Math.abs(testResult - oldResultValue) < 0.01) ? 0 : testResult - oldResultValue,
                    test: testCase.test
                };
            if (oldResultValue === null) {
                newItems.push(dataObject);
            } else if (dataObject.amount > 0) {
                improved.push(dataObject);
            } else if (dataObject.amount < 0) {
                regressed.push(dataObject);
            }
        });

        reportChanges(browser, improved, regressed, newItems);
    }

    function reportChanges(browser, improved, regressed, newItems) {
        if (newItems.length > 0 || improved.length > 0 || regressed.length > 0) {
            console.log((regressed.length > 0) ? colors.red : colors.green, browser);

            regressed.forEach(function(item) {
                console.log(colors.red, item.amount + "%", item.test);
            });

            improved.forEach(function(item) {
                console.log(colors.green, item.amount + "%", item.test);
            });

            newItems.forEach(function(item) {
                console.log(colors.blue, "NEW", item.test);
            });
        }
    }

    function formatResultName(navigator) {
        return (navigator.browserName + "-" + ((navigator.version) ? navigator.version : "release") + "-" + navigator.platform).replace(/ /g, "").toLowerCase();
    }

    function webdriverStream(test) {
        var browser = wd.remote("localhost", 4445, process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY);
        var browserStream = new Bacon.Bus();
        if (process.env.TRAVIS_JOB_NUMBER) {
            test.capabilities["tunnel-identifier"] = process.env.TRAVIS_JOB_NUMBER;
            test.capabilities["name"] = process.env.TRAVIS_COMMIT.substring(0, 10);
            test.capabilities["build"] = process.env.TRAVIS_BUILD_NUMBER;
        } else {
            test.capabilities["name"] = "Manual run";
        }

        var resultStream = Bacon.fromNodeCallback(browser, "init", test.capabilities)
            .flatMap(Bacon.fromNodeCallback(browser, "setImplicitWaitTimeout", 15000)
            .flatMap(function() {
                Bacon.later(0, formatResultName(test.capabilities)).onValue(browserStream.push);
                return Bacon.fromArray(test.cases).zip(browserStream.take(test.cases.length)).flatMap(function(options) {
                    var testCase = options[0];
                    var name = options[1];
                    console.log(colors.green, "STARTING", name, testCase, colors.clear);
                    return Bacon.fromNodeCallback(browser, "get", "http://localhost:" + port + "/" + testCase + "?selenium")
                        .flatMap(Bacon.combineTemplate({
                            dataUrl: Bacon.fromNodeCallback(browser, "elementByCssSelector", ".html2canvas").flatMap(function(canvas) {
                                return Bacon.fromNodeCallback(browser, "execute", "return arguments[0].toDataURL('image/png').substring(22)", [canvas]);
                            }),
                            screenshot: Bacon.fromNodeCallback(browser, "takeScreenshot")
                        }))
                        .flatMap(function(result) {
                            return Bacon.combineTemplate({
                                browser: name,
                                testCase: testCase,
                                accuracy: Bacon.constant(result.dataUrl).flatMap(getPixelArray).combine(Bacon.constant(result.screenshot).flatMap(getPixelArray), calculateDifference),
                                dataUrl: result.dataUrl,
                                screenshot: result.screenshot
                            });
                        });
                });
            }));

        resultStream.onError(function(error) {
            var name = formatResultName(test.capabilities);
            console.log(colors.red, "ERROR", name, error.message);
            browserStream.push(name);
            browser.quit();
        });

        resultStream.onValue(function(result) {
            console.log(colors.green, "COMPLETE", result.browser, result.testCase, result.accuracy, "%", colors.clear);
            browserStream.push(result.browser);
        });

        return resultStream.fold([], pushToArray).flatMap(function(value) {
            return Bacon.fromCallback(function(callback) {
                browser.quit(function() {
                    callback(value);
                });
            });
        });
    }

    function createImages(data) {
        var dataurlFileName = "tests/results/" + data.browser + "-" +  data.testCase.replace(/\//g, "-") + "-html2canvas.png";
        var screenshotFileName = "tests/results/" + data.browser + "-" + data.testCase.replace(/\//g, "-") + "-screencapture.png";
        return Bacon.combineTemplate({
            name: data.testCase,
            dataurl: Bacon.fromNodeCallback(fs.writeFile, dataurlFileName, data.dataUrl, "base64").map(function() {
                return dataurlFileName;
            }),
            screenshot: Bacon.fromNodeCallback(fs.writeFile, screenshotFileName, data.screenshot, "base64").map(function() {
                return screenshotFileName;
            })
        });
    }

    function pushToArray(array, item) {
        array.push(item);
        return array;
    }

    function runWebDriver(browsers, cases) {
        var availableBrowsers = new Bacon.Bus();
        var result = Bacon.combineTemplate({
            capabilities: Bacon.fromArray(browsers).zip(availableBrowsers.take(browsers.length), function(first) { return first; }),
            cases: cases
        }).flatMap(webdriverStream).doAction(function() {
            availableBrowsers.push("ready");
        });

        Bacon.fromArray([1, 2, 3, 4]).onValue(availableBrowsers.push);

        return result.fold([], pushToArray);
    }

    exports.tests = function(browsers, singleTest) {
        return (singleTest ? Bacon.constant([singleTest]) : getTests("tests/cases").fold([], pushToArray)).flatMap(runWebDriver.bind(null, browsers)).mapError(false);
    };
})();
