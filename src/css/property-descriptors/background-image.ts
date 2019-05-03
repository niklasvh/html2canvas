import {TokenType} from "../syntax/tokenizer";
import {ICSSImage, image} from "../types/image";
import {IPropertyListDescriptor, PropertyDescriptorParsingType} from "../IPropertyDescriptor";
import {CSSValue, nonFunctionArgSeperator} from "../syntax/parser";

export const backgroundImage: IPropertyListDescriptor<ICSSImage[]> = {
    name: 'background-image',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens: CSSValue[]) => {
        if (tokens.length === 0) {
            return [];
        }

        const first = tokens[0];

        if (first.type ===  TokenType.IDENT_TOKEN && first.value === 'none') {
            return []
        }

        return tokens.filter(nonFunctionArgSeperator).map(image.parse);
    }
};
