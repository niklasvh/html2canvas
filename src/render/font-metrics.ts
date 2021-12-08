import {SMALL_IMAGE} from '../core/util';
export interface FontMetric {
    baseline: number;
    middle: number;
}

const SAMPLE_TEXT = 'Hidden Text';

export class FontMetrics {
    private readonly _data: {[key: string]: FontMetric};
    private readonly _document: Document;

    constructor(document: Document) {
        this._data = {};
        this._document = document;
    }

    private parseMetrics(font: string): FontMetric {
        const container = this._document.createElement('div');
        const img = this._document.createElement('img');
        const span = this._document.createElement('span');

        const body = this._document.body as HTMLBodyElement;

        container.style.visibility = 'hidden';
        container.style.font = font;
        container.style.margin = '0';
        container.style.padding = '0';

        body.appendChild(container);

        img.src = SMALL_IMAGE;
        img.width = 1;
        img.height = 1;

        img.style.margin = '0';
        img.style.padding = '0';
        img.style.verticalAlign = 'baseline';

        span.style.font = font;
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
    getMetrics(font: string): FontMetric {
        const key = font;
        if (typeof this._data[key] === 'undefined') {
            this._data[key] = this.parseMetrics(font);
        }

        return this._data[key];
    }
}
