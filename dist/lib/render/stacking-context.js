"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitwise_1 = require("../core/bitwise");
var bound_curves_1 = require("./bound-curves");
var effects_1 = require("./effects");
var overflow_1 = require("../css/property-descriptors/overflow");
var path_1 = require("./path");
var ol_element_container_1 = require("../dom/elements/ol-element-container");
var li_element_container_1 = require("../dom/elements/li-element-container");
var counter_1 = require("../css/types/functions/counter");
var StackingContext = /** @class */ (function () {
    function StackingContext(container) {
        this.element = container;
        this.inlineLevel = [];
        this.nonInlineLevel = [];
        this.negativeZIndex = [];
        this.zeroOrAutoZIndexOrTransformedOrOpacity = [];
        this.positiveZIndex = [];
        this.nonPositionedFloats = [];
        this.nonPositionedInlineLevel = [];
    }
    return StackingContext;
}());
exports.StackingContext = StackingContext;
var ElementPaint = /** @class */ (function () {
    function ElementPaint(element, parentStack) {
        this.container = element;
        this.effects = parentStack.slice(0);
        this.curves = new bound_curves_1.BoundCurves(element);
        if (element.styles.transform !== null) {
            var offsetX = element.bounds.left + element.styles.transformOrigin[0].number;
            var offsetY = element.bounds.top + element.styles.transformOrigin[1].number;
            var matrix = element.styles.transform;
            this.effects.push(new effects_1.TransformEffect(offsetX, offsetY, matrix));
        }
        if (element.styles.overflowX !== overflow_1.OVERFLOW.VISIBLE) {
            var borderBox = bound_curves_1.calculateBorderBoxPath(this.curves);
            var paddingBox = bound_curves_1.calculatePaddingBoxPath(this.curves);
            if (path_1.equalPath(borderBox, paddingBox)) {
                this.effects.push(new effects_1.ClipEffect(borderBox, 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */));
            }
            else {
                this.effects.push(new effects_1.ClipEffect(borderBox, 2 /* BACKGROUND_BORDERS */));
                this.effects.push(new effects_1.ClipEffect(paddingBox, 4 /* CONTENT */));
            }
        }
    }
    ElementPaint.prototype.getParentEffects = function () {
        var effects = this.effects.slice(0);
        if (this.container.styles.overflowX !== overflow_1.OVERFLOW.VISIBLE) {
            var borderBox = bound_curves_1.calculateBorderBoxPath(this.curves);
            var paddingBox = bound_curves_1.calculatePaddingBoxPath(this.curves);
            if (!path_1.equalPath(borderBox, paddingBox)) {
                effects.push(new effects_1.ClipEffect(paddingBox, 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */));
            }
        }
        return effects;
    };
    return ElementPaint;
}());
exports.ElementPaint = ElementPaint;
var parseStackTree = function (parent, stackingContext, realStackingContext, listItems) {
    parent.container.elements.forEach(function (child) {
        var treatAsRealStackingContext = bitwise_1.contains(child.flags, 4 /* CREATES_REAL_STACKING_CONTEXT */);
        var createsStackingContext = bitwise_1.contains(child.flags, 2 /* CREATES_STACKING_CONTEXT */);
        var paintContainer = new ElementPaint(child, parent.getParentEffects());
        if (bitwise_1.contains(child.styles.display, 2048 /* LIST_ITEM */)) {
            listItems.push(paintContainer);
        }
        var listOwnerItems = bitwise_1.contains(child.flags, 8 /* IS_LIST_OWNER */) ? [] : listItems;
        if (treatAsRealStackingContext || createsStackingContext) {
            var parentStack = treatAsRealStackingContext || child.styles.isPositioned() ? realStackingContext : stackingContext;
            var stack = new StackingContext(paintContainer);
            if (child.styles.isPositioned() || child.styles.opacity < 1 || child.styles.isTransformed()) {
                var order_1 = child.styles.zIndex.order;
                if (order_1 < 0) {
                    var index_1 = 0;
                    parentStack.negativeZIndex.some(function (current, i) {
                        if (order_1 > current.element.container.styles.zIndex.order) {
                            index_1 = i;
                            return false;
                        }
                        else if (index_1 > 0) {
                            return true;
                        }
                        return false;
                    });
                    parentStack.negativeZIndex.splice(index_1, 0, stack);
                }
                else if (order_1 > 0) {
                    var index_2 = 0;
                    parentStack.positiveZIndex.some(function (current, i) {
                        if (order_1 >= current.element.container.styles.zIndex.order) {
                            index_2 = i + 1;
                            return false;
                        }
                        else if (index_2 > 0) {
                            return true;
                        }
                        return false;
                    });
                    parentStack.positiveZIndex.splice(index_2, 0, stack);
                }
                else {
                    parentStack.zeroOrAutoZIndexOrTransformedOrOpacity.push(stack);
                }
            }
            else {
                if (child.styles.isFloating()) {
                    parentStack.nonPositionedFloats.push(stack);
                }
                else {
                    parentStack.nonPositionedInlineLevel.push(stack);
                }
            }
            parseStackTree(paintContainer, stack, treatAsRealStackingContext ? stack : realStackingContext, listOwnerItems);
        }
        else {
            if (child.styles.isInlineLevel()) {
                stackingContext.inlineLevel.push(paintContainer);
            }
            else {
                stackingContext.nonInlineLevel.push(paintContainer);
            }
            parseStackTree(paintContainer, stackingContext, realStackingContext, listOwnerItems);
        }
        if (bitwise_1.contains(child.flags, 8 /* IS_LIST_OWNER */)) {
            processListItems(child, listOwnerItems);
        }
    });
};
var processListItems = function (owner, elements) {
    var numbering = owner instanceof ol_element_container_1.OLElementContainer ? owner.start : 1;
    var reversed = owner instanceof ol_element_container_1.OLElementContainer ? owner.reversed : false;
    for (var i = 0; i < elements.length; i++) {
        var item = elements[i];
        if (item.container instanceof li_element_container_1.LIElementContainer &&
            typeof item.container.value === 'number' &&
            item.container.value !== 0) {
            numbering = item.container.value;
        }
        item.listValue = counter_1.createCounterText(numbering, item.container.styles.listStyleType, true);
        numbering += reversed ? -1 : 1;
    }
};
exports.parseStackingContexts = function (container) {
    var paintContainer = new ElementPaint(container, []);
    var root = new StackingContext(paintContainer);
    var listItems = [];
    parseStackTree(paintContainer, root, root, listItems);
    processListItems(paintContainer.container, listItems);
    return root;
};
//# sourceMappingURL=stacking-context.js.map