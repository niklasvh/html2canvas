import { CSSValue } from '../../syntax/parser';
import { CSSRadialGradientImage, GradientColorStop, GradientCorner, UnprocessedGradientColorStop } from '../image';
import { Context } from '../../../core/context';
export declare const parseColorStop: (context: Context, args: CSSValue[]) => UnprocessedGradientColorStop;
export declare const processColorStops: (stops: UnprocessedGradientColorStop[], lineLength: number) => GradientColorStop[];
export declare const calculateGradientDirection: (angle: number | GradientCorner, width: number, height: number) => [number, number, number, number, number];
export declare const calculateRadius: (gradient: CSSRadialGradientImage, x: number, y: number, width: number, height: number) => [number, number];
