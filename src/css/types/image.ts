import {CSSValue} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {Color} from './color';
import {linearGradient} from './functions/linear-gradient';
import {prefixLinearGradient} from './functions/-prefix-linear-gradient';
import {ITypeDescriptor} from '../ITypeDescriptor';
import {CacheStorage} from '../../core/cache-storage';
import {LengthPercentage} from './length-percentage';
import {webkitGradient} from './functions/-webkit-gradient';

export enum CSSImageType {
    URL,
    LINEAR_GRADIENT
}

export const isLinearGradient = (background: ICSSImage): background is CSSLinearGradientImage => {
    return background.type === CSSImageType.LINEAR_GRADIENT;
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
    angle: number | GradientCorner;
    stops: UnprocessedGradientColorStop[];
}

export interface CSSLinearGradientImage extends ICSSGradientImage {
    type: CSSImageType.LINEAR_GRADIENT;
}

export const image: ITypeDescriptor<ICSSImage> = {
    name: 'image',
    parse: (value: CSSValue): ICSSImage => {
        if (value.type === TokenType.URL_TOKEN) {
            const image: CSSURLImage = {url: value.value, type: CSSImageType.URL};
            CacheStorage.getInstance().addImage(value.value);
            return image;
        }

        if (value.type === TokenType.FUNCTION) {
            const imageFunction = SUPPORTED_IMAGE_FUNCTIONS[value.name];
            if (typeof imageFunction === 'undefined') {
                throw new Error(`Attempting to parse an unsupported image function "${value.name}"`);
            }
            return imageFunction(value.values);
        }

        throw new Error(`Unsupported image type`);
    }
};

const SUPPORTED_IMAGE_FUNCTIONS: {
    [key: string]: (args: CSSValue[]) => ICSSImage;
} = {
    'linear-gradient': linearGradient,
    '-moz-linear-gradient': prefixLinearGradient,
    '-ms-linear-gradient': prefixLinearGradient,
    '-o-linear-gradient': prefixLinearGradient,
    '-webkit-linear-gradient': prefixLinearGradient,
    '-webkit-gradient': webkitGradient
};
