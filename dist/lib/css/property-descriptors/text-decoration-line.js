"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textDecorationLine = void 0;
var parser_1 = require("../syntax/parser");
exports.textDecorationLine = {
    name: 'text-decoration-line',
    initialValue: 'none',
    prefix: false,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        return tokens
            .filter(parser_1.isIdentToken)
            .map(function (token) {
            switch (token.value) {
                case 'underline':
                    return 1 /* UNDERLINE */;
                case 'overline':
                    return 2 /* OVERLINE */;
                case 'line-through':
                    return 3 /* LINE_THROUGH */;
                case 'none':
                    return 4 /* BLINK */;
            }
            return 0 /* NONE */;
        })
            .filter(function (line) { return line !== 0 /* NONE */; });
    }
};
//# sourceMappingURL=text-decoration-line.js.map