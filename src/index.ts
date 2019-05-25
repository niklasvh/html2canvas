import {Bounds, parseBounds, parseDocumentSize} from './css/layout/bounds';
import {color, Color, COLORS, isTransparent} from './css/types/color';
import {Parser} from './css/syntax/parser';
import {CloneOptions, DocumentCloner} from './dom/document-cloner';
import {isBodyElement, isHTMLElement, parseTree} from './dom/node-parser';
import {Logger} from './core/logger';
import {CacheStorage} from './core/cache-storage';
import {CanvasRenderer, RenderOptions} from './render/canvas/canvas-renderer';
import {ForeignObjectRenderer} from './render/canvas/foreignobject-renderer';

export type Options = CloneOptions &
    RenderOptions & {
        allowTaint: boolean;
        backgroundColor: string;
        foreignObjectRendering: boolean;
        imageTimeout: number;
        logging: boolean;
        proxy?: string;
        removeContainer?: boolean;
        useCORS: boolean;
    };

const parseColor = (value: string): Color => color.parse(Parser.create(value).parseComponentValue());

const html2canvas = (element: HTMLElement, options: Options): Promise<HTMLCanvasElement> => {
    return renderElement(element, options);
};

export default html2canvas;

CacheStorage.setContext(window);

const renderElement = async (element: HTMLElement, opts: Options): Promise<HTMLCanvasElement> => {
    const ownerDocument = element.ownerDocument;

    if (!ownerDocument) {
        throw new Error(`Element is not attached to a Document`);
    }

    const defaultView = ownerDocument.defaultView;

    if (!defaultView) {
        throw new Error(`Document is not attached to a Window`);
    }

    const defaultOptions = {
        allowTaint: false,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        logging: true,
        proxy: undefined,
        removeContainer: true,
        foreignObjectRendering: false,
        scale: defaultView.devicePixelRatio || 1,
        useCORS: false,
        windowWidth: defaultView.innerWidth,
        windowHeight: defaultView.innerHeight,
        scrollX: defaultView.pageXOffset,
        scrollY: defaultView.pageYOffset
    };

    const options: Options = {...defaultOptions, ...opts};

    const windowBounds = new Bounds(options.scrollX, options.scrollY, options.windowWidth, options.windowHeight);

    // http://www.w3.org/TR/css3-background/#special-backgrounds
    const documentBackgroundColor = ownerDocument.documentElement
        ? parseColor(getComputedStyle(ownerDocument.documentElement).backgroundColor as string)
        : COLORS.TRANSPARENT;
    const bodyBackgroundColor = ownerDocument.body
        ? parseColor(getComputedStyle(ownerDocument.body).backgroundColor as string)
        : COLORS.TRANSPARENT;

    const backgroundColor =
        element === ownerDocument.documentElement
            ? isTransparent(documentBackgroundColor)
                ? isTransparent(bodyBackgroundColor)
                    ? options.backgroundColor
                        ? parseColor(options.backgroundColor)
                        : null
                    : bodyBackgroundColor
                : documentBackgroundColor
            : options.backgroundColor
            ? parseColor(options.backgroundColor)
            : null;

    const instanceName = (Math.round(Math.random() * 1000) + Date.now()).toString(16);
    Logger.create(instanceName);
    const cache = CacheStorage.create(instanceName, options);
    Logger.getInstance(instanceName).debug(`Starting document clone`);
    const documentCloner = new DocumentCloner(element, {
        id: instanceName,
        onclone: options.onclone,
        ignoreElements: options.ignoreElements,
        inlineImages: options.foreignObjectRendering,
        copyStyles: options.foreignObjectRendering
    });
    const clonedElement = documentCloner.clonedReferenceElement;
    if (!clonedElement) {
        return Promise.reject(`Unable to find element in cloned iframe`);
    }

    const container = await documentCloner.toIFrame(ownerDocument, windowBounds);

    const {width, height, left, top} =
        isBodyElement(clonedElement) || isHTMLElement(clonedElement)
            ? parseDocumentSize(ownerDocument)
            : parseBounds(clonedElement);

    const renderOptions = {
        id: instanceName,
        cache,
        backgroundColor,
        scale: options.scale,
        x: typeof options.x === 'number' ? options.x : left,
        y: typeof options.y === 'number' ? options.y : top,
        scrollX: options.scrollX,
        scrollY: options.scrollY,
        width: typeof options.width === 'number' ? options.width : Math.ceil(width),
        height: typeof options.height === 'number' ? options.height : Math.ceil(height),
        windowWidth: options.windowWidth,
        windowHeight: options.windowHeight
    };

    let canvas;

    if (options.foreignObjectRendering) {
        Logger.getInstance(instanceName).debug(`Document cloned, using foreign object rendering`);
        const renderer = new ForeignObjectRenderer(renderOptions);
        canvas = await renderer.render(clonedElement);
    } else {
        Logger.getInstance(instanceName).debug(`Document cloned, using computed rendering`);

        CacheStorage.attachInstance(cache);
        Logger.getInstance(instanceName).debug(`Starting DOM parsing`);
        const root = parseTree(clonedElement);
        CacheStorage.detachInstance();

        if (backgroundColor === root.styles.backgroundColor) {
            root.styles.backgroundColor = COLORS.TRANSPARENT;
        }

        Logger.getInstance(instanceName).debug(`Starting renderer`);

        const renderer = new CanvasRenderer(renderOptions);
        canvas = await renderer.render(root);
    }

    if (options.removeContainer === true) {
        if (!cleanContainer(container)) {
            Logger.getInstance(instanceName).error(`Cannot detach cloned iframe as it is not in the DOM anymore`);
        }
    }

    Logger.getInstance(instanceName).debug(`Finished rendering`);
    Logger.destroy(instanceName);
    CacheStorage.destroy(instanceName);
    return canvas;
};

const cleanContainer = (container: HTMLIFrameElement): boolean => {
    if (container.parentNode) {
        container.parentNode.removeChild(container);
        return true;
    }
    return false;
};
