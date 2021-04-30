"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var tokenizer_1 = require("../syntax/tokenizer");
exports.fontFamily = {
    name: "font-family",
    initialValue: '',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.LIST,
    parse: function (tokens) {
        var accumulator = [];
        var results = [];
        tokens.forEach(function (token) {
            switch (token.type) {
                case tokenizer_1.TokenType.IDENT_TOKEN:
                case tokenizer_1.TokenType.STRING_TOKEN:
                    accumulator.push(token.value);
                    break;
                case tokenizer_1.TokenType.NUMBER_TOKEN:
                    accumulator.push(token.number.toString());
                    break;
                case tokenizer_1.TokenType.COMMA_TOKEN:
                    results.push(accumulator.join(' '));
                    accumulator.length = 0;
                    break;
            }
        });
        if (accumulator.length) {
            results.push(accumulator.join(' '));
        }
        return results.map(function (result) { return (result.indexOf(' ') === -1 ? result : "'" + result + "'"); });
    }
};
//# sourceMappingURL=font-family.js.map