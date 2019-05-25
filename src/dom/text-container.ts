import {CSSParsedDeclaration} from '../css/index';
import {TEXT_TRANSFORM} from '../css/property-descriptors/text-transform';
import {parseTextBounds, TextBounds} from '../css/layout/text';

export class TextContainer {
    text: string;
    textBounds: TextBounds[];

    constructor(node: Text, styles: CSSParsedDeclaration) {
        this.text = transform(node.data, styles.textTransform);
        this.textBounds = parseTextBounds(this.text, styles, node);
    }
}

const transform = (text: string, transform: TEXT_TRANSFORM) => {
    switch (transform) {
        case TEXT_TRANSFORM.LOWERCASE:
            return text.toLowerCase();
        case TEXT_TRANSFORM.CAPITALIZE:
            return text.replace(CAPITALIZE, capitalize);
        case TEXT_TRANSFORM.UPPERCASE:
            return text.toUpperCase();
        default:
            return text;
    }
};

const CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;

const capitalize = (m: string, p1: string, p2: string) => {
    if (m.length > 0) {
        return p1 + p2.toUpperCase();
    }

    return m;
};
