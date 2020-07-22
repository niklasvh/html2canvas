import {CSSValue} from '../syntax/parser'
import {TokenType} from '../syntax/tokenizer'
import {ITypeDescriptor} from '../ITypeDescriptor'

export const duration: ITypeDescriptor<number> = {
    name: 'duration',
    parse: (value: CSSValue): number => {
        if (value.type === TokenType.DIMENSION_TOKEN) {
            return (value.unit.toLowerCase() === 's' ? 1000 : 1) * value.number;
        }

        throw new Error(`Unsupported angle type`);
    }
}
