"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundClip = void 0;
var parser_1 = require("../syntax/parser");
exports.backgroundClip = {
    name: 'background-clip',
    initialValue: 'border-box',
    prefix: false,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        return tokens.map(function (token) {
            if (parser_1.isIdentToken(token)) {
                switch (token.value) {
                    case 'padding-box':
                        return 1 /* PADDING_BOX */;
                    case 'content-box':
                        return 2 /* CONTENT_BOX */;
                }
            }
            return 0 /* BORDER_BOX */;
        });
    }
};
//# sourceMappingURL=background-clip.js.map