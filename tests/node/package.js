var assert = require('assert');
var path = require('path');
var html2canvas = require('../../');

describe("Package", function() {
    it("should have html2canvas defined", function() {
        assert.equal(typeof(html2canvas), "function");
    });
});

describe.only("requirejs", function() {
    var requirejs = require('requirejs');

    requirejs.config({
        baseUrl: path.resolve(__dirname, '../../dist')
    });

    it("should have html2canvas defined", function(done) {
        requirejs(['html2canvas'], function(h2c) {
            assert.equal(typeof(h2c), "function");
            done();
        });
    });
});
