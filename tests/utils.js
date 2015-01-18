var fs = require('fs');
var wd = require('wd');
var path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');

Promise.promisifyAll(fs);

var colors = {
    red: "\x1b[1;31m",
    blue: "\x1b[1;36m",
    violet: "\x1b[0;35m",
    green: "\x1b[0;32m",
    clear: "\x1b[0m"
};

function isHtmlFile(filename) {
    return path.extname(filename) === '.html';
}

function getTests(path) {
    return fs.readdirAsync(path).map(function(name) {
        var filename = path + "/" + name;
        return fs.statAsync(filename).then(function(stat) {
            return stat.isDirectory() ? getTests(filename) : filename;
        });
    }).then(function(t) {
        return _.flatten(t).filter(isHtmlFile);
    });
}

function initBrowser(settings) {
    var browser = wd.remote({
        hostname: 'localhost',
        port: 4445,
        user: process.env.SAUCE_USERNAME,
        pwd: process.env.SAUCE_ACCESS_KEY
    }, 'promiseChain');

    if (process.env.TRAVIS_JOB_NUMBER) {
        settings["tunnel-identifier"] = process.env.TRAVIS_JOB_NUMBER;
        settings["name"] = process.env.TRAVIS_COMMIT.substring(0, 10);
        settings["build"] = process.env.TRAVIS_BUILD_NUMBER;
    } else {
        settings["name"] = "Manual run";
    }

    return browser.resolve(Promise).init(settings).then(function(b) {
        return Promise.resolve(b).disposer(function() {
            return browser.quit();
        });
    });
}

function loadTestPage(browser, test, port) {
    return function(settings) {
        return browser.get("http://localhost:" + port + "/" + test + "?selenium").then(function() {
            return settings;
        });
    };
}

module.exports.colors = colors;
module.exports.getTests = getTests;
module.exports.initBrowser = initBrowser;
module.exports.loadTestPage = loadTestPage;
