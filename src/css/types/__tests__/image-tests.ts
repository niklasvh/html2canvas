import {deepStrictEqual} from 'assert';
import {Parser} from '../../syntax/parser';
import {CSSImageType, image} from '../image';
import {color, pack} from '../color';
import {FLAG_INTEGER, TokenType} from '../../syntax/tokenizer';
import {deg} from '../angle';

const parse = (context: Context, value: string) => image.parse(context, Parser.parseValue(value));
const colorParse = (context: Context, value: string) => color.parse(context, Parser.parseValue(value));

jest.mock('../../../core/features');

jest.mock('../../../core/context');
import {Context} from '../../../core/context';

describe('types', () => {
    let context: Context;
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context = new Context({} as any, {} as any);
    });

    describe('<image>', () => {
        describe('parsing', () => {
            describe('url', () => {
                it('url(test.jpg)', () =>
                    deepStrictEqual(parse(context, 'url(http://example.com/test.jpg)'), {
                        url: 'http://example.com/test.jpg',
                        type: CSSImageType.URL
                    }));
                it('url("test.jpg")', () =>
                    deepStrictEqual(parse(context, 'url("http://example.com/test.jpg")'), {
                        url: 'http://example.com/test.jpg',
                        type: CSSImageType.URL
                    }));
            });
            describe('linear-gradient', () => {
                it('linear-gradient(#f69d3c, #3f87a6)', () =>
                    deepStrictEqual(parse(context, 'linear-gradient(#f69d3c, #3f87a6)'), {
                        angle: deg(180),
                        type: CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {color: pack(0xf6, 0x9d, 0x3c, 1), stop: null},
                            {color: pack(0x3f, 0x87, 0xa6, 1), stop: null}
                        ]
                    }));
                it('linear-gradient(yellow, blue)', () =>
                    deepStrictEqual(parse(context, 'linear-gradient(yellow, blue)'), {
                        angle: deg(180),
                        type: CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {color: colorParse(context, 'yellow'), stop: null},
                            {color: colorParse(context, 'blue'), stop: null}
                        ]
                    }));
                it('linear-gradient(to bottom, yellow, blue)', () =>
                    deepStrictEqual(parse(context, 'linear-gradient(to bottom, yellow, blue)'), {
                        angle: deg(180),
                        type: CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {color: colorParse(context, 'yellow'), stop: null},
                            {color: colorParse(context, 'blue'), stop: null}
                        ]
                    }));
                it('linear-gradient(180deg, yellow, blue)', () =>
                    deepStrictEqual(parse(context, 'linear-gradient(180deg, yellow, blue)'), {
                        angle: deg(180),
                        type: CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {color: colorParse(context, 'yellow'), stop: null},
                            {color: colorParse(context, 'blue'), stop: null}
                        ]
                    }));
                it('linear-gradient(to top, blue, yellow)', () =>
                    deepStrictEqual(parse(context, 'linear-gradient(to top, blue, yellow)'), {
                        angle: 0,
                        type: CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {color: colorParse(context, 'blue'), stop: null},
                            {color: colorParse(context, 'yellow'), stop: null}
                        ]
                    }));
                it('linear-gradient(to top right, blue, yellow)', () =>
                    deepStrictEqual(parse(context, 'linear-gradient(to top right, blue, yellow)'), {
                        angle: [
                            {type: TokenType.PERCENTAGE_TOKEN, number: 100, flags: 4},
                            {type: TokenType.NUMBER_TOKEN, number: 0, flags: 4}
                        ],
                        type: CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {color: colorParse(context, 'blue'), stop: null},
                            {color: colorParse(context, 'yellow'), stop: null}
                        ]
                    }));
                it('linear-gradient(to bottom, yellow 0%, blue 100%)', () =>
                    deepStrictEqual(parse(context, 'linear-gradient(to bottom, yellow 0%, blue 100%)'), {
                        angle: deg(180),
                        type: CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {
                                color: colorParse(context, 'yellow'),
                                stop: {
                                    type: TokenType.PERCENTAGE_TOKEN,
                                    number: 0,
                                    flags: FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse(context, 'blue'),
                                stop: {
                                    type: TokenType.PERCENTAGE_TOKEN,
                                    number: 100,
                                    flags: FLAG_INTEGER
                                }
                            }
                        ]
                    }));
                it('linear-gradient(to top left, lightpink, lightpink 5px, white 5px, white 10px)', () =>
                    deepStrictEqual(
                        parse(context, 'linear-gradient(to top left, lightpink, lightpink 5px, white 5px, white 10px)'),
                        {
                            angle: [
                                {type: TokenType.PERCENTAGE_TOKEN, number: 100, flags: 4},
                                {type: TokenType.PERCENTAGE_TOKEN, number: 100, flags: 4}
                            ],
                            type: CSSImageType.LINEAR_GRADIENT,
                            stops: [
                                {color: colorParse(context, 'lightpink'), stop: null},
                                {
                                    color: colorParse(context, 'lightpink'),
                                    stop: {
                                        type: TokenType.DIMENSION_TOKEN,
                                        number: 5,
                                        flags: FLAG_INTEGER,
                                        unit: 'px'
                                    }
                                },
                                {
                                    color: colorParse(context, 'white'),
                                    stop: {
                                        type: TokenType.DIMENSION_TOKEN,
                                        number: 5,
                                        flags: FLAG_INTEGER,
                                        unit: 'px'
                                    }
                                },
                                {
                                    color: colorParse(context, 'white'),
                                    stop: {
                                        type: TokenType.DIMENSION_TOKEN,
                                        number: 10,
                                        flags: FLAG_INTEGER,
                                        unit: 'px'
                                    }
                                }
                            ]
                        }
                    ));
            });
            describe('-prefix-linear-gradient', () => {
                it('-webkit-linear-gradient(left, #cedbe9 0%, #aac5de 17%, #3a8bc2 84%, #26558b 100%)', () =>
                    deepStrictEqual(
                        parse(
                            context,
                            '-webkit-linear-gradient(left, #cedbe9 0%, #aac5de 17%, #3a8bc2 84%, #26558b 100%)'
                        ),
                        {
                            angle: deg(90),
                            type: CSSImageType.LINEAR_GRADIENT,
                            stops: [
                                {
                                    color: colorParse(context, '#cedbe9'),
                                    stop: {
                                        type: TokenType.PERCENTAGE_TOKEN,
                                        number: 0,
                                        flags: FLAG_INTEGER
                                    }
                                },
                                {
                                    color: colorParse(context, '#aac5de'),
                                    stop: {
                                        type: TokenType.PERCENTAGE_TOKEN,
                                        number: 17,
                                        flags: FLAG_INTEGER
                                    }
                                },
                                {
                                    color: colorParse(context, '#3a8bc2'),
                                    stop: {
                                        type: TokenType.PERCENTAGE_TOKEN,
                                        number: 84,
                                        flags: FLAG_INTEGER
                                    }
                                },
                                {
                                    color: colorParse(context, '#26558b'),
                                    stop: {
                                        type: TokenType.PERCENTAGE_TOKEN,
                                        number: 100,
                                        flags: FLAG_INTEGER
                                    }
                                }
                            ]
                        }
                    ));
                it('-moz-linear-gradient(top, #cce5f4 0%, #00263c 100%)', () =>
                    deepStrictEqual(parse(context, '-moz-linear-gradient(top, #cce5f4 0%, #00263c 100%)'), {
                        angle: deg(180),
                        type: CSSImageType.LINEAR_GRADIENT,
                        stops: [
                            {
                                color: colorParse(context, '#cce5f4'),
                                stop: {
                                    type: TokenType.PERCENTAGE_TOKEN,
                                    number: 0,
                                    flags: FLAG_INTEGER
                                }
                            },
                            {
                                color: colorParse(context, '#00263c'),
                                stop: {
                                    type: TokenType.PERCENTAGE_TOKEN,
                                    number: 100,
                                    flags: FLAG_INTEGER
                                }
                            }
                        ]
                    }));
            });
        });
    });
});
