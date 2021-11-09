import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken, parseFunctionArgs} from '../syntax/parser';
import {Context} from '../../core/context';
export type BackgroundRepeat = BACKGROUND_REPEAT[];

export const enum BACKGROUND_REPEAT {
    REPEAT = 0,
    NO_REPEAT = 1,
    REPEAT_X = 2,
    REPEAT_Y = 3
}

export const backgroundRepeat: IPropertyListDescriptor<BackgroundRepeat> = {
    name: 'background-repeat',
    initialValue: 'repeat',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]): BackgroundRepeat => {
        return parseFunctionArgs(tokens)
            .map((values) =>
                values
                    .filter(isIdentToken)
                    .map((token) => token.value)
                    .join(' ')
            )
            .map(parseBackgroundRepeat);
    }
};

const parseBackgroundRepeat = (value: string): BACKGROUND_REPEAT => {
    switch (value) {
        case 'no-repeat':
            return BACKGROUND_REPEAT.NO_REPEAT;
        case 'repeat-x':
        case 'repeat no-repeat':
            return BACKGROUND_REPEAT.REPEAT_X;
        case 'repeat-y':
        case 'no-repeat repeat':
            return BACKGROUND_REPEAT.REPEAT_Y;
        case 'repeat':
        default:
            return BACKGROUND_REPEAT.REPEAT;
    }
};
