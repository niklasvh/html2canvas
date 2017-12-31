/* @flow */
'use strict';
import type NodeContainer from './NodeContainer';
import TextContainer from './TextContainer';

import {BACKGROUND_CLIP, BACKGROUND_ORIGIN} from './parsing/background';
import {BORDER_STYLE} from './parsing/border';

import Circle from './drawing/Circle';
import Vector from './drawing/Vector';
import Color from './Color';
import Length from './Length';
import {Bounds} from './Bounds';
import {TextBounds} from './TextBounds';
import {copyCSSStyles} from './Util';

export const INPUT_COLOR = new Color([42, 42, 42]);
const INPUT_BORDER_COLOR = new Color([165, 165, 165]);
const INPUT_BACKGROUND_COLOR = new Color([222, 222, 222]);
const INPUT_BORDER = {
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    borderStyle: BORDER_STYLE.SOLID
};
export const INPUT_BORDERS = [INPUT_BORDER, INPUT_BORDER, INPUT_BORDER, INPUT_BORDER];
export const INPUT_BACKGROUND = {
    backgroundColor: INPUT_BACKGROUND_COLOR,
    backgroundImage: [],
    backgroundClip: BACKGROUND_CLIP.PADDING_BOX,
    backgroundOrigin: BACKGROUND_ORIGIN.PADDING_BOX
};

const RADIO_BORDER_RADIUS = new Length('50%');
const RADIO_BORDER_RADIUS_TUPLE = [RADIO_BORDER_RADIUS, RADIO_BORDER_RADIUS];
const INPUT_RADIO_BORDER_RADIUS = [
    RADIO_BORDER_RADIUS_TUPLE,
    RADIO_BORDER_RADIUS_TUPLE,
    RADIO_BORDER_RADIUS_TUPLE,
    RADIO_BORDER_RADIUS_TUPLE
];

const CHECKBOX_BORDER_RADIUS = new Length('3px');
const CHECKBOX_BORDER_RADIUS_TUPLE = [CHECKBOX_BORDER_RADIUS, CHECKBOX_BORDER_RADIUS];
const INPUT_CHECKBOX_BORDER_RADIUS = [
    CHECKBOX_BORDER_RADIUS_TUPLE,
    CHECKBOX_BORDER_RADIUS_TUPLE,
    CHECKBOX_BORDER_RADIUS_TUPLE,
    CHECKBOX_BORDER_RADIUS_TUPLE
];

export const getInputBorderRadius = (node: HTMLInputElement) => {
    return node.type === 'radio' ? INPUT_RADIO_BORDER_RADIUS : INPUT_CHECKBOX_BORDER_RADIUS;
};

export const inlineInputElement = (node: HTMLInputElement, container: NodeContainer): void => {
    if (node.type === 'radio' || node.type === 'checkbox') {
        if (node.checked) {
            const size = Math.min(container.bounds.width, container.bounds.height);
            container.childNodes.push(
                node.type === 'checkbox'
                    ? [
                          new Vector(
                              container.bounds.left + size * 0.39363,
                              container.bounds.top + size * 0.79
                          ),
                          new Vector(
                              container.bounds.left + size * 0.16,
                              container.bounds.top + size * 0.5549
                          ),
                          new Vector(
                              container.bounds.left + size * 0.27347,
                              container.bounds.top + size * 0.44071
                          ),
                          new Vector(
                              container.bounds.left + size * 0.39694,
                              container.bounds.top + size * 0.5649
                          ),
                          new Vector(
                              container.bounds.left + size * 0.72983,
                              container.bounds.top + size * 0.23
                          ),
                          new Vector(
                              container.bounds.left + size * 0.84,
                              container.bounds.top + size * 0.34085
                          ),
                          new Vector(
                              container.bounds.left + size * 0.39363,
                              container.bounds.top + size * 0.79
                          )
                      ]
                    : new Circle(
                          container.bounds.left + size / 4,
                          container.bounds.top + size / 4,
                          size / 4
                      )
            );
        }
    } else {
        inlineFormElement(getInputValue(node), node, container, false);
    }
};

export const inlineTextAreaElement = (
    node: HTMLTextAreaElement,
    container: NodeContainer
): void => {
    inlineFormElement(node.value, node, container, true);
};

export const inlineSelectElement = (node: HTMLSelectElement, container: NodeContainer): void => {
    const option = node.options[node.selectedIndex || 0];
    inlineFormElement(option ? option.text || '' : '', node, container, false);
};

export const reformatInputBounds = (bounds: Bounds): Bounds => {
    if (bounds.width > bounds.height) {
        bounds.left += (bounds.width - bounds.height) / 2;
        bounds.width = bounds.height;
    } else if (bounds.width < bounds.height) {
        bounds.top += (bounds.height - bounds.width) / 2;
        bounds.height = bounds.width;
    }
    return bounds;
};

const inlineFormElement = (
    value: string,
    node: HTMLElement,
    container: NodeContainer,
    allowLinebreak: boolean
): void => {
    const body = node.ownerDocument.body;
    if (value.length > 0 && body) {
        const wrapper = node.ownerDocument.createElement('html2canvaswrapper');
        copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node, null), wrapper);
        wrapper.style.position = 'absolute';
        wrapper.style.left = `${container.bounds.left}px`;
        wrapper.style.top = `${container.bounds.top}px`;
        if (!allowLinebreak) {
            wrapper.style.whiteSpace = 'nowrap';
        }
        const text = node.ownerDocument.createTextNode(value);
        wrapper.appendChild(text);
        body.appendChild(wrapper);
        container.childNodes.push(TextContainer.fromTextNode(text, container));
        body.removeChild(wrapper);
    }
};

const getInputValue = (node: HTMLInputElement): string => {
    const value =
        node.type === 'password' ? new Array(node.value.length + 1).join('\u2022') : node.value;

    return value.length === 0 ? node.placeholder || '' : value;
};
