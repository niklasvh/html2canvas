"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linearGradient = void 0;
var parser_1 = require("../../syntax/parser");
var angle_1 = require("../angle");
var gradient_1 = require("./gradient");
var linearGradient = function (context, tokens) {
    var angle = angle_1.deg(180);
    var stops = [];
    parser_1.parseFunctionArgs(tokens).forEach(function (arg, i) {
        if (i === 0) {
            var firstToken = arg[0];
            if (firstToken.type === 20 /* IDENT_TOKEN */ && firstToken.value === 'to') {
                angle = angle_1.parseNamedSide(arg);
                return;
            }
            else if (angle_1.isAngle(firstToken)) {
                angle = angle_1.angle.parse(context, firstToken);
                return;
            }
        }
        var colorStop = gradient_1.parseColorStop(context, arg);
        stops.push(colorStop);
    });
    return { angle: angle, stops: stops, type: 1 /* LINEAR_GRADIENT */ };
};
exports.linearGradient = linearGradient;
//# sourceMappingURL=linear-gradient.js.map