"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overflowWrap = void 0;
exports.overflowWrap = {
    name: 'overflow-wrap',
    initialValue: 'normal',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, overflow) {
        switch (overflow) {
            case 'break-word':
                return "break-word" /* BREAK_WORD */;
            case 'normal':
            default:
                return "normal" /* NORMAL */;
        }
    }
};
//# sourceMappingURL=overflow-wrap.js.map