import {strictEqual} from 'assert';
import {layout} from '../textarea-layout';
import {fromCodePoint, toCodePoints} from 'css-line-break';

describe('textarea-layout', () => {
    it('should wrap lines at word boundaries', () => {
        layoutEqual(' A long text with several lines.',
            [' A long text', 'with several', 'lines.']);
    });
    it('should omit spaces at the end of a line', () => {
        layoutEqual(' A long text     with several lines.  2',
            [' A long text', 'with several', 'lines.  2']);
    });
    it('should omit spaces at the end of a line 2', () => {
        layoutEqual('  A long text   with several lines.  2',
            ['  A long', 'text   with', 'several', 'lines.  2']);
    });
    it('should omit spaces at the end of a line 3', () => {
        layoutEqual('A long text     with   sev      eral lines.',
            ['A long text', 'with   sev', 'eral lines.']);
    });
    it('should respect newlines', () => {
        layoutEqual(' A long text\n    with\n\n several lines.',
            [' A long text', '    with', '', ' several', 'lines.']);
    });
    it('should wrap too long words', () => {
        layoutEqual('Donaudampfschifffahrtskapitänskoch 2',
            ['Donaudampfsc', 'hifffahrtska', 'pitänskoch 2']);
    });
    it('should wrap too long words 2', () => {
        layoutEqual('Donaudampfschifffahrtskapitänskoch\n 2',
            ['Donaudampfsc', 'hifffahrtska', 'pitänskoch', ' 2']);
    });
    it('should wrap too long words 3', () => {
        layoutEqual('Donaudampfsc x2',
            ['Donaudampfsc', 'x2']);
    });
});

function layoutEqual(s: string, lines: string[]) {
    const pos = layout(toCodePoints(s).map(i => fromCodePoint(i)), 120, _ => 10);
    let line = '';
    let y = 0;
    let j = 0;
    for (let i = 0; i < pos.length; i++) {
        if (y === pos[i][1]) {
            if (pos[i][0] >= 0) {
                line += s.charAt(i);
            }
        } else {
            strictEqual(line, lines[j]);
            j++;
            line = pos[i][0] >= 0 ? s.charAt(i) : '';
            y = pos[i][1];
        }
    }
}
