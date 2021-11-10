"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixLinearGradient = void 0;
var parser_1 = require("../../syntax/parser");
var angle_1 = require("../angle");
var gradient_1 = require("./gradient");
var prefixLinearGradient = function (context, tokens) {
    var angle = angle_1.deg(180);
    var stops = [];
    parser_1.parseFunctionArgs(tokens).forEach(function (arg, i) {
        if (i === 0) {
            var firstToken = arg[0];
            if (firstToken.type === 20 /* IDENT_TOKEN */ &&
                ['top', 'left', 'right', 'bottom'].indexOf(firstToken.value) !== -1) {
                angle = angle_1.parseNamedSide(arg);
                return;
            }
            else if (angle_1.isAngle(firstToken)) {
                angle = (angle_1.angle.parse(context, firstToken) + angle_1.deg(270)) % angle_1.deg(360);
                return;
            }
        }
        var colorStop = gradient_1.parseColorStop(context, arg);
        stops.push(colorStop);
    });
    return {
        angle: angle,
        stops: stops,
        type: 1 /* LINEAR_GRADIENT */
    };
};
exports.prefixLinearGradient = prefixLinearGradient;
//# sourceMappingURL=-prefix-linear-gradient.js.map