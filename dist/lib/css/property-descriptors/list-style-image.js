"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("../syntax/tokenizer");
var image_1 = require("../types/image");
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
exports.listStyleImage = {
    name: 'list-style-image',
    initialValue: 'none',
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: function (token) {
        if (token.type === tokenizer_1.TokenType.IDENT_TOKEN && token.value === 'none') {
            return null;
        }
        return image_1.image.parse(token);
    }
};
//# sourceMappingURL=list-style-image.js.map