/* @flow */
'use strict';

import type {BackgroundSource} from './parsing/background';
import type ResourceLoader from './ResourceLoader';

import {parseBackgroundImage} from './parsing/background';
import {copyCSSStyles, getParentOfType} from './Util';
import NodeContainer from './NodeContainer';
import TextContainer from './TextContainer';
import ListStyleTypeFormatter from 'liststyletype-formatter';

// Margin between the enumeration and the list item content
const MARGIN_RIGHT = 7;

export const LIST_STYLE_POSITION = {
    INSIDE: 0,
    OUTSIDE: 1
};

export type ListStylePosition = $Values<typeof LIST_STYLE_POSITION>;

export type ListStyle = {
    listStyleType: string,
    listStyleImage: BackgroundSource,
    listStylePosition: ListStylePosition
};

export const parseListStyle = (style: CSSStyleDeclaration): ListStyle => {
    const listStyleImage = parseBackgroundImage(style.getPropertyValue('list-style-image'));
    return {
        listStyleType: style.getPropertyValue('list-style-type'),
        listStyleImage: listStyleImage && listStyleImage[0],
        listStylePosition: parseListStylePosition(style.getPropertyValue('list-style-position'))
    };
};

export const parseListStylePosition = (position: string): ListStylePosition => {
    switch (position) {
        case 'inside':
            return LIST_STYLE_POSITION.INSIDE;
        case 'outside':
            return LIST_STYLE_POSITION.OUTSIDE;
    }
    return LIST_STYLE_POSITION.OUTSIDE;
};

const getListItemValue = (node: HTMLLIElement): number => {
    if (node.value) {
        return node.value;
    }

    const listContainer = getParentOfType(node, ['OL', 'UL']);
    if (!listContainer || listContainer.tagName === 'UL') {
        // The actual value isn't needed for unordered lists, just return an arbitrary value
        return 1;
    }

    // $FlowFixMe
    let value = listContainer.start !== undefined ? listContainer.start - 1 : 0;
    const listItems = listContainer.querySelectorAll('li');
    const lenListItems = listItems.length;

    for (let i = 0; i < lenListItems; i++) {
        // $FlowFixMe
        const listItem: HTMLLIElement = listItems[i];
        if (getParentOfType(listItem, ['OL']) === listContainer) {
            value = listItem.hasAttribute('value') ? listItem.value : value + 1;
        }
        if (listItem === node) {
            break;
        }
    }

    return value;
};

export const inlineListItemElement = (
    node: HTMLLIElement,
    container: NodeContainer,
    resourceLoader: ResourceLoader
): void => {
    const style = node.ownerDocument.defaultView.getComputedStyle(node, null);
    const listStyle = parseListStyle(style);

    if (listStyle.listStyleType === 'none') {
        return;
    }

    const wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    copyCSSStyles(style, wrapper);

    wrapper.style.position = 'fixed';
    wrapper.style.bottom = 'auto';

    switch (listStyle.listStylePosition) {
        case LIST_STYLE_POSITION.OUTSIDE:
            wrapper.style.left = 'auto';
            wrapper.style.right = `${node.ownerDocument.defaultView.innerWidth -
                container.bounds.left +
                MARGIN_RIGHT}px`;
            wrapper.style.textAlign = 'right';
            break;
        case LIST_STYLE_POSITION.INSIDE:
            wrapper.style.left = `${container.bounds.left}px`;
            wrapper.style.right = 'auto';
            wrapper.style.textAlign = 'left';
            break;
    }

    let text;
    if (listStyle.listStyleImage && listStyle.listStyleImage !== 'none') {
        if (listStyle.listStyleImage.method === 'url') {
            const image = node.ownerDocument.createElement('img');
            image.src = listStyle.listStyleImage.args[0];
            wrapper.style.top = `${container.bounds.top}px`;
            wrapper.style.width = 'auto';
            wrapper.style.height = 'auto';
            wrapper.appendChild(image);
        } else {
            const size = parseFloat(container.style.font.fontSize) * 0.5;
            wrapper.style.top = `${container.bounds.top + container.bounds.height - 1.5 * size}px`;
            wrapper.style.width = `${size}px`;
            wrapper.style.height = `${size}px`;
            wrapper.style.backgroundImage = style.listStyleImage;
        }
    } else {
        text = node.ownerDocument.createTextNode(
            ListStyleTypeFormatter.format(getListItemValue(node), style.listStyleType)
        );
        wrapper.appendChild(text);
        wrapper.style.top = `${container.bounds.top}px`;
    }

    // $FlowFixMe
    const body: HTMLBodyElement = node.ownerDocument.body;
    body.appendChild(wrapper);

    if (text) {
        container.childNodes.push(TextContainer.fromTextNode(text, container));
        body.removeChild(wrapper);
    } else {
        // $FlowFixMe
        container.childNodes.push(new NodeContainer(wrapper, container, resourceLoader, 0));
    }
};
