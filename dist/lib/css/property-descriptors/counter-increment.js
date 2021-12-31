"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.counterIncrement = void 0;
var parser_1 = require("../syntax/parser");
exports.counterIncrement = {
    name: 'counter-increment',
    initialValue: 'none',
    prefix: true,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        if (tokens.length === 0) {
            return null;
        }
        var first = tokens[0];
        if (first.type === 20 /* IDENT_TOKEN */ && first.value === 'none') {
            return null;
        }
        var increments = [];
        var filtered = tokens.filter(parser_1.nonWhiteSpace);
        for (var i = 0; i < filtered.length; i++) {
            var counter = filtered[i];
            var next = filtered[i + 1];
            if (counter.type === 20 /* IDENT_TOKEN */) {
                var increment = next && parser_1.isNumberToken(next) ? next.number : 1;
                increments.push({ counter: counter.value, increment: increment });
            }
        }
        return increments;
    }
};
//# sourceMappingURL=counter-increment.js.map