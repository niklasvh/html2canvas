import { IPropertyListDescriptor } from '../IPropertyDescriptor';
import { LengthPercentage } from '../types/length-percentage';
import { StringValueToken } from '../syntax/tokenizer';
export declare enum BACKGROUND_SIZE {
    AUTO = "auto",
    CONTAIN = "contain",
    COVER = "cover"
}
export declare type BackgroundSizeInfo = LengthPercentage | StringValueToken;
export declare type BackgroundSize = BackgroundSizeInfo[][];
export declare const backgroundSize: IPropertyListDescriptor<BackgroundSize>;
