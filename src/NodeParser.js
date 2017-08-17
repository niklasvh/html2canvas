/* @flow */
'use strict';
import type ImageLoader, {ImageElement} from './ImageLoader';
import type Logger from './Logger';
import StackingContext from './StackingContext';
import NodeContainer from './NodeContainer';
import TextContainer from './TextContainer';
import {inlineInputElement, inlineTextAreaElement, inlineSelectElement} from './Input';

export const NodeParser = (
    node: HTMLElement,
    imageLoader: ImageLoader<ImageElement>,
    logger: Logger
): StackingContext => {
    if (__DEV__) {
        logger.log(`Starting node parsing`);
    }

    let index = 0;

    const container = new NodeContainer(node, null, imageLoader, index++);
    const stack = new StackingContext(container, null, true);

    parseNodeTree(node, container, stack, imageLoader, index);

    if (__DEV__) {
        logger.log(`Finished parsing node tree`);
    }

    return stack;
};

const IGNORED_NODE_NAMES = ['SCRIPT', 'HEAD', 'TITLE', 'OBJECT', 'BR', 'OPTION'];

const parseNodeTree = (
    node: HTMLElement,
    parent: NodeContainer,
    stack: StackingContext,
    imageLoader: ImageLoader<ImageElement>,
    index: number
): void => {
    if (__DEV__ && index > 50000) {
        throw new Error(`Recursion error while parsing node tree`);
    }

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
                const container = new NodeContainer(childNode, parent, imageLoader, index++);
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
                            parseNodeTree(childNode, container, childStack, imageLoader, index);
                        }
                    } else {
                        stack.children.push(container);
                        if (SHOULD_TRAVERSE_CHILDREN) {
                            parseNodeTree(childNode, container, stack, imageLoader, index);
                        }
                    }
                }
            }
        } else if (
            childNode instanceof defaultView.SVGSVGElement ||
            childNode instanceof SVGSVGElement
        ) {
            const container = new NodeContainer(childNode, parent, imageLoader, index++);
            const treatAsRealStackingContext = createsRealStackingContext(container, childNode);
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
            } else {
                stack.children.push(container);
            }
        }
    }
};

const createsRealStackingContext = (
    container: NodeContainer,
    node: HTMLElement | SVGSVGElement
): boolean => {
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

const isBodyWithTransparentRoot = (
    container: NodeContainer,
    node: HTMLElement | SVGSVGElement
): boolean => {
    return (
        node.nodeName === 'BODY' &&
        container.parent instanceof NodeContainer &&
        container.parent.style.background.backgroundColor.isTransparent()
    );
};
