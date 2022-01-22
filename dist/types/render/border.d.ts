import { Path } from './path';
import { BoundCurves } from './bound-curves';
export declare const parsePathForBorder: (curves: BoundCurves, borderSide: number) => Path[];
export declare const parsePathForBorderDoubleOuter: (curves: BoundCurves, borderSide: number) => Path[];
export declare const parsePathForBorderDoubleInner: (curves: BoundCurves, borderSide: number) => Path[];
export declare const parsePathForBorderStroke: (curves: BoundCurves, borderSide: number) => Path[];
