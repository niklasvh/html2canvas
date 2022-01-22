"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontFamily = void 0;
exports.fontFamily = {
    name: "font-family",
    initialValue: '',
    prefix: false,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        var accumulator = [];
        var results = [];
        tokens.forEach(function (token) {
            switch (token.type) {
                case 20 /* IDENT_TOKEN */:
                case 0 /* STRING_TOKEN */:
                    accumulator.push(token.value);
                    break;
                case 17 /* NUMBER_TOKEN */:
                    accumulator.push(token.number.toString());
                    break;
                case 4 /* COMMA_TOKEN */:
                    results.push(accumulator.join(' '));
                    accumulator.length = 0;
                    break;
            }
        });
        if (accumulator.length) {
            results.push(accumulator.join(' '));
        }
        return results.map(function (result) { return (result.indexOf(' ') === -1 ? result : "'" + result + "'"); });
    }
};
//# sourceMappingURL=font-family.js.map