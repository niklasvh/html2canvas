/* @flow */
'use strict';

export const contains = (bit: number, value: number): boolean => (bit & value) !== 0;

export const copyCSSStyles = (style: CSSStyleDeclaration, target: HTMLElement): void => {
    if (style.cssText) {
        target.style = style.cssText;
    } else {
        // Edge does not provide value for cssText
        for (let i = style.length - 1; i >= 0; i--) {
            const property = style.item(i);
            target.style.setProperty(property, style.getPropertyValue(property));
        }
    }
};
