import {PropertyDescriptorParsingType, IPropertyListDescriptor} from '../IPropertyDescriptor';
import {CSSValue, parseFunctionArgs} from '../syntax/parser';
import {isLengthPercentage, LengthPercentageTuple, parseLengthPercentageTuple} from '../types/length-percentage';
import {Context} from '../../core/context';
export type BackgroundPosition = BackgroundImagePosition[];

export type BackgroundImagePosition = LengthPercentageTuple;

export const backgroundPosition: IPropertyListDescriptor<BackgroundPosition> = {
    name: 'background-position',
    initialValue: '0% 0%',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (_context: Context, tokens: CSSValue[]): BackgroundPosition => {        
        // console.log('background-position')
        // console.log(_context);
        // console.log(tokens);
        // console.log('parseFunctionArgs',parseFunctionArgs(tokens))
        let b = parseFunctionArgs(tokens)
            .map((values: CSSValue[]) => {
                let a = values.filter(isLengthPercentage)
                return  a           
            })
            .map(parseLengthPercentageTuple);
        return b
    }
};
