"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paintOrder = void 0;
var parser_1 = require("../syntax/parser");
exports.paintOrder = {
    name: 'paint-order',
    initialValue: 'normal',
    prefix: false,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        var DEFAULT_VALUE = [0 /* FILL */, 1 /* STROKE */, 2 /* MARKERS */];
        var layers = [];
        tokens.filter(parser_1.isIdentToken).forEach(function (token) {
            switch (token.value) {
                case 'stroke':
                    layers.push(1 /* STROKE */);
                    break;
                case 'fill':
                    layers.push(0 /* FILL */);
                    break;
                case 'markers':
                    layers.push(2 /* MARKERS */);
                    break;
            }
        });
        DEFAULT_VALUE.forEach(function (value) {
            if (layers.indexOf(value) === -1) {
                layers.push(value);
            }
        });
        return layers;
    }
};
//# sourceMappingURL=paint-order.js.map