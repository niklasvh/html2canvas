"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../../syntax/parser");
var image_1 = require("../image");
var angle_1 = require("../angle");
var tokenizer_1 = require("../../syntax/tokenizer");
var color_1 = require("../color");
var length_percentage_1 = require("../length-percentage");
exports.webkitGradient = function (tokens) {
    var angle = angle_1.deg(180);
    var stops = [];
    var type = image_1.CSSImageType.LINEAR_GRADIENT;
    var shape = image_1.CSSRadialShape.CIRCLE;
    var size = image_1.CSSRadialExtent.FARTHEST_CORNER;
    var position = [];
    parser_1.parseFunctionArgs(tokens).forEach(function (arg, i) {
        var firstToken = arg[0];
        if (i === 0) {
            if (parser_1.isIdentToken(firstToken) && firstToken.value === 'linear') {
                type = image_1.CSSImageType.LINEAR_GRADIENT;
                return;
            }
            else if (parser_1.isIdentToken(firstToken) && firstToken.value === 'radial') {
                type = image_1.CSSImageType.RADIAL_GRADIENT;
                return;
            }
        }
        if (firstToken.type === tokenizer_1.TokenType.FUNCTION) {
            if (firstToken.name === 'from') {
                var color = color_1.color.parse(firstToken.values[0]);
                stops.push({ stop: length_percentage_1.ZERO_LENGTH, color: color });
            }
            else if (firstToken.name === 'to') {
                var color = color_1.color.parse(firstToken.values[0]);
                stops.push({ stop: length_percentage_1.HUNDRED_PERCENT, color: color });
            }
            else if (firstToken.name === 'color-stop') {
                var values = firstToken.values.filter(parser_1.nonFunctionArgSeparator);
                if (values.length === 2) {
                    var color = color_1.color.parse(values[1]);
                    var stop_1 = values[0];
                    if (parser_1.isNumberToken(stop_1)) {
                        stops.push({
                            stop: { type: tokenizer_1.TokenType.PERCENTAGE_TOKEN, number: stop_1.number * 100, flags: stop_1.flags },
                            color: color
                        });
                    }
                }
            }
        }
    });
    return type === image_1.CSSImageType.LINEAR_GRADIENT
        ? {
            angle: (angle + angle_1.deg(180)) % angle_1.deg(360),
            stops: stops,
            type: type
        }
        : { size: size, shape: shape, stops: stops, position: position, type: type };
};
//# sourceMappingURL=-webkit-gradient.js.map