"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontVariant = void 0;
var parser_1 = require("../syntax/parser");
exports.fontVariant = {
    name: 'font-variant',
    initialValue: 'none',
    type: 1 /* LIST */,
    prefix: false,
    parse: function (_context, tokens) {
        return tokens.filter(parser_1.isIdentToken).map(function (token) { return token.value; });
    }
};
//# sourceMappingURL=font-variant.js.map