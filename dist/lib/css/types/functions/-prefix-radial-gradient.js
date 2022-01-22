"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixRadialGradient = void 0;
var parser_1 = require("../../syntax/parser");
var gradient_1 = require("./gradient");
var length_percentage_1 = require("../length-percentage");
var length_1 = require("../length");
var radial_gradient_1 = require("./radial-gradient");
var prefixRadialGradient = function (context, tokens) {
    var shape = 0 /* CIRCLE */;
    var size = 3 /* FARTHEST_CORNER */;
    var stops = [];
    var position = [];
    parser_1.parseFunctionArgs(tokens).forEach(function (arg, i) {
        var isColorStop = true;
        if (i === 0) {
            isColorStop = arg.reduce(function (acc, token) {
                if (parser_1.isIdentToken(token)) {
                    switch (token.value) {
                        case 'center':
                            position.push(length_percentage_1.FIFTY_PERCENT);
                            return false;
                        case 'top':
                        case 'left':
                            position.push(length_percentage_1.ZERO_LENGTH);
                            return false;
                        case 'right':
                        case 'bottom':
                            position.push(length_percentage_1.HUNDRED_PERCENT);
                            return false;
                    }
                }
                else if (length_percentage_1.isLengthPercentage(token) || length_1.isLength(token)) {
                    position.push(token);
                    return false;
                }
                return acc;
            }, isColorStop);
        }
        else if (i === 1) {
            isColorStop = arg.reduce(function (acc, token) {
                if (parser_1.isIdentToken(token)) {
                    switch (token.value) {
                        case radial_gradient_1.CIRCLE:
                            shape = 0 /* CIRCLE */;
                            return false;
                        case radial_gradient_1.ELLIPSE:
                            shape = 1 /* ELLIPSE */;
                            return false;
                        case radial_gradient_1.CONTAIN:
                        case radial_gradient_1.CLOSEST_SIDE:
                            size = 0 /* CLOSEST_SIDE */;
                            return false;
                        case radial_gradient_1.FARTHEST_SIDE:
                            size = 1 /* FARTHEST_SIDE */;
                            return false;
                        case radial_gradient_1.CLOSEST_CORNER:
                            size = 2 /* CLOSEST_CORNER */;
                            return false;
                        case radial_gradient_1.COVER:
                        case radial_gradient_1.FARTHEST_CORNER:
                            size = 3 /* FARTHEST_CORNER */;
                            return false;
                    }
                }
                else if (length_1.isLength(token) || length_percentage_1.isLengthPercentage(token)) {
                    if (!Array.isArray(size)) {
                        size = [];
                    }
                    size.push(token);
                    return false;
                }
                return acc;
            }, isColorStop);
        }
        if (isColorStop) {
            var colorStop = gradient_1.parseColorStop(context, arg);
            stops.push(colorStop);
        }
    });
    return { size: size, shape: shape, stops: stops, position: position, type: 2 /* RADIAL_GRADIENT */ };
};
exports.prefixRadialGradient = prefixRadialGradient;
//# sourceMappingURL=-prefix-radial-gradient.js.map