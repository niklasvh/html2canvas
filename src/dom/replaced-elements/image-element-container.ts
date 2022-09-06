import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';
import {serializeSvg, deserializeSvg} from '../../core/features';

export class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    private static INLINE_SVG = /^data:image\/svg\+xml/i;
    private static IS_FIRE_FOX = /firefox/i.test(navigator?.userAgent);

    constructor(context: Context, img: HTMLImageElement) {
        super(context, img);
        this.src = img.currentSrc || img.src;
        this.intrinsicWidth = img.naturalWidth;
        this.intrinsicHeight = img.naturalHeight;
        this.update();
        this.context.cache.addImage(this.src);
    }

    private update() {
        if (!this.intrinsicWidth || !this.intrinsicHeight || ImageElementContainer.IS_FIRE_FOX) {
            if (ImageElementContainer.INLINE_SVG.test(this.src)) {
                const [, inlinedSvg] = this.src.split(',');
                const svgElement = deserializeSvg(inlinedSvg);

                const {
                    width: {baseVal: widthBaseVal},
                    height: {baseVal: heightBaseVal}
                } = svgElement;
                widthBaseVal.valueAsString = widthBaseVal.value.toString();
                heightBaseVal.valueAsString = heightBaseVal.value.toString();
                this.src = serializeSvg(svgElement, 'base64');

                this.intrinsicWidth = widthBaseVal.value;
                this.intrinsicHeight = heightBaseVal.value;
                return;
            }
        }
    }
}
