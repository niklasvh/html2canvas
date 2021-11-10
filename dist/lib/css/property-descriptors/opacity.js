"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opacity = void 0;
var parser_1 = require("../syntax/parser");
exports.opacity = {
    name: 'opacity',
    initialValue: '1',
    type: 0 /* VALUE */,
    prefix: false,
    parse: function (_context, token) {
        if (parser_1.isNumberToken(token)) {
            return token.number;
        }
        return 1;
    }
};
//# sourceMappingURL=opacity.js.map