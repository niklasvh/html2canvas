import { ElementContainer } from '../dom/element-container';
import { BoundCurves } from './bound-curves';
import { EffectTarget, IElementEffect } from './effects';
export declare class StackingContext {
    element: ElementPaint;
    negativeZIndex: StackingContext[];
    zeroOrAutoZIndexOrTransformedOrOpacity: StackingContext[];
    positiveZIndex: StackingContext[];
    nonPositionedFloats: StackingContext[];
    nonPositionedInlineLevel: StackingContext[];
    inlineLevel: ElementPaint[];
    nonInlineLevel: ElementPaint[];
    constructor(container: ElementPaint);
}
export declare class ElementPaint {
    readonly container: ElementContainer;
    readonly parent: ElementPaint | null;
    readonly effects: IElementEffect[];
    readonly curves: BoundCurves;
    listValue?: string;
    constructor(container: ElementContainer, parent: ElementPaint | null);
    getEffects(target: EffectTarget): IElementEffect[];
}
export declare const parseStackingContexts: (container: ElementContainer) => StackingContext;
