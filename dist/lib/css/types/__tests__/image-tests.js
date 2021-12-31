"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var parser_1 = require("../../syntax/parser");
var image_1 = require("../image");
var color_1 = require("../color");
var tokenizer_1 = require("../../syntax/tokenizer");
var angle_1 = require("../angle");
var parse = function (context, value) { return image_1.image.parse(context, parser_1.Parser.parseValue(value)); };
var colorParse = function (context, value) { return color_1.color.parse(context, parser_1.Parser.parseValue(value)); };
jest.mock('../../../core/features');
jest.mock('../../../core/context');
var context_1 = require("../../../core/context");
describe('types', function () {
    var context;
    beforeEach(function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context = new context_1.Context({}, {});
    });
    describe('<image>', function () {
        describe('parsing', function () {
            describe('url', function () {
                it('url(test.jpg)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'url(http://example.com/test.jpg)'), {
                        url: 'http://example.com/test.jpg',
                        type: 0 /* URL */
                    });
                });
                it('url("test.jpg")', function () {
                    return assert_1.deepStrictEqual(parse(context, 'url("http://example.com/test.jpg")'), {
                        url: 'http://example.com/test.jpg',
                        type: 0 /* URL */
                    });
                });
            });
            describe('linear-gradient', function () {
                it('linear-gradient(#f69d3c, #3f87a6)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'linear-gradient(#f69d3c, #3f87a6)'), {
                        angle: angle_1.deg(180),
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            { color: color_1.pack(0xf6, 0x9d, 0x3c, 1), stop: null },
                            { color: color_1.pack(0x3f, 0x87, 0xa6, 1), stop: null }
                        ]
                    });
                });
                it('linear-gradient(yellow, blue)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'linear-gradient(yellow, blue)'), {
                        angle: angle_1.deg(180),
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            { color: colorParse(context, 'yellow'), stop: null },
                            { color: colorParse(context, 'blue'), stop: null }
                        ]
                    });
                });
                it('linear-gradient(to bottom, yellow, blue)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'linear-gradient(to bottom, yellow, blue)'), {
                        angle: angle_1.deg(180),
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            { color: colorParse(context, 'yellow'), stop: null },
                            { color: colorParse(context, 'blue'), stop: null }
                        ]
                    });
                });
                it('linear-gradient(180deg, yellow, blue)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'linear-gradient(180deg, yellow, blue)'), {
                        angle: angle_1.deg(180),
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            { color: colorParse(context, 'yellow'), stop: null },
                            { color: colorParse(context, 'blue'), stop: null }
                        ]
                    });
                });
                it('linear-gradient(to top, blue, yellow)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'linear-gradient(to top, blue, yellow)'), {
                        angle: 0,
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            { color: colorParse(context, 'blue'), stop: null },
                            { color: colorParse(context, 'yellow'), stop: null }
                        ]
                    });
                });
                it('linear-gradient(to top right, blue, yellow)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'linear-gradient(to top right, blue, yellow)'), {
                        angle: [
                            { type: 16 /* PERCENTAGE_TOKEN */, number: 100, flags: 4 },
                            { type: 17 /* NUMBER_TOKEN */, number: 0, flags: 4 }
                        ],
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            { color: colorParse(context, 'blue'), stop: null },
                            { color: colorParse(context, 'yellow'), stop: null }
                        ]
                    });
                });
                it('linear-gradient(to bottom, yellow 0%, blue 100%)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'linear-gradient(to bottom, yellow 0%, blue 100%)'), {
                        angle: angle_1.deg(180),
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            {
                                color: colorParse(context, 'yellow'),
                                stop: {
                                    type: 16 /* PERCENTAGE_TOKEN */,
                                    number: 0,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse(context, 'blue'),
                                stop: {
                                    type: 16 /* PERCENTAGE_TOKEN */,
                                    number: 100,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            }
                        ]
                    });
                });
                it('linear-gradient(to top left, lightpink, lightpink 5px, white 5px, white 10px)', function () {
                    return assert_1.deepStrictEqual(parse(context, 'linear-gradient(to top left, lightpink, lightpink 5px, white 5px, white 10px)'), {
                        angle: [
                            { type: 16 /* PERCENTAGE_TOKEN */, number: 100, flags: 4 },
                            { type: 16 /* PERCENTAGE_TOKEN */, number: 100, flags: 4 }
                        ],
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            { color: colorParse(context, 'lightpink'), stop: null },
                            {
                                color: colorParse(context, 'lightpink'),
                                stop: {
                                    type: 15 /* DIMENSION_TOKEN */,
                                    number: 5,
                                    flags: tokenizer_1.FLAG_INTEGER,
                                    unit: 'px'
                                }
                            },
                            {
                                color: colorParse(context, 'white'),
                                stop: {
                                    type: 15 /* DIMENSION_TOKEN */,
                                    number: 5,
                                    flags: tokenizer_1.FLAG_INTEGER,
                                    unit: 'px'
                                }
                            },
                            {
                                color: colorParse(context, 'white'),
                                stop: {
                                    type: 15 /* DIMENSION_TOKEN */,
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
                    return assert_1.deepStrictEqual(parse(context, '-webkit-linear-gradient(left, #cedbe9 0%, #aac5de 17%, #3a8bc2 84%, #26558b 100%)'), {
                        angle: angle_1.deg(90),
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            {
                                color: colorParse(context, '#cedbe9'),
                                stop: {
                                    type: 16 /* PERCENTAGE_TOKEN */,
                                    number: 0,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse(context, '#aac5de'),
                                stop: {
                                    type: 16 /* PERCENTAGE_TOKEN */,
                                    number: 17,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse(context, '#3a8bc2'),
                                stop: {
                                    type: 16 /* PERCENTAGE_TOKEN */,
                                    number: 84,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse(context, '#26558b'),
                                stop: {
                                    type: 16 /* PERCENTAGE_TOKEN */,
                                    number: 100,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            }
                        ]
                    });
                });
                it('-moz-linear-gradient(top, #cce5f4 0%, #00263c 100%)', function () {
                    return assert_1.deepStrictEqual(parse(context, '-moz-linear-gradient(top, #cce5f4 0%, #00263c 100%)'), {
                        angle: angle_1.deg(180),
                        type: 1 /* LINEAR_GRADIENT */,
                        stops: [
                            {
                                color: colorParse(context, '#cce5f4'),
                                stop: {
                                    type: 16 /* PERCENTAGE_TOKEN */,
                                    number: 0,
                                    flags: tokenizer_1.FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse(context, '#00263c'),
                                stop: {
                                    type: 16 /* PERCENTAGE_TOKEN */,
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