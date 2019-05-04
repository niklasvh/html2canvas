import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isNumberToken} from '../syntax/parser';
export const opacity: IPropertyValueDescriptor<number> = {
    name: 'opacity',
    initialValue: '1',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (token: CSSValue): number => {
        if (isNumberToken(token)) {
            return token.number;
        }
        return 1;
    }
};
