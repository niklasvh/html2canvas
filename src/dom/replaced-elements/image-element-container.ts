import {ElementContainer} from '../element-container';
import {CacheStorage} from '../../core/cache-storage';
import {NO_COMPUTE_STYLES} from '../document-cloner';
import {CSSParsedDeclaration} from '../../css';

export class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(img: HTMLImageElement) {
        if (img.title === NO_COMPUTE_STYLES) {
            super(img, new CSSParsedDeclaration(img.style));
        } else {
            super(img);
        }
        this.src = img.currentSrc || img.src;
        this.intrinsicWidth = img.naturalWidth;
        this.intrinsicHeight = img.naturalHeight;
        CacheStorage.getInstance().addImage(this.src);
    }
}
