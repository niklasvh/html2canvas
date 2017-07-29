/* @flow */
'use strict';
import type ImageLoader from './ImageLoader';
import type Logger from './Logger';
import StackingContext from './StackingContext';
import NodeContainer from './NodeContainer';
import TextContainer from './TextContainer';

export const NodeParser = (
    node: HTMLElement,
    imageLoader: ImageLoader,
    logger: Logger
): StackingContext => {
    const container = new NodeContainer(node, null, imageLoader);
    const stack = new StackingContext(container, null, true);

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

const parseNodeTree = (
    node: HTMLElement,
    parent: NodeContainer,
    stack: StackingContext,
    imageLoader: ImageLoader
): void => {
    node.childNodes.forEach((childNode: Node) => {
        if (childNode instanceof Text) {
            if (childNode.data.trim().length > 0) {
                parent.textNodes.push(new TextContainer(childNode, parent));
            }
        } else if (childNode instanceof HTMLElement) {
            if (IGNORED_NODE_NAMES.indexOf(childNode.nodeName) === -1) {
                const container = new NodeContainer(childNode, parent, imageLoader);
                if (container.isVisible()) {
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
                        parseNodeTree(childNode, container, childStack, imageLoader);
                    } else {
                        stack.children.push(container);
                        parseNodeTree(childNode, container, stack, imageLoader);
                    }
                }
            }
        }
    });
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
