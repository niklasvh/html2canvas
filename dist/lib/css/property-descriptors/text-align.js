"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textAlign = void 0;
exports.textAlign = {
    name: 'text-align',
    initialValue: 'left',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, textAlign) {
        switch (textAlign) {
            case 'right':
                return 2 /* RIGHT */;
            case 'center':
            case 'justify':
                return 1 /* CENTER */;
            case 'left':
            default:
                return 0 /* LEFT */;
        }
    }
};
//# sourceMappingURL=text-align.js.map