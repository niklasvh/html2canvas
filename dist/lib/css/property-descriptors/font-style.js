"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontStyle = void 0;
exports.fontStyle = {
    name: 'font-style',
    initialValue: 'normal',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, overflow) {
        switch (overflow) {
            case 'oblique':
                return "oblique" /* OBLIQUE */;
            case 'italic':
                return "italic" /* ITALIC */;
            case 'normal':
            default:
                return "normal" /* NORMAL */;
        }
    }
};
//# sourceMappingURL=font-style.js.map