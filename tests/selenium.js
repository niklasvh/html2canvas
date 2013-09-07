(function(){
    "use strict;";
    var WebDriver = require('sync-webdriver'),
        Bacon = require('baconjs').Bacon,
        express = require('express'),
        http = require("http"),
        https = require("https"),
        url = require("url"),
        path = require("path"),
        base64_arraybuffer = require('base64-arraybuffer'),
        PNG = require('png-js'),
        fs = require("fs"),
        googleapis = require('googleapis'),
        jwt = require('jwt-sign');

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

    app.use('/index.html', function(req, res){
      res.send("<ul>" + tests.map(function(test) {
        return "<li><a href='" + test + "'>" + test + "</a></li>";
      }).join("") + "</ul>");
    });

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

    function httpget(options) {
        return Bacon.fromCallback(function(callback) {
            https.get(options, function(res){
                var data = '';

                res.on('data', function (chunk){
                    data += chunk;
                });

                res.on('end',function(){
                    callback(data);
                });
            });
        });
    }

    function parseJSON(str) {
        return JSON.parse(str);
    }

    function writeResults() {
        Object.keys(results).forEach(function(browser) {
            var filename = "tests/results/" + browser + ".json";
            try {
                var oldResults = JSON.parse(fs.readFileSync(filename));
                compareResults(oldResults, results[browser], browser);
            } catch(e) {}

            var date = new Date();
            var result = JSON.stringify({
                browser: browser,
                results: results[browser],
                timestamp: date.toISOString()
            });

            if (process.env.MONGOLAB_APIKEY) {
                var options = {
                    host: "api.mongolab.com",
                    port: 443,
                    path: "/api/1/databases/html2canvas/collections/webdriver-results?apiKey=" + process.env.MONGOLAB_APIKEY + '&q={"browser":"' + browser + '"}&fo=true&s={"timestamp":-1}'
                };

                httpget(options).map(parseJSON).onValue(function(data) {
                    compareResults(data.results, results[browser], browser);

                    options.method =  'POST';
                    options.path = "/api/1/databases/html2canvas/collections/webdriver-results?apiKey=" + process.env.MONGOLAB_APIKEY;
                    options.headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': result.length
                    };

                    console.log("Sending results for", browser);
                    var request = https.request(options, function(res) {
                        console.log(colors.green, "Results sent for", browser);
                    });

                    request.write(result);
                    request.end();
                });
            }

            console.log(colors.violet, "Writing", browser + ".json");
            fs.writeFile(filename, result);
        });
    }

    function webdriverOptions(browserName, version, platform) {
        var options = {};
        if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
            options = {
                port: 4445,
                hostname: "localhost",
                name: process.env.TRAVIS_JOB_ID || "Manual run",
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
        var drive = Bacon.fromCallback(discover, "drive", "v2").toProperty();
        var auth = Bacon.fromCallback(createToken, "95492219822.apps.googleusercontent.com").toProperty();

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

                if (fs.existsSync('tests/certificate.pem')) {
                    Bacon.combineWith(permissionRequest, drive, auth, Bacon.combineWith(uploadRequest, drive, auth, resultStream.doAction(mapResults).flatMap(createImages)).flatMap(executeRequest)).flatMap(executeRequestOriginal).onValue(uploadImages);
                }

                resultStream.onEnd(callback);
            });
        });
    }

    function permissionRequest(client, authClient, images) {
        var body = {
            value: 'me',
            type: 'anyone',
            role: 'reader'
        };

        return images.map(function(data) {
            var request = client.drive.permissions.insert({fileId: data.id}).withAuthClient(authClient);
            request.body = body;
            request.fileData = data;
            return request;
        });
    }

    function executeRequest(requests) {
        return Bacon.combineAsArray(requests.map(function(request) {
            return Bacon.fromCallback(function(callback) {
                request.execute(function(err, result) {
                    if (!err) {
                        callback(result);
                    } else {
                        console.log("Google drive error", err);
                    }
                });
            });
        }));
    }

    function executeRequestOriginal(requests) {
        return Bacon.combineAsArray(requests.map(function(request) {
            return Bacon.fromCallback(function(callback) {
                request.execute(function(err, result) {
                    if (!err) {
                        callback(request.fileData);
                    } else {
                        console.log("Google drive error", err);
                    }
                });
            });
        }));
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

    function uploadImages(results) {
        results.forEach(function(result) {
            console.log(result.webContentLink);
        });
    }

    function discover(api, version, callback) {
        googleapis.discover(api, version).execute(function(err, client) {
            if (!err) {
                callback(client);
            }
        });
    }

    function createToken(account, callback) {
        var payload = {
                "iss": '95492219822@developer.gserviceaccount.com',
                "scope": 'https://www.googleapis.com/auth/drive',
                "aud":"https://accounts.google.com/o/oauth2/token",
                "exp": ~~(new Date().getTime() / 1000) + (30 * 60),
                "iat": ~~(new Date().getTime() / 1000 - 60)
            },
            key = fs.readFileSync('tests/certificate.pem', 'utf8'),
            transporterTokenRequest = {
                method: 'POST',
                uri: 'https://accounts.google.com/o/oauth2/token',
                form: {
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    assertion: jwt.sign(payload, key)
                },
                json: true
            },
            oauth2Client = new googleapis.OAuth2Client(account, "", "");

        oauth2Client.transporter.request(transporterTokenRequest, function(err, result) {
            if (!err) {
                oauth2Client.credentials = result;
                callback(oauth2Client);
            }
        });
    }

    function uploadRequest(client, authClient, data) {
        return [
            client.drive.files.insert({title: data.dataurl, mimeType: 'image/png', description: process.env.TRAVIS_JOB_ID}).withMedia('image/png', fs.readFileSync(data.dataurl)).withAuthClient(authClient),
            client.drive.files.insert({title: data.screenshot, mimeType: 'image/png', description: process.env.TRAVIS_JOB_ID}).withMedia('image/png', fs.readFileSync(data.screenshot)).withAuthClient(authClient)
        ];
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
        results = {},
        testStream = getTests("tests/cases");

  testStream.onValue(function(test) {
    tests.push(test);
  });

  exports.tests = function() {
    testStream.onEnd(runWebDriver);
  };
})();