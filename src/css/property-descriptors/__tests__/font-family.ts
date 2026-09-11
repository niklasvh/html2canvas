import {deepEqual} from 'assert';
import {Parser} from '../../syntax/parser';
import {fontFamily} from '../font-family';
import {Context} from '../../../core/context';

const fontFamilyParse = (value: string) => fontFamily.parse({} as Context, Parser.parseValues(value));

describe('property-descriptors', () => {
    describe('font-family', () => {
        it('sans-serif', () => deepEqual(fontFamilyParse('sans-serif'), ['sans-serif']));

        it('great fonts 40 library', () =>
            deepEqual(fontFamilyParse('great fonts 40 library'), ["'great fonts 40 library'"]));

        it('preferred font, "quoted fallback font", font', () =>
            deepEqual(fontFamilyParse('preferred font, "quoted fallback font", font'), [
                "'preferred font'",
                "'quoted fallback font'",
                'font'
            ]));

        it("'escaping test\\'s font'", () =>
            deepEqual(fontFamilyParse("'escaping test\\'s font'"), ["'escaping test\\'s font'"]));

        it('preserves quotes around a family beginning with a digit', () =>
            deepEqual(fontFamilyParse('"123font", Arial, sans-serif'), ["'123font'", 'Arial', 'sans-serif']));

        it('preserves quotes around a numeric family', () => deepEqual(fontFamilyParse('"123"'), ["'123'"]));

        it('keeps quoted generic names distinct from generic keywords', () =>
            deepEqual(fontFamilyParse('"serif", serif, "sans-serif", sans-serif'), [
                "'serif'",
                'serif',
                "'sans-serif'",
                'sans-serif'
            ]));

        it('preserves quotes around punctuation and commas', () =>
            deepEqual(fontFamilyParse('"font!", "font/name", "font,name", serif'), [
                "'font!'",
                "'font/name'",
                "'font,name'",
                'serif'
            ]));

        it('escapes apostrophes when serializing double-quoted strings', () =>
            deepEqual(fontFamilyParse('"O\'Brien", serif'), ["'O\\'Brien'", 'serif']));

        it('escapes backslashes when serializing strings', () =>
            deepEqual(fontFamilyParse('"font\\\\name", serif'), ["'font\\\\name'", 'serif']));

        it('escapes line breaks decoded from CSS escapes', () =>
            deepEqual(fontFamilyParse('"line\\a break", "carriage\\d return", "form\\c feed"'), [
                "'line\\a break'",
                "'carriage\\d return'",
                "'form\\c feed'"
            ]));
    });
});
