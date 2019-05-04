import {Matrix} from '../css/property-descriptors/transform';
import {Path} from './path';

export const enum EffectType {
    TRANSFORM = 0,
    CLIP = 1
}

export const enum EffectTarget {
    BACKGROUND_BORDERS = 1 << 1,
    CONTENT = 1 << 2
}

export interface IElementEffect {
    readonly type: EffectType;
    readonly target: number;
}

export class TransformEffect implements IElementEffect {
    readonly type: EffectType;
    readonly target: number;
    readonly offsetX: number;
    readonly offsetY: number;
    readonly matrix: Matrix;

    constructor(offsetX: number, offsetY: number, matrix: Matrix) {
        this.type = EffectType.TRANSFORM;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.matrix = matrix;
        this.target = EffectTarget.BACKGROUND_BORDERS | EffectTarget.CONTENT;
    }
}

export class ClipEffect implements IElementEffect {
    readonly type: EffectType;
    readonly target: number;
    readonly path: Path[];

    constructor(path: Path[], target: EffectTarget) {
        this.type = EffectType.CLIP;
        this.target = target;
        this.path = path;
    }
}

export const isTransformEffect = (effect: IElementEffect): effect is TransformEffect =>
    effect.type === EffectType.TRANSFORM;
export const isClipEffect = (effect: IElementEffect): effect is ClipEffect => effect.type === EffectType.CLIP;
