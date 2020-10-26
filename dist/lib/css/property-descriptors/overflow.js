"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var parser_1 = require("../syntax/parser");
var OVERFLOW;
(function (OVERFLOW) {
    OVERFLOW[OVERFLOW["VISIBLE"] = 0] = "VISIBLE";
    OVERFLOW[OVERFLOW["HIDDEN"] = 1] = "HIDDEN";
    OVERFLOW[OVERFLOW["SCROLL"] = 2] = "SCROLL";
    OVERFLOW[OVERFLOW["AUTO"] = 3] = "AUTO";
})(OVERFLOW = exports.OVERFLOW || (exports.OVERFLOW = {}));
exports.overflow = {
    name: 'overflow',
    initialValue: 'visible',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.LIST,
    parse: function (tokens) {
        return tokens.filter(parser_1.isIdentToken).map(function (overflow) {
            switch (overflow.value) {
                case 'hidden':
                    return OVERFLOW.HIDDEN;
                case 'scroll':
                    return OVERFLOW.SCROLL;
                case 'auto':
                    return OVERFLOW.AUTO;
                case 'visible':
                default:
                    return OVERFLOW.VISIBLE;
            }
        });
    }
};
//# sourceMappingURL=overflow.js.map