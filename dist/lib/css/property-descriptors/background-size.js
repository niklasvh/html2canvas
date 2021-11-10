"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundSize = exports.BACKGROUND_SIZE = void 0;
var parser_1 = require("../syntax/parser");
var length_percentage_1 = require("../types/length-percentage");
var BACKGROUND_SIZE;
(function (BACKGROUND_SIZE) {
    BACKGROUND_SIZE["AUTO"] = "auto";
    BACKGROUND_SIZE["CONTAIN"] = "contain";
    BACKGROUND_SIZE["COVER"] = "cover";
})(BACKGROUND_SIZE = exports.BACKGROUND_SIZE || (exports.BACKGROUND_SIZE = {}));
exports.backgroundSize = {
    name: 'background-size',
    initialValue: '0',
    prefix: false,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        return parser_1.parseFunctionArgs(tokens).map(function (values) { return values.filter(isBackgroundSizeInfoToken); });
    }
};
var isBackgroundSizeInfoToken = function (value) {
    return parser_1.isIdentToken(value) || length_percentage_1.isLengthPercentage(value);
};
//# sourceMappingURL=background-size.js.map