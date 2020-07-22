import {CSSValue} from '../syntax/parser'
import {TokenType} from '../syntax/tokenizer'
import {ITypeDescriptor} from '../ITypeDescriptor'

export const duration: ITypeDescriptor<number> = {
    name: 'duration',
    parse: (value: CSSValue): number => {
        if (value.type === TokenType.DIMENSION_TOKEN) {
            switch (value.unit.toLowerCase()){
                case 's': return 1000*value.number;
                case 'ms': return value.number;
            }
        }

        throw new Error(`Unsupported duration type`);
    }
}
