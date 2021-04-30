"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var parser_1 = require("../syntax/parser");
exports.opacity = {
    name: 'opacity',
    initialValue: '1',
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: function (token) {
        if (parser_1.isNumberToken(token)) {
            return token.number;
        }
        return 1;
    }
};
//# sourceMappingURL=opacity.js.map