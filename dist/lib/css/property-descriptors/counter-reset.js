"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.counterReset = void 0;
var parser_1 = require("../syntax/parser");
exports.counterReset = {
    name: 'counter-reset',
    initialValue: 'none',
    prefix: true,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        if (tokens.length === 0) {
            return [];
        }
        var resets = [];
        var filtered = tokens.filter(parser_1.nonWhiteSpace);
        for (var i = 0; i < filtered.length; i++) {
            var counter = filtered[i];
            var next = filtered[i + 1];
            if (parser_1.isIdentToken(counter) && counter.value !== 'none') {
                var reset = next && parser_1.isNumberToken(next) ? next.number : 0;
                resets.push({ counter: counter.value, reset: reset });
            }
        }
        return resets;
    }
};
//# sourceMappingURL=counter-reset.js.map