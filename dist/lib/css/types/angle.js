"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deg = exports.parseNamedSide = exports.isAngle = exports.angle = void 0;
var parser_1 = require("../syntax/parser");
var length_percentage_1 = require("./length-percentage");
var DEG = 'deg';
var GRAD = 'grad';
var RAD = 'rad';
var TURN = 'turn';
exports.angle = {
    name: 'angle',
    parse: function (_context, value) {
        if (value.type === 15 /* DIMENSION_TOKEN */) {
            switch (value.unit) {
                case DEG:
                    return (Math.PI * value.number) / 180;
                case GRAD:
                    return (Math.PI / 200) * value.number;
                case RAD:
                    return value.number;
                case TURN:
                    return Math.PI * 2 * value.number;
            }
        }
        throw new Error("Unsupported angle type");
    }
};
var isAngle = function (value) {
    if (value.type === 15 /* DIMENSION_TOKEN */) {
        if (value.unit === DEG || value.unit === GRAD || value.unit === RAD || value.unit === TURN) {
            return true;
        }
    }
    return false;
};
exports.isAngle = isAngle;
var parseNamedSide = function (tokens) {
    var sideOrCorner = tokens
        .filter(parser_1.isIdentToken)
        .map(function (ident) { return ident.value; })
        .join(' ');
    switch (sideOrCorner) {
        case 'to bottom right':
        case 'to right bottom':
        case 'left top':
        case 'top left':
            return [length_percentage_1.ZERO_LENGTH, length_percentage_1.ZERO_LENGTH];
        case 'to top':
        case 'bottom':
            return exports.deg(0);
        case 'to bottom left':
        case 'to left bottom':
        case 'right top':
        case 'top right':
            return [length_percentage_1.ZERO_LENGTH, length_percentage_1.HUNDRED_PERCENT];
        case 'to right':
        case 'left':
            return exports.deg(90);
        case 'to top left':
        case 'to left top':
        case 'right bottom':
        case 'bottom right':
            return [length_percentage_1.HUNDRED_PERCENT, length_percentage_1.HUNDRED_PERCENT];
        case 'to bottom':
        case 'top':
            return exports.deg(180);
        case 'to top right':
        case 'to right top':
        case 'left bottom':
        case 'bottom left':
            return [length_percentage_1.HUNDRED_PERCENT, length_percentage_1.ZERO_LENGTH];
        case 'to left':
        case 'right':
            return exports.deg(270);
    }
    return 0;
};
exports.parseNamedSide = parseNamedSide;
var deg = function (deg) { return (Math.PI * deg) / 180; };
exports.deg = deg;
//# sourceMappingURL=angle.js.map