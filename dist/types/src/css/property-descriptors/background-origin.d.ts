import { IPropertyListDescriptor } from '../IPropertyDescriptor';
export declare const enum BACKGROUND_ORIGIN {
    BORDER_BOX = 0,
    PADDING_BOX = 1,
    CONTENT_BOX = 2
}
export declare type BackgroundOrigin = BACKGROUND_ORIGIN[];
export declare const backgroundOrigin: IPropertyListDescriptor<BackgroundOrigin>;
