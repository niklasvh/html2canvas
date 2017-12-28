/* @flow */
'use strict';

import {createCounterText} from './ListItem';
import {parseListStyleType} from './parsing/listStyle';

export const PSEUDO_CONTENT_ITEM_TYPE = {
    TEXT: 0,
    IMAGE: 1
};

export const TOKEN_TYPE = {
    STRING: 0,
    ATTRIBUTE: 1,
    URL: 2,
    COUNTER: 3,
    COUNTERS: 4,
    OPENQUOTE: 5,
    CLOSEQUOTE: 6
};

export type PseudoContentData = {
    counters: {[string]: Array<number>},
    quoteDepth: number
};

export type PseudoContentItem = {
    type: $Values<typeof PSEUDO_CONTENT_ITEM_TYPE>,
    value: string
};

export type Token = {
    type: $Values<typeof TOKEN_TYPE>,
    value?: string,
    name?: string,
    format?: string,
    glue?: string
};

export const parseCounterReset = (
    style: ?CSSStyleDeclaration,
    data: PseudoContentData
): Array<string> => {
    if (!style || !style.counterReset || style.counterReset === 'none') {
        return [];
    }

    const counterNames: Array<string> = [];
    const counterResets = style.counterReset.split(/\s*,\s*/);
    const lenCounterResets = counterResets.length;

    for (let i = 0; i < lenCounterResets; i++) {
        const [counterName, initialValue] = counterResets[i].split(/\s+/);
        counterNames.push(counterName);
        let counter = data.counters[counterName];
        if (!counter) {
            counter = data.counters[counterName] = [];
        }
        counter.push(parseInt(initialValue || 0, 10));
    }

    return counterNames;
};

export const popCounters = (counterNames: Array<string>, data: PseudoContentData): void => {
    const lenCounters = counterNames.length;
    for (let i = 0; i < lenCounters; i++) {
        data.counters[counterNames[i]].pop();
    }
};

export const resolvePseudoContent = (
    node: Node,
    style: ?CSSStyleDeclaration,
    data: PseudoContentData
): ?Array<PseudoContentItem> => {
    if (
        !style ||
        !style.content ||
        style.content === 'none' ||
        style.content === '-moz-alt-content' ||
        style.display === 'none'
    ) {
        return null;
    }

    const tokens = parseContent(style.content);

    const len = tokens.length;
    const contentItems: Array<PseudoContentItem> = [];
    let s = '';

    // increment the counter (if there is a "counter-increment" declaration)
    const counterIncrement = style.counterIncrement;
    if (counterIncrement && counterIncrement !== 'none') {
        const [counterName, incrementValue] = counterIncrement.split(/\s+/);
        const counter = data.counters[counterName];
        if (counter) {
            counter[counter.length - 1] +=
                incrementValue === undefined ? 1 : parseInt(incrementValue, 10);
        }
    }

    // build the content string
    for (let i = 0; i < len; i++) {
        const token = tokens[i];
        switch (token.type) {
            case TOKEN_TYPE.STRING:
                s += token.value || '';
                break;

            case TOKEN_TYPE.ATTRIBUTE:
                if (node instanceof HTMLElement && token.value) {
                    s += node.getAttribute(token.value) || '';
                }
                break;

            case TOKEN_TYPE.COUNTER:
                const counter = data.counters[token.name || ''];
                if (counter) {
                    s += formatCounterValue([counter[counter.length - 1]], '', token.format);
                }
                break;

            case TOKEN_TYPE.COUNTERS:
                const counters = data.counters[token.name || ''];
                if (counters) {
                    s += formatCounterValue(counters, token.glue, token.format);
                }
                break;

            case TOKEN_TYPE.OPENQUOTE:
                s += getQuote(style, true, data.quoteDepth);
                data.quoteDepth++;
                break;

            case TOKEN_TYPE.CLOSEQUOTE:
                data.quoteDepth--;
                s += getQuote(style, false, data.quoteDepth);
                break;

            case TOKEN_TYPE.URL:
                if (s) {
                    contentItems.push({type: PSEUDO_CONTENT_ITEM_TYPE.TEXT, value: s});
                    s = '';
                }
                contentItems.push({type: PSEUDO_CONTENT_ITEM_TYPE.IMAGE, value: token.value || ''});
                break;
        }
    }

    if (s) {
        contentItems.push({type: PSEUDO_CONTENT_ITEM_TYPE.TEXT, value: s});
    }

    return contentItems;
};

export const parseContent = (content: string, cache?: {[string]: Array<Token>}): Array<Token> => {
    if (cache && cache[content]) {
        return cache[content];
    }

    const tokens: Array<Token> = [];
    const len = content.length;

    let isString = false;
    let isEscaped = false;
    let isFunction = false;
    let str = '';
    let functionName = '';
    let args = [];

    for (let i = 0; i < len; i++) {
        const c = content.charAt(i);

        switch (c) {
            case "'":
            case '"':
                if (isEscaped) {
                    str += c;
                } else {
                    isString = !isString;
                    if (!isFunction && !isString) {
                        tokens.push({type: TOKEN_TYPE.STRING, value: str});
                        str = '';
                    }
                }
                break;

            case '\\':
                if (isEscaped) {
                    str += c;
                    isEscaped = false;
                } else {
                    isEscaped = true;
                }
                break;

            case '(':
                if (isString) {
                    str += c;
                } else {
                    isFunction = true;
                    functionName = str;
                    str = '';
                    args = [];
                }
                break;

            case ')':
                if (isString) {
                    str += c;
                } else if (isFunction) {
                    if (str) {
                        args.push(str);
                    }

                    switch (functionName) {
                        case 'attr':
                            if (args.length > 0) {
                                tokens.push({type: TOKEN_TYPE.ATTRIBUTE, value: args[0]});
                            }
                            break;

                        case 'counter':
                            if (args.length > 0) {
                                const counter: Token = {
                                    type: TOKEN_TYPE.COUNTER,
                                    name: args[0]
                                };
                                if (args.length > 1) {
                                    counter.format = args[1];
                                }
                                tokens.push(counter);
                            }
                            break;

                        case 'counters':
                            if (args.length > 0) {
                                const counters: Token = {
                                    type: TOKEN_TYPE.COUNTERS,
                                    name: args[0]
                                };
                                if (args.length > 1) {
                                    counters.glue = args[1];
                                }
                                if (args.length > 2) {
                                    counters.format = args[2];
                                }
                                tokens.push(counters);
                            }
                            break;

                        case 'url':
                            if (args.length > 0) {
                                tokens.push({type: TOKEN_TYPE.URL, value: args[0]});
                            }
                            break;
                    }

                    isFunction = false;
                    str = '';
                }
                break;

            case ',':
                if (isString) {
                    str += c;
                } else if (isFunction) {
                    args.push(str);
                    str = '';
                }
                break;

            case ' ':
            case '\t':
                if (isString) {
                    str += c;
                } else if (str) {
                    addOtherToken(tokens, str);
                    str = '';
                }
                break;

            default:
                str += c;
        }

        if (c !== '\\') {
            isEscaped = false;
        }
    }

    if (str) {
        addOtherToken(tokens, str);
    }

    if (cache) {
        cache[content] = tokens;
    }

    return tokens;
};

const addOtherToken = (tokens: Array<Token>, identifier: string): void => {
    switch (identifier) {
        case 'open-quote':
            tokens.push({type: TOKEN_TYPE.OPENQUOTE});
            break;
        case 'close-quote':
            tokens.push({type: TOKEN_TYPE.CLOSEQUOTE});
            break;
    }
};

const getQuote = (style: CSSStyleDeclaration, isOpening: boolean, quoteDepth: number): string => {
    const quotes = style.quotes ? style.quotes.split(/\s+/) : ["'\"'", "'\"'"];
    let idx = quoteDepth * 2;
    if (idx >= quotes.length) {
        idx = quotes.length - 2;
    }
    if (!isOpening) {
        ++idx;
    }
    return quotes[idx].replace(/^["']|["']$/g, '');
};

const formatCounterValue = (counter, glue: ?string, format: ?string): string => {
    const len = counter.length;
    let result = '';

    for (let i = 0; i < len; i++) {
        if (i > 0) {
            result += glue || '';
        }
        result += createCounterText(counter[i], parseListStyleType(format || 'decimal'), false);
    }

    return result;
};
