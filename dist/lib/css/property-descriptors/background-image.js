"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundImage = void 0;
var image_1 = require("../types/image");
var parser_1 = require("../syntax/parser");
exports.backgroundImage = {
    name: 'background-image',
    initialValue: 'none',
    type: 1 /* LIST */,
    prefix: false,
    parse: function (context, tokens) {
        if (tokens.length === 0) {
            return [];
        }
        var first = tokens[0];
        if (first.type === 20 /* IDENT_TOKEN */ && first.value === 'none') {
            return [];
        }
        return tokens
            .filter(function (value) { return parser_1.nonFunctionArgSeparator(value) && image_1.isSupportedImage(value); })
            .map(function (value) { return image_1.image.parse(context, value); });
    }
};
//# sourceMappingURL=background-image.js.map