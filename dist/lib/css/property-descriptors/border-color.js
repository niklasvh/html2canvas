"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var borderColorForSide = function (side) { return ({
    name: "border-" + side + "-color",
    initialValue: 'transparent',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'color'
}); };
exports.borderTopColor = borderColorForSide('top');
exports.borderRightColor = borderColorForSide('right');
exports.borderBottomColor = borderColorForSide('bottom');
exports.borderLeftColor = borderColorForSide('left');
//# sourceMappingURL=border-color.js.map