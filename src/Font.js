/* @flow */
'use strict';

import type {Font} from './parsing/font';

const SAMPLE_TEXT = 'Hidden Text';
import {SMALL_IMAGE} from './Util';

export class FontMetrics {
    _data: {};
    _document: Document;

    constructor(document: Document) {
        this._data = {};
        this._document = document;
    }
    _parseMetrics(font: Font) {
        const container = this._document.createElement('div');
        const img = this._document.createElement('img');
        const span = this._document.createElement('span');

        const body = this._document.body;
        if (!body) {
            throw new Error(__DEV__ ? 'No document found for font metrics' : '');
        }

        container.style.visibility = 'hidden';
        container.style.fontFamily = font.fontFamily;
        container.style.fontSize = font.fontSize;
        container.style.margin = '0';
        container.style.padding = '0';

        body.appendChild(container);

        img.src = SMALL_IMAGE;
        img.width = 1;
        img.height = 1;

        img.style.margin = '0';
        img.style.padding = '0';
        img.style.verticalAlign = 'baseline';

        span.style.fontFamily = font.fontFamily;
        span.style.fontSize = font.fontSize;
        span.style.margin = '0';
        span.style.padding = '0';

        span.appendChild(this._document.createTextNode(SAMPLE_TEXT));
        container.appendChild(span);
        container.appendChild(img);
        const baseline = img.offsetTop - span.offsetTop + 2;

        container.removeChild(span);
        container.appendChild(this._document.createTextNode(SAMPLE_TEXT));

        container.style.lineHeight = 'normal';
        img.style.verticalAlign = 'super';

        const middle = img.offsetTop - container.offsetTop + 2;

        body.removeChild(container);

        return {baseline, middle};
    }
    getMetrics(font: Font) {
        const key = `${font.fontFamily} ${font.fontSize}`;
        if (this._data[key] === undefined) {
            this._data[key] = this._parseMetrics(font);
        }

        return this._data[key];
    }
}
