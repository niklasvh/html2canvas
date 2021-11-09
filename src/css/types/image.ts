import {CSSValue} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {Color} from './color';
import {linearGradient} from './functions/linear-gradient';
import {prefixLinearGradient} from './functions/-prefix-linear-gradient';
import {ITypeDescriptor} from '../ITypeDescriptor';
import {LengthPercentage} from './length-percentage';
import {webkitGradient} from './functions/-webkit-gradient';
import {radialGradient} from './functions/radial-gradient';
import {prefixRadialGradient} from './functions/-prefix-radial-gradient';
import {Context} from '../../core/context';

export const enum CSSImageType {
    URL,
    LINEAR_GRADIENT,
    RADIAL_GRADIENT
}

export const isLinearGradient = (background: ICSSImage): background is CSSLinearGradientImage => {
    return background.type === CSSImageType.LINEAR_GRADIENT;
};

export const isRadialGradient = (background: ICSSImage): background is CSSRadialGradientImage => {
    return background.type === CSSImageType.RADIAL_GRADIENT;
};

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

// interface ICSSGeneratedImage extends ICSSImage {}

export type GradientCorner = [LengthPercentage, LengthPercentage];

interface ICSSGradientImage extends ICSSImage {
    stops: UnprocessedGradientColorStop[];
}

export interface CSSLinearGradientImage extends ICSSGradientImage {
    angle: number | GradientCorner;
    type: CSSImageType.LINEAR_GRADIENT;
}

export const enum CSSRadialShape {
    CIRCLE,
    ELLIPSE
}

export const enum CSSRadialExtent {
    CLOSEST_SIDE,
    FARTHEST_SIDE,
    CLOSEST_CORNER,
    FARTHEST_CORNER
}

export type CSSRadialSize = CSSRadialExtent | LengthPercentage[];

export interface CSSRadialGradientImage extends ICSSGradientImage {
    type: CSSImageType.RADIAL_GRADIENT;
    shape: CSSRadialShape;
    size: CSSRadialSize;
    position: LengthPercentage[];
}

export const image: ITypeDescriptor<ICSSImage> = {
    name: 'image',
    parse: (context: Context, value: CSSValue): ICSSImage => {
        if (value.type === TokenType.URL_TOKEN) {
            const image: CSSURLImage = {url: value.value, type: CSSImageType.URL};
            context.cache.addImage(value.value);
            return image;
        }

        if (value.type === TokenType.FUNCTION) {
            const imageFunction = SUPPORTED_IMAGE_FUNCTIONS[value.name];
            if (typeof imageFunction === 'undefined') {
                throw new Error(`Attempting to parse an unsupported image function "${value.name}"`);
            }
            return imageFunction(context, value.values);
        }

        throw new Error(`Unsupported image type ${value.type}`);
    }
};

export function isSupportedImage(value: CSSValue): boolean {
    return (
        !(value.type === TokenType.IDENT_TOKEN && value.value === 'none') &&
        (value.type !== TokenType.FUNCTION || !!SUPPORTED_IMAGE_FUNCTIONS[value.name])
    );
}

const SUPPORTED_IMAGE_FUNCTIONS: Record<string, (context: Context, args: CSSValue[]) => ICSSImage> = {
    'linear-gradient': linearGradient,
    '-moz-linear-gradient': prefixLinearGradient,
    '-ms-linear-gradient': prefixLinearGradient,
    '-o-linear-gradient': prefixLinearGradient,
    '-webkit-linear-gradient': prefixLinearGradient,
    'radial-gradient': radialGradient,
    '-moz-radial-gradient': prefixRadialGradient,
    '-ms-radial-gradient': prefixRadialGradient,
    '-o-radial-gradient': prefixRadialGradient,
    '-webkit-radial-gradient': prefixRadialGradient,
    '-webkit-gradient': webkitGradient
};
