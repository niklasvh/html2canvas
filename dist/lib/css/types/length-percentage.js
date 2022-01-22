"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsoluteValue = exports.getAbsoluteValueForTuple = exports.HUNDRED_PERCENT = exports.FIFTY_PERCENT = exports.ZERO_LENGTH = exports.parseLengthPercentageTuple = exports.isLengthPercentage = void 0;
var tokenizer_1 = require("../syntax/tokenizer");
var parser_1 = require("../syntax/parser");
var length_1 = require("./length");
var isLengthPercentage = function (token) {
    return token.type === 16 /* PERCENTAGE_TOKEN */ || length_1.isLength(token);
};
exports.isLengthPercentage = isLengthPercentage;
var parseLengthPercentageTuple = function (tokens) {
    return tokens.length > 1 ? [tokens[0], tokens[1]] : [tokens[0]];
};
exports.parseLengthPercentageTuple = parseLengthPercentageTuple;
exports.ZERO_LENGTH = {
    type: 17 /* NUMBER_TOKEN */,
    number: 0,
    flags: tokenizer_1.FLAG_INTEGER
};
exports.FIFTY_PERCENT = {
    type: 16 /* PERCENTAGE_TOKEN */,
    number: 50,
    flags: tokenizer_1.FLAG_INTEGER
};
exports.HUNDRED_PERCENT = {
    type: 16 /* PERCENTAGE_TOKEN */,
    number: 100,
    flags: tokenizer_1.FLAG_INTEGER
};
var getAbsoluteValueForTuple = function (tuple, width, height) {
    var x = tuple[0], y = tuple[1];
    return [exports.getAbsoluteValue(x, width), exports.getAbsoluteValue(typeof y !== 'undefined' ? y : x, height)];
};
exports.getAbsoluteValueForTuple = getAbsoluteValueForTuple;
var getAbsoluteValue = function (token, parent) {
    if (token.type === 16 /* PERCENTAGE_TOKEN */) {
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
exports.getAbsoluteValue = getAbsoluteValue;
//# sourceMappingURL=length-percentage.js.map