import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isAutoIdentToken, isDimensionToken} from '../syntax/parser';
import {Context} from '../../core/context';
import {AutoIdentToken, DimensionToken, TokenType} from '../syntax/tokenizer';

export interface RectClip {
    top: DimensionToken | AutoIdentToken;
    right: DimensionToken | AutoIdentToken;
    bottom: DimensionToken | AutoIdentToken;
    left: DimensionToken | AutoIdentToken;
}

const isDimensionOrAutoToken = (token: CSSValue): token is DimensionToken | AutoIdentToken =>
    isDimensionToken(token) || isAutoIdentToken(token);

export const clip: IPropertyValueDescriptor<RectClip | null> = {
    name: 'clip',
    initialValue: 'auto',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (_context: Context, token: CSSValue) => {
        if (isAutoIdentToken(token)) {
            return null;
        }
        if (token.type !== TokenType.FUNCTION || token.name !== 'rect') {
            throw new Error('Clip value must be auto or a rect function');
        }

        const rectArgs = token.values.filter(isDimensionOrAutoToken);
        if (rectArgs.length !== 4) {
            throw new Error('Rect clip must have 4 elements that are either a dimension or "auto"');
        }

        return {
            top: rectArgs[0],
            right: rectArgs[1],
            bottom: rectArgs[2],
            left: rectArgs[3]
        };
    }
};
