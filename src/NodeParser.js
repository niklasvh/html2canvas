/* @flow */
'use strict';
import type ImageLoader from './ImageLoader';
import type Logger from './Logger';
import StackingContext from './StackingContext';
import NodeContainer from './NodeContainer';
import TextContainer from './TextContainer';
import {inlineInputElement, inlineTextAreaElement, inlineSelectElement} from './Input';

export const NodeParser = (
    node: HTMLElement,
    imageLoader: ImageLoader,
    logger: Logger
): StackingContext => {
    const container = new NodeContainer(node, null, imageLoader);
    const stack = new StackingContext(container, null, true);

    createPseudoHideStyles(node.ownerDocument);

    if (__DEV__) {
        logger.log(`Starting node parsing`);
    }

    parseNodeTree(node, container, stack, imageLoader);

    if (__DEV__) {
        logger.log(`Finished parsing node tree`);
    }

    return stack;
};

const IGNORED_NODE_NAMES = ['SCRIPT', 'HEAD', 'TITLE', 'OBJECT', 'BR', 'OPTION'];
const URL_REGEXP = /^url\((.+)\)$/i;
const PSEUDO_BEFORE = ':before';
const PSEUDO_AFTER = ':after';
const PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';
const PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';

const parseNodeTree = (
    node: HTMLElement,
    parent: NodeContainer,
    stack: StackingContext,
    imageLoader: ImageLoader
): void => {
    for (let childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
        nextNode = childNode.nextSibling;
        const defaultView = childNode.ownerDocument.defaultView;
        if (childNode instanceof defaultView.Text || childNode instanceof Text) {
            if (childNode.data.trim().length > 0) {
                parent.childNodes.push(TextContainer.fromTextNode(childNode, parent));
            }
        } else if (
            childNode instanceof defaultView.HTMLElement ||
            childNode instanceof HTMLElement
        ) {
            if (IGNORED_NODE_NAMES.indexOf(childNode.nodeName) === -1) {
                inlinePseudoElement(childNode, PSEUDO_BEFORE);
                inlinePseudoElement(childNode, PSEUDO_AFTER);
                const container = new NodeContainer(childNode, parent, imageLoader);
                if (container.isVisible()) {
                    if (childNode.tagName === 'INPUT') {
                        // $FlowFixMe
                        inlineInputElement(childNode, container);
                    } else if (childNode.tagName === 'TEXTAREA') {
                        // $FlowFixMe
                        inlineTextAreaElement(childNode, container);
                    } else if (childNode.tagName === 'SELECT') {
                        // $FlowFixMe
                        inlineSelectElement(childNode, container);
                    }

                    const SHOULD_TRAVERSE_CHILDREN = childNode.tagName !== 'TEXTAREA';
                    const treatAsRealStackingContext = createsRealStackingContext(
                        container,
                        childNode
                    );
                    if (treatAsRealStackingContext || createsStackingContext(container)) {
                        // for treatAsRealStackingContext:false, any positioned descendants and descendants
                        // which actually create a new stacking context should be considered part of the parent stacking context
                        const parentStack =
                            treatAsRealStackingContext || container.isPositioned()
                                ? stack.getRealParentStackingContext()
                                : stack;
                        const childStack = new StackingContext(
                            container,
                            parentStack,
                            treatAsRealStackingContext
                        );
                        parentStack.contexts.push(childStack);
                        if (SHOULD_TRAVERSE_CHILDREN) {
                            parseNodeTree(childNode, container, childStack, imageLoader);
                        }
                    } else {
                        stack.children.push(container);
                        if (SHOULD_TRAVERSE_CHILDREN) {
                            parseNodeTree(childNode, container, stack, imageLoader);
                        }
                    }
                }
            }
        }
    }
};

const inlinePseudoElement = (node: HTMLElement, pseudoElt: ':before' | ':after'): void => {
    const style = node.ownerDocument.defaultView.getComputedStyle(node, pseudoElt);
    if (
        !style ||
        !style.content ||
        style.content === 'none' ||
        style.content === '-moz-alt-content' ||
        style.display === 'none'
    ) {
        return;
    }

    const content = stripQuotes(style.content);
    const image = content.match(URL_REGEXP);
    const anonymousReplacedElement = node.ownerDocument.createElement(
        image ? 'img' : 'html2canvaspseudoelement'
    );
    if (image) {
        // $FlowFixMe
        anonymousReplacedElement.src = stripQuotes(image[1]);
    } else {
        anonymousReplacedElement.textContent = content;
    }

    anonymousReplacedElement.style = style.cssText;
    anonymousReplacedElement.className = `${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE} ${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;
    node.className +=
        pseudoElt === PSEUDO_BEFORE
            ? ` ${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE}`
            : ` ${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;
    if (pseudoElt === PSEUDO_BEFORE) {
        node.insertBefore(anonymousReplacedElement, node.firstChild);
    } else {
        node.appendChild(anonymousReplacedElement);
    }
};

const createsRealStackingContext = (container: NodeContainer, node: HTMLElement): boolean => {
    return (
        container.isRootElement() ||
        container.isPositionedWithZIndex() ||
        container.style.opacity < 1 ||
        container.isTransformed() ||
        isBodyWithTransparentRoot(container, node)
    );
};

const createsStackingContext = (container: NodeContainer): boolean => {
    return container.isPositioned() || container.isFloating();
};

const isBodyWithTransparentRoot = (container: NodeContainer, node: HTMLElement): boolean => {
    return (
        node.nodeName === 'BODY' &&
        container.parent instanceof NodeContainer &&
        container.parent.style.background.backgroundColor.isTransparent()
    );
};

const stripQuotes = (content: string): string => {
    const first = content.substr(0, 1);
    return first === content.substr(content.length - 1) && first.match(/['"]/)
        ? content.substr(1, content.length - 2)
        : content;
};

const PSEUDO_HIDE_ELEMENT_STYLE = `{
    content: "" !important;
    display: none !important;
}`;

const createPseudoHideStyles = (document: Document) => {
    createStyles(
        document,
        `.${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE}${PSEUDO_BEFORE}${PSEUDO_HIDE_ELEMENT_STYLE}
         .${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}${PSEUDO_AFTER}${PSEUDO_HIDE_ELEMENT_STYLE}`
    );
};

const createStyles = (document: Document, styles) => {
    const style = document.createElement('style');
    style.innerHTML = styles;
    if (document.body) {
        document.body.appendChild(style);
    }
};
