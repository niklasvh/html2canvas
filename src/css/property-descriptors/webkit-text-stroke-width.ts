import {CSSValue, isDimensionToken} from '../syntax/parser';
import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export const webkitTextStrokeWidth: IPropertyValueDescriptor<number> = {
    name: `-webkit-text-stroke-width`,
    initialValue: '0',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (token: CSSValue): number => {
        if (isDimensionToken(token)) {
            return token.number;
        }
        return 0;
    }
};
