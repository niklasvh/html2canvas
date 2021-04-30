import { CSSToken, DimensionToken, NumberValueToken, StringValueToken, TokenType } from './tokenizer';
export declare type CSSBlockType = TokenType.LEFT_PARENTHESIS_TOKEN | TokenType.LEFT_SQUARE_BRACKET_TOKEN | TokenType.LEFT_CURLY_BRACKET_TOKEN;
export interface CSSBlock {
    type: CSSBlockType;
    values: CSSValue[];
}
export interface CSSFunction {
    type: TokenType.FUNCTION;
    name: string;
    values: CSSValue[];
}
export declare type CSSValue = CSSFunction | CSSToken | CSSBlock;
export declare class Parser {
    private _tokens;
    constructor(tokens: CSSToken[]);
    static create(value: string): Parser;
    static parseValue(value: string): CSSValue;
    static parseValues(value: string): CSSValue[];
    parseComponentValue(): CSSValue;
    parseComponentValues(): CSSValue[];
    private consumeComponentValue;
    private consumeSimpleBlock;
    private consumeFunction;
    private consumeToken;
    private reconsumeToken;
}
export declare const isDimensionToken: (token: CSSValue) => token is DimensionToken;
export declare const isNumberToken: (token: CSSValue) => token is NumberValueToken;
export declare const isIdentToken: (token: CSSValue) => token is StringValueToken;
export declare const isStringToken: (token: CSSValue) => token is StringValueToken;
export declare const isIdentWithValue: (token: CSSValue, value: string) => boolean;
export declare const nonWhiteSpace: (token: CSSValue) => boolean;
export declare const nonFunctionArgSeparator: (token: CSSValue) => boolean;
export declare const parseFunctionArgs: (tokens: CSSValue[]) => CSSValue[][];
