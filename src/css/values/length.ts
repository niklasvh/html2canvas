import {invariant} from "../../invariant";
export enum LENGTH_TYPE {
    PX = 0,
    PERCENTAGE = 1
}

export class Length {
    type: LENGTH_TYPE;
    value: number;

    constructor(value: string) {
        this.type =
            value.substr(value.length - 1) === '%' ? LENGTH_TYPE.PERCENTAGE : LENGTH_TYPE.PX;
        const parsedValue = parseFloat(value);
        invariant(!isNaN(parsedValue), `Invalid value given for Length: "${value}"`);
        this.value = isNaN(parsedValue) ? 0 : parsedValue;
    }

    isPercentage(): boolean {
        return this.type === LENGTH_TYPE.PERCENTAGE;
    }

    getAbsoluteValue(parentLength: number): number {
        return this.isPercentage() ? parentLength * (this.value / 100) : this.value;
    }

    static create(v: string): Length {
        return new Length(v);
    }

    static ZeroLength = new Length('0');
}
