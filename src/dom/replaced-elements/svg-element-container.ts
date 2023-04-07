import {ElementContainer} from '../element-container';
import {parseBounds} from '../../css/layout/bounds';
import {Context} from '../../core/context';

export class SVGElementContainer extends ElementContainer {
    svg: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(context: Context, img: SVGSVGElement) {
        super(context, img)
        const s = new XMLSerializer()
        const bounds = parseBounds(context, img)
        let originPosition: string = img.style.position
        img.setAttribute('width', `${bounds.width}px`)
        img.setAttribute('height', `${bounds.height}px`)
        
        // fix: resolve missing svg serialized content
        // if svg's tag has absolute position, when converting through serializeToString, it will result in missing SVG content.
        // so, it is necessary to eliminate positioning before serialization.
        img.style.position = 'initial'

        this.svg = `data:image/svg+xml,${encodeURIComponent(s.serializeToString(img))}`
        
        // reset position
        img.style.position = originPosition
        
        this.intrinsicWidth = img.width.baseVal.value
        this.intrinsicHeight = img.height.baseVal.value

        this.context.cache.addImage(this.svg)
    }
}
