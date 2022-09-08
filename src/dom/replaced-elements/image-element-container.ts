import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';
import {serializeSvg, deserializeSvg} from '../../core/features';

export class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number = 0;
    intrinsicHeight: number = 0;
    isSVG: boolean;

    private static SVG = /\.svg$/i;
    private static INLINED_SVG = /^data:image\/svg\+xml/i;
    private static IS_FIRE_FOX = /firefox/i.test(navigator?.userAgent);

    constructor(context: Context, img: HTMLImageElement) {
        super(context, img);
        this.src = img.currentSrc || img.src;
        this.isSVG = this.isSvg() || this.isInlinedSvg();
        this.context.cache.addImage(this.src);
    }

    private isInlinedSvg = () => ImageElementContainer.INLINED_SVG.test(this.src);
    private isSvg = () => ImageElementContainer.SVG.test(this.src);

    public setup(img: HTMLImageElement) {
        if (this.isSvg()) return;

        if (this.isInlinedSvg()) {
            const [, inlinedSvg] = this.src.split(',');
            const svgElement = deserializeSvg(inlinedSvg);
            const {
                width: {baseVal: widthBaseVal},
                height: {baseVal: heightBaseVal}
            } = svgElement;

            if (ImageElementContainer.IS_FIRE_FOX) {
                widthBaseVal.valueAsString = widthBaseVal.value.toString();
                heightBaseVal.valueAsString = heightBaseVal.value.toString();
                img.src = serializeSvg(svgElement, 'base64');
            }

            this.intrinsicWidth = widthBaseVal.value;
            this.intrinsicHeight = heightBaseVal.value;
            return;
        }

        this.intrinsicWidth = img.naturalWidth;
        this.intrinsicHeight = img.naturalHeight;
    }
}
