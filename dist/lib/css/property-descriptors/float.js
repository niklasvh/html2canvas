"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.float = void 0;
exports.float = {
    name: 'float',
    initialValue: 'none',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, float) {
        switch (float) {
            case 'left':
                return 1 /* LEFT */;
            case 'right':
                return 2 /* RIGHT */;
            case 'inline-start':
                return 3 /* INLINE_START */;
            case 'inline-end':
                return 4 /* INLINE_END */;
        }
        return 0 /* NONE */;
    }
};
//# sourceMappingURL=float.js.map