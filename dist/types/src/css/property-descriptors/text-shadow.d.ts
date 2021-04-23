import { IPropertyListDescriptor } from '../IPropertyDescriptor';
import { Color } from '../types/color';
import { Length } from '../types/length';
export declare type TextShadow = TextShadowItem[];
interface TextShadowItem {
    color: Color;
    offsetX: Length;
    offsetY: Length;
    blur: Length;
}
export declare const textShadow: IPropertyListDescriptor<TextShadow>;
export {};
