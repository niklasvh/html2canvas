import { CSSValue } from './syntax/parser';
export interface ITypeDescriptor<T> {
    name: string;
    parse: (value: CSSValue) => T;
}
