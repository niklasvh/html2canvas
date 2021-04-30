"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var FONT_STYLE;
(function (FONT_STYLE) {
    FONT_STYLE["NORMAL"] = "normal";
    FONT_STYLE["ITALIC"] = "italic";
    FONT_STYLE["OBLIQUE"] = "oblique";
})(FONT_STYLE = exports.FONT_STYLE || (exports.FONT_STYLE = {}));
exports.fontStyle = {
    name: 'font-style',
    initialValue: 'normal',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.IDENT_VALUE,
    parse: function (overflow) {
        switch (overflow) {
            case 'oblique':
                return FONT_STYLE.OBLIQUE;
            case 'italic':
                return FONT_STYLE.ITALIC;
            case 'normal':
            default:
                return FONT_STYLE.NORMAL;
        }
    }
};
//# sourceMappingURL=font-style.js.map