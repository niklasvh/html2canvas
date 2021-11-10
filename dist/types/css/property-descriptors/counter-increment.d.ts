import { IPropertyListDescriptor } from '../IPropertyDescriptor';
export interface COUNTER_INCREMENT {
    counter: string;
    increment: number;
}
export declare type CounterIncrement = COUNTER_INCREMENT[] | null;
export declare const counterIncrement: IPropertyListDescriptor<CounterIncrement>;
