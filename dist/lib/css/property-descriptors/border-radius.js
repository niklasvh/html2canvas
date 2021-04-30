"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var length_percentage_1 = require("../types/length-percentage");
var borderRadiusForSide = function (side) { return ({
    name: "border-radius-" + side,
    initialValue: '0 0',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.LIST,
    parse: function (tokens) { return length_percentage_1.parseLengthPercentageTuple(tokens.filter(length_percentage_1.isLengthPercentage)); }
}); };
exports.borderTopLeftRadius = borderRadiusForSide('top-left');
exports.borderTopRightRadius = borderRadiusForSide('top-right');
exports.borderBottomRightRadius = borderRadiusForSide('bottom-right');
exports.borderBottomLeftRadius = borderRadiusForSide('bottom-left');
//# sourceMappingURL=border-radius.js.map