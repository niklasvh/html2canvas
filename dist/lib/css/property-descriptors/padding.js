"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paddingLeft = exports.paddingBottom = exports.paddingRight = exports.paddingTop = void 0;
var paddingForSide = function (side) { return ({
    name: "padding-" + side,
    initialValue: '0',
    prefix: false,
    type: 3 /* TYPE_VALUE */,
    format: 'length-percentage'
}); };
exports.paddingTop = paddingForSide('top');
exports.paddingRight = paddingForSide('right');
exports.paddingBottom = paddingForSide('bottom');
exports.paddingLeft = paddingForSide('left');
//# sourceMappingURL=padding.js.map