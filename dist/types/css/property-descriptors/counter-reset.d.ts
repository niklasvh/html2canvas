import { IPropertyListDescriptor } from '../IPropertyDescriptor';
export interface COUNTER_RESET {
    counter: string;
    reset: number;
}
export declare type CounterReset = COUNTER_RESET[];
export declare const counterReset: IPropertyListDescriptor<CounterReset>;
