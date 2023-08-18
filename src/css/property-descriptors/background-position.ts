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
        console.log('background-position')
        console.log(_context);
        console.log(tokens);
        console.log('parseFunctionArgs',parseFunctionArgs(tokens))
        return parseFunctionArgs(tokens)
            .map((values: CSSValue[]) => {
                console.log('map项',values);    
                let a = values.filter(isLengthPercentage)
                console.log('map处理后的结果',a);
                return  a           
            })
            .map(parseLengthPercentageTuple);
    }
};
