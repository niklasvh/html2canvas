"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineBreak = exports.LINE_BREAK = void 0;
var LINE_BREAK;
(function (LINE_BREAK) {
    LINE_BREAK["NORMAL"] = "normal";
    LINE_BREAK["STRICT"] = "strict";
})(LINE_BREAK = exports.LINE_BREAK || (exports.LINE_BREAK = {}));
exports.lineBreak = {
    name: 'line-break',
    initialValue: 'normal',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, lineBreak) {
        switch (lineBreak) {
            case 'strict':
                return LINE_BREAK.STRICT;
            case 'normal':
            default:
                return LINE_BREAK.NORMAL;
        }
    }
};
//# sourceMappingURL=line-break.js.map