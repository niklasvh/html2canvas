/* @flow */
'use strict';

export const PAINT_LAYER = {
    STROKE: 0,
    FILL: 1,
    MARKERS: 2
};

export type PaintLayer = $Values<typeof PAINT_LAYER>;

export const parsePaintOrder = (paintOrder: string): Array<PaintLayer> => {
    const order = paintOrder.split(' ');

    if (order[0] === 'normal') {
        return [PAINT_LAYER.FILL, PAINT_LAYER.STROKE, PAINT_LAYER.MARKERS];
    }

    const layers = [];

    order.forEach(layer => {
        switch (layer) {
            case 'stroke':
                layers.push(PAINT_LAYER.STROKE);
                break;
            case 'fill':
                layers.push(PAINT_LAYER.FILL);
                break;
            case 'markers':
                layers.push(PAINT_LAYER.MARKERS);
                break;
        }
    });

    return layers;
};
