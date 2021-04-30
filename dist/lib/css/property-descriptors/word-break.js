"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var WORD_BREAK;
(function (WORD_BREAK) {
    WORD_BREAK["NORMAL"] = "normal";
    WORD_BREAK["BREAK_ALL"] = "break-all";
    WORD_BREAK["KEEP_ALL"] = "keep-all";
})(WORD_BREAK = exports.WORD_BREAK || (exports.WORD_BREAK = {}));
exports.wordBreak = {
    name: 'word-break',
    initialValue: 'normal',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.IDENT_VALUE,
    parse: function (wordBreak) {
        switch (wordBreak) {
            case 'break-all':
                return WORD_BREAK.BREAK_ALL;
            case 'keep-all':
                return WORD_BREAK.KEEP_ALL;
            case 'normal':
            default:
                return WORD_BREAK.NORMAL;
        }
    }
};
//# sourceMappingURL=word-break.js.map