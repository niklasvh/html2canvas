import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
import {Context} from '../../core/context';
export const enum PAINT_ORDER_LAYER {
    FILL,
    STROKE,
    MARKERS
}

export type PaintOrder = PAINT_ORDER_LAYER[];

export const paintOrder: IPropertyListDescriptor<PaintOrder> = {
    name: 'paint-order',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]): PaintOrder => {
        const DEFAULT_VALUE = [PAINT_ORDER_LAYER.FILL, PAINT_ORDER_LAYER.STROKE, PAINT_ORDER_LAYER.MARKERS];
        const layers: PaintOrder = [];

        tokens.filter(isIdentToken).forEach((token) => {
            switch (token.value) {
                case 'stroke':
                    layers.push(PAINT_ORDER_LAYER.STROKE);
                    break;
                case 'fill':
                    layers.push(PAINT_ORDER_LAYER.FILL);
                    break;
                case 'markers':
                    layers.push(PAINT_ORDER_LAYER.MARKERS);
                    break;
            }
        });
        DEFAULT_VALUE.forEach((value) => {
            if (layers.indexOf(value) === -1) {
                layers.push(value);
            }
        });

        return layers;
    }
};
