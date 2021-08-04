import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';

export class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(context: Context, img: HTMLImageElement) {
        super(context, img);
        this.src = img.currentSrc || img.src;
        this.intrinsicWidth = img.naturalWidth;
        this.intrinsicHeight = img.naturalHeight;
        this.context.cache.addImage(this.src);
    }
}
