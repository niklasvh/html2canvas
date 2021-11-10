"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boxShadow = void 0;
var parser_1 = require("../syntax/parser");
var length_percentage_1 = require("../types/length-percentage");
var color_1 = require("../types/color");
var length_1 = require("../types/length");
exports.boxShadow = {
    name: 'box-shadow',
    initialValue: 'none',
    type: 1 /* LIST */,
    prefix: false,
    parse: function (context, tokens) {
        if (tokens.length === 1 && parser_1.isIdentWithValue(tokens[0], 'none')) {
            return [];
        }
        return parser_1.parseFunctionArgs(tokens).map(function (values) {
            var shadow = {
                color: 0x000000ff,
                offsetX: length_percentage_1.ZERO_LENGTH,
                offsetY: length_percentage_1.ZERO_LENGTH,
                blur: length_percentage_1.ZERO_LENGTH,
                spread: length_percentage_1.ZERO_LENGTH,
                inset: false
            };
            var c = 0;
            for (var i = 0; i < values.length; i++) {
                var token = values[i];
                if (parser_1.isIdentWithValue(token, 'inset')) {
                    shadow.inset = true;
                }
                else if (length_1.isLength(token)) {
                    if (c === 0) {
                        shadow.offsetX = token;
                    }
                    else if (c === 1) {
                        shadow.offsetY = token;
                    }
                    else if (c === 2) {
                        shadow.blur = token;
                    }
                    else {
                        shadow.spread = token;
                    }
                    c++;
                }
                else {
                    shadow.color = color_1.color.parse(context, token);
                }
            }
            return shadow;
        });
    }
};
//# sourceMappingURL=box-shadow.js.map