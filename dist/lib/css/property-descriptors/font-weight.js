"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontWeight = void 0;
var parser_1 = require("../syntax/parser");
exports.fontWeight = {
    name: 'font-weight',
    initialValue: 'normal',
    type: 0 /* VALUE */,
    prefix: false,
    parse: function (_context, token) {
        if (parser_1.isNumberToken(token)) {
            return token.number;
        }
        if (parser_1.isIdentToken(token)) {
            switch (token.value) {
                case 'bold':
                    return 700;
                case 'normal':
                default:
                    return 400;
            }
        }
        return 400;
    }
};
//# sourceMappingURL=font-weight.js.map