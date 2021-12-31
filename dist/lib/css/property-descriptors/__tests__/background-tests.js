"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var parser_1 = require("../../syntax/parser");
var background_image_1 = require("../background-image");
var color_1 = require("../../types/color");
var angle_1 = require("../../types/angle");
jest.mock('../../../core/context');
var context_1 = require("../../../core/context");
jest.mock('../../../core/features');
var backgroundImageParse = function (context, value) {
    return background_image_1.backgroundImage.parse(context, parser_1.Parser.parseValues(value));
};
describe('property-descriptors', function () {
    var context;
    beforeEach(function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context = new context_1.Context({}, {});
    });
    describe('background-image', function () {
        it('none', function () {
            assert_1.deepStrictEqual(backgroundImageParse(context, 'none'), []);
            expect(context.cache.addImage).not.toHaveBeenCalled();
        });
        it('url(test.jpg), url(test2.jpg)', function () {
            assert_1.deepStrictEqual(backgroundImageParse(context, 'url(http://example.com/test.jpg), url(http://example.com/test2.jpg)'), [
                { url: 'http://example.com/test.jpg', type: 0 /* URL */ },
                { url: 'http://example.com/test2.jpg', type: 0 /* URL */ }
            ]);
            expect(context.cache.addImage).toHaveBeenCalledWith('http://example.com/test.jpg');
            expect(context.cache.addImage).toHaveBeenCalledWith('http://example.com/test2.jpg');
        });
        it("linear-gradient(to bottom, rgba(255,255,0,0.5), rgba(0,0,255,0.5)), url('https://html2canvas.hertzen.com')", function () {
            return assert_1.deepStrictEqual(backgroundImageParse(context, "linear-gradient(to bottom, rgba(255,255,0,0.5), rgba(0,0,255,0.5)), url('https://html2canvas.hertzen.com')"), [
                {
                    angle: angle_1.deg(180),
                    type: 1 /* LINEAR_GRADIENT */,
                    stops: [
                        { color: color_1.pack(255, 255, 0, 0.5), stop: null },
                        { color: color_1.pack(0, 0, 255, 0.5), stop: null }
                    ]
                },
                { url: 'https://html2canvas.hertzen.com', type: 0 /* URL */ }
            ]);
        });
    });
});
//# sourceMappingURL=background-tests.js.map