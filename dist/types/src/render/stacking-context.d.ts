import { ElementContainer } from '../dom/element-container';
import { BoundCurves } from './bound-curves';
import { IElementEffect } from './effects';
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
    container: ElementContainer;
    effects: IElementEffect[];
    curves: BoundCurves;
    listValue?: string;
    constructor(element: ElementContainer, parentStack: IElementEffect[]);
    getParentEffects(): IElementEffect[];
}
export declare const parseStackingContexts: (container: ElementContainer) => StackingContext;
