"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var parser_1 = require("../syntax/parser");
var tokenizer_1 = require("../syntax/tokenizer");
var length_percentage_1 = require("../types/length-percentage");
exports.lineHeight = {
    name: 'line-height',
    initialValue: 'normal',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.TOKEN_VALUE
};
exports.computeLineHeight = function (token, fontSize) {
    if (parser_1.isIdentToken(token) && token.value === 'normal') {
        return 1.2 * fontSize;
    }
    else if (token.type === tokenizer_1.TokenType.NUMBER_TOKEN) {
        return fontSize * token.number;
    }
    else if (length_percentage_1.isLengthPercentage(token)) {
        return length_percentage_1.getAbsoluteValue(token, fontSize);
    }
    return fontSize;
};
//# sourceMappingURL=line-height.js.map