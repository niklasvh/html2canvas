import {transform} from '../transform';
import {Parser} from '../../syntax/parser';
import {deepStrictEqual} from 'assert';
const parseValue = (value: string) => transform.parse(Parser.parseValue(value));

describe('property-descriptors', () => {
    describe('transform', () => {
        it('none', () => deepStrictEqual(parseValue('none'), null));
        it('matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0)', () =>
            deepStrictEqual(parseValue('matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0)'), [1, 2, 3, 4, 5, 6]));
        it('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)', () =>
            deepStrictEqual(
                parseValue('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'),
                [1, 0, 0, 1, 0, 0]
            ));
    });
});
