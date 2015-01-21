var wd = require('wd');
var http = require("http");
var https = require("https");
var url = require("url");
var path = require("path");
var Promise = require('bluebird');
var _ = require('lodash');
var humanizeDuration = require("humanize-duration");
var utils = require('../utils');
var colors = utils.colors;
var port = 8080;

function runTestWithRetries(browser, test, retries) {
    retries = retries || 0;
    return runTest(browser, test)
        .timeout(30000)
        .catch(Promise.TimeoutError, function() {
            if (retries < 3) {
                console.log(colors.violet, "Retry", (retries + 1), test);
                return runTestWithRetries(browser, test, retries + 1);
            } else {
                throw new Error("Couldn't run test after 3 retries");
            }
        });
}

function getResults(browser) {
    return function() {
        return Promise.props({
            dataUrl: browser.waitForElementByCss("body[data-complete='true']", 90000).then(function() {
                return browser.elementsByCssSelector('.test.fail');
            }).then(function(nodes) {
                return Array.isArray(nodes) ? Promise.map(nodes, function(node) {
                    return browser.text(node).then(function(error) {
                        return Promise.reject(error);
                    });
                }) : Promise.resolve([]);
            })
        });
    };
}

function runTest(browser, test) {
    return Promise.resolve(browser
        .then(utils.loadTestPage(browser, test, port))
        .then(getResults(browser))
    ).cancellable();
}

exports.tests = function(browsers, singleTest) {
    var path = "tests/mocha";
    return (singleTest ? Promise.resolve([singleTest]) : utils.getTests(path)).then(function(tests) {
        return Promise.map(browsers, function(settings) {
            var name = [settings.browserName, settings.version, settings.platform].join("-");
            var count = 0;
            var browser = utils.initBrowser(settings);
            return Promise.using(browser, function() {
                return Promise.map(tests, function(test, index, total) {
                    console.log(colors.green, "STARTING", "(" + (++count) + "/" + total + ")", name, test, colors.clear);
                    var start = Date.now();
                    return runTestWithRetries(browser, test).then(function() {
                        console.log(colors.green, "COMPLETE", humanizeDuration(Date.now() - start), "(" + count + "/" + total + ")", name, colors.clear);
                    });
                }, {concurrency: 1})
                    .settle()
                    .catch(function(error) {
                        console.error(colors.red, "ERROR", name, error);
                        throw error;
                    });
            });
        }, {concurrency: 3});
    });
};
