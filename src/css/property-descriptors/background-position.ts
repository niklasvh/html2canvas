import {PropertyDescriptorParsingType, IPropertyListDescriptor} from '../IPropertyDescriptor';
import {parseFunctionArgs} from '../syntax/parser';
import {LengthPercentageTuple, parseLengthPercentageTuple} from '../types/length-percentage';
import {Context} from '../../core/context';
export type BackgroundPosition = BackgroundImagePosition[];

export type BackgroundImagePosition = LengthPercentageTuple;

export const backgroundPosition: IPropertyListDescriptor<BackgroundPosition> = {
    name: 'background-position',
    initialValue: '0% 0%',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (_context: Context, tokens: LengthPercentageTuple): BackgroundPosition => {
        return parseFunctionArgs(tokens).map(parseLengthPercentageTuple);
    }
};
