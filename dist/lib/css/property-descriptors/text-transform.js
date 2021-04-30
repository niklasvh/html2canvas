"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var TEXT_TRANSFORM;
(function (TEXT_TRANSFORM) {
    TEXT_TRANSFORM[TEXT_TRANSFORM["NONE"] = 0] = "NONE";
    TEXT_TRANSFORM[TEXT_TRANSFORM["LOWERCASE"] = 1] = "LOWERCASE";
    TEXT_TRANSFORM[TEXT_TRANSFORM["UPPERCASE"] = 2] = "UPPERCASE";
    TEXT_TRANSFORM[TEXT_TRANSFORM["CAPITALIZE"] = 3] = "CAPITALIZE";
})(TEXT_TRANSFORM = exports.TEXT_TRANSFORM || (exports.TEXT_TRANSFORM = {}));
exports.textTransform = {
    name: 'text-transform',
    initialValue: 'none',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.IDENT_VALUE,
    parse: function (textTransform) {
        switch (textTransform) {
            case 'uppercase':
                return TEXT_TRANSFORM.UPPERCASE;
            case 'lowercase':
                return TEXT_TRANSFORM.LOWERCASE;
            case 'capitalize':
                return TEXT_TRANSFORM.CAPITALIZE;
        }
        return TEXT_TRANSFORM.NONE;
    }
};
//# sourceMappingURL=text-transform.js.map