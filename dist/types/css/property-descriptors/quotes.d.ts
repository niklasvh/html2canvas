import { IPropertyListDescriptor } from '../IPropertyDescriptor';
export interface QUOTE {
    open: string;
    close: string;
}
export declare type Quotes = QUOTE[] | null;
export declare const quotes: IPropertyListDescriptor<Quotes>;
export declare const getQuote: (quotes: Quotes, depth: number, open: boolean) => string;
