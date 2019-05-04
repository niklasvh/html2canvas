import {DimensionToken, FLAG_INTEGER, NumberValueToken, TokenType} from '../syntax/tokenizer';
import {CSSValue} from '../syntax/parser';
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
export const getAbsoluteValueForTuple = (
    tuple: LengthPercentageTuple,
    width: number,
    height: number
): [number, number] => {
    let [x, y] = tuple;
    return [getAbsoluteValue(x, width), getAbsoluteValue(typeof y !== 'undefined' ? y : x, height)];
};
export const getAbsoluteValue = (token: LengthPercentage, parent: number) => {
    if (token.type === TokenType.PERCENTAGE_TOKEN) {
        return token.number / 100 * parent;
    }

    return token.number;
};
