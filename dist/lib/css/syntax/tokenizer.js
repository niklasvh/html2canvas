"use strict";
// https://www.w3.org/TR/css-syntax-3
Object.defineProperty(exports, "__esModule", { value: true });
var css_line_break_1 = require("css-line-break");
var TokenType;
(function (TokenType) {
    TokenType[TokenType["STRING_TOKEN"] = 0] = "STRING_TOKEN";
    TokenType[TokenType["BAD_STRING_TOKEN"] = 1] = "BAD_STRING_TOKEN";
    TokenType[TokenType["LEFT_PARENTHESIS_TOKEN"] = 2] = "LEFT_PARENTHESIS_TOKEN";
    TokenType[TokenType["RIGHT_PARENTHESIS_TOKEN"] = 3] = "RIGHT_PARENTHESIS_TOKEN";
    TokenType[TokenType["COMMA_TOKEN"] = 4] = "COMMA_TOKEN";
    TokenType[TokenType["HASH_TOKEN"] = 5] = "HASH_TOKEN";
    TokenType[TokenType["DELIM_TOKEN"] = 6] = "DELIM_TOKEN";
    TokenType[TokenType["AT_KEYWORD_TOKEN"] = 7] = "AT_KEYWORD_TOKEN";
    TokenType[TokenType["PREFIX_MATCH_TOKEN"] = 8] = "PREFIX_MATCH_TOKEN";
    TokenType[TokenType["DASH_MATCH_TOKEN"] = 9] = "DASH_MATCH_TOKEN";
    TokenType[TokenType["INCLUDE_MATCH_TOKEN"] = 10] = "INCLUDE_MATCH_TOKEN";
    TokenType[TokenType["LEFT_CURLY_BRACKET_TOKEN"] = 11] = "LEFT_CURLY_BRACKET_TOKEN";
    TokenType[TokenType["RIGHT_CURLY_BRACKET_TOKEN"] = 12] = "RIGHT_CURLY_BRACKET_TOKEN";
    TokenType[TokenType["SUFFIX_MATCH_TOKEN"] = 13] = "SUFFIX_MATCH_TOKEN";
    TokenType[TokenType["SUBSTRING_MATCH_TOKEN"] = 14] = "SUBSTRING_MATCH_TOKEN";
    TokenType[TokenType["DIMENSION_TOKEN"] = 15] = "DIMENSION_TOKEN";
    TokenType[TokenType["PERCENTAGE_TOKEN"] = 16] = "PERCENTAGE_TOKEN";
    TokenType[TokenType["NUMBER_TOKEN"] = 17] = "NUMBER_TOKEN";
    TokenType[TokenType["FUNCTION"] = 18] = "FUNCTION";
    TokenType[TokenType["FUNCTION_TOKEN"] = 19] = "FUNCTION_TOKEN";
    TokenType[TokenType["IDENT_TOKEN"] = 20] = "IDENT_TOKEN";
    TokenType[TokenType["COLUMN_TOKEN"] = 21] = "COLUMN_TOKEN";
    TokenType[TokenType["URL_TOKEN"] = 22] = "URL_TOKEN";
    TokenType[TokenType["BAD_URL_TOKEN"] = 23] = "BAD_URL_TOKEN";
    TokenType[TokenType["CDC_TOKEN"] = 24] = "CDC_TOKEN";
    TokenType[TokenType["CDO_TOKEN"] = 25] = "CDO_TOKEN";
    TokenType[TokenType["COLON_TOKEN"] = 26] = "COLON_TOKEN";
    TokenType[TokenType["SEMICOLON_TOKEN"] = 27] = "SEMICOLON_TOKEN";
    TokenType[TokenType["LEFT_SQUARE_BRACKET_TOKEN"] = 28] = "LEFT_SQUARE_BRACKET_TOKEN";
    TokenType[TokenType["RIGHT_SQUARE_BRACKET_TOKEN"] = 29] = "RIGHT_SQUARE_BRACKET_TOKEN";
    TokenType[TokenType["UNICODE_RANGE_TOKEN"] = 30] = "UNICODE_RANGE_TOKEN";
    TokenType[TokenType["WHITESPACE_TOKEN"] = 31] = "WHITESPACE_TOKEN";
    TokenType[TokenType["EOF_TOKEN"] = 32] = "EOF_TOKEN";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
exports.FLAG_UNRESTRICTED = 1 << 0;
exports.FLAG_ID = 1 << 1;
exports.FLAG_INTEGER = 1 << 2;
exports.FLAG_NUMBER = 1 << 3;
var LINE_FEED = 0x000a;
var SOLIDUS = 0x002f;
var REVERSE_SOLIDUS = 0x005c;
var CHARACTER_TABULATION = 0x0009;
var SPACE = 0x0020;
var QUOTATION_MARK = 0x0022;
var EQUALS_SIGN = 0x003d;
var NUMBER_SIGN = 0x0023;
var DOLLAR_SIGN = 0x0024;
var PERCENTAGE_SIGN = 0x0025;
var APOSTROPHE = 0x0027;
var LEFT_PARENTHESIS = 0x0028;
var RIGHT_PARENTHESIS = 0x0029;
var LOW_LINE = 0x005f;
var HYPHEN_MINUS = 0x002d;
var EXCLAMATION_MARK = 0x0021;
var LESS_THAN_SIGN = 0x003c;
var GREATER_THAN_SIGN = 0x003e;
var COMMERCIAL_AT = 0x0040;
var LEFT_SQUARE_BRACKET = 0x005b;
var RIGHT_SQUARE_BRACKET = 0x005d;
var CIRCUMFLEX_ACCENT = 0x003d;
var LEFT_CURLY_BRACKET = 0x007b;
var QUESTION_MARK = 0x003f;
var RIGHT_CURLY_BRACKET = 0x007d;
var VERTICAL_LINE = 0x007c;
var TILDE = 0x007e;
var CONTROL = 0x0080;
var REPLACEMENT_CHARACTER = 0xfffd;
var ASTERISK = 0x002a;
var PLUS_SIGN = 0x002b;
var COMMA = 0x002c;
var COLON = 0x003a;
var SEMICOLON = 0x003b;
var FULL_STOP = 0x002e;
var NULL = 0x0000;
var BACKSPACE = 0x0008;
var LINE_TABULATION = 0x000b;
var SHIFT_OUT = 0x000e;
var INFORMATION_SEPARATOR_ONE = 0x001f;
var DELETE = 0x007f;
var EOF = -1;
var ZERO = 0x0030;
var a = 0x0061;
var e = 0x0065;
var f = 0x0066;
var u = 0x0075;
var z = 0x007a;
var A = 0x0041;
var E = 0x0045;
var F = 0x0046;
var U = 0x0055;
var Z = 0x005a;
var isDigit = function (codePoint) { return codePoint >= ZERO && codePoint <= 0x0039; };
var isSurrogateCodePoint = function (codePoint) { return codePoint >= 0xd800 && codePoint <= 0xdfff; };
var isHex = function (codePoint) {
    return isDigit(codePoint) || (codePoint >= A && codePoint <= F) || (codePoint >= a && codePoint <= f);
};
var isLowerCaseLetter = function (codePoint) { return codePoint >= a && codePoint <= z; };
var isUpperCaseLetter = function (codePoint) { return codePoint >= A && codePoint <= Z; };
var isLetter = function (codePoint) { return isLowerCaseLetter(codePoint) || isUpperCaseLetter(codePoint); };
var isNonASCIICodePoint = function (codePoint) { return codePoint >= CONTROL; };
var isWhiteSpace = function (codePoint) {
    return codePoint === LINE_FEED || codePoint === CHARACTER_TABULATION || codePoint === SPACE;
};
var isNameStartCodePoint = function (codePoint) {
    return isLetter(codePoint) || isNonASCIICodePoint(codePoint) || codePoint === LOW_LINE;
};
var isNameCodePoint = function (codePoint) {
    return isNameStartCodePoint(codePoint) || isDigit(codePoint) || codePoint === HYPHEN_MINUS;
};
var isNonPrintableCodePoint = function (codePoint) {
    return ((codePoint >= NULL && codePoint <= BACKSPACE) ||
        codePoint === LINE_TABULATION ||
        (codePoint >= SHIFT_OUT && codePoint <= INFORMATION_SEPARATOR_ONE) ||
        codePoint === DELETE);
};
var isValidEscape = function (c1, c2) {
    if (c1 !== REVERSE_SOLIDUS) {
        return false;
    }
    return c2 !== LINE_FEED;
};
var isIdentifierStart = function (c1, c2, c3) {
    if (c1 === HYPHEN_MINUS) {
        return isNameStartCodePoint(c2) || isValidEscape(c2, c3);
    }
    else if (isNameStartCodePoint(c1)) {
        return true;
    }
    else if (c1 === REVERSE_SOLIDUS && isValidEscape(c1, c2)) {
        return true;
    }
    return false;
};
var isNumberStart = function (c1, c2, c3) {
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
var stringToNumber = function (codePoints) {
    var c = 0;
    var sign = 1;
    if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {
        if (codePoints[c] === HYPHEN_MINUS) {
            sign = -1;
        }
        c++;
    }
    var integers = [];
    while (isDigit(codePoints[c])) {
        integers.push(codePoints[c++]);
    }
    var int = integers.length ? parseInt(css_line_break_1.fromCodePoint.apply(void 0, integers), 10) : 0;
    if (codePoints[c] === FULL_STOP) {
        c++;
    }
    var fraction = [];
    while (isDigit(codePoints[c])) {
        fraction.push(codePoints[c++]);
    }
    var fracd = fraction.length;
    var frac = fracd ? parseInt(css_line_break_1.fromCodePoint.apply(void 0, fraction), 10) : 0;
    if (codePoints[c] === E || codePoints[c] === e) {
        c++;
    }
    var expsign = 1;
    if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {
        if (codePoints[c] === HYPHEN_MINUS) {
            expsign = -1;
        }
        c++;
    }
    var exponent = [];
    while (isDigit(codePoints[c])) {
        exponent.push(codePoints[c++]);
    }
    var exp = exponent.length ? parseInt(css_line_break_1.fromCodePoint.apply(void 0, exponent), 10) : 0;
    return sign * (int + frac * Math.pow(10, -fracd)) * Math.pow(10, expsign * exp);
};
var LEFT_PARENTHESIS_TOKEN = {
    type: TokenType.LEFT_PARENTHESIS_TOKEN
};
var RIGHT_PARENTHESIS_TOKEN = {
    type: TokenType.RIGHT_PARENTHESIS_TOKEN
};
var COMMA_TOKEN = { type: TokenType.COMMA_TOKEN };
var SUFFIX_MATCH_TOKEN = { type: TokenType.SUFFIX_MATCH_TOKEN };
var PREFIX_MATCH_TOKEN = { type: TokenType.PREFIX_MATCH_TOKEN };
var COLUMN_TOKEN = { type: TokenType.COLUMN_TOKEN };
var DASH_MATCH_TOKEN = { type: TokenType.DASH_MATCH_TOKEN };
var INCLUDE_MATCH_TOKEN = { type: TokenType.INCLUDE_MATCH_TOKEN };
var LEFT_CURLY_BRACKET_TOKEN = {
    type: TokenType.LEFT_CURLY_BRACKET_TOKEN
};
var RIGHT_CURLY_BRACKET_TOKEN = {
    type: TokenType.RIGHT_CURLY_BRACKET_TOKEN
};
var SUBSTRING_MATCH_TOKEN = { type: TokenType.SUBSTRING_MATCH_TOKEN };
var BAD_URL_TOKEN = { type: TokenType.BAD_URL_TOKEN };
var BAD_STRING_TOKEN = { type: TokenType.BAD_STRING_TOKEN };
var CDO_TOKEN = { type: TokenType.CDO_TOKEN };
var CDC_TOKEN = { type: TokenType.CDC_TOKEN };
var COLON_TOKEN = { type: TokenType.COLON_TOKEN };
var SEMICOLON_TOKEN = { type: TokenType.SEMICOLON_TOKEN };
var LEFT_SQUARE_BRACKET_TOKEN = {
    type: TokenType.LEFT_SQUARE_BRACKET_TOKEN
};
var RIGHT_SQUARE_BRACKET_TOKEN = {
    type: TokenType.RIGHT_SQUARE_BRACKET_TOKEN
};
var WHITESPACE_TOKEN = { type: TokenType.WHITESPACE_TOKEN };
exports.EOF_TOKEN = { type: TokenType.EOF_TOKEN };
var Tokenizer = /** @class */ (function () {
    function Tokenizer() {
        this._value = [];
    }
    Tokenizer.prototype.write = function (chunk) {
        this._value = this._value.concat(css_line_break_1.toCodePoints(chunk));
    };
    Tokenizer.prototype.read = function () {
        var tokens = [];
        var token = this.consumeToken();
        while (token !== exports.EOF_TOKEN) {
            tokens.push(token);
            token = this.consumeToken();
        }
        return tokens;
    };
    Tokenizer.prototype.consumeToken = function () {
        var codePoint = this.consumeCodePoint();
        switch (codePoint) {
            case QUOTATION_MARK:
                return this.consumeStringToken(QUOTATION_MARK);
            case NUMBER_SIGN:
                var c1 = this.peekCodePoint(0);
                var c2 = this.peekCodePoint(1);
                var c3 = this.peekCodePoint(2);
                if (isNameCodePoint(c1) || isValidEscape(c2, c3)) {
                    var flags = isIdentifierStart(c1, c2, c3) ? exports.FLAG_ID : exports.FLAG_UNRESTRICTED;
                    var value = this.consumeName();
                    return { type: TokenType.HASH_TOKEN, value: value, flags: flags };
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
                var e1 = codePoint;
                var e2 = this.peekCodePoint(0);
                var e3 = this.peekCodePoint(1);
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
                        var c = this.consumeCodePoint();
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
                if (this.peekCodePoint(0) === EXCLAMATION_MARK &&
                    this.peekCodePoint(1) === HYPHEN_MINUS &&
                    this.peekCodePoint(2) === HYPHEN_MINUS) {
                    this.consumeCodePoint();
                    this.consumeCodePoint();
                    return CDO_TOKEN;
                }
                break;
            case COMMERCIAL_AT:
                var a1 = this.peekCodePoint(0);
                var a2 = this.peekCodePoint(1);
                var a3 = this.peekCodePoint(2);
                if (isIdentifierStart(a1, a2, a3)) {
                    var value = this.consumeName();
                    return { type: TokenType.AT_KEYWORD_TOKEN, value: value };
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
                var u1 = this.peekCodePoint(0);
                var u2 = this.peekCodePoint(1);
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
                return exports.EOF_TOKEN;
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
        return { type: TokenType.DELIM_TOKEN, value: css_line_break_1.fromCodePoint(codePoint) };
    };
    Tokenizer.prototype.consumeCodePoint = function () {
        var value = this._value.shift();
        return typeof value === 'undefined' ? -1 : value;
    };
    Tokenizer.prototype.reconsumeCodePoint = function (codePoint) {
        this._value.unshift(codePoint);
    };
    Tokenizer.prototype.peekCodePoint = function (delta) {
        if (delta >= this._value.length) {
            return -1;
        }
        return this._value[delta];
    };
    Tokenizer.prototype.consumeUnicodeRangeToken = function () {
        var digits = [];
        var codePoint = this.consumeCodePoint();
        while (isHex(codePoint) && digits.length < 6) {
            digits.push(codePoint);
            codePoint = this.consumeCodePoint();
        }
        var questionMarks = false;
        while (codePoint === QUESTION_MARK && digits.length < 6) {
            digits.push(codePoint);
            codePoint = this.consumeCodePoint();
            questionMarks = true;
        }
        if (questionMarks) {
            var start_1 = parseInt(css_line_break_1.fromCodePoint.apply(void 0, digits.map(function (digit) { return (digit === QUESTION_MARK ? ZERO : digit); })), 16);
            var end = parseInt(css_line_break_1.fromCodePoint.apply(void 0, digits.map(function (digit) { return (digit === QUESTION_MARK ? F : digit); })), 16);
            return { type: TokenType.UNICODE_RANGE_TOKEN, start: start_1, end: end };
        }
        var start = parseInt(css_line_break_1.fromCodePoint.apply(void 0, digits), 16);
        if (this.peekCodePoint(0) === HYPHEN_MINUS && isHex(this.peekCodePoint(1))) {
            this.consumeCodePoint();
            codePoint = this.consumeCodePoint();
            var endDigits = [];
            while (isHex(codePoint) && endDigits.length < 6) {
                endDigits.push(codePoint);
                codePoint = this.consumeCodePoint();
            }
            var end = parseInt(css_line_break_1.fromCodePoint.apply(void 0, endDigits), 16);
            return { type: TokenType.UNICODE_RANGE_TOKEN, start: start, end: end };
        }
        else {
            return { type: TokenType.UNICODE_RANGE_TOKEN, start: start, end: start };
        }
    };
    Tokenizer.prototype.consumeIdentLikeToken = function () {
        var value = this.consumeName();
        if (value.toLowerCase() === 'url' && this.peekCodePoint(0) === LEFT_PARENTHESIS) {
            this.consumeCodePoint();
            return this.consumeUrlToken();
        }
        else if (this.peekCodePoint(0) === LEFT_PARENTHESIS) {
            this.consumeCodePoint();
            return { type: TokenType.FUNCTION_TOKEN, value: value };
        }
        return { type: TokenType.IDENT_TOKEN, value: value };
    };
    Tokenizer.prototype.consumeUrlToken = function () {
        var value = [];
        this.consumeWhiteSpace();
        if (this.peekCodePoint(0) === EOF) {
            return { type: TokenType.URL_TOKEN, value: '' };
        }
        var next = this.peekCodePoint(0);
        if (next === APOSTROPHE || next === QUOTATION_MARK) {
            var stringToken = this.consumeStringToken(this.consumeCodePoint());
            if (stringToken.type === TokenType.STRING_TOKEN) {
                this.consumeWhiteSpace();
                if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
                    this.consumeCodePoint();
                    return { type: TokenType.URL_TOKEN, value: stringToken.value };
                }
            }
            this.consumeBadUrlRemnants();
            return BAD_URL_TOKEN;
        }
        while (true) {
            var codePoint = this.consumeCodePoint();
            if (codePoint === EOF || codePoint === RIGHT_PARENTHESIS) {
                return { type: TokenType.URL_TOKEN, value: css_line_break_1.fromCodePoint.apply(void 0, value) };
            }
            else if (isWhiteSpace(codePoint)) {
                this.consumeWhiteSpace();
                if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
                    this.consumeCodePoint();
                    return { type: TokenType.URL_TOKEN, value: css_line_break_1.fromCodePoint.apply(void 0, value) };
                }
                this.consumeBadUrlRemnants();
                return BAD_URL_TOKEN;
            }
            else if (codePoint === QUOTATION_MARK ||
                codePoint === APOSTROPHE ||
                codePoint === LEFT_PARENTHESIS ||
                isNonPrintableCodePoint(codePoint)) {
                this.consumeBadUrlRemnants();
                return BAD_URL_TOKEN;
            }
            else if (codePoint === REVERSE_SOLIDUS) {
                if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                    value.push(this.consumeEscapedCodePoint());
                }
                else {
                    this.consumeBadUrlRemnants();
                    return BAD_URL_TOKEN;
                }
            }
            else {
                value.push(codePoint);
            }
        }
    };
    Tokenizer.prototype.consumeWhiteSpace = function () {
        while (isWhiteSpace(this.peekCodePoint(0))) {
            this.consumeCodePoint();
        }
    };
    Tokenizer.prototype.consumeBadUrlRemnants = function () {
        while (true) {
            var codePoint = this.consumeCodePoint();
            if (codePoint === RIGHT_PARENTHESIS || codePoint === EOF) {
                return;
            }
            if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                this.consumeEscapedCodePoint();
            }
        }
    };
    Tokenizer.prototype.consumeStringSlice = function (count) {
        var SLICE_STACK_SIZE = 60000;
        var value = '';
        while (count > 0) {
            var amount = Math.min(SLICE_STACK_SIZE, count);
            value += css_line_break_1.fromCodePoint.apply(void 0, this._value.splice(0, amount));
            count -= amount;
        }
        this._value.shift();
        return value;
    };
    Tokenizer.prototype.consumeStringToken = function (endingCodePoint) {
        var value = '';
        var i = 0;
        do {
            var codePoint = this._value[i];
            if (codePoint === EOF || codePoint === undefined || codePoint === endingCodePoint) {
                value += this.consumeStringSlice(i);
                return { type: TokenType.STRING_TOKEN, value: value };
            }
            if (codePoint === LINE_FEED) {
                this._value.splice(0, i);
                return BAD_STRING_TOKEN;
            }
            if (codePoint === REVERSE_SOLIDUS) {
                var next = this._value[i + 1];
                if (next !== EOF && next !== undefined) {
                    if (next === LINE_FEED) {
                        value += this.consumeStringSlice(i);
                        i = -1;
                        this._value.shift();
                    }
                    else if (isValidEscape(codePoint, next)) {
                        value += this.consumeStringSlice(i);
                        value += css_line_break_1.fromCodePoint(this.consumeEscapedCodePoint());
                        i = -1;
                    }
                }
            }
            i++;
        } while (true);
    };
    Tokenizer.prototype.consumeNumber = function () {
        var repr = [];
        var type = exports.FLAG_INTEGER;
        var c1 = this.peekCodePoint(0);
        if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
            repr.push(this.consumeCodePoint());
        }
        while (isDigit(this.peekCodePoint(0))) {
            repr.push(this.consumeCodePoint());
        }
        c1 = this.peekCodePoint(0);
        var c2 = this.peekCodePoint(1);
        if (c1 === FULL_STOP && isDigit(c2)) {
            repr.push(this.consumeCodePoint(), this.consumeCodePoint());
            type = exports.FLAG_NUMBER;
            while (isDigit(this.peekCodePoint(0))) {
                repr.push(this.consumeCodePoint());
            }
        }
        c1 = this.peekCodePoint(0);
        c2 = this.peekCodePoint(1);
        var c3 = this.peekCodePoint(2);
        if ((c1 === E || c1 === e) && (((c2 === PLUS_SIGN || c2 === HYPHEN_MINUS) && isDigit(c3)) || isDigit(c2))) {
            repr.push(this.consumeCodePoint(), this.consumeCodePoint());
            type = exports.FLAG_NUMBER;
            while (isDigit(this.peekCodePoint(0))) {
                repr.push(this.consumeCodePoint());
            }
        }
        return [stringToNumber(repr), type];
    };
    Tokenizer.prototype.consumeNumericToken = function () {
        var _a = this.consumeNumber(), number = _a[0], flags = _a[1];
        var c1 = this.peekCodePoint(0);
        var c2 = this.peekCodePoint(1);
        var c3 = this.peekCodePoint(2);
        if (isIdentifierStart(c1, c2, c3)) {
            var unit = this.consumeName();
            return { type: TokenType.DIMENSION_TOKEN, number: number, flags: flags, unit: unit };
        }
        if (c1 === PERCENTAGE_SIGN) {
            this.consumeCodePoint();
            return { type: TokenType.PERCENTAGE_TOKEN, number: number, flags: flags };
        }
        return { type: TokenType.NUMBER_TOKEN, number: number, flags: flags };
    };
    Tokenizer.prototype.consumeEscapedCodePoint = function () {
        var codePoint = this.consumeCodePoint();
        if (isHex(codePoint)) {
            var hex = css_line_break_1.fromCodePoint(codePoint);
            while (isHex(this.peekCodePoint(0)) && hex.length < 6) {
                hex += css_line_break_1.fromCodePoint(this.consumeCodePoint());
            }
            if (isWhiteSpace(this.peekCodePoint(0))) {
                this.consumeCodePoint();
            }
            var hexCodePoint = parseInt(hex, 16);
            if (hexCodePoint === 0 || isSurrogateCodePoint(hexCodePoint) || hexCodePoint > 0x10ffff) {
                return REPLACEMENT_CHARACTER;
            }
            return hexCodePoint;
        }
        if (codePoint === EOF) {
            return REPLACEMENT_CHARACTER;
        }
        return codePoint;
    };
    Tokenizer.prototype.consumeName = function () {
        var result = '';
        while (true) {
            var codePoint = this.consumeCodePoint();
            if (isNameCodePoint(codePoint)) {
                result += css_line_break_1.fromCodePoint(codePoint);
            }
            else if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                result += css_line_break_1.fromCodePoint(this.consumeEscapedCodePoint());
            }
            else {
                this.reconsumeCodePoint(codePoint);
                return result;
            }
        }
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map