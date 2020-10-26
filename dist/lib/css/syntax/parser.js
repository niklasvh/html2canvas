"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        while (token.type === tokenizer_1.TokenType.WHITESPACE_TOKEN) {
            token = this.consumeToken();
        }
        if (token.type === tokenizer_1.TokenType.EOF_TOKEN) {
            throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
        }
        this.reconsumeToken(token);
        var value = this.consumeComponentValue();
        do {
            token = this.consumeToken();
        } while (token.type === tokenizer_1.TokenType.WHITESPACE_TOKEN);
        if (token.type === tokenizer_1.TokenType.EOF_TOKEN) {
            return value;
        }
        throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
    };
    Parser.prototype.parseComponentValues = function () {
        var values = [];
        while (true) {
            var value = this.consumeComponentValue();
            if (value.type === tokenizer_1.TokenType.EOF_TOKEN) {
                return values;
            }
            values.push(value);
            values.push();
        }
    };
    Parser.prototype.consumeComponentValue = function () {
        var token = this.consumeToken();
        switch (token.type) {
            case tokenizer_1.TokenType.LEFT_CURLY_BRACKET_TOKEN:
            case tokenizer_1.TokenType.LEFT_SQUARE_BRACKET_TOKEN:
            case tokenizer_1.TokenType.LEFT_PARENTHESIS_TOKEN:
                return this.consumeSimpleBlock(token.type);
            case tokenizer_1.TokenType.FUNCTION_TOKEN:
                return this.consumeFunction(token);
        }
        return token;
    };
    Parser.prototype.consumeSimpleBlock = function (type) {
        var block = { type: type, values: [] };
        var token = this.consumeToken();
        while (true) {
            if (token.type === tokenizer_1.TokenType.EOF_TOKEN || isEndingTokenFor(token, type)) {
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
            type: tokenizer_1.TokenType.FUNCTION
        };
        while (true) {
            var token = this.consumeToken();
            if (token.type === tokenizer_1.TokenType.EOF_TOKEN || token.type === tokenizer_1.TokenType.RIGHT_PARENTHESIS_TOKEN) {
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
exports.isDimensionToken = function (token) { return token.type === tokenizer_1.TokenType.DIMENSION_TOKEN; };
exports.isNumberToken = function (token) { return token.type === tokenizer_1.TokenType.NUMBER_TOKEN; };
exports.isIdentToken = function (token) { return token.type === tokenizer_1.TokenType.IDENT_TOKEN; };
exports.isStringToken = function (token) { return token.type === tokenizer_1.TokenType.STRING_TOKEN; };
exports.isIdentWithValue = function (token, value) {
    return exports.isIdentToken(token) && token.value === value;
};
exports.nonWhiteSpace = function (token) { return token.type !== tokenizer_1.TokenType.WHITESPACE_TOKEN; };
exports.nonFunctionArgSeparator = function (token) {
    return token.type !== tokenizer_1.TokenType.WHITESPACE_TOKEN && token.type !== tokenizer_1.TokenType.COMMA_TOKEN;
};
exports.parseFunctionArgs = function (tokens) {
    var args = [];
    var arg = [];
    tokens.forEach(function (token) {
        if (token.type === tokenizer_1.TokenType.COMMA_TOKEN) {
            if (arg.length === 0) {
                throw new Error("Error parsing function args, zero tokens for arg");
            }
            args.push(arg);
            arg = [];
            return;
        }
        if (token.type !== tokenizer_1.TokenType.WHITESPACE_TOKEN) {
            arg.push(token);
        }
    });
    if (arg.length) {
        args.push(arg);
    }
    return args;
};
var isEndingTokenFor = function (token, type) {
    if (type === tokenizer_1.TokenType.LEFT_CURLY_BRACKET_TOKEN && token.type === tokenizer_1.TokenType.RIGHT_CURLY_BRACKET_TOKEN) {
        return true;
    }
    if (type === tokenizer_1.TokenType.LEFT_SQUARE_BRACKET_TOKEN && token.type === tokenizer_1.TokenType.RIGHT_SQUARE_BRACKET_TOKEN) {
        return true;
    }
    return type === tokenizer_1.TokenType.LEFT_PARENTHESIS_TOKEN && token.type === tokenizer_1.TokenType.RIGHT_PARENTHESIS_TOKEN;
};
//# sourceMappingURL=parser.js.map