/* @flow */
'use strict';

import NodeContainer from './NodeContainer';

const LENGTH_WITH_UNIT = /([\d.]+)(px|r?em|%)/i;

export const LENGTH_TYPE = {
    PX: 0,
    PERCENTAGE: 1
};

export type LengthType = $Values<typeof LENGTH_TYPE>;

export default class Length {
    type: LengthType;
    value: number;

    constructor(value: string) {
        this.type =
            value.substr(value.length - 1) === '%' ? LENGTH_TYPE.PERCENTAGE : LENGTH_TYPE.PX;
        const parsedValue = parseFloat(value);
        if (__DEV__ && isNaN(parsedValue)) {
            console.error(`Invalid value given for Length: "${value}"`);
        }
        this.value = isNaN(parsedValue) ? 0 : parsedValue;
    }

    isPercentage(): boolean {
        return this.type === LENGTH_TYPE.PERCENTAGE;
    }

    getAbsoluteValue(parentLength: number): number {
        return this.isPercentage() ? parentLength * (this.value / 100) : this.value;
    }

    static create(v): Length {
        return new Length(v);
    }
}

const getRootFontSize = (container: NodeContainer): number => {
    const parent = container.parent;
    return parent ? getRootFontSize(parent) : parseFloat(container.style.font.fontSize);
};

export const calculateLengthFromValueWithUnit = (
    container: NodeContainer,
    value: string,
    unit: string
): Length => {
    switch (unit) {
        case 'px':
        case '%':
            return new Length(value + unit);
        case 'em':
        case 'rem':
            const length = new Length(value);
            length.value *=
                unit === 'em'
                    ? parseFloat(container.style.font.fontSize)
                    : getRootFontSize(container);
            return length;
        default:
            // TODO: handle correctly if unknown unit is used
            return new Length('0');
    }
};
