import {deepEqual} from 'assert';
import {Parser} from '../../syntax/parser';
import {fontFamily} from '../font-family';

const fontFamilyParse = (value: string) => fontFamily.parse(Parser.parseValues(value));

describe('property-descriptors', () => {
    describe('font-family', () => {
        it('sans-serif', () =>
            deepEqual(fontFamilyParse('sans-serif'), [
                "'sans-serif'",
            ]));

        it('great fonts 40 library', () =>
            deepEqual(fontFamilyParse('great fonts 40 library'), [
                "'great fonts 40 library'",
            ]));

        it('preferred font, "quoted fallback font"', () =>
            deepEqual(fontFamilyParse('preferred font, "quoted fallback font"'), [
                "'preferred font'",
                "'quoted fallback font'"
            ]));
    });
});
