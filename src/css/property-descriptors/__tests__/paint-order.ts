import {deepStrictEqual} from 'assert';
import {Parser} from '../../syntax/parser';
import {paintOrder, PAINT_ORDER_LAYER} from '../paint-order';
import {Context} from '../../../core/context';

const paintOrderParse = (value: string) => paintOrder.parse({} as Context, Parser.parseValues(value));

describe('property-descriptors', () => {
    describe('paint-order', () => {
        it('none', () =>
            deepStrictEqual(paintOrderParse('none'), [
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.MARKERS
            ]));

        it('EMPTY', () =>
            deepStrictEqual(paintOrderParse(''), [
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.MARKERS
            ]));

        it('other values', () =>
            deepStrictEqual(paintOrderParse('other values'), [
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.MARKERS
            ]));

        it('normal', () =>
            deepStrictEqual(paintOrderParse('normal'), [
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.MARKERS
            ]));

        it('stroke', () =>
            deepStrictEqual(paintOrderParse('stroke'), [
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.MARKERS
            ]));

        it('fill', () =>
            deepStrictEqual(paintOrderParse('fill'), [
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.MARKERS
            ]));

        it('markers', () =>
            deepStrictEqual(paintOrderParse('markers'), [
                PAINT_ORDER_LAYER.MARKERS,
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.STROKE
            ]));

        it('stroke fill', () =>
            deepStrictEqual(paintOrderParse('stroke fill'), [
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.MARKERS
            ]));

        it('markers stroke', () =>
            deepStrictEqual(paintOrderParse('markers stroke'), [
                PAINT_ORDER_LAYER.MARKERS,
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.FILL
            ]));

        it('markers stroke fill', () =>
            deepStrictEqual(paintOrderParse('markers stroke fill'), [
                PAINT_ORDER_LAYER.MARKERS,
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.FILL
            ]));

        it('stroke fill markers', () =>
            deepStrictEqual(paintOrderParse('stroke fill markers'), [
                PAINT_ORDER_LAYER.STROKE,
                PAINT_ORDER_LAYER.FILL,
                PAINT_ORDER_LAYER.MARKERS
            ]));
    });
});
