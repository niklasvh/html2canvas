import {Context} from '../../core/context';

export class Bounds {
    constructor(readonly left: number, readonly top: number, readonly width: number, readonly height: number) {}

    add(x: number, y: number, w: number, h: number): Bounds {
        return new Bounds(this.left + x, this.top + y, this.width + w, this.height + h);
    }

    static fromClientRect(context: Context, clientRect: ClientRect): Bounds {
        return new Bounds(
            clientRect.left + context.windowBounds.left,
            clientRect.top + context.windowBounds.top,
            clientRect.width,
            clientRect.height
        );
    }

    static fromDOMRectList(context: Context, domRectList: DOMRectList): Bounds {
        const domRect = Array.from(domRectList).find((rect) => rect.width !== 0);
        return domRect
            ? new Bounds(
                  domRect.left + context.windowBounds.left,
                  domRect.top + context.windowBounds.top,
                  domRect.width,
                  domRect.height
              )
            : Bounds.EMPTY;
    }

    static EMPTY = new Bounds(0, 0, 0, 0);
}

export const parseBounds = (context: Context, node: Element): Bounds => {
    return Bounds.fromClientRect(context, node.getBoundingClientRect());
};

export const parseDocumentSize = (document: Document): Bounds => {
    const body = document.body;
    const documentElement = document.documentElement;

    if (!body || !documentElement) {
        throw new Error(`Unable to get document size`);
    }
    const width = Math.max(
        Math.max(body.scrollWidth, documentElement.scrollWidth),
        Math.max(body.offsetWidth, documentElement.offsetWidth),
        Math.max(body.clientWidth, documentElement.clientWidth)
    );

    const height = Math.max(
        Math.max(body.scrollHeight, documentElement.scrollHeight),
        Math.max(body.offsetHeight, documentElement.offsetHeight),
        Math.max(body.clientHeight, documentElement.clientHeight)
    );

    return new Bounds(0, 0, width, height);
};
