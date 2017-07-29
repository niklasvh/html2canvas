/* @flow */
'use strict';

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
