import { ElementContainer } from '../dom/element-container';
import { Path } from './path';
export declare class BoundCurves {
    readonly topLeftBorderBox: Path;
    readonly topRightBorderBox: Path;
    readonly bottomRightBorderBox: Path;
    readonly bottomLeftBorderBox: Path;
    readonly topLeftPaddingBox: Path;
    readonly topRightPaddingBox: Path;
    readonly bottomRightPaddingBox: Path;
    readonly bottomLeftPaddingBox: Path;
    readonly topLeftContentBox: Path;
    readonly topRightContentBox: Path;
    readonly bottomRightContentBox: Path;
    readonly bottomLeftContentBox: Path;
    constructor(element: ElementContainer);
}
export declare const calculateBorderBoxPath: (curves: BoundCurves) => Path[];
export declare const calculateContentBoxPath: (curves: BoundCurves) => Path[];
export declare const calculatePaddingBoxPath: (curves: BoundCurves) => Path[];
