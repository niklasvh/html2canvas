"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var FLOAT;
(function (FLOAT) {
    FLOAT[FLOAT["NONE"] = 0] = "NONE";
    FLOAT[FLOAT["LEFT"] = 1] = "LEFT";
    FLOAT[FLOAT["RIGHT"] = 2] = "RIGHT";
    FLOAT[FLOAT["INLINE_START"] = 3] = "INLINE_START";
    FLOAT[FLOAT["INLINE_END"] = 4] = "INLINE_END";
})(FLOAT = exports.FLOAT || (exports.FLOAT = {}));
exports.float = {
    name: 'float',
    initialValue: 'none',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.IDENT_VALUE,
    parse: function (float) {
        switch (float) {
            case 'left':
                return FLOAT.LEFT;
            case 'right':
                return FLOAT.RIGHT;
            case 'inline-start':
                return FLOAT.INLINE_START;
            case 'inline-end':
                return FLOAT.INLINE_END;
        }
        return FLOAT.NONE;
    }
};
//# sourceMappingURL=float.js.map