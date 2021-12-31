export declare const enum TokenType {
    STRING_TOKEN = 0,
    BAD_STRING_TOKEN = 1,
    LEFT_PARENTHESIS_TOKEN = 2,
    RIGHT_PARENTHESIS_TOKEN = 3,
    COMMA_TOKEN = 4,
    HASH_TOKEN = 5,
    DELIM_TOKEN = 6,
    AT_KEYWORD_TOKEN = 7,
    PREFIX_MATCH_TOKEN = 8,
    DASH_MATCH_TOKEN = 9,
    INCLUDE_MATCH_TOKEN = 10,
    LEFT_CURLY_BRACKET_TOKEN = 11,
    RIGHT_CURLY_BRACKET_TOKEN = 12,
    SUFFIX_MATCH_TOKEN = 13,
    SUBSTRING_MATCH_TOKEN = 14,
    DIMENSION_TOKEN = 15,
    PERCENTAGE_TOKEN = 16,
    NUMBER_TOKEN = 17,
    FUNCTION = 18,
    FUNCTION_TOKEN = 19,
    IDENT_TOKEN = 20,
    COLUMN_TOKEN = 21,
    URL_TOKEN = 22,
    BAD_URL_TOKEN = 23,
    CDC_TOKEN = 24,
    CDO_TOKEN = 25,
    COLON_TOKEN = 26,
    SEMICOLON_TOKEN = 27,
    LEFT_SQUARE_BRACKET_TOKEN = 28,
    RIGHT_SQUARE_BRACKET_TOKEN = 29,
    UNICODE_RANGE_TOKEN = 30,
    WHITESPACE_TOKEN = 31,
    EOF_TOKEN = 32
}
interface IToken {
    type: TokenType;
}
export interface Token extends IToken {
    type: TokenType.BAD_URL_TOKEN | TokenType.BAD_STRING_TOKEN | TokenType.LEFT_PARENTHESIS_TOKEN | TokenType.RIGHT_PARENTHESIS_TOKEN | TokenType.COMMA_TOKEN | TokenType.SUBSTRING_MATCH_TOKEN | TokenType.PREFIX_MATCH_TOKEN | TokenType.SUFFIX_MATCH_TOKEN | TokenType.COLON_TOKEN | TokenType.SEMICOLON_TOKEN | TokenType.LEFT_SQUARE_BRACKET_TOKEN | TokenType.RIGHT_SQUARE_BRACKET_TOKEN | TokenType.LEFT_CURLY_BRACKET_TOKEN | TokenType.RIGHT_CURLY_BRACKET_TOKEN | TokenType.DASH_MATCH_TOKEN | TokenType.INCLUDE_MATCH_TOKEN | TokenType.COLUMN_TOKEN | TokenType.WHITESPACE_TOKEN | TokenType.CDC_TOKEN | TokenType.CDO_TOKEN | TokenType.EOF_TOKEN;
}
export interface StringValueToken extends IToken {
    type: TokenType.STRING_TOKEN | TokenType.DELIM_TOKEN | TokenType.FUNCTION_TOKEN | TokenType.IDENT_TOKEN | TokenType.URL_TOKEN | TokenType.AT_KEYWORD_TOKEN;
    value: string;
}
export interface HashToken extends IToken {
    type: TokenType.HASH_TOKEN;
    flags: number;
    value: string;
}
export interface NumberValueToken extends IToken {
    type: TokenType.PERCENTAGE_TOKEN | TokenType.NUMBER_TOKEN;
    flags: number;
    number: number;
}
export interface DimensionToken extends IToken {
    type: TokenType.DIMENSION_TOKEN;
    flags: number;
    unit: string;
    number: number;
}
export interface UnicodeRangeToken extends IToken {
    type: TokenType.UNICODE_RANGE_TOKEN;
    start: number;
    end: number;
}
export declare type CSSToken = Token | StringValueToken | NumberValueToken | DimensionToken | UnicodeRangeToken | HashToken;
export declare const FLAG_UNRESTRICTED: number;
export declare const FLAG_ID: number;
export declare const FLAG_INTEGER: number;
export declare const FLAG_NUMBER: number;
export declare const EOF_TOKEN: Token;
export declare class Tokenizer {
    private _value;
    constructor();
    write(chunk: string): void;
    read(): CSSToken[];
    private consumeToken;
    private consumeCodePoint;
    private reconsumeCodePoint;
    private peekCodePoint;
    private consumeUnicodeRangeToken;
    private consumeIdentLikeToken;
    private consumeUrlToken;
    private consumeWhiteSpace;
    private consumeBadUrlRemnants;
    private consumeStringSlice;
    private consumeStringToken;
    private consumeNumber;
    private consumeNumericToken;
    private consumeEscapedCodePoint;
    private consumeName;
}
export {};
