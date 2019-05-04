import {ElementContainer} from '../element-container';
import {CacheStorage} from '../../core/cache-storage';

export class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(img: HTMLImageElement) {
        super(img);
        this.src = img.currentSrc || img.src;
        this.intrinsicWidth = img.naturalWidth;
        this.intrinsicHeight = img.naturalHeight;
        CacheStorage.getInstance().addImage(this.src);
    }
}
