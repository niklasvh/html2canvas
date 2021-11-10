import { LIST_STYLE_TYPE } from '../../property-descriptors/list-style-type';
import { CSSParsedCounterDeclaration } from '../../index';
export declare class CounterState {
    private readonly counters;
    getCounterValue(name: string): number;
    getCounterValues(name: string): readonly number[];
    pop(counters: string[]): void;
    parse(style: CSSParsedCounterDeclaration): string[];
}
export declare const createCounterText: (value: number, type: LIST_STYLE_TYPE, appendSuffix: boolean) => string;
