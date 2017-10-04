'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseTextDecoration = exports.TEXT_DECORATION_LINE = exports.TEXT_DECORATION = exports.TEXT_DECORATION_STYLE = undefined;

var _Color = require('../Color');

var _Color2 = _interopRequireDefault(_Color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEXT_DECORATION_STYLE = exports.TEXT_DECORATION_STYLE = {
    SOLID: 0,
    DOUBLE: 1,
    DOTTED: 2,
    DASHED: 3,
    WAVY: 4
};

var TEXT_DECORATION = exports.TEXT_DECORATION = {
    NONE: null
};

var TEXT_DECORATION_LINE = exports.TEXT_DECORATION_LINE = {
    UNDERLINE: 1,
    OVERLINE: 2,
    LINE_THROUGH: 3,
    BLINK: 4
};

var parseLine = function parseLine(line) {
    switch (line) {
        case 'underline':
            return TEXT_DECORATION_LINE.UNDERLINE;
        case 'overline':
            return TEXT_DECORATION_LINE.OVERLINE;
        case 'line-through':
            return TEXT_DECORATION_LINE.LINE_THROUGH;
    }
    return TEXT_DECORATION_LINE.BLINK;
};

var parseTextDecorationLine = function parseTextDecorationLine(line) {
    if (line === 'none') {
        return null;
    }

    return line.split(' ').map(parseLine);
};

var parseTextDecorationStyle = function parseTextDecorationStyle(style) {
    switch (style) {
        case 'double':
            return TEXT_DECORATION_STYLE.DOUBLE;
        case 'dotted':
            return TEXT_DECORATION_STYLE.DOTTED;
        case 'dashed':
            return TEXT_DECORATION_STYLE.DASHED;
        case 'wavy':
            return TEXT_DECORATION_STYLE.WAVY;
    }
    return TEXT_DECORATION_STYLE.SOLID;
};

var parseTextDecoration = exports.parseTextDecoration = function parseTextDecoration(style) {
    var textDecorationLine = parseTextDecorationLine(style.textDecorationLine ? style.textDecorationLine : style.textDecoration);
    if (textDecorationLine === null) {
        return TEXT_DECORATION.NONE;
    }

    var textDecorationColor = style.textDecorationColor ? new _Color2.default(style.textDecorationColor) : null;
    var textDecorationStyle = parseTextDecorationStyle(style.textDecorationStyle);

    return {
        textDecorationLine: textDecorationLine,
        textDecorationColor: textDecorationColor,
        textDecorationStyle: textDecorationStyle
    };
};