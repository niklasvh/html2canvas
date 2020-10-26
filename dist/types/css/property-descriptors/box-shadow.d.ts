import { IPropertyListDescriptor } from '../IPropertyDescriptor';
import { Color } from '../types/color';
import { Length } from '../types/length';
export declare type BoxShadow = BoxShadowItem[];
interface BoxShadowItem {
    inset: boolean;
    color: Color;
    offsetX: Length;
    offsetY: Length;
    blur: Length;
    spread: Length;
}
export declare const boxShadow: IPropertyListDescriptor<BoxShadow>;
export {};
