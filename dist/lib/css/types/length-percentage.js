"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("../syntax/tokenizer");
var parser_1 = require("../syntax/parser");
var length_1 = require("./length");
exports.isLengthPercentage = function (token) {
    return token.type === tokenizer_1.TokenType.PERCENTAGE_TOKEN || length_1.isLength(token);
};
exports.parseLengthPercentageTuple = function (tokens) {
    return tokens.length > 1 ? [tokens[0], tokens[1]] : [tokens[0]];
};
exports.ZERO_LENGTH = {
    type: tokenizer_1.TokenType.NUMBER_TOKEN,
    number: 0,
    flags: tokenizer_1.FLAG_INTEGER
};
exports.FIFTY_PERCENT = {
    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
    number: 50,
    flags: tokenizer_1.FLAG_INTEGER
};
exports.HUNDRED_PERCENT = {
    type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
    number: 100,
    flags: tokenizer_1.FLAG_INTEGER
};
exports.getAbsoluteValueForTuple = function (tuple, width, height) {
    var x = tuple[0], y = tuple[1];
    return [exports.getAbsoluteValue(x, width), exports.getAbsoluteValue(typeof y !== 'undefined' ? y : x, height)];
};
exports.getAbsoluteValue = function (token, parent) {
    if (token.type === tokenizer_1.TokenType.PERCENTAGE_TOKEN) {
        return (token.number / 100) * parent;
    }
    if (parser_1.isDimensionToken(token)) {
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
//# sourceMappingURL=length-percentage.js.map