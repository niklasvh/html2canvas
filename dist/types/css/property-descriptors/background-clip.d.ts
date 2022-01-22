import { IPropertyListDescriptor } from '../IPropertyDescriptor';
export declare const enum BACKGROUND_CLIP {
    BORDER_BOX = 0,
    PADDING_BOX = 1,
    CONTENT_BOX = 2
}
export declare type BackgroundClip = BACKGROUND_CLIP[];
export declare const backgroundClip: IPropertyListDescriptor<BackgroundClip>;
