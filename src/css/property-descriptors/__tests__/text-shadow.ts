import {deepStrictEqual} from 'assert';
import {Parser} from '../../syntax/parser';
import {color, COLORS} from '../../types/color';
import {textShadow} from '../text-shadow';
import {FLAG_INTEGER, DimensionToken, TokenType} from '../../syntax/tokenizer';
import {ZERO_LENGTH} from '../../types/length-percentage';

const textShadowParse = (value: string) => textShadow.parse(Parser.parseValues(value));
const colorParse = (value: string) => color.parse(Parser.parseValue(value));
const dimension = (number: number, unit: string): DimensionToken => ({
    flags: FLAG_INTEGER,
    number,
    unit,
    type: TokenType.DIMENSION_TOKEN
});

describe('property-descriptors', () => {
    describe('text-shadow', () => {
        it('none', () => deepStrictEqual(textShadowParse('none'), []));

        it('1px 1px 2px pink', () =>
            deepStrictEqual(textShadowParse('1px 1px 2px pink'), [
                {
                    color: colorParse('pink'),
                    offsetX: dimension(1, 'px'),
                    offsetY: dimension(1, 'px'),
                    blur: dimension(2, 'px')
                }
            ]));

        it('#fc0 1px 0 10px', () =>
            deepStrictEqual(textShadowParse('#fc0 1px 0 10px'), [
                {
                    color: colorParse('#fc0'),
                    offsetX: dimension(1, 'px'),
                    offsetY: ZERO_LENGTH,
                    blur: dimension(10, 'px')
                }
            ]));

        it('5px 5px #558abb', () =>
            deepStrictEqual(textShadowParse('5px 5px #558abb'), [
                {
                    color: colorParse('#558abb'),
                    offsetX: dimension(5, 'px'),
                    offsetY: dimension(5, 'px'),
                    blur: ZERO_LENGTH
                }
            ]));

        it('white 2px 5px', () =>
            deepStrictEqual(textShadowParse('white 2px 5px'), [
                {
                    color: colorParse('#fff'),
                    offsetX: dimension(2, 'px'),
                    offsetY: dimension(5, 'px'),
                    blur: ZERO_LENGTH
                }
            ]));

        it('white 2px 5px', () =>
            deepStrictEqual(textShadowParse('5px 10px'), [
                {
                    color: COLORS.TRANSPARENT,
                    offsetX: dimension(5, 'px'),
                    offsetY: dimension(10, 'px'),
                    blur: ZERO_LENGTH
                }
            ]));

        it('1px 1px 2px red, 0 0 1em blue, 0 0 2em blue', () =>
            deepStrictEqual(textShadowParse('1px 1px 2px red, 0 0 1em blue, 0 0 2em blue'), [
                {
                    color: colorParse('red'),
                    offsetX: dimension(1, 'px'),
                    offsetY: dimension(1, 'px'),
                    blur: dimension(2, 'px')
                },
                {
                    color: colorParse('blue'),
                    offsetX: ZERO_LENGTH,
                    offsetY: ZERO_LENGTH,
                    blur: dimension(1, 'em')
                },
                {
                    color: colorParse('blue'),
                    offsetX: ZERO_LENGTH,
                    offsetY: ZERO_LENGTH,
                    blur: dimension(2, 'em')
                }
            ]));
    });
});
