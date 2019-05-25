const testRangeBounds = (document: Document) => {
    const TEST_HEIGHT = 123;

    if (document.createRange) {
        const range = document.createRange();
        if (range.getBoundingClientRect) {
            const testElement = document.createElement('boundtest');
            testElement.style.height = `${TEST_HEIGHT}px`;
            testElement.style.display = 'block';
            document.body.appendChild(testElement);

            range.selectNode(testElement);
            const rangeBounds = range.getBoundingClientRect();
            const rangeHeight = Math.round(rangeBounds.height);
            document.body.removeChild(testElement);
            if (rangeHeight === TEST_HEIGHT) {
                return true;
            }
        }
    }

    return false;
};

const testCORS = (): boolean => typeof new Image().crossOrigin !== 'undefined';

const testResponseType = (): boolean => typeof new XMLHttpRequest().responseType === 'string';

const testSVG = (document: Document): boolean => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return false;
    }

    img.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>`;

    try {
        ctx.drawImage(img, 0, 0);
        canvas.toDataURL();
    } catch (e) {
        return false;
    }
    return true;
};

const isGreenPixel = (data: Uint8ClampedArray): boolean =>
    data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;

const testForeignObject = (document: Document): Promise<boolean> => {
    const canvas = document.createElement('canvas');
    const size = 100;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return Promise.reject(false);
    }
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(0, 0, size, size);

    const img = new Image();
    const greenImageSrc = canvas.toDataURL();
    img.src = greenImageSrc;
    const svg = createForeignObjectSVG(size, size, 0, 0, img);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, size, size);

    return loadSerializedSVG(svg)
        .then((img: HTMLImageElement) => {
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, size, size).data;
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, size, size);

            const node = document.createElement('div');
            node.style.backgroundImage = `url(${greenImageSrc})`;
            node.style.height = `${size}px`;
            // Firefox 55 does not render inline <img /> tags
            return isGreenPixel(data)
                ? loadSerializedSVG(createForeignObjectSVG(size, size, 0, 0, node))
                : Promise.reject(false);
        })
        .then((img: HTMLImageElement) => {
            ctx.drawImage(img, 0, 0);
            // Edge does not render background-images
            return isGreenPixel(ctx.getImageData(0, 0, size, size).data);
        })
        .catch(() => false);
};

export const createForeignObjectSVG = (width: number, height: number, x: number, y: number, node: Node) => {
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    const foreignObject = document.createElementNS(xmlns, 'foreignObject');
    svg.setAttributeNS(null, 'width', width.toString());
    svg.setAttributeNS(null, 'height', height.toString());

    foreignObject.setAttributeNS(null, 'width', '100%');
    foreignObject.setAttributeNS(null, 'height', '100%');
    foreignObject.setAttributeNS(null, 'x', x.toString());
    foreignObject.setAttributeNS(null, 'y', y.toString());
    foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
    svg.appendChild(foreignObject);

    foreignObject.appendChild(node);

    return svg;
};

export const loadSerializedSVG = (svg: Node): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;

        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    });
};

export const FEATURES = {
    get SUPPORT_RANGE_BOUNDS() {
        'use strict';
        const value = testRangeBounds(document);
        Object.defineProperty(FEATURES, 'SUPPORT_RANGE_BOUNDS', {value});
        return value;
    },
    get SUPPORT_SVG_DRAWING() {
        'use strict';
        const value = testSVG(document);
        Object.defineProperty(FEATURES, 'SUPPORT_SVG_DRAWING', {value});
        return value;
    },
    get SUPPORT_FOREIGNOBJECT_DRAWING() {
        'use strict';
        const value =
            typeof Array.from === 'function' && typeof window.fetch === 'function'
                ? testForeignObject(document)
                : Promise.resolve(false);
        Object.defineProperty(FEATURES, 'SUPPORT_FOREIGNOBJECT_DRAWING', {value});
        return value;
    },
    get SUPPORT_CORS_IMAGES() {
        'use strict';
        const value = testCORS();
        Object.defineProperty(FEATURES, 'SUPPORT_CORS_IMAGES', {value});
        return value;
    },
    get SUPPORT_RESPONSE_TYPE() {
        'use strict';
        const value = testResponseType();
        Object.defineProperty(FEATURES, 'SUPPORT_RESPONSE_TYPE', {value});
        return value;
    },
    get SUPPORT_CORS_XHR() {
        'use strict';
        const value = 'withCredentials' in new XMLHttpRequest();
        Object.defineProperty(FEATURES, 'SUPPORT_CORS_XHR', {value});
        return value;
    }
};
