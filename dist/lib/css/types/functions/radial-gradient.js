"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../../syntax/parser");
var image_1 = require("../image");
var gradient_1 = require("./gradient");
var length_percentage_1 = require("../length-percentage");
var length_1 = require("../length");
exports.CLOSEST_SIDE = 'closest-side';
exports.FARTHEST_SIDE = 'farthest-side';
exports.CLOSEST_CORNER = 'closest-corner';
exports.FARTHEST_CORNER = 'farthest-corner';
exports.CIRCLE = 'circle';
exports.ELLIPSE = 'ellipse';
exports.COVER = 'cover';
exports.CONTAIN = 'contain';
exports.radialGradient = function (tokens) {
    var shape = image_1.CSSRadialShape.CIRCLE;
    var size = image_1.CSSRadialExtent.FARTHEST_CORNER;
    var stops = [];
    var position = [];
    parser_1.parseFunctionArgs(tokens).forEach(function (arg, i) {
        var isColorStop = true;
        if (i === 0) {
            var isAtPosition_1 = false;
            isColorStop = arg.reduce(function (acc, token) {
                if (isAtPosition_1) {
                    if (parser_1.isIdentToken(token)) {
                        switch (token.value) {
                            case 'center':
                                position.push(length_percentage_1.FIFTY_PERCENT);
                                return acc;
                            case 'top':
                            case 'left':
                                position.push(length_percentage_1.ZERO_LENGTH);
                                return acc;
                            case 'right':
                            case 'bottom':
                                position.push(length_percentage_1.HUNDRED_PERCENT);
                                return acc;
                        }
                    }
                    else if (length_percentage_1.isLengthPercentage(token) || length_1.isLength(token)) {
                        position.push(token);
                    }
                }
                else if (parser_1.isIdentToken(token)) {
                    switch (token.value) {
                        case exports.CIRCLE:
                            shape = image_1.CSSRadialShape.CIRCLE;
                            return false;
                        case exports.ELLIPSE:
                            shape = image_1.CSSRadialShape.ELLIPSE;
                            return false;
                        case 'at':
                            isAtPosition_1 = true;
                            return false;
                        case exports.CLOSEST_SIDE:
                            size = image_1.CSSRadialExtent.CLOSEST_SIDE;
                            return false;
                        case exports.COVER:
                        case exports.FARTHEST_SIDE:
                            size = image_1.CSSRadialExtent.FARTHEST_SIDE;
                            return false;
                        case exports.CONTAIN:
                        case exports.CLOSEST_CORNER:
                            size = image_1.CSSRadialExtent.CLOSEST_CORNER;
                            return false;
                        case exports.FARTHEST_CORNER:
                            size = image_1.CSSRadialExtent.FARTHEST_CORNER;
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
            var colorStop = gradient_1.parseColorStop(arg);
            stops.push(colorStop);
        }
    });
    return { size: size, shape: shape, stops: stops, position: position, type: image_1.CSSImageType.RADIAL_GRADIENT };
};
//# sourceMappingURL=radial-gradient.js.map