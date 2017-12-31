/* @flow */
'use strict';

import NodeContainer from './NodeContainer';
import {LineBreaker, fromCodePoint, toCodePoints} from 'css-line-break';
import {OVERFLOW_WRAP} from './parsing/overflowWrap';

export {toCodePoints, fromCodePoint} from 'css-line-break';

export const breakWords = (str: string, parent: NodeContainer): Array<string> => {
    const breaker = LineBreaker(str, {
        lineBreak: parent.style.lineBreak,
        wordBreak:
            parent.style.overflowWrap === OVERFLOW_WRAP.BREAK_WORD
                ? 'break-word'
                : parent.style.wordBreak
    });

    const words = [];
    let bk;

    while (!(bk = breaker.next()).done) {
        words.push(bk.value.slice());
    }

    return words;
};
