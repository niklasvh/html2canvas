"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../../syntax/parser");
var image_1 = require("../image");
var tokenizer_1 = require("../../syntax/tokenizer");
var angle_1 = require("../angle");
var gradient_1 = require("./gradient");
exports.prefixLinearGradient = function (tokens) {
    var angle = angle_1.deg(180);
    var stops = [];
    parser_1.parseFunctionArgs(tokens).forEach(function (arg, i) {
        if (i === 0) {
            var firstToken = arg[0];
            if (firstToken.type === tokenizer_1.TokenType.IDENT_TOKEN &&
                ['top', 'left', 'right', 'bottom'].indexOf(firstToken.value) !== -1) {
                angle = angle_1.parseNamedSide(arg);
                return;
            }
            else if (angle_1.isAngle(firstToken)) {
                angle = (angle_1.angle.parse(firstToken) + angle_1.deg(270)) % angle_1.deg(360);
                return;
            }
        }
        var colorStop = gradient_1.parseColorStop(arg);
        stops.push(colorStop);
    });
    return {
        angle: angle,
        stops: stops,
        type: image_1.CSSImageType.LINEAR_GRADIENT
    };
};
//# sourceMappingURL=-prefix-linear-gradient.js.map