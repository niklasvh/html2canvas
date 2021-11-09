import {CSSValue} from './syntax/parser';
import {Context} from '../core/context';

export interface ITypeDescriptor<T> {
    name: string;
    parse: (context: Context, value: CSSValue) => T;
}
