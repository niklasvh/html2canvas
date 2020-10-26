"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transform_1 = require("../transform");
var parser_1 = require("../../syntax/parser");
var assert_1 = require("assert");
var parseValue = function (value) { return transform_1.transform.parse(parser_1.Parser.parseValue(value)); };
describe('property-descriptors', function () {
    describe('transform', function () {
        it('none', function () { return assert_1.deepStrictEqual(parseValue('none'), null); });
        it('matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0)', function () {
            return assert_1.deepStrictEqual(parseValue('matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0)'), [1, 2, 3, 4, 5, 6]);
        });
        it('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)', function () {
            return assert_1.deepStrictEqual(parseValue('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'), [
                1,
                0,
                0,
                1,
                0,
                0
            ]);
        });
    });
});
//# sourceMappingURL=transform-tests.js.map