"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStylePosition = void 0;
exports.listStylePosition = {
    name: 'list-style-position',
    initialValue: 'outside',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, position) {
        switch (position) {
            case 'inside':
                return 0 /* INSIDE */;
            case 'outside':
            default:
                return 1 /* OUTSIDE */;
        }
    }
};
//# sourceMappingURL=list-style-position.js.map