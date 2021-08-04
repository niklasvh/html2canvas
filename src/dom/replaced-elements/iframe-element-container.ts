import {ElementContainer} from '../element-container';
import {parseTree} from '../node-parser';
import {Color, parseColor, COLORS, isTransparent} from '../../css/types/color';
import {Context} from '../../core/context';

export class IFrameElementContainer extends ElementContainer {
    src: string;
    width: number;
    height: number;
    tree?: ElementContainer;
    backgroundColor: Color;

    constructor(context: Context, iframe: HTMLIFrameElement) {
        super(context, iframe);
        this.src = iframe.src;
        this.width = parseInt(iframe.width, 10) || 0;
        this.height = parseInt(iframe.height, 10) || 0;
        this.backgroundColor = this.styles.backgroundColor;
        try {
            if (
                iframe.contentWindow &&
                iframe.contentWindow.document &&
                iframe.contentWindow.document.documentElement
            ) {
                this.tree = parseTree(context, iframe.contentWindow.document.documentElement);

                // http://www.w3.org/TR/css3-background/#special-backgrounds
                const documentBackgroundColor = iframe.contentWindow.document.documentElement
                    ? parseColor(
                          context,
                          getComputedStyle(iframe.contentWindow.document.documentElement).backgroundColor as string
                      )
                    : COLORS.TRANSPARENT;
                const bodyBackgroundColor = iframe.contentWindow.document.body
                    ? parseColor(
                          context,
                          getComputedStyle(iframe.contentWindow.document.body).backgroundColor as string
                      )
                    : COLORS.TRANSPARENT;

                this.backgroundColor = isTransparent(documentBackgroundColor)
                    ? isTransparent(bodyBackgroundColor)
                        ? this.styles.backgroundColor
                        : bodyBackgroundColor
                    : documentBackgroundColor;
            }
        } catch (e) {}
    }
}
