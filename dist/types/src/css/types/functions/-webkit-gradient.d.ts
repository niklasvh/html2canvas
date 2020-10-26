import { CSSValue } from '../../syntax/parser';
import { CSSLinearGradientImage, CSSRadialGradientImage } from '../image';
export declare const webkitGradient: (tokens: CSSValue[]) => CSSLinearGradientImage | CSSRadialGradientImage;
