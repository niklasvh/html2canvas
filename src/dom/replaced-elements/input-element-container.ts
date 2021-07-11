import {ElementContainer} from '../element-container';
import {BORDER_STYLE} from '../../css/property-descriptors/border-style';
import {BACKGROUND_CLIP} from '../../css/property-descriptors/background-clip';
import {BACKGROUND_ORIGIN} from '../../css/property-descriptors/background-origin';
import {TokenType} from '../../css/syntax/tokenizer';
import {LengthPercentageTuple} from '../../css/types/length-percentage';
import {Bounds} from '../../css/layout/bounds';

const CHECKBOX_BORDER_RADIUS: LengthPercentageTuple = [
    {
        type: TokenType.DIMENSION_TOKEN,
        flags: 0,
        unit: 'px',
        number: 3
    }
];

const RADIO_BORDER_RADIUS: LengthPercentageTuple = [
    {
        type: TokenType.PERCENTAGE_TOKEN,
        flags: 0,
        number: 50
    }
];

const reformatInputBounds = (bounds: Bounds): Bounds => {
    if (bounds.width > bounds.height) {
        return new Bounds(bounds.left + (bounds.width - bounds.height) / 2, bounds.top, bounds.height, bounds.height);
    } else if (bounds.width < bounds.height) {
        return new Bounds(bounds.left, bounds.top + (bounds.height - bounds.width) / 2, bounds.width, bounds.width);
    }
    return bounds;
};

const getInputValue = (node: HTMLInputElement): string => {
    const value = node.type === PASSWORD ? new Array(node.value.length + 1).join('\u2022') : node.value;

    return value.length === 0 ? node.placeholder || '' : value;
};

export const CHECKBOX = 'checkbox';
export const RADIO = 'radio';
export const PASSWORD = 'password';
export const INPUT_COLOR = 0x2a2a2aff;

export class InputElementContainer extends ElementContainer {
    readonly type: string;
    readonly checked: boolean;
    readonly value: string;

    constructor(input: HTMLInputElement) {
        super(input);
        this.type = input.type.toLowerCase();
        this.checked = input.checked;
        this.value = getInputValue(input);

        if (this.type === CHECKBOX || this.type === RADIO) {
            this.styles.backgroundColor = 0xdededeff;
            this.styles.borderTopColor =
                this.styles.borderRightColor =
                this.styles.borderBottomColor =
                this.styles.borderLeftColor =
                    0xa5a5a5ff;
            this.styles.borderTopWidth =
                this.styles.borderRightWidth =
                this.styles.borderBottomWidth =
                this.styles.borderLeftWidth =
                    1;
            this.styles.borderTopStyle =
                this.styles.borderRightStyle =
                this.styles.borderBottomStyle =
                this.styles.borderLeftStyle =
                    BORDER_STYLE.SOLID;
            this.styles.backgroundClip = [BACKGROUND_CLIP.BORDER_BOX];
            this.styles.backgroundOrigin = [BACKGROUND_ORIGIN.BORDER_BOX];
            this.bounds = reformatInputBounds(this.bounds);
        }

        switch (this.type) {
            case CHECKBOX:
                this.styles.borderTopRightRadius =
                    this.styles.borderTopLeftRadius =
                    this.styles.borderBottomRightRadius =
                    this.styles.borderBottomLeftRadius =
                        CHECKBOX_BORDER_RADIUS;
                break;
            case RADIO:
                this.styles.borderTopRightRadius =
                    this.styles.borderTopLeftRadius =
                    this.styles.borderBottomRightRadius =
                    this.styles.borderBottomLeftRadius =
                        RADIO_BORDER_RADIUS;
                break;
        }
    }
}
