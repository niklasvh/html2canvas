import { CSSValue } from '../../syntax/parser';
import { CSSLinearGradientImage, CSSRadialGradientImage } from '../image';
import { Context } from '../../../core/context';
export declare const webkitGradient: (context: Context, tokens: CSSValue[]) => CSSLinearGradientImage | CSSRadialGradientImage;
