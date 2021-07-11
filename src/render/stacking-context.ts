import {ElementContainer, FLAGS} from '../dom/element-container';
import {contains} from '../core/bitwise';
import {BoundCurves, calculateBorderBoxPath, calculatePaddingBoxPath} from './bound-curves';
import {ClipEffect, EffectTarget, IElementEffect, OpacityEffect, TransformEffect} from './effects';
import {OVERFLOW} from '../css/property-descriptors/overflow';
import {equalPath} from './path';
import {DISPLAY} from '../css/property-descriptors/display';
import {OLElementContainer} from '../dom/elements/ol-element-container';
import {LIElementContainer} from '../dom/elements/li-element-container';
import {createCounterText} from '../css/types/functions/counter';

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
    listValue?: string;

    constructor(element: ElementContainer, parentStack: IElementEffect[]) {
        this.container = element;
        this.effects = parentStack.slice(0);
        this.curves = new BoundCurves(element);
        if (element.styles.opacity < 1) {
            this.effects.push(new OpacityEffect(element.styles.opacity));
        }

        if (element.styles.transform !== null) {
            const offsetX = element.bounds.left + element.styles.transformOrigin[0].number;
            const offsetY = element.bounds.top + element.styles.transformOrigin[1].number;
            const matrix = element.styles.transform;
            this.effects.push(new TransformEffect(offsetX, offsetY, matrix));
        }

        if (element.styles.overflowX !== OVERFLOW.VISIBLE) {
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
        if (this.container.styles.overflowX !== OVERFLOW.VISIBLE) {
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
    realStackingContext: StackingContext,
    listItems: ElementPaint[]
) => {
    parent.container.elements.forEach((child) => {
        const treatAsRealStackingContext = contains(child.flags, FLAGS.CREATES_REAL_STACKING_CONTEXT);
        const createsStackingContext = contains(child.flags, FLAGS.CREATES_STACKING_CONTEXT);
        const paintContainer = new ElementPaint(child, parent.getParentEffects());
        if (contains(child.styles.display, DISPLAY.LIST_ITEM)) {
            listItems.push(paintContainer);
        }

        const listOwnerItems = contains(child.flags, FLAGS.IS_LIST_OWNER) ? [] : listItems;

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
                            return false;
                        } else if (index > 0) {
                            return true;
                        }

                        return false;
                    });
                    parentStack.negativeZIndex.splice(index, 0, stack);
                } else if (order > 0) {
                    let index = 0;
                    parentStack.positiveZIndex.some((current, i) => {
                        if (order >= current.element.container.styles.zIndex.order) {
                            index = i + 1;
                            return false;
                        } else if (index > 0) {
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

            parseStackTree(
                paintContainer,
                stack,
                treatAsRealStackingContext ? stack : realStackingContext,
                listOwnerItems
            );
        } else {
            if (child.styles.isInlineLevel()) {
                stackingContext.inlineLevel.push(paintContainer);
            } else {
                stackingContext.nonInlineLevel.push(paintContainer);
            }

            parseStackTree(paintContainer, stackingContext, realStackingContext, listOwnerItems);
        }

        if (contains(child.flags, FLAGS.IS_LIST_OWNER)) {
            processListItems(child, listOwnerItems);
        }
    });
};

const processListItems = (owner: ElementContainer, elements: ElementPaint[]) => {
    let numbering = owner instanceof OLElementContainer ? owner.start : 1;
    const reversed = owner instanceof OLElementContainer ? owner.reversed : false;
    for (let i = 0; i < elements.length; i++) {
        const item = elements[i];
        if (
            item.container instanceof LIElementContainer &&
            typeof item.container.value === 'number' &&
            item.container.value !== 0
        ) {
            numbering = item.container.value;
        }

        item.listValue = createCounterText(numbering, item.container.styles.listStyleType, true);

        numbering += reversed ? -1 : 1;
    }
};

export const parseStackingContexts = (container: ElementContainer): StackingContext => {
    const paintContainer = new ElementPaint(container, []);
    const root = new StackingContext(paintContainer);
    const listItems: ElementPaint[] = [];
    parseStackTree(paintContainer, root, root, listItems);
    processListItems(paintContainer.container, listItems);
    return root;
};
