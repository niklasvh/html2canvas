"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.direction = void 0;
exports.direction = {
    name: 'direction',
    initialValue: 'ltr',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, direction) {
        switch (direction) {
            case 'rtl':
                return 1 /* RTL */;
            case 'ltr':
            default:
                return 0 /* LTR */;
        }
    }
};
//# sourceMappingURL=direction.js.map