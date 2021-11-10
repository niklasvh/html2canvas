"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visibility = void 0;
exports.visibility = {
    name: 'visible',
    initialValue: 'none',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, visibility) {
        switch (visibility) {
            case 'hidden':
                return 1 /* HIDDEN */;
            case 'collapse':
                return 2 /* COLLAPSE */;
            case 'visible':
            default:
                return 0 /* VISIBLE */;
        }
    }
};
//# sourceMappingURL=visibility.js.map