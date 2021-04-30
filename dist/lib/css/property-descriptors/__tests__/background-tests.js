"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var parser_1 = require("../../syntax/parser");
var background_image_1 = require("../background-image");
var image_1 = require("../../types/image");
var color_1 = require("../../types/color");
var angle_1 = require("../../types/angle");
jest.mock('../../../core/cache-storage');
jest.mock('../../../core/features');
var backgroundImageParse = function (value) { return background_image_1.backgroundImage.parse(parser_1.Parser.parseValues(value)); };
describe('property-descriptors', function () {
    describe('background-image', function () {
        it('none', function () { return assert_1.deepStrictEqual(backgroundImageParse('none'), []); });
        it('url(test.jpg), url(test2.jpg)', function () {
            return assert_1.deepStrictEqual(backgroundImageParse('url(http://example.com/test.jpg), url(http://example.com/test2.jpg)'), [
                { url: 'http://example.com/test.jpg', type: image_1.CSSImageType.URL },
                { url: 'http://example.com/test2.jpg', type: image_1.CSSImageType.URL }
            ]);
        });
        it("linear-gradient(to bottom, rgba(255,255,0,0.5), rgba(0,0,255,0.5)), url('https://html2canvas.hertzen.com')", function () {
            return assert_1.deepStrictEqual(backgroundImageParse("linear-gradient(to bottom, rgba(255,255,0,0.5), rgba(0,0,255,0.5)), url('https://html2canvas.hertzen.com')"), [
                {
                    angle: angle_1.deg(180),
                    type: image_1.CSSImageType.LINEAR_GRADIENT,
                    stops: [{ color: color_1.pack(255, 255, 0, 0.5), stop: null }, { color: color_1.pack(0, 0, 255, 0.5), stop: null }]
                },
                { url: 'https://html2canvas.hertzen.com', type: image_1.CSSImageType.URL }
            ]);
        });
    });
});
//# sourceMappingURL=background-tests.js.map