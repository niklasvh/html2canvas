(function(){
    "use strict;";
    var WebDriver = require('sync-webdriver'),
        Bacon = require('baconjs').Bacon,
        express = require('express'),
        http = require("http"),
        url = require("url"),
        path = require("path"),
        base64_arraybuffer = require('base64-arraybuffer'),
        PNG = require('png-js'),
        fs = require("fs");

    var port = 8080,
        app = express(),
        colors = {
            red: "\x1b[1;31m",
            blue: "\x1b[1;36m",
            violet: "\x1b[0;35m",
            green: "\x1b[0;32m",
            clear: "\x1b[0m"
        };

    var server = app.listen(port);
    app.use('/', express.static(__dirname + "/../"));

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
            (new PNG(arraybuffer)).decode(callback);
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

    function canvasToDataUrl(canvas) {
        return canvas.toDataURL("image/png").substring(22);
    }

    function createImages(data) {
        return Bacon.combineTemplate({
            dataurl: Bacon.fromNodeCallback(fs.writeFile, "tests/results/captures/" + data.testCase.replace(/\//g, "-") + "-html2canvas.png", data.dataUrl, "base64"),
            screenshot: Bacon.fromNodeCallback(fs.writeFile, "tests/results/captures/" + data.testCase.replace(/\//g, "-") + "-screencapture.png", data.screenshot, "base64"),
            data: Bacon.constant(data)
        });
    }

    function closeServer() {
        server.close();
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

    function writeResults() {
        Object.keys(results).forEach(function(browser) {
            var filename = "tests/results/" + browser + ".json";
            try {
                var oldResults = JSON.parse(fs.readFileSync(filename));
                compareResults(oldResults, results[browser], browser);
            } catch(e) {}

            console.log(colors.violet, "Writing", browser + ".json");
            fs.writeFile(filename, JSON.stringify(results[browser]));
        });
    }

    function webdriverOptions(browserName, version, platform) {
        var options = {};
        if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
            options = {
                port: 4445,
                hostname: "localhost",
                username: process.env.SAUCE_USERNAME,
                password: process.env.SAUCE_ACCESS_KEY,
                desiredCapabilities: {
                    browserName: browserName,
                    version: version,
                    platform: platform,
                    "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER
                }
            };
        }
        return options;
    }

    function mapResults(result) {
        if (!results[result.browser]) {
            results[result.browser] = [];
        }

        results[result.browser].push({
            test: result.testCase,
            result: result.accuracy
        });
    }

    function formatResultName(navigator) {
        return (navigator.browser + "-" + ((navigator.version) ? navigator.version : "release") + "-" + navigator.platform).replace(/ /g, "").toLowerCase();
    }

    function webdriverStream(navigator) {
        return Bacon.fromCallback(function(callback) {
            new WebDriver.Session(webdriverOptions(navigator.browser, navigator.version, navigator.platform), function() {
                var browser = this;

                var resultStream = Bacon.fromArray(tests).flatMap(function(testCase) {
                    console.log(colors.green, "STARTING",formatResultName(navigator), testCase, colors.clear);
                    browser.url = "http://localhost:" + port + "/" + testCase + "?selenium";
                    var canvas = browser.element(".html2canvas", 15000);
                    var dataUrl = Bacon.constant(browser.execute(canvasToDataUrl, canvas));
                    var screenshot = Bacon.constant(browser.screenshot());
                    var result =  dataUrl.flatMap(getPixelArray).combine(screenshot.flatMap(getPixelArray), calculateDifference);
                    console.log(colors.green, "COMPLETE", formatResultName(navigator), testCase, colors.clear);
                    return Bacon.combineTemplate({
                        browser: formatResultName(navigator),
                        testCase: testCase,
                        accuracy: result,
                        dataUrl: dataUrl,
                        screenshot: screenshot
                    });
                });
                resultStream.onValue(mapResults);
                resultStream.onEnd(callback);
            });
        });
    }

    function runWebDriver() {
        var browsers = [
            {
                browser: "chrome",
                platform: "Windows 7"
            },{
                browser: "firefox",
                version: "15",
                platform: "Windows 7"
            },{
                browser: "internet explorer",
                version: "9",
                platform: "Windows 7"
            },{
                browser: "internet explorer",
                version: "10",
                platform: "Windows 8"
            },{
                browser: "safari",
                version: "6",
                platform: "OS X 10.8"
            },{
                browser: "chrome",
                platform: "OS X 10.8"
            }
        ];

        var testRunnerStream = Bacon.sequentially(1000, browsers).flatMap(webdriverStream);
        testRunnerStream.onEnd(writeResults);
        testRunnerStream.onEnd(closeServer);
    }

    var tests = [],
        outputImages = false,
        results = {};

    exports.tests = function() {
        var testStream = getTests("tests/cases");

        testStream.onValue(function(test) {
            tests.push(test);
        });

        testStream.onEnd(runWebDriver);
    };


    /*
    if (outputImages) {
        resultStream.flatMap(createImages).onValue(function(test){
            console.log(test.data.testCase, "screenshots created");
        });
    }
    */

})();