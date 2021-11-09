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
    const [x, y] = tuple;
    return [getAbsoluteValue(x, width), getAbsoluteValue(typeof y !== 'undefined' ? y : x, height)];
};
export const getAbsoluteValue = (token: LengthPercentage, parent: number): number => {
    if (token.type === TokenType.PERCENTAGE_TOKEN) {
        return (token.number / 100) * parent;
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
