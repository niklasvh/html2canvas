import { IPropertyListDescriptor } from '../IPropertyDescriptor';
export declare const enum TEXT_DECORATION_LINE {
    NONE = 0,
    UNDERLINE = 1,
    OVERLINE = 2,
    LINE_THROUGH = 3,
    BLINK = 4
}
export declare type TextDecorationLine = TEXT_DECORATION_LINE[];
export declare const textDecorationLine: IPropertyListDescriptor<TextDecorationLine>;
