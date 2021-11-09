import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isNumberToken} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {Context} from '../../core/context';

interface zIndex {
    order: number;
    auto: boolean;
}

export const zIndex: IPropertyValueDescriptor<zIndex> = {
    name: 'z-index',
    initialValue: 'auto',
    prefix: false,
    type: PropertyDescriptorParsingType.VALUE,
    parse: (_context: Context, token: CSSValue): zIndex => {
        if (token.type === TokenType.IDENT_TOKEN) {
            return {auto: true, order: 0};
        }

        if (isNumberToken(token)) {
            return {auto: false, order: token.number};
        }

        throw new Error(`Invalid z-index number parsed`);
    }
};
