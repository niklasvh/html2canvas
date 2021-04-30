"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var parser_1 = require("../syntax/parser");
var length_percentage_1 = require("../types/length-percentage");
exports.backgroundPosition = {
    name: 'background-position',
    initialValue: '0% 0%',
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: function (tokens) {
        return parser_1.parseFunctionArgs(tokens)
            .map(function (values) { return values.filter(length_percentage_1.isLengthPercentage); })
            .map(length_percentage_1.parseLengthPercentageTuple);
    }
};
//# sourceMappingURL=background-position.js.map