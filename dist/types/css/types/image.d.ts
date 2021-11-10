import { CSSValue } from '../syntax/parser';
import { Color } from './color';
import { ITypeDescriptor } from '../ITypeDescriptor';
import { LengthPercentage } from './length-percentage';
export declare const enum CSSImageType {
    URL = 0,
    LINEAR_GRADIENT = 1,
    RADIAL_GRADIENT = 2
}
export declare const isLinearGradient: (background: ICSSImage) => background is CSSLinearGradientImage;
export declare const isRadialGradient: (background: ICSSImage) => background is CSSRadialGradientImage;
export interface UnprocessedGradientColorStop {
    color: Color;
    stop: LengthPercentage | null;
}
export interface GradientColorStop {
    color: Color;
    stop: number;
}
export interface ICSSImage {
    type: CSSImageType;
}
export interface CSSURLImage extends ICSSImage {
    url: string;
    type: CSSImageType.URL;
}
export declare type GradientCorner = [LengthPercentage, LengthPercentage];
interface ICSSGradientImage extends ICSSImage {
    stops: UnprocessedGradientColorStop[];
}
export interface CSSLinearGradientImage extends ICSSGradientImage {
    angle: number | GradientCorner;
    type: CSSImageType.LINEAR_GRADIENT;
}
export declare const enum CSSRadialShape {
    CIRCLE = 0,
    ELLIPSE = 1
}
export declare const enum CSSRadialExtent {
    CLOSEST_SIDE = 0,
    FARTHEST_SIDE = 1,
    CLOSEST_CORNER = 2,
    FARTHEST_CORNER = 3
}
export declare type CSSRadialSize = CSSRadialExtent | LengthPercentage[];
export interface CSSRadialGradientImage extends ICSSGradientImage {
    type: CSSImageType.RADIAL_GRADIENT;
    shape: CSSRadialShape;
    size: CSSRadialSize;
    position: LengthPercentage[];
}
export declare const image: ITypeDescriptor<ICSSImage>;
export declare function isSupportedImage(value: CSSValue): boolean;
export {};
