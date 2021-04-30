"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var parser_1 = require("../../syntax/parser");
var color_1 = require("../../types/color");
var text_shadow_1 = require("../text-shadow");
var tokenizer_1 = require("../../syntax/tokenizer");
var length_percentage_1 = require("../../types/length-percentage");
var textShadowParse = function (value) { return text_shadow_1.textShadow.parse(parser_1.Parser.parseValues(value)); };
var colorParse = function (value) { return color_1.color.parse(parser_1.Parser.parseValue(value)); };
var dimension = function (number, unit) { return ({
    flags: tokenizer_1.FLAG_INTEGER,
    number: number,
    unit: unit,
    type: tokenizer_1.TokenType.DIMENSION_TOKEN
}); };
describe('property-descriptors', function () {
    describe('text-shadow', function () {
        it('none', function () { return assert_1.deepStrictEqual(textShadowParse('none'), []); });
        it('1px 1px 2px pink', function () {
            return assert_1.deepStrictEqual(textShadowParse('1px 1px 2px pink'), [
                {
                    color: colorParse('pink'),
                    offsetX: dimension(1, 'px'),
                    offsetY: dimension(1, 'px'),
                    blur: dimension(2, 'px')
                }
            ]);
        });
        it('#fc0 1px 0 10px', function () {
            return assert_1.deepStrictEqual(textShadowParse('#fc0 1px 0 10px'), [
                {
                    color: colorParse('#fc0'),
                    offsetX: dimension(1, 'px'),
                    offsetY: length_percentage_1.ZERO_LENGTH,
                    blur: dimension(10, 'px')
                }
            ]);
        });
        it('5px 5px #558abb', function () {
            return assert_1.deepStrictEqual(textShadowParse('5px 5px #558abb'), [
                {
                    color: colorParse('#558abb'),
                    offsetX: dimension(5, 'px'),
                    offsetY: dimension(5, 'px'),
                    blur: length_percentage_1.ZERO_LENGTH
                }
            ]);
        });
        it('white 2px 5px', function () {
            return assert_1.deepStrictEqual(textShadowParse('white 2px 5px'), [
                {
                    color: colorParse('#fff'),
                    offsetX: dimension(2, 'px'),
                    offsetY: dimension(5, 'px'),
                    blur: length_percentage_1.ZERO_LENGTH
                }
            ]);
        });
        it('white 2px 5px', function () {
            return assert_1.deepStrictEqual(textShadowParse('5px 10px'), [
                {
                    color: color_1.COLORS.TRANSPARENT,
                    offsetX: dimension(5, 'px'),
                    offsetY: dimension(10, 'px'),
                    blur: length_percentage_1.ZERO_LENGTH
                }
            ]);
        });
        it('1px 1px 2px red, 0 0 1em blue, 0 0 2em blue', function () {
            return assert_1.deepStrictEqual(textShadowParse('1px 1px 2px red, 0 0 1em blue, 0 0 2em blue'), [
                {
                    color: colorParse('red'),
                    offsetX: dimension(1, 'px'),
                    offsetY: dimension(1, 'px'),
                    blur: dimension(2, 'px')
                },
                {
                    color: colorParse('blue'),
                    offsetX: length_percentage_1.ZERO_LENGTH,
                    offsetY: length_percentage_1.ZERO_LENGTH,
                    blur: dimension(1, 'em')
                },
                {
                    color: colorParse('blue'),
                    offsetX: length_percentage_1.ZERO_LENGTH,
                    offsetY: length_percentage_1.ZERO_LENGTH,
                    blur: dimension(2, 'em')
                }
            ]);
        });
    });
});
//# sourceMappingURL=text-shadow.js.map