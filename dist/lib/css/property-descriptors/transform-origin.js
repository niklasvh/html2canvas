"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformOrigin = void 0;
var length_percentage_1 = require("../types/length-percentage");
var tokenizer_1 = require("../syntax/tokenizer");
var DEFAULT_VALUE = {
    type: 16 /* PERCENTAGE_TOKEN */,
    number: 50,
    flags: tokenizer_1.FLAG_INTEGER
};
var DEFAULT = [DEFAULT_VALUE, DEFAULT_VALUE];
exports.transformOrigin = {
    name: 'transform-origin',
    initialValue: '50% 50%',
    prefix: true,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        var origins = tokens.filter(length_percentage_1.isLengthPercentage);
        if (origins.length !== 2) {
            return DEFAULT;
        }
        return [origins[0], origins[1]];
    }
};
//# sourceMappingURL=transform-origin.js.map