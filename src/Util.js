/* @flow */
'use strict';

export const contains = (bit: number, value: number): boolean => (bit & value) !== 0;

export const distance = (a: number, b: number): number => Math.sqrt(a * a + b * b);

export const copyCSSStyles = (style: CSSStyleDeclaration, target: HTMLElement): HTMLElement => {
    // Edge does not provide value for cssText
    for (let i = style.length - 1; i >= 0; i--) {
        const property = style.item(i);
        // Safari shows pseudoelements if content is set
        if (property !== 'content') {
            target.style.setProperty(property, style.getPropertyValue(property));
        }
    }
    return target;
};

export const SMALL_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
