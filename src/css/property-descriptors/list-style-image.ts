import {TokenType} from '../syntax/tokenizer';
import {ICSSImage, image} from '../types/image';
import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue} from '../syntax/parser';

export const listStyleImage: IPropertyValueDescriptor<ICSSImage | null> = {
    name: 'list-style-image',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (token: CSSValue) => {
        if (token.type === TokenType.IDENT_TOKEN && token.value === 'none') {
            return null;
        }

        return image.parse(token);
    }
};
