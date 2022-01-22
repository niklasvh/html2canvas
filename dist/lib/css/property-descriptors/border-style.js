"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borderLeftStyle = exports.borderBottomStyle = exports.borderRightStyle = exports.borderTopStyle = void 0;
var borderStyleForSide = function (side) { return ({
    name: "border-" + side + "-style",
    initialValue: 'solid',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, style) {
        switch (style) {
            case 'none':
                return 0 /* NONE */;
            case 'dashed':
                return 2 /* DASHED */;
            case 'dotted':
                return 3 /* DOTTED */;
            case 'double':
                return 4 /* DOUBLE */;
        }
        return 1 /* SOLID */;
    }
}); };
exports.borderTopStyle = borderStyleForSide('top');
exports.borderRightStyle = borderStyleForSide('right');
exports.borderBottomStyle = borderStyleForSide('bottom');
exports.borderLeftStyle = borderStyleForSide('left');
//# sourceMappingURL=border-style.js.map