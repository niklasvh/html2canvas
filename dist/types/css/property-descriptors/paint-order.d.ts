import { IPropertyListDescriptor } from '../IPropertyDescriptor';
export declare const enum PAINT_ORDER_LAYER {
    FILL = 0,
    STROKE = 1,
    MARKERS = 2
}
export declare type PaintOrder = PAINT_ORDER_LAYER[];
export declare const paintOrder: IPropertyListDescriptor<PaintOrder>;
