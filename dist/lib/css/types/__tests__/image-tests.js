"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var parser_1 = require("../../syntax/parser");
var image_1 = require("../image");
var color_1 = require("../color");
var tokenizer_1 = require("../../syntax/tokenizer");
var angle_1 = require("../angle");
var parse = function (value) { return image_1.image.parse(parser_1.Parser.parseValue(value)); };
var colorParse = function (value) { return color_1.color.parse(parser_1.Parser.parseValue(value)); };
jest.mock('../../../core/cache-storage');
jest.mock('../../../core/features');
describe('types', function () {
    describe('<image>', function () {
        describe('parsing', function () {
            describe('url', function () {
                it('url(test.jpg)', function () {
                    return assert_1.deepStrictEqual(parse('url(http://example.com/test.jpg)'), {
                        url: 'http://example.com/test.jpg',
                        type: image_1.CSSImageType.URL
                    });
                });
                it('url("test.jpg")', function () {
                    return assert_1.deepStrictEqual(parse('url("http://example.com/test.jpg")'), {
                        url: 'http://example.com/test.jpg',
                        type: image_1.CSSImageType.URL
                    });
                });
            });
            describe('linear-gradient', function () {
                it('linear-gradient(#f69d3c, #3f87a6)', function () {
                    return assert_1.deepStrictEqual(parse('linear-gradient(#f69d3c, #3f87a6)'), {
                        angle: angle_1.deg(180),
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            { color: color_1.pack(0xf6, 0x9d, 0x3c, 1), stop: null },
                            { color: color_1.pack(0x3f, 0x87, 0xa6, 1), stop: null }
                        ]
                    });
                });
                it('linear-gradient(yellow, blue)', function () {
                    return assert_1.deepStrictEqual(parse('linear-gradient(yellow, blue)'), {
                        angle: angle_1.deg(180),
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [{ color: colorParse('yellow'), stop: null }, { color: colorParse('blue'), stop: null }]
                    });
                });
                it('linear-gradient(to bottom, yellow, blue)', function () {
                    return assert_1.deepStrictEqual(parse('linear-gradient(to bottom, yellow, blue)'), {
                        angle: angle_1.deg(180),
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [{ color: colorParse('yellow'), stop: null }, { color: colorParse('blue'), stop: null }]
                    });
                });
                it('linear-gradient(180deg, yellow, blue)', function () {
                    return assert_1.deepStrictEqual(parse('linear-gradient(180deg, yellow, blue)'), {
                        angle: angle_1.deg(180),
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [{ color: colorParse('yellow'), stop: null }, { color: colorParse('blue'), stop: null }]
                    });
                });
                it('linear-gradient(to top, blue, yellow)', function () {
                    return assert_1.deepStrictEqual(parse('linear-gradient(to top, blue, yellow)'), {
                        angle: 0,
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [{ color: colorParse('blue'), stop: null }, { color: colorParse('yellow'), stop: null }]
                    });
                });
                it('linear-gradient(to top right, blue, yellow)', function () {
                    return assert_1.deepStrictEqual(parse('linear-gradient(to top right, blue, yellow)'), {
                        angle: [
                            { type: tokenizer_1.TokenType.PERCENTAGE_TOKEN, number: 100, flags: 4 },
                            { type: tokenizer_1.TokenType.NUMBER_TOKEN, number: 0, flags: 4 }
                        ],
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [{ color: colorParse('blue'), stop: null }, { color: colorParse('yellow'), stop: null }]
                    });
                });
                it('linear-gradient(to bottom, yellow 0%, blue 100%)', function () {
                    return assert_1.deepStrictEqual(parse('linear-gradient(to bottom, yellow 0%, blue 100%)'), {
                        angle: angle_1.deg(180),
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {
                                color: colorParse('yellow'),
                                stop: {
                                    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
                                    number: 0,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse('blue'),
                                stop: {
                                    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
                                    number: 100,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            }
                        ]
                    });
                });
                it('linear-gradient(to top left, lightpink, lightpink 5px, white 5px, white 10px)', function () {
                    return assert_1.deepStrictEqual(parse('linear-gradient(to top left, lightpink, lightpink 5px, white 5px, white 10px)'), {
                        angle: [
                            { type: tokenizer_1.TokenType.PERCENTAGE_TOKEN, number: 100, flags: 4 },
                            { type: tokenizer_1.TokenType.PERCENTAGE_TOKEN, number: 100, flags: 4 }
                        ],
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            { color: colorParse('lightpink'), stop: null },
                            {
                                color: colorParse('lightpink'),
                                stop: {
                                    type: tokenizer_1.TokenType.DIMENSION_TOKEN,
                                    number: 5,
                                    flags: tokenizer_1.FLAG_INTEGER,
                                    unit: 'px'
                                }
                            },
                            {
                                color: colorParse('white'),
                                stop: {
                                    type: tokenizer_1.TokenType.DIMENSION_TOKEN,
                                    number: 5,
                                    flags: tokenizer_1.FLAG_INTEGER,
                                    unit: 'px'
                                }
                            },
                            {
                                color: colorParse('white'),
                                stop: {
                                    type: tokenizer_1.TokenType.DIMENSION_TOKEN,
                                    number: 10,
                                    flags: tokenizer_1.FLAG_INTEGER,
                                    unit: 'px'
                                }
                            }
                        ]
                    });
                });
            });
            describe('-prefix-linear-gradient', function () {
                it('-webkit-linear-gradient(left, #cedbe9 0%, #aac5de 17%, #3a8bc2 84%, #26558b 100%)', function () {
                    return assert_1.deepStrictEqual(parse('-webkit-linear-gradient(left, #cedbe9 0%, #aac5de 17%, #3a8bc2 84%, #26558b 100%)'), {
                        angle: angle_1.deg(90),
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {
                                color: colorParse('#cedbe9'),
                                stop: {
                                    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
                                    number: 0,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse('#aac5de'),
                                stop: {
                                    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
                                    number: 17,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse('#3a8bc2'),
                                stop: {
                                    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
                                    number: 84,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse('#26558b'),
                                stop: {
                                    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
                                    number: 100,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            }
                        ]
                    });
                });
                it('-moz-linear-gradient(top, #cce5f4 0%, #00263c 100%)', function () {
                    return assert_1.deepStrictEqual(parse('-moz-linear-gradient(top, #cce5f4 0%, #00263c 100%)'), {
                        angle: angle_1.deg(180),
                        type: image_1.CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {
                                color: colorParse('#cce5f4'),
                                stop: {
                                    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
                                    number: 0,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse('#00263c'),
                                stop: {
                                    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
                                    number: 100,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            }
                        ]
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=image-tests.js.map