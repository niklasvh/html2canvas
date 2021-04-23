"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("../syntax/tokenizer");
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
exports.content = {
    name: 'content',
    initialValue: 'none',
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: function (tokens) {
        if (tokens.length === 0) {
            return [];
        }
        var first = tokens[0];
        if (first.type === tokenizer_1.TokenType.IDENT_TOKEN && first.value === 'none') {
            return [];
        }
        return tokens;
    }
};
//# sourceMappingURL=content.js.map