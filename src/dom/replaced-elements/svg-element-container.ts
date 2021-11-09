import {ElementContainer} from '../element-container';
import {parseBounds} from '../../css/layout/bounds';
import {Context} from '../../core/context';

export class SVGElementContainer extends ElementContainer {
    svg: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(context: Context, img: SVGSVGElement) {
        super(context, img);
        const s = new XMLSerializer();
        const bounds = parseBounds(context, img);
        img.setAttribute('width', `${bounds.width}px`);
        img.setAttribute('height', `${bounds.height}px`);

        this.svg = `data:image/svg+xml,${encodeURIComponent(s.serializeToString(img))}`;
        this.intrinsicWidth = img.width.baseVal.value;
        this.intrinsicHeight = img.height.baseVal.value;

        this.context.cache.addImage(this.svg);
    }
}
