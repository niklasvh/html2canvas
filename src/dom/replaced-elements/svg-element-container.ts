import {ElementContainer} from '../element-container';
import {CacheStorage} from '../../core/cache-storage';

export class SVGElementContainer extends ElementContainer {
    svg: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(img: SVGSVGElement) {
        super(img);
        const percentValueTest: RegExp = /^[0-9]{1,3}\%$/i;

        const widthAttribute: string = img.getAttribute('width') || '';
        const widthStyle: string = img.style.width || '';
        const heightAttribute: string = img.getAttribute('width') || '';
        const heightStyle: string = img.style.width || '';

        if (
            percentValueTest.test(widthAttribute) ||
            percentValueTest.test(widthStyle) ||
            percentValueTest.test(heightAttribute) ||
            percentValueTest.test(heightStyle)
        ) {
            if (!img.clientWidth && !img.clientHeight && img.parentElement) {
                const parentStyle: CSSStyleDeclaration = window.getComputedStyle(img.parentElement);
                img.setAttribute('width', parentStyle.width || '100%');
                img.setAttribute('height', parentStyle.height || '100%');
            } else {
                img.setAttribute('width', img.clientWidth.toString());
                img.setAttribute('height', img.clientHeight.toString());
            }
        }

        const s = new XMLSerializer();
        this.svg = `data:image/svg+xml,${encodeURIComponent(s.serializeToString(img))}`;
        this.intrinsicWidth = img.width.baseVal.value;
        this.intrinsicHeight = img.height.baseVal.value;

        CacheStorage.getInstance().addImage(this.svg);
    }
}
