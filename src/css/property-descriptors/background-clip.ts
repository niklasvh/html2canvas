import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
export enum BACKGROUND_CLIP {
    BORDER_BOX = 0,
    PADDING_BOX = 1,
    CONTENT_BOX = 2
}

export type BackgroundClip = BACKGROUND_CLIP[];

export const backgroundClip: IPropertyListDescriptor<BackgroundClip> = {
    name: 'background-clip',
    initialValue: 'border-box',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens: CSSValue[]): BackgroundClip => {
        return tokens.map((token) => {
            if (isIdentToken(token)) {
                switch (token.value) {
                    case 'padding-box':
                        return BACKGROUND_CLIP.PADDING_BOX;
                    case 'content-box':
                        return BACKGROUND_CLIP.CONTENT_BOX;
                }
            }
            return BACKGROUND_CLIP.BORDER_BOX;
        });
    }
};
