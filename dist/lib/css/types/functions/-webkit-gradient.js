"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webkitGradient = void 0;
var parser_1 = require("../../syntax/parser");
var angle_1 = require("../angle");
var color_1 = require("../color");
var length_percentage_1 = require("../length-percentage");
var webkitGradient = function (context, tokens) {
    var angle = angle_1.deg(180);
    var stops = [];
    var type = 1 /* LINEAR_GRADIENT */;
    var shape = 0 /* CIRCLE */;
    var size = 3 /* FARTHEST_CORNER */;
    var position = [];
    parser_1.parseFunctionArgs(tokens).forEach(function (arg, i) {
        var firstToken = arg[0];
        if (i === 0) {
            if (parser_1.isIdentToken(firstToken) && firstToken.value === 'linear') {
                type = 1 /* LINEAR_GRADIENT */;
                return;
            }
            else if (parser_1.isIdentToken(firstToken) && firstToken.value === 'radial') {
                type = 2 /* RADIAL_GRADIENT */;
                return;
            }
        }
        if (firstToken.type === 18 /* FUNCTION */) {
            if (firstToken.name === 'from') {
                var color = color_1.color.parse(context, firstToken.values[0]);
                stops.push({ stop: length_percentage_1.ZERO_LENGTH, color: color });
            }
            else if (firstToken.name === 'to') {
                var color = color_1.color.parse(context, firstToken.values[0]);
                stops.push({ stop: length_percentage_1.HUNDRED_PERCENT, color: color });
            }
            else if (firstToken.name === 'color-stop') {
                var values = firstToken.values.filter(parser_1.nonFunctionArgSeparator);
                if (values.length === 2) {
                    var color = color_1.color.parse(context, values[1]);
                    var stop_1 = values[0];
                    if (parser_1.isNumberToken(stop_1)) {
                        stops.push({
                            stop: { type: 16 /* PERCENTAGE_TOKEN */, number: stop_1.number * 100, flags: stop_1.flags },
                            color: color
                        });
                    }
                }
            }
        }
    });
    return type === 1 /* LINEAR_GRADIENT */
        ? {
            angle: (angle + angle_1.deg(180)) % angle_1.deg(360),
            stops: stops,
            type: type
        }
        : { size: size, shape: shape, stops: stops, position: position, type: type };
};
exports.webkitGradient = webkitGradient;
//# sourceMappingURL=-webkit-gradient.js.map