import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';
import {CSSValue, isDimensionToken} from '../syntax/parser';
import {time} from '../types/time';

export const duration: IPropertyListDescriptor<number[]> = {
    name: 'duration',
    initialValue: '0s',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (context: Context, tokens: CSSValue[]) => {
        return tokens.filter(isDimensionToken).map((token) => time.parse(context, token));
    }
};
