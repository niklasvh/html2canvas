import { LIST_STYLE_TYPE } from '../../property-descriptors/list-style-type';
import { CSSParsedCounterDeclaration } from '../../index';
export declare class CounterState {
    readonly counters: {
        [key: string]: number[];
    };
    constructor();
    getCounterValue(name: string): number;
    getCounterValues(name: string): number[];
    pop(counters: string[]): void;
    parse(style: CSSParsedCounterDeclaration): string[];
}
export declare const createCounterText: (value: number, type: LIST_STYLE_TYPE, appendSuffix: boolean) => string;
