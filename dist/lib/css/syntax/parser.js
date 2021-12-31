"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFunctionArgs = exports.nonFunctionArgSeparator = exports.nonWhiteSpace = exports.isIdentWithValue = exports.isStringToken = exports.isIdentToken = exports.isNumberToken = exports.isDimensionToken = exports.Parser = void 0;
var tokenizer_1 = require("./tokenizer");
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this._tokens = tokens;
    }
    Parser.create = function (value) {
        var tokenizer = new tokenizer_1.Tokenizer();
        tokenizer.write(value);
        return new Parser(tokenizer.read());
    };
    Parser.parseValue = function (value) {
        return Parser.create(value).parseComponentValue();
    };
    Parser.parseValues = function (value) {
        return Parser.create(value).parseComponentValues();
    };
    Parser.prototype.parseComponentValue = function () {
        var token = this.consumeToken();
        while (token.type === 31 /* WHITESPACE_TOKEN */) {
            token = this.consumeToken();
        }
        if (token.type === 32 /* EOF_TOKEN */) {
            throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
        }
        this.reconsumeToken(token);
        var value = this.consumeComponentValue();
        do {
            token = this.consumeToken();
        } while (token.type === 31 /* WHITESPACE_TOKEN */);
        if (token.type === 32 /* EOF_TOKEN */) {
            return value;
        }
        throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
    };
    Parser.prototype.parseComponentValues = function () {
        var values = [];
        while (true) {
            var value = this.consumeComponentValue();
            if (value.type === 32 /* EOF_TOKEN */) {
                return values;
            }
            values.push(value);
            values.push();
        }
    };
    Parser.prototype.consumeComponentValue = function () {
        var token = this.consumeToken();
        switch (token.type) {
            case 11 /* LEFT_CURLY_BRACKET_TOKEN */:
            case 28 /* LEFT_SQUARE_BRACKET_TOKEN */:
            case 2 /* LEFT_PARENTHESIS_TOKEN */:
                return this.consumeSimpleBlock(token.type);
            case 19 /* FUNCTION_TOKEN */:
                return this.consumeFunction(token);
        }
        return token;
    };
    Parser.prototype.consumeSimpleBlock = function (type) {
        var block = { type: type, values: [] };
        var token = this.consumeToken();
        while (true) {
            if (token.type === 32 /* EOF_TOKEN */ || isEndingTokenFor(token, type)) {
                return block;
            }
            this.reconsumeToken(token);
            block.values.push(this.consumeComponentValue());
            token = this.consumeToken();
        }
    };
    Parser.prototype.consumeFunction = function (functionToken) {
        var cssFunction = {
            name: functionToken.value,
            values: [],
            type: 18 /* FUNCTION */
        };
        while (true) {
            var token = this.consumeToken();
            if (token.type === 32 /* EOF_TOKEN */ || token.type === 3 /* RIGHT_PARENTHESIS_TOKEN */) {
                return cssFunction;
            }
            this.reconsumeToken(token);
            cssFunction.values.push(this.consumeComponentValue());
        }
    };
    Parser.prototype.consumeToken = function () {
        var token = this._tokens.shift();
        return typeof token === 'undefined' ? tokenizer_1.EOF_TOKEN : token;
    };
    Parser.prototype.reconsumeToken = function (token) {
        this._tokens.unshift(token);
    };
    return Parser;
}());
exports.Parser = Parser;
var isDimensionToken = function (token) { return token.type === 15 /* DIMENSION_TOKEN */; };
exports.isDimensionToken = isDimensionToken;
var isNumberToken = function (token) { return token.type === 17 /* NUMBER_TOKEN */; };
exports.isNumberToken = isNumberToken;
var isIdentToken = function (token) { return token.type === 20 /* IDENT_TOKEN */; };
exports.isIdentToken = isIdentToken;
var isStringToken = function (token) { return token.type === 0 /* STRING_TOKEN */; };
exports.isStringToken = isStringToken;
var isIdentWithValue = function (token, value) {
    return exports.isIdentToken(token) && token.value === value;
};
exports.isIdentWithValue = isIdentWithValue;
var nonWhiteSpace = function (token) { return token.type !== 31 /* WHITESPACE_TOKEN */; };
exports.nonWhiteSpace = nonWhiteSpace;
var nonFunctionArgSeparator = function (token) {
    return token.type !== 31 /* WHITESPACE_TOKEN */ && token.type !== 4 /* COMMA_TOKEN */;
};
exports.nonFunctionArgSeparator = nonFunctionArgSeparator;
var parseFunctionArgs = function (tokens) {
    var args = [];
    var arg = [];
    tokens.forEach(function (token) {
        if (token.type === 4 /* COMMA_TOKEN */) {
            if (arg.length === 0) {
                throw new Error("Error parsing function args, zero tokens for arg");
            }
            args.push(arg);
            arg = [];
            return;
        }
        if (token.type !== 31 /* WHITESPACE_TOKEN */) {
            arg.push(token);
        }
    });
    if (arg.length) {
        args.push(arg);
    }
    return args;
};
exports.parseFunctionArgs = parseFunctionArgs;
var isEndingTokenFor = function (token, type) {
    if (type === 11 /* LEFT_CURLY_BRACKET_TOKEN */ && token.type === 12 /* RIGHT_CURLY_BRACKET_TOKEN */) {
        return true;
    }
    if (type === 28 /* LEFT_SQUARE_BRACKET_TOKEN */ && token.type === 29 /* RIGHT_SQUARE_BRACKET_TOKEN */) {
        return true;
    }
    return type === 2 /* LEFT_PARENTHESIS_TOKEN */ && token.type === 3 /* RIGHT_PARENTHESIS_TOKEN */;
};
//# sourceMappingURL=parser.js.map