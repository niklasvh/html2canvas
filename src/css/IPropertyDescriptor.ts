import {CSSValue} from './syntax/parser';
import {CSSTypes} from './types';
import {Context} from '../core/context';

export const enum PropertyDescriptorParsingType {
    VALUE,
    LIST,
    IDENT_VALUE,
    TYPE_VALUE,
    TOKEN_VALUE
}

export interface IPropertyDescriptor {
    name: string;
    type: PropertyDescriptorParsingType;
    initialValue: string;
    prefix: boolean;
}

export interface IPropertyIdentValueDescriptor<T> extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.IDENT_VALUE;
    parse: (context: Context, token: string) => T;
}

export interface IPropertyTypeValueDescriptor extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.TYPE_VALUE;
    format: CSSTypes;
}

export interface IPropertyValueDescriptor<T> extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.VALUE;
    parse: (context: Context, token: CSSValue) => T;
}

export interface IPropertyListDescriptor<T> extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.LIST;
    parse: (context: Context, tokens: CSSValue[]) => T;
}

export interface IPropertyTokenValueDescriptor extends IPropertyDescriptor {
    type: PropertyDescriptorParsingType.TOKEN_VALUE;
}

export type CSSPropertyDescriptor<T> =
    | IPropertyValueDescriptor<T>
    | IPropertyListDescriptor<T>
    | IPropertyIdentValueDescriptor<T>
    | IPropertyTypeValueDescriptor
    | IPropertyTokenValueDescriptor;
