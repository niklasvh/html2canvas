
import { CSSParsedDeclaration } from '../css/index';
import { isLinearGradient, isRadialGradient } from '../css/types/image';
import { BACKGROUND_CLIP } from '../css/property-descriptors/background-clip';

export const isFontColorGradient = (styles: CSSParsedDeclaration) => {
    if (styles.backgroundImage.length === 1 && (isLinearGradient(styles.backgroundImage[0]) || isRadialGradient(styles.backgroundImage[0]))) {
        return (styles.textFillColor === 0 || styles.color === 0) && styles.backgroundClip.length === 1 && styles.backgroundClip[0] === BACKGROUND_CLIP.TEXT;
    } else { 
        return false;
    }
}
