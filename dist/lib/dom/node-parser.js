"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var element_container_1 = require("./element-container");
var text_container_1 = require("./text-container");
var image_element_container_1 = require("./replaced-elements/image-element-container");
var canvas_element_container_1 = require("./replaced-elements/canvas-element-container");
var svg_element_container_1 = require("./replaced-elements/svg-element-container");
var li_element_container_1 = require("./elements/li-element-container");
var ol_element_container_1 = require("./elements/ol-element-container");
var input_element_container_1 = require("./replaced-elements/input-element-container");
var select_element_container_1 = require("./elements/select-element-container");
var textarea_element_container_1 = require("./elements/textarea-element-container");
var iframe_element_container_1 = require("./replaced-elements/iframe-element-container");
var LIST_OWNERS = ['OL', 'UL', 'MENU'];
var parseNodeTree = function (node, parent, root) {
    for (var childNode = node.firstChild, nextNode = void 0; childNode; childNode = nextNode) {
        nextNode = childNode.nextSibling;
        if (exports.isTextNode(childNode) && childNode.data.trim().length > 0) {
            parent.textNodes.push(new text_container_1.TextContainer(childNode, parent.styles));
        }
        else if (exports.isElementNode(childNode)) {
            var container = createContainer(childNode);
            if (container.styles.isVisible()) {
                if (createsRealStackingContext(childNode, container, root)) {
                    container.flags |= 4 /* CREATES_REAL_STACKING_CONTEXT */;
                }
                else if (createsStackingContext(container.styles)) {
                    container.flags |= 2 /* CREATES_STACKING_CONTEXT */;
                }
                if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {
                    container.flags |= 8 /* IS_LIST_OWNER */;
                }
                parent.elements.push(container);
                if (!exports.isTextareaElement(childNode) && !exports.isSVGElement(childNode) && !exports.isSelectElement(childNode)) {
                    parseNodeTree(childNode, container, root);
                }
            }
        }
    }
};
var createContainer = function (element) {
    if (exports.isImageElement(element)) {
        return new image_element_container_1.ImageElementContainer(element);
    }
    if (exports.isCanvasElement(element)) {
        return new canvas_element_container_1.CanvasElementContainer(element);
    }
    if (exports.isSVGElement(element)) {
        return new svg_element_container_1.SVGElementContainer(element);
    }
    if (exports.isLIElement(element)) {
        return new li_element_container_1.LIElementContainer(element);
    }
    if (exports.isOLElement(element)) {
        return new ol_element_container_1.OLElementContainer(element);
    }
    if (exports.isInputElement(element)) {
        return new input_element_container_1.InputElementContainer(element);
    }
    if (exports.isSelectElement(element)) {
        return new select_element_container_1.SelectElementContainer(element);
    }
    if (exports.isTextareaElement(element)) {
        return new textarea_element_container_1.TextareaElementContainer(element);
    }
    if (exports.isIFrameElement(element)) {
        return new iframe_element_container_1.IFrameElementContainer(element);
    }
    return new element_container_1.ElementContainer(element);
};
exports.parseTree = function (element) {
    var container = createContainer(element);
    container.flags |= 4 /* CREATES_REAL_STACKING_CONTEXT */;
    parseNodeTree(element, container, container);
    return container;
};
var createsRealStackingContext = function (node, container, root) {
    return (container.styles.isPositionedWithZIndex() ||
        container.styles.opacity < 1 ||
        container.styles.isTransformed() ||
        (exports.isBodyElement(node) && root.styles.isTransparent()));
};
var createsStackingContext = function (styles) { return styles.isPositioned() || styles.isFloating(); };
exports.isTextNode = function (node) { return node.nodeType === Node.TEXT_NODE; };
exports.isElementNode = function (node) { return node.nodeType === Node.ELEMENT_NODE; };
exports.isHTMLElementNode = function (node) {
    return exports.isElementNode(node) && typeof node.style !== 'undefined' && !exports.isSVGElementNode(node);
};
exports.isSVGElementNode = function (element) {
    return typeof element.className === 'object';
};
exports.isLIElement = function (node) { return node.tagName === 'LI'; };
exports.isOLElement = function (node) { return node.tagName === 'OL'; };
exports.isInputElement = function (node) { return node.tagName === 'INPUT'; };
exports.isHTMLElement = function (node) { return node.tagName === 'HTML'; };
exports.isSVGElement = function (node) { return node.tagName === 'svg'; };
exports.isBodyElement = function (node) { return node.tagName === 'BODY'; };
exports.isCanvasElement = function (node) { return node.tagName === 'CANVAS'; };
exports.isImageElement = function (node) { return node.tagName === 'IMG'; };
exports.isIFrameElement = function (node) { return node.tagName === 'IFRAME'; };
exports.isStyleElement = function (node) { return node.tagName === 'STYLE'; };
exports.isScriptElement = function (node) { return node.tagName === 'SCRIPT'; };
exports.isTextareaElement = function (node) { return node.tagName === 'TEXTAREA'; };
exports.isSelectElement = function (node) { return node.tagName === 'SELECT'; };
//# sourceMappingURL=node-parser.js.map