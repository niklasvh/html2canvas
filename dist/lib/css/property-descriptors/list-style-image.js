"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStyleImage = void 0;
var image_1 = require("../types/image");
exports.listStyleImage = {
    name: 'list-style-image',
    initialValue: 'none',
    type: 0 /* VALUE */,
    prefix: false,
    parse: function (context, token) {
        if (token.type === 20 /* IDENT_TOKEN */ && token.value === 'none') {
            return null;
        }
        return image_1.image.parse(context, token);
    }
};
//# sourceMappingURL=list-style-image.js.map