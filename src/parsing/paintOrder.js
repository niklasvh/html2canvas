/* @flow */
'use strict';

export const PAINT_ORDER = {
    STROKE: 0,
    FILL: 1,
    MARKERS: 2
};

export type PaintOrder = {
    order: array
};

export const parsePaintOrder = (paintOrder: string): PaintOrder => {
    const order = paintOrder.split(' ')

    if (order[0] === 'normal') {
        return {order: [PAINT_ORDER.FILL, PAINT_ORDER.STROKE, PAINT_ORDER.MARKERS]}
    }

    const layers = order.map(layer => {
        switch (layer) {
            case 'stroke':
                layer = PAINT_ORDER.STROKE;
                break;
            case 'fill':
                layer = PAINT_ORDER.FILL;
                break;
            case 'markers':
                layer = PAINT_ORDER.MARKERS;
                break;
        }
        return layer;
    })

    return {
        order: layers
    }
};
