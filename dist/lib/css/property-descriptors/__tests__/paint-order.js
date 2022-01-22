"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var parser_1 = require("../../syntax/parser");
var paint_order_1 = require("../paint-order");
var paintOrderParse = function (value) { return paint_order_1.paintOrder.parse({}, parser_1.Parser.parseValues(value)); };
describe('property-descriptors', function () {
    describe('paint-order', function () {
        it('none', function () {
            return assert_1.deepStrictEqual(paintOrderParse('none'), [
                0 /* FILL */,
                1 /* STROKE */,
                2 /* MARKERS */
            ]);
        });
        it('EMPTY', function () {
            return assert_1.deepStrictEqual(paintOrderParse(''), [
                0 /* FILL */,
                1 /* STROKE */,
                2 /* MARKERS */
            ]);
        });
        it('other values', function () {
            return assert_1.deepStrictEqual(paintOrderParse('other values'), [
                0 /* FILL */,
                1 /* STROKE */,
                2 /* MARKERS */
            ]);
        });
        it('normal', function () {
            return assert_1.deepStrictEqual(paintOrderParse('normal'), [
                0 /* FILL */,
                1 /* STROKE */,
                2 /* MARKERS */
            ]);
        });
        it('stroke', function () {
            return assert_1.deepStrictEqual(paintOrderParse('stroke'), [
                1 /* STROKE */,
                0 /* FILL */,
                2 /* MARKERS */
            ]);
        });
        it('fill', function () {
            return assert_1.deepStrictEqual(paintOrderParse('fill'), [
                0 /* FILL */,
                1 /* STROKE */,
                2 /* MARKERS */
            ]);
        });
        it('markers', function () {
            return assert_1.deepStrictEqual(paintOrderParse('markers'), [
                2 /* MARKERS */,
                0 /* FILL */,
                1 /* STROKE */
            ]);
        });
        it('stroke fill', function () {
            return assert_1.deepStrictEqual(paintOrderParse('stroke fill'), [
                1 /* STROKE */,
                0 /* FILL */,
                2 /* MARKERS */
            ]);
        });
        it('markers stroke', function () {
            return assert_1.deepStrictEqual(paintOrderParse('markers stroke'), [
                2 /* MARKERS */,
                1 /* STROKE */,
                0 /* FILL */
            ]);
        });
        it('markers stroke fill', function () {
            return assert_1.deepStrictEqual(paintOrderParse('markers stroke fill'), [
                2 /* MARKERS */,
                1 /* STROKE */,
                0 /* FILL */
            ]);
        });
        it('stroke fill markers', function () {
            return assert_1.deepStrictEqual(paintOrderParse('stroke fill markers'), [
                1 /* STROKE */,
                0 /* FILL */,
                2 /* MARKERS */
            ]);
        });
    });
});
//# sourceMappingURL=paint-order.js.map