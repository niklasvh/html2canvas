import {ElementContainer} from '../element-container';
import {CacheStorage} from '../../core/cache-storage';
import {Context} from '../../context';

export class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(context: Context, img: HTMLImageElement) {
        super(context, img);
        this.src = img.currentSrc || img.src;
        this.intrinsicWidth = img.naturalWidth;
        this.intrinsicHeight = img.naturalHeight;
        CacheStorage.getInstance().addImage(this.src);
    }
}
