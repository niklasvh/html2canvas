"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("../syntax/tokenizer");
exports.isLength = function (token) {
    return token.type === tokenizer_1.TokenType.NUMBER_TOKEN || token.type === tokenizer_1.TokenType.DIMENSION_TOKEN;
};
//# sourceMappingURL=length.js.map