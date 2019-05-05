import {ElementContainer, FLAGS} from '../dom/element-container';
import {contains} from '../core/bitwise';
import {BoundCurves, calculateBorderBoxPath, calculatePaddingBoxPath} from './bound-curves';
import {ClipEffect, EffectTarget, IElementEffect, TransformEffect} from './effects';
import {OVERFLOW} from '../css/property-descriptors/overflow';
import {equalPath} from './path';

export class StackingContext {
    element: ElementPaint;
    negativeZIndex: StackingContext[];
    zeroOrAutoZIndexOrTransformedOrOpacity: StackingContext[];
    positiveZIndex: StackingContext[];
    nonPositionedFloats: StackingContext[];
    nonPositionedInlineLevel: StackingContext[];
    inlineLevel: ElementPaint[];
    nonInlineLevel: ElementPaint[];

    constructor(container: ElementPaint) {
        this.element = container;
        this.inlineLevel = [];
        this.nonInlineLevel = [];
        this.negativeZIndex = [];
        this.zeroOrAutoZIndexOrTransformedOrOpacity = [];
        this.positiveZIndex = [];
        this.nonPositionedFloats = [];
        this.nonPositionedInlineLevel = [];
    }
}

export class ElementPaint {
    container: ElementContainer;
    effects: IElementEffect[];
    curves: BoundCurves;

    constructor(element: ElementContainer, parentStack: IElementEffect[]) {
        this.container = element;
        this.effects = parentStack.slice(0);
        this.curves = new BoundCurves(element);
        if (element.styles.transform !== null) {
            const offsetX = element.bounds.left + element.styles.transformOrigin[0].number;
            const offsetY = element.bounds.top + element.styles.transformOrigin[1].number;
            const matrix = element.styles.transform;
            this.effects.push(new TransformEffect(offsetX, offsetY, matrix));
        }

        if (element.styles.overflow !== OVERFLOW.VISIBLE) {
            const borderBox = calculateBorderBoxPath(this.curves);
            const paddingBox = calculatePaddingBoxPath(this.curves);

            if (equalPath(borderBox, paddingBox)) {
                this.effects.push(new ClipEffect(borderBox, EffectTarget.BACKGROUND_BORDERS | EffectTarget.CONTENT));
            } else {
                this.effects.push(new ClipEffect(borderBox, EffectTarget.BACKGROUND_BORDERS));
                this.effects.push(new ClipEffect(paddingBox, EffectTarget.CONTENT));
            }
        }
    }

    getParentEffects(): IElementEffect[] {
        const effects = this.effects.slice(0);
        if (this.container.styles.overflow !== OVERFLOW.VISIBLE) {
            const borderBox = calculateBorderBoxPath(this.curves);
            const paddingBox = calculatePaddingBoxPath(this.curves);
            if (!equalPath(borderBox, paddingBox)) {
                effects.push(new ClipEffect(paddingBox, EffectTarget.BACKGROUND_BORDERS | EffectTarget.CONTENT));
            }
        }
        return effects;
    }
}

const parseStackTree = (
    parent: ElementPaint,
    stackingContext: StackingContext,
    realStackingContext: StackingContext
) => {
    parent.container.elements.forEach(child => {
        const treatAsRealStackingContext = contains(child.flags, FLAGS.CREATES_REAL_STACKING_CONTEXT);
        const createsStackingContext = contains(child.flags, FLAGS.CREATES_STACKING_CONTEXT);
        const paintContainer = new ElementPaint(child, parent.getParentEffects());

        if (treatAsRealStackingContext || createsStackingContext) {
            const parentStack =
                treatAsRealStackingContext || child.styles.isPositioned() ? realStackingContext : stackingContext;

            const stack = new StackingContext(paintContainer);

            if (child.styles.isPositioned() || child.styles.opacity < 1 || child.styles.isTransformed()) {
                const order = child.styles.zIndex.order;
                if (order < 0) {
                    let index = 0;

                    parentStack.negativeZIndex.some((current, i) => {
                        if (order > current.element.container.styles.zIndex.order) {
                            index = i;
                            return true;
                        }
                        return false;
                    });
                    parentStack.negativeZIndex.splice(index, 0, stack);
                } else if (order > 0) {
                    let index = 0;
                    parentStack.positiveZIndex.some((current, i) => {
                        if (order > current.element.container.styles.zIndex.order) {
                            index = i + 1;
                            return true;
                        }

                        return false;
                    });
                    parentStack.positiveZIndex.splice(index, 0, stack);
                } else {
                    parentStack.zeroOrAutoZIndexOrTransformedOrOpacity.push(stack);
                }
            } else {
                if (child.styles.isFloating()) {
                    parentStack.nonPositionedFloats.push(stack);
                } else {
                    parentStack.nonPositionedInlineLevel.push(stack);
                }
            }

            parseStackTree(paintContainer, stack, treatAsRealStackingContext ? stack : realStackingContext);
        } else {
            if (child.styles.isInlineLevel()) {
                stackingContext.inlineLevel.push(paintContainer);
            } else {
                stackingContext.nonInlineLevel.push(paintContainer);
            }

            parseStackTree(paintContainer, stackingContext, realStackingContext);
        }
    });
};

export const parseStackingContexts = (container: ElementContainer): StackingContext => {
    const paintContainer = new ElementPaint(container, []);
    const root = new StackingContext(paintContainer);
    parseStackTree(paintContainer, root, root);
    return root;
};
