var assert = require('assert');
var html2canvas = require('../../');

describe("Package", function() {
    it("should have html2canvas defined", function() {
        assert.equal(typeof(html2canvas), "function");
    });
});
