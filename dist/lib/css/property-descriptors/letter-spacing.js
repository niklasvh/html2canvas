"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var tokenizer_1 = require("../syntax/tokenizer");
exports.letterSpacing = {
    name: 'letter-spacing',
    initialValue: '0',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.VALUE,
    parse: function (token) {
        if (token.type === tokenizer_1.TokenType.IDENT_TOKEN && token.value === 'normal') {
            return 0;
        }
        if (token.type === tokenizer_1.TokenType.NUMBER_TOKEN) {
            return token.number;
        }
        if (token.type === tokenizer_1.TokenType.DIMENSION_TOKEN) {
            return token.number;
        }
        return 0;
    }
};
//# sourceMappingURL=letter-spacing.js.map