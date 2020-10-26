"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var parser_1 = require("../../../syntax/parser");
var radial_gradient_1 = require("../radial-gradient");
var image_1 = require("../../image");
var color_1 = require("../../color");
var tokenizer_1 = require("../../../syntax/tokenizer");
var length_percentage_1 = require("../../length-percentage");
var parse = function (value) { return radial_gradient_1.radialGradient(parser_1.Parser.parseValues(value)[0].values); };
var colorParse = function (value) { return color_1.color.parse(parser_1.Parser.parseValue(value)); };
describe('functions', function () {
    describe('radial-gradient', function () {
        describe('parsing', function () {
            it('radial-gradient(circle closest-side, #3f87a6, #ebf8e1, #f69d3c)', function () {
                return assert_1.deepStrictEqual(parse('radial-gradient(ellipse closest-side, #3f87a6, #ebf8e1, #f69d3c)'), {
                    type: image_1.CSSImageType.RADIAL_GRADIENT,
                    shape: image_1.CSSRadialShape.ELLIPSE,
                    size: image_1.CSSRadialExtent.CLOSEST_SIDE,
                    position: [],
                    stops: [
                        { color: colorParse('#3f87a6'), stop: null },
                        { color: colorParse('#ebf8e1'), stop: null },
                        { color: colorParse('#f69d3c'), stop: null }
                    ]
                });
            });
            it('radial-gradient(circle at center, red 0, blue, green 100%)', function () {
                return assert_1.deepStrictEqual(parse('radial-gradient(circle at center, red 0, blue, green 100%)'), {
                    type: image_1.CSSImageType.RADIAL_GRADIENT,
                    shape: image_1.CSSRadialShape.CIRCLE,
                    size: image_1.CSSRadialExtent.FARTHEST_CORNER,
                    position: [length_percentage_1.FIFTY_PERCENT],
                    stops: [
                        { color: colorParse('red'), stop: { type: tokenizer_1.TokenType.NUMBER_TOKEN, number: 0, flags: 4 } },
                        { color: colorParse('blue'), stop: null },
                        { color: colorParse('green'), stop: { type: tokenizer_1.TokenType.PERCENTAGE_TOKEN, number: 100, flags: 4 } }
                    ]
                });
            });
            it('radial-gradient(circle at 100%, #333, #333 50%, #eee 75%, #333 75%)', function () {
                return assert_1.deepStrictEqual(parse('radial-gradient(circle at 100%, #333, #333 50%, #eee 75%, #333 75%)'), {
                    type: image_1.CSSImageType.RADIAL_GRADIENT,
                    shape: image_1.CSSRadialShape.CIRCLE,
                    size: image_1.CSSRadialExtent.FARTHEST_CORNER,
                    position: [length_percentage_1.HUNDRED_PERCENT],
                    stops: [
                        { color: colorParse('#333'), stop: null },
                        { color: colorParse('#333'), stop: { type: tokenizer_1.TokenType.PERCENTAGE_TOKEN, number: 50, flags: 4 } },
                        { color: colorParse('#eee'), stop: { type: tokenizer_1.TokenType.PERCENTAGE_TOKEN, number: 75, flags: 4 } },
                        { color: colorParse('#333'), stop: { type: tokenizer_1.TokenType.PERCENTAGE_TOKEN, number: 75, flags: 4 } }
                    ]
                });
            });
            it('radial-gradient(20px, red, blue)', function () {
                return assert_1.deepStrictEqual(parse('radial-gradient(20px, red, blue)'), {
                    type: image_1.CSSImageType.RADIAL_GRADIENT,
                    shape: image_1.CSSRadialShape.CIRCLE,
                    size: [{ type: tokenizer_1.TokenType.DIMENSION_TOKEN, number: 20, flags: 4, unit: 'px' }],
                    position: [],
                    stops: [{ color: colorParse('red'), stop: null }, { color: colorParse('blue'), stop: null }]
                });
            });
        });
    });
});
//# sourceMappingURL=radial-gradient.js.map