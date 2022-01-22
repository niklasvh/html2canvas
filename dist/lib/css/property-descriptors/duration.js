"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duration = void 0;
var parser_1 = require("../syntax/parser");
var time_1 = require("../types/time");
exports.duration = {
    name: 'duration',
    initialValue: '0s',
    prefix: false,
    type: 1 /* LIST */,
    parse: function (context, tokens) {
        return tokens.filter(parser_1.isDimensionToken).map(function (token) { return time_1.time.parse(context, token); });
    }
};
//# sourceMappingURL=duration.js.map