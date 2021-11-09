// https://www.w3.org/TR/css-syntax-3

import {fromCodePoint, toCodePoints} from 'css-line-break';

export const enum TokenType {
    STRING_TOKEN,
    BAD_STRING_TOKEN,
    LEFT_PARENTHESIS_TOKEN,
    RIGHT_PARENTHESIS_TOKEN,
    COMMA_TOKEN,
    HASH_TOKEN,
    DELIM_TOKEN,
    AT_KEYWORD_TOKEN,
    PREFIX_MATCH_TOKEN,
    DASH_MATCH_TOKEN,
    INCLUDE_MATCH_TOKEN,
    LEFT_CURLY_BRACKET_TOKEN,
    RIGHT_CURLY_BRACKET_TOKEN,
    SUFFIX_MATCH_TOKEN,
    SUBSTRING_MATCH_TOKEN,
    DIMENSION_TOKEN,
    PERCENTAGE_TOKEN,
    NUMBER_TOKEN,
    FUNCTION,
    FUNCTION_TOKEN,
    IDENT_TOKEN,
    COLUMN_TOKEN,
    URL_TOKEN,
    BAD_URL_TOKEN,
    CDC_TOKEN,
    CDO_TOKEN,
    COLON_TOKEN,
    SEMICOLON_TOKEN,
    LEFT_SQUARE_BRACKET_TOKEN,
    RIGHT_SQUARE_BRACKET_TOKEN,
    UNICODE_RANGE_TOKEN,
    WHITESPACE_TOKEN,
    EOF_TOKEN
}

interface IToken {
    type: TokenType;
}

export interface Token extends IToken {
    type:
        | TokenType.BAD_URL_TOKEN
        | TokenType.BAD_STRING_TOKEN
        | TokenType.LEFT_PARENTHESIS_TOKEN
        | TokenType.RIGHT_PARENTHESIS_TOKEN
        | TokenType.COMMA_TOKEN
        | TokenType.SUBSTRING_MATCH_TOKEN
        | TokenType.PREFIX_MATCH_TOKEN
        | TokenType.SUFFIX_MATCH_TOKEN
        | TokenType.COLON_TOKEN
        | TokenType.SEMICOLON_TOKEN
        | TokenType.LEFT_SQUARE_BRACKET_TOKEN
        | TokenType.RIGHT_SQUARE_BRACKET_TOKEN
        | TokenType.LEFT_CURLY_BRACKET_TOKEN
        | TokenType.RIGHT_CURLY_BRACKET_TOKEN
        | TokenType.DASH_MATCH_TOKEN
        | TokenType.INCLUDE_MATCH_TOKEN
        | TokenType.COLUMN_TOKEN
        | TokenType.WHITESPACE_TOKEN
        | TokenType.CDC_TOKEN
        | TokenType.CDO_TOKEN
        | TokenType.EOF_TOKEN;
}

export interface StringValueToken extends IToken {
    type:
        | TokenType.STRING_TOKEN
        | TokenType.DELIM_TOKEN
        | TokenType.FUNCTION_TOKEN
        | TokenType.IDENT_TOKEN
        | TokenType.URL_TOKEN
        | TokenType.AT_KEYWORD_TOKEN;
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

export type CSSToken = Token | StringValueToken | NumberValueToken | DimensionToken | UnicodeRangeToken | HashToken;

export const FLAG_UNRESTRICTED = 1 << 0;
export const FLAG_ID = 1 << 1;
export const FLAG_INTEGER = 1 << 2;
export const FLAG_NUMBER = 1 << 3;

const LINE_FEED = 0x000a;
const SOLIDUS = 0x002f;
const REVERSE_SOLIDUS = 0x005c;
const CHARACTER_TABULATION = 0x0009;
const SPACE = 0x0020;
const QUOTATION_MARK = 0x0022;
const EQUALS_SIGN = 0x003d;
const NUMBER_SIGN = 0x0023;
const DOLLAR_SIGN = 0x0024;
const PERCENTAGE_SIGN = 0x0025;
const APOSTROPHE = 0x0027;
const LEFT_PARENTHESIS = 0x0028;
const RIGHT_PARENTHESIS = 0x0029;
const LOW_LINE = 0x005f;
const HYPHEN_MINUS = 0x002d;
const EXCLAMATION_MARK = 0x0021;
const LESS_THAN_SIGN = 0x003c;
const GREATER_THAN_SIGN = 0x003e;
const COMMERCIAL_AT = 0x0040;
const LEFT_SQUARE_BRACKET = 0x005b;
const RIGHT_SQUARE_BRACKET = 0x005d;
const CIRCUMFLEX_ACCENT = 0x003d;
const LEFT_CURLY_BRACKET = 0x007b;
const QUESTION_MARK = 0x003f;
const RIGHT_CURLY_BRACKET = 0x007d;
const VERTICAL_LINE = 0x007c;
const TILDE = 0x007e;
const CONTROL = 0x0080;
const REPLACEMENT_CHARACTER = 0xfffd;
const ASTERISK = 0x002a;
const PLUS_SIGN = 0x002b;
const COMMA = 0x002c;
const COLON = 0x003a;
const SEMICOLON = 0x003b;
const FULL_STOP = 0x002e;
const NULL = 0x0000;
const BACKSPACE = 0x0008;
const LINE_TABULATION = 0x000b;
const SHIFT_OUT = 0x000e;
const INFORMATION_SEPARATOR_ONE = 0x001f;
const DELETE = 0x007f;
const EOF = -1;
const ZERO = 0x0030;
const a = 0x0061;
const e = 0x0065;
const f = 0x0066;
const u = 0x0075;
const z = 0x007a;
const A = 0x0041;
const E = 0x0045;
const F = 0x0046;
const U = 0x0055;
const Z = 0x005a;

const isDigit = (codePoint: number) => codePoint >= ZERO && codePoint <= 0x0039;
const isSurrogateCodePoint = (codePoint: number) => codePoint >= 0xd800 && codePoint <= 0xdfff;
const isHex = (codePoint: number) =>
    isDigit(codePoint) || (codePoint >= A && codePoint <= F) || (codePoint >= a && codePoint <= f);
const isLowerCaseLetter = (codePoint: number) => codePoint >= a && codePoint <= z;
const isUpperCaseLetter = (codePoint: number) => codePoint >= A && codePoint <= Z;
const isLetter = (codePoint: number) => isLowerCaseLetter(codePoint) || isUpperCaseLetter(codePoint);
const isNonASCIICodePoint = (codePoint: number) => codePoint >= CONTROL;
const isWhiteSpace = (codePoint: number): boolean =>
    codePoint === LINE_FEED || codePoint === CHARACTER_TABULATION || codePoint === SPACE;
const isNameStartCodePoint = (codePoint: number): boolean =>
    isLetter(codePoint) || isNonASCIICodePoint(codePoint) || codePoint === LOW_LINE;
const isNameCodePoint = (codePoint: number): boolean =>
    isNameStartCodePoint(codePoint) || isDigit(codePoint) || codePoint === HYPHEN_MINUS;
const isNonPrintableCodePoint = (codePoint: number): boolean => {
    return (
        (codePoint >= NULL && codePoint <= BACKSPACE) ||
        codePoint === LINE_TABULATION ||
        (codePoint >= SHIFT_OUT && codePoint <= INFORMATION_SEPARATOR_ONE) ||
        codePoint === DELETE
    );
};
const isValidEscape = (c1: number, c2: number): boolean => {
    if (c1 !== REVERSE_SOLIDUS) {
        return false;
    }

    return c2 !== LINE_FEED;
};
const isIdentifierStart = (c1: number, c2: number, c3: number): boolean => {
    if (c1 === HYPHEN_MINUS) {
        return isNameStartCodePoint(c2) || isValidEscape(c2, c3);
    } else if (isNameStartCodePoint(c1)) {
        return true;
    } else if (c1 === REVERSE_SOLIDUS && isValidEscape(c1, c2)) {
        return true;
    }
    return false;
};

const isNumberStart = (c1: number, c2: number, c3: number): boolean => {
    if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
        if (isDigit(c2)) {
            return true;
        }

        return c2 === FULL_STOP && isDigit(c3);
    }

    if (c1 === FULL_STOP) {
        return isDigit(c2);
    }

    return isDigit(c1);
};

const stringToNumber = (codePoints: number[]): number => {
    let c = 0;
    let sign = 1;
    if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {
        if (codePoints[c] === HYPHEN_MINUS) {
            sign = -1;
        }
        c++;
    }

    const integers = [];

    while (isDigit(codePoints[c])) {
        integers.push(codePoints[c++]);
    }

    const int = integers.length ? parseInt(fromCodePoint(...integers), 10) : 0;

    if (codePoints[c] === FULL_STOP) {
        c++;
    }

    const fraction = [];
    while (isDigit(codePoints[c])) {
        fraction.push(codePoints[c++]);
    }

    const fracd = fraction.length;
    const frac = fracd ? parseInt(fromCodePoint(...fraction), 10) : 0;

    if (codePoints[c] === E || codePoints[c] === e) {
        c++;
    }

    let expsign = 1;

    if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {
        if (codePoints[c] === HYPHEN_MINUS) {
            expsign = -1;
        }
        c++;
    }

    const exponent = [];

    while (isDigit(codePoints[c])) {
        exponent.push(codePoints[c++]);
    }

    const exp = exponent.length ? parseInt(fromCodePoint(...exponent), 10) : 0;

    return sign * (int + frac * Math.pow(10, -fracd)) * Math.pow(10, expsign * exp);
};

const LEFT_PARENTHESIS_TOKEN: Token = {
    type: TokenType.LEFT_PARENTHESIS_TOKEN
};
const RIGHT_PARENTHESIS_TOKEN: Token = {
    type: TokenType.RIGHT_PARENTHESIS_TOKEN
};
const COMMA_TOKEN: Token = {type: TokenType.COMMA_TOKEN};
const SUFFIX_MATCH_TOKEN: Token = {type: TokenType.SUFFIX_MATCH_TOKEN};
const PREFIX_MATCH_TOKEN: Token = {type: TokenType.PREFIX_MATCH_TOKEN};
const COLUMN_TOKEN: Token = {type: TokenType.COLUMN_TOKEN};
const DASH_MATCH_TOKEN: Token = {type: TokenType.DASH_MATCH_TOKEN};
const INCLUDE_MATCH_TOKEN: Token = {type: TokenType.INCLUDE_MATCH_TOKEN};
const LEFT_CURLY_BRACKET_TOKEN: Token = {
    type: TokenType.LEFT_CURLY_BRACKET_TOKEN
};
const RIGHT_CURLY_BRACKET_TOKEN: Token = {
    type: TokenType.RIGHT_CURLY_BRACKET_TOKEN
};
const SUBSTRING_MATCH_TOKEN: Token = {type: TokenType.SUBSTRING_MATCH_TOKEN};
const BAD_URL_TOKEN: Token = {type: TokenType.BAD_URL_TOKEN};
const BAD_STRING_TOKEN: Token = {type: TokenType.BAD_STRING_TOKEN};
const CDO_TOKEN: Token = {type: TokenType.CDO_TOKEN};
const CDC_TOKEN: Token = {type: TokenType.CDC_TOKEN};
const COLON_TOKEN: Token = {type: TokenType.COLON_TOKEN};
const SEMICOLON_TOKEN: Token = {type: TokenType.SEMICOLON_TOKEN};
const LEFT_SQUARE_BRACKET_TOKEN: Token = {
    type: TokenType.LEFT_SQUARE_BRACKET_TOKEN
};
const RIGHT_SQUARE_BRACKET_TOKEN: Token = {
    type: TokenType.RIGHT_SQUARE_BRACKET_TOKEN
};
const WHITESPACE_TOKEN: Token = {type: TokenType.WHITESPACE_TOKEN};
export const EOF_TOKEN: Token = {type: TokenType.EOF_TOKEN};

export class Tokenizer {
    private _value: number[];

    constructor() {
        this._value = [];
    }

    write(chunk: string): void {
        this._value = this._value.concat(toCodePoints(chunk));
    }

    read(): CSSToken[] {
        const tokens = [];
        let token = this.consumeToken();
        while (token !== EOF_TOKEN) {
            tokens.push(token);
            token = this.consumeToken();
        }
        return tokens;
    }

    private consumeToken(): CSSToken {
        const codePoint = this.consumeCodePoint();

        switch (codePoint) {
            case QUOTATION_MARK:
                return this.consumeStringToken(QUOTATION_MARK);
            case NUMBER_SIGN:
                const c1 = this.peekCodePoint(0);
                const c2 = this.peekCodePoint(1);
                const c3 = this.peekCodePoint(2);
                if (isNameCodePoint(c1) || isValidEscape(c2, c3)) {
                    const flags = isIdentifierStart(c1, c2, c3) ? FLAG_ID : FLAG_UNRESTRICTED;
                    const value = this.consumeName();

                    return {type: TokenType.HASH_TOKEN, value, flags};
                }
                break;
            case DOLLAR_SIGN:
                if (this.peekCodePoint(0) === EQUALS_SIGN) {
                    this.consumeCodePoint();
                    return SUFFIX_MATCH_TOKEN;
                }
                break;
            case APOSTROPHE:
                return this.consumeStringToken(APOSTROPHE);
            case LEFT_PARENTHESIS:
                return LEFT_PARENTHESIS_TOKEN;
            case RIGHT_PARENTHESIS:
                return RIGHT_PARENTHESIS_TOKEN;
            case ASTERISK:
                if (this.peekCodePoint(0) === EQUALS_SIGN) {
                    this.consumeCodePoint();
                    return SUBSTRING_MATCH_TOKEN;
                }
                break;
            case PLUS_SIGN:
                if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {
                    this.reconsumeCodePoint(codePoint);
                    return this.consumeNumericToken();
                }
                break;
            case COMMA:
                return COMMA_TOKEN;
            case HYPHEN_MINUS:
                const e1 = codePoint;
                const e2 = this.peekCodePoint(0);
                const e3 = this.peekCodePoint(1);

                if (isNumberStart(e1, e2, e3)) {
                    this.reconsumeCodePoint(codePoint);
                    return this.consumeNumericToken();
                }

                if (isIdentifierStart(e1, e2, e3)) {
                    this.reconsumeCodePoint(codePoint);
                    return this.consumeIdentLikeToken();
                }

                if (e2 === HYPHEN_MINUS && e3 === GREATER_THAN_SIGN) {
                    this.consumeCodePoint();
                    this.consumeCodePoint();
                    return CDC_TOKEN;
                }
                break;

            case FULL_STOP:
                if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {
                    this.reconsumeCodePoint(codePoint);
                    return this.consumeNumericToken();
                }
                break;
            case SOLIDUS:
                if (this.peekCodePoint(0) === ASTERISK) {
                    this.consumeCodePoint();
                    while (true) {
                        let c = this.consumeCodePoint();
                        if (c === ASTERISK) {
                            c = this.consumeCodePoint();
                            if (c === SOLIDUS) {
                                return this.consumeToken();
                            }
                        }
                        if (c === EOF) {
                            return this.consumeToken();
                        }
                    }
                }
                break;
            case COLON:
                return COLON_TOKEN;
            case SEMICOLON:
                return SEMICOLON_TOKEN;
            case LESS_THAN_SIGN:
                if (
                    this.peekCodePoint(0) === EXCLAMATION_MARK &&
                    this.peekCodePoint(1) === HYPHEN_MINUS &&
                    this.peekCodePoint(2) === HYPHEN_MINUS
                ) {
                    this.consumeCodePoint();
                    this.consumeCodePoint();
                    return CDO_TOKEN;
                }
                break;
            case COMMERCIAL_AT:
                const a1 = this.peekCodePoint(0);
                const a2 = this.peekCodePoint(1);
                const a3 = this.peekCodePoint(2);
                if (isIdentifierStart(a1, a2, a3)) {
                    const value = this.consumeName();
                    return {type: TokenType.AT_KEYWORD_TOKEN, value};
                }
                break;
            case LEFT_SQUARE_BRACKET:
                return LEFT_SQUARE_BRACKET_TOKEN;
            case REVERSE_SOLIDUS:
                if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                    this.reconsumeCodePoint(codePoint);
                    return this.consumeIdentLikeToken();
                }
                break;
            case RIGHT_SQUARE_BRACKET:
                return RIGHT_SQUARE_BRACKET_TOKEN;
            case CIRCUMFLEX_ACCENT:
                if (this.peekCodePoint(0) === EQUALS_SIGN) {
                    this.consumeCodePoint();
                    return PREFIX_MATCH_TOKEN;
                }
                break;
            case LEFT_CURLY_BRACKET:
                return LEFT_CURLY_BRACKET_TOKEN;
            case RIGHT_CURLY_BRACKET:
                return RIGHT_CURLY_BRACKET_TOKEN;
            case u:
            case U:
                const u1 = this.peekCodePoint(0);
                const u2 = this.peekCodePoint(1);
                if (u1 === PLUS_SIGN && (isHex(u2) || u2 === QUESTION_MARK)) {
                    this.consumeCodePoint();
                    this.consumeUnicodeRangeToken();
                }
                this.reconsumeCodePoint(codePoint);
                return this.consumeIdentLikeToken();
            case VERTICAL_LINE:
                if (this.peekCodePoint(0) === EQUALS_SIGN) {
                    this.consumeCodePoint();
                    return DASH_MATCH_TOKEN;
                }
                if (this.peekCodePoint(0) === VERTICAL_LINE) {
                    this.consumeCodePoint();
                    return COLUMN_TOKEN;
                }
                break;
            case TILDE:
                if (this.peekCodePoint(0) === EQUALS_SIGN) {
                    this.consumeCodePoint();
                    return INCLUDE_MATCH_TOKEN;
                }
                break;
            case EOF:
                return EOF_TOKEN;
        }

        if (isWhiteSpace(codePoint)) {
            this.consumeWhiteSpace();
            return WHITESPACE_TOKEN;
        }

        if (isDigit(codePoint)) {
            this.reconsumeCodePoint(codePoint);
            return this.consumeNumericToken();
        }

        if (isNameStartCodePoint(codePoint)) {
            this.reconsumeCodePoint(codePoint);
            return this.consumeIdentLikeToken();
        }

        return {type: TokenType.DELIM_TOKEN, value: fromCodePoint(codePoint)};
    }

    private consumeCodePoint(): number {
        const value = this._value.shift();

        return typeof value === 'undefined' ? -1 : value;
    }

    private reconsumeCodePoint(codePoint: number) {
        this._value.unshift(codePoint);
    }

    private peekCodePoint(delta: number): number {
        if (delta >= this._value.length) {
            return -1;
        }

        return this._value[delta];
    }

    private consumeUnicodeRangeToken(): UnicodeRangeToken {
        const digits = [];
        let codePoint = this.consumeCodePoint();
        while (isHex(codePoint) && digits.length < 6) {
            digits.push(codePoint);
            codePoint = this.consumeCodePoint();
        }
        let questionMarks = false;
        while (codePoint === QUESTION_MARK && digits.length < 6) {
            digits.push(codePoint);
            codePoint = this.consumeCodePoint();
            questionMarks = true;
        }

        if (questionMarks) {
            const start = parseInt(
                fromCodePoint(...digits.map((digit) => (digit === QUESTION_MARK ? ZERO : digit))),
                16
            );
            const end = parseInt(fromCodePoint(...digits.map((digit) => (digit === QUESTION_MARK ? F : digit))), 16);
            return {type: TokenType.UNICODE_RANGE_TOKEN, start, end};
        }

        const start = parseInt(fromCodePoint(...digits), 16);
        if (this.peekCodePoint(0) === HYPHEN_MINUS && isHex(this.peekCodePoint(1))) {
            this.consumeCodePoint();
            codePoint = this.consumeCodePoint();
            const endDigits = [];
            while (isHex(codePoint) && endDigits.length < 6) {
                endDigits.push(codePoint);
                codePoint = this.consumeCodePoint();
            }
            const end = parseInt(fromCodePoint(...endDigits), 16);

            return {type: TokenType.UNICODE_RANGE_TOKEN, start, end};
        } else {
            return {type: TokenType.UNICODE_RANGE_TOKEN, start, end: start};
        }
    }

    private consumeIdentLikeToken(): StringValueToken | Token {
        const value = this.consumeName();
        if (value.toLowerCase() === 'url' && this.peekCodePoint(0) === LEFT_PARENTHESIS) {
            this.consumeCodePoint();
            return this.consumeUrlToken();
        } else if (this.peekCodePoint(0) === LEFT_PARENTHESIS) {
            this.consumeCodePoint();
            return {type: TokenType.FUNCTION_TOKEN, value};
        }

        return {type: TokenType.IDENT_TOKEN, value};
    }

    private consumeUrlToken(): StringValueToken | Token {
        const value = [];
        this.consumeWhiteSpace();

        if (this.peekCodePoint(0) === EOF) {
            return {type: TokenType.URL_TOKEN, value: ''};
        }

        const next = this.peekCodePoint(0);
        if (next === APOSTROPHE || next === QUOTATION_MARK) {
            const stringToken = this.consumeStringToken(this.consumeCodePoint());
            if (stringToken.type === TokenType.STRING_TOKEN) {
                this.consumeWhiteSpace();

                if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
                    this.consumeCodePoint();
                    return {type: TokenType.URL_TOKEN, value: stringToken.value};
                }
            }

            this.consumeBadUrlRemnants();
            return BAD_URL_TOKEN;
        }

        while (true) {
            const codePoint = this.consumeCodePoint();
            if (codePoint === EOF || codePoint === RIGHT_PARENTHESIS) {
                return {type: TokenType.URL_TOKEN, value: fromCodePoint(...value)};
            } else if (isWhiteSpace(codePoint)) {
                this.consumeWhiteSpace();
                if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
                    this.consumeCodePoint();
                    return {type: TokenType.URL_TOKEN, value: fromCodePoint(...value)};
                }
                this.consumeBadUrlRemnants();
                return BAD_URL_TOKEN;
            } else if (
                codePoint === QUOTATION_MARK ||
                codePoint === APOSTROPHE ||
                codePoint === LEFT_PARENTHESIS ||
                isNonPrintableCodePoint(codePoint)
            ) {
                this.consumeBadUrlRemnants();
                return BAD_URL_TOKEN;
            } else if (codePoint === REVERSE_SOLIDUS) {
                if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                    value.push(this.consumeEscapedCodePoint());
                } else {
                    this.consumeBadUrlRemnants();
                    return BAD_URL_TOKEN;
                }
            } else {
                value.push(codePoint);
            }
        }
    }

    private consumeWhiteSpace(): void {
        while (isWhiteSpace(this.peekCodePoint(0))) {
            this.consumeCodePoint();
        }
    }

    private consumeBadUrlRemnants(): void {
        while (true) {
            const codePoint = this.consumeCodePoint();
            if (codePoint === RIGHT_PARENTHESIS || codePoint === EOF) {
                return;
            }

            if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                this.consumeEscapedCodePoint();
            }
        }
    }

    private consumeStringSlice(count: number): string {
        const SLICE_STACK_SIZE = 60000;
        let value = '';
        while (count > 0) {
            const amount = Math.min(SLICE_STACK_SIZE, count);
            value += fromCodePoint(...this._value.splice(0, amount));
            count -= amount;
        }
        this._value.shift();

        return value;
    }

    private consumeStringToken(endingCodePoint: number): StringValueToken | Token {
        let value = '';
        let i = 0;

        do {
            const codePoint = this._value[i];
            if (codePoint === EOF || codePoint === undefined || codePoint === endingCodePoint) {
                value += this.consumeStringSlice(i);
                return {type: TokenType.STRING_TOKEN, value};
            }

            if (codePoint === LINE_FEED) {
                this._value.splice(0, i);
                return BAD_STRING_TOKEN;
            }

            if (codePoint === REVERSE_SOLIDUS) {
                const next = this._value[i + 1];
                if (next !== EOF && next !== undefined) {
                    if (next === LINE_FEED) {
                        value += this.consumeStringSlice(i);
                        i = -1;
                        this._value.shift();
                    } else if (isValidEscape(codePoint, next)) {
                        value += this.consumeStringSlice(i);
                        value += fromCodePoint(this.consumeEscapedCodePoint());
                        i = -1;
                    }
                }
            }

            i++;
        } while (true);
    }

    private consumeNumber() {
        const repr = [];
        let type = FLAG_INTEGER;
        let c1 = this.peekCodePoint(0);
        if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
            repr.push(this.consumeCodePoint());
        }

        while (isDigit(this.peekCodePoint(0))) {
            repr.push(this.consumeCodePoint());
        }
        c1 = this.peekCodePoint(0);
        let c2 = this.peekCodePoint(1);
        if (c1 === FULL_STOP && isDigit(c2)) {
            repr.push(this.consumeCodePoint(), this.consumeCodePoint());
            type = FLAG_NUMBER;
            while (isDigit(this.peekCodePoint(0))) {
                repr.push(this.consumeCodePoint());
            }
        }

        c1 = this.peekCodePoint(0);
        c2 = this.peekCodePoint(1);
        const c3 = this.peekCodePoint(2);
        if ((c1 === E || c1 === e) && (((c2 === PLUS_SIGN || c2 === HYPHEN_MINUS) && isDigit(c3)) || isDigit(c2))) {
            repr.push(this.consumeCodePoint(), this.consumeCodePoint());
            type = FLAG_NUMBER;
            while (isDigit(this.peekCodePoint(0))) {
                repr.push(this.consumeCodePoint());
            }
        }

        return [stringToNumber(repr), type];
    }

    private consumeNumericToken(): NumberValueToken | DimensionToken {
        const [number, flags] = this.consumeNumber();
        const c1 = this.peekCodePoint(0);
        const c2 = this.peekCodePoint(1);
        const c3 = this.peekCodePoint(2);

        if (isIdentifierStart(c1, c2, c3)) {
            const unit = this.consumeName();
            return {type: TokenType.DIMENSION_TOKEN, number, flags, unit};
        }

        if (c1 === PERCENTAGE_SIGN) {
            this.consumeCodePoint();
            return {type: TokenType.PERCENTAGE_TOKEN, number, flags};
        }

        return {type: TokenType.NUMBER_TOKEN, number, flags};
    }

    private consumeEscapedCodePoint(): number {
        const codePoint = this.consumeCodePoint();

        if (isHex(codePoint)) {
            let hex = fromCodePoint(codePoint);
            while (isHex(this.peekCodePoint(0)) && hex.length < 6) {
                hex += fromCodePoint(this.consumeCodePoint());
            }

            if (isWhiteSpace(this.peekCodePoint(0))) {
                this.consumeCodePoint();
            }

            const hexCodePoint = parseInt(hex, 16);

            if (hexCodePoint === 0 || isSurrogateCodePoint(hexCodePoint) || hexCodePoint > 0x10ffff) {
                return REPLACEMENT_CHARACTER;
            }

            return hexCodePoint;
        }

        if (codePoint === EOF) {
            return REPLACEMENT_CHARACTER;
        }

        return codePoint;
    }

    private consumeName(): string {
        let result = '';
        while (true) {
            const codePoint = this.consumeCodePoint();
            if (isNameCodePoint(codePoint)) {
                result += fromCodePoint(codePoint);
            } else if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                result += fromCodePoint(this.consumeEscapedCodePoint());
            } else {
                this.reconsumeCodePoint(codePoint);
                return result;
            }
        }
    }
}
