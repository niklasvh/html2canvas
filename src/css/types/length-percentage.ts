import {DimensionToken, FLAG_INTEGER, NumberValueToken, TokenType} from '../syntax/tokenizer';
import {CSSValue, isDimensionToken} from '../syntax/parser';
import {isLength} from './length';
export type LengthPercentage = DimensionToken | NumberValueToken;
export type LengthPercentageTuple = [LengthPercentage] | [LengthPercentage, LengthPercentage];

export const isLengthPercentage = (token: CSSValue): token is LengthPercentage =>
    token.type === TokenType.PERCENTAGE_TOKEN || isLength(token);
export const parseLengthPercentageTuple = (tokens: LengthPercentage[]): LengthPercentageTuple =>
    tokens.length > 1 ? [tokens[0], tokens[1]] : [tokens[0]];
export const ZERO_LENGTH: NumberValueToken = {
    type: TokenType.NUMBER_TOKEN,
    number: 0,
    flags: FLAG_INTEGER
};

export const FIFTY_PERCENT: NumberValueToken = {
    type: TokenType.PERCENTAGE_TOKEN,
    number: 50,
    flags: FLAG_INTEGER
};

export const HUNDRED_PERCENT: NumberValueToken = {
    type: TokenType.PERCENTAGE_TOKEN,
    number: 100,
    flags: FLAG_INTEGER
};

export const getAbsoluteValueForTuple = (
    tuple: LengthPercentageTuple,
    width: number,
    height: number
): [number, number] => {
    let [x, y] = tuple;
    let absoluteX = getAbsoluteValue(x, width);
    let absoluteY = getAbsoluteValue(typeof y !== 'undefined' ? y : x, height);

    // https://developer.mozilla.org/en-US/docs/Web/CSS/background-position#values
    // With 3-value syntax, there are two keywords, and an offset that modifies the
    // preceding keyword
    if (tuple.length == 3) {
        // If the first keyword is "left" or "right", we start with the X position
        if (tuple[0].value == 'left' || tuple[0].value == 'right') {
            // If the second tuple is an offset, apply it to the X position
            if (tuple[1].type == TokenType.PERCENTAGE_TOKEN || tuple[1].type == TokenType.DIMENSION_TOKEN) {
                if (tuple[0].value == 'left') absoluteX = getAbsoluteValue(tuple[1], width);
                if (tuple[0].value == 'right') absoluteX = width - getAbsoluteValue(tuple[1], width);
            }

            // If the second tuple is a keyword, X position is left or right
            if (tuple[1].type == TokenType.IDENT_TOKEN) {
                if (tuple[0].value == 'left') absoluteX = getAbsoluteValue(tuple[0], width);
                if (tuple[0].value == 'right') absoluteX = width - getAbsoluteValue(tuple[0], width);
            }

            // If the first keyword is left/right and the last is 50%, we know that's
            // vertical centering
            if (tuple[2].type == TokenType.PERCENTAGE_TOKEN) {
                absoluteY = getAbsoluteValue(tuple[2], height);
            }
        }

        // If the third tuple is an offset (meaning the first two are keywords) it modifies
        // the second tuple keyword
        if (tuple[2].type == TokenType.PERCENTAGE_TOKEN || tuple[2].type == TokenType.DIMENSION_TOKEN) {
            if (tuple[1].value == 'top') absoluteY = getAbsoluteValue(tuple[2], height);
            if (tuple[1].value == 'bottom') absoluteY = height - getAbsoluteValue(tuple[2], height);
            if (tuple[1].value == 'left') absoluteX = getAbsoluteValue(tuple[2], width);
            if (tuple[1].value == 'right') absoluteX = width - getAbsoluteValue(tuple[2], width);
        }

        // If the first keyword is "center" we check to see if the other keyword is left/right
        // to see if this applies to Y, otherwise assume X
        if (tuple[0].value == 'center') {
            if (
                tuple[1].value !== 'left' &&
                tuple[1].value !== 'right' &&
                tuple[2].value !== 'left' &&
                tuple[2].value !== 'right'
            ) {
                absoluteX = getAbsoluteValue(tuple[0], width);
            }

            if (tuple[1].value == 'left' || tuple[1].value == 'right') {
                absoluteY = getAbsoluteValue(tuple[0], height);
            }
        }

        if (tuple[1].value == 'center' || tuple[2].value == 'center') {
            if (tuple[0].value == 'right' || tuple[0].value == 'right') {
                absoluteY = getAbsoluteValue(tuple[2], height);
            }
        }
    }

    // With 4-value syntax, the 1st and 3rd values are keywords, and the 2nd and 4th
    // are offsets for each of them respectively
    if (tuple.length == 4) {
        if (tuple[0].type == TokenType.IDENT_TOKEN) {
            if (tuple[0].value == 'left') absoluteX = getAbsoluteValue(tuple[1], width);
            if (tuple[0].value == 'right') absoluteX = width - getAbsoluteValue(tuple[1], width);
            if (tuple[0].value == 'top') absoluteY = getAbsoluteValue(tuple[1], height);
            if (tuple[0].value == 'bottom') absoluteY = height - getAbsoluteValue(tuple[1], height);
        }

        if (tuple[2].type == TokenType.IDENT_TOKEN) {
            if (tuple[2].value == 'top') absoluteY = getAbsoluteValue(tuple[3], height);
            if (tuple[2].value == 'bottom') absoluteY = height - getAbsoluteValue(tuple[3], height);
            if (tuple[2].value == 'left') absoluteX = getAbsoluteValue(tuple[3], width);
            if (tuple[2].value == 'right') absoluteX = width - getAbsoluteValue(tuple[3], width);
        }
    }

    return [absoluteX, absoluteY];
};
export const getAbsoluteValue = (token: LengthPercentage, parent: number): number => {
    if (token.type === TokenType.PERCENTAGE_TOKEN) {
        return (token.number / 100) * parent;
    }

    if (token.type === TokenType.IDENT_TOKEN) {
        switch (token.value) {
            case 'right':
            case 'bottom':
                return parent;
            case 'center':
                return 0.5 * parent;
            default:
                return 0;
        }
    }

    // Firefox translates positions like "right 20px" as calc(100% + 20px)
    if (token.type === TokenType.FUNCTION) {
        if (token.name === 'calc' && token.values.length == 5) {
            let firstValue = getAbsoluteValue(token.values[0], parent);
            let secondValue = getAbsoluteValue(token.values[4], parent);

            if (token.values[2].value == '-') return firstValue - secondValue;
            if (token.values[2].value == '+') return firstValue + secondValue;
        }
    }

    if (isDimensionToken(token)) {
        switch (token.unit) {
            case 'rem':
            case 'em':
                return 16 * token.number; // TODO use correct font-size
            case 'px':
            default:
                return token.number;
        }
    }

    return token.number;
};
