"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../../syntax/parser");
var tokenizer_1 = require("../../syntax/tokenizer");
var angle_1 = require("../angle");
var image_1 = require("../image");
var gradient_1 = require("./gradient");
exports.linearGradient = function (tokens) {
    var angle = angle_1.deg(180);
    var stops = [];
    parser_1.parseFunctionArgs(tokens).forEach(function (arg, i) {
        if (i === 0) {
            var firstToken = arg[0];
            if (firstToken.type === tokenizer_1.TokenType.IDENT_TOKEN && firstToken.value === 'to') {
                angle = angle_1.parseNamedSide(arg);
                return;
            }
            else if (angle_1.isAngle(firstToken)) {
                angle = angle_1.angle.parse(firstToken);
                return;
            }
        }
        var colorStop = gradient_1.parseColorStop(arg);
        stops.push(colorStop);
    });
    return { angle: angle, stops: stops, type: image_1.CSSImageType.LINEAR_GRADIENT };
};
//# sourceMappingURL=linear-gradient.js.map