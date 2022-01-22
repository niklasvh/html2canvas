"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.content = void 0;
exports.content = {
    name: 'content',
    initialValue: 'none',
    type: 1 /* LIST */,
    prefix: false,
    parse: function (_context, tokens) {
        if (tokens.length === 0) {
            return [];
        }
        var first = tokens[0];
        if (first.type === 20 /* IDENT_TOKEN */ && first.value === 'none') {
            return [];
        }
        return tokens;
    }
};
//# sourceMappingURL=content.js.map