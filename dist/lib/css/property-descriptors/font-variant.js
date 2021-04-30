"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var parser_1 = require("../syntax/parser");
exports.fontVariant = {
    name: 'font-variant',
    initialValue: 'none',
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: function (tokens) {
        return tokens.filter(parser_1.isIdentToken).map(function (token) { return token.value; });
    }
};
//# sourceMappingURL=font-variant.js.map