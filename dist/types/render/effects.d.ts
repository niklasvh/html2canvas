import { Matrix } from '../css/property-descriptors/transform';
import { Path } from './path';
export declare const enum EffectType {
    TRANSFORM = 0,
    CLIP = 1,
    OPACITY = 2
}
export declare const enum EffectTarget {
    BACKGROUND_BORDERS = 2,
    CONTENT = 4
}
export interface IElementEffect {
    readonly type: EffectType;
    readonly target: number;
}
export declare class TransformEffect implements IElementEffect {
    readonly type: EffectType;
    readonly target: number;
    readonly offsetX: number;
    readonly offsetY: number;
    readonly matrix: Matrix;
    constructor(offsetX: number, offsetY: number, matrix: Matrix);
}
export declare class ClipEffect implements IElementEffect {
    readonly type: EffectType;
    readonly target: number;
    readonly path: Path[];
    constructor(path: Path[], target: EffectTarget);
}
export declare class OpacityEffect implements IElementEffect {
    readonly type: EffectType;
    readonly target: number;
    readonly opacity: number;
    constructor(opacity: number);
}
export declare const isTransformEffect: (effect: IElementEffect) => effect is TransformEffect;
export declare const isClipEffect: (effect: IElementEffect) => effect is ClipEffect;
export declare const isOpacityEffect: (effect: IElementEffect) => effect is OpacityEffect;
