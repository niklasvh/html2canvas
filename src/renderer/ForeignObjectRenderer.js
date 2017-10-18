import type {RenderOptions} from '../Renderer';

export default class ForeignObjectRenderer {
    options: RenderOptions;
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    render(options) {
        this.options = options;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = Math.floor(options.width) * options.scale;
        this.canvas.height = Math.floor(options.height) * options.scale;
        this.canvas.style.width = `${options.width}px`;
        this.canvas.style.height = `${options.height}px`;

        options.logger.log(
            `ForeignObject renderer initialized (${options.width}x${options.height} at ${options.x},${options.y}) with scale ${options.scale}`
        );
        const svg = createForeignObjectSVG(
            Math.max(options.windowWidth, options.width) * options.scale,
            Math.max(options.windowHeight, options.height) * options.scale,
            options.scrollX * options.scale,
            options.scrollY * options.scale,
            this.element
        );

        return loadSerializedSVG(svg).then(img => {
            if (options.backgroundColor) {
                this.ctx.fillStyle = options.backgroundColor.toString();
                this.ctx.fillRect(
                    0,
                    0,
                    options.width * options.scale,
                    options.height * options.scale
                );
            }

            this.ctx.drawImage(img, -options.x * options.scale, -options.y * options.scale);
            return this.canvas;
        });
    }
}

export const createForeignObjectSVG = (
    width: number,
    height: number,
    x: number,
    y: number,
    node: Node
) => {
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    const foreignObject = document.createElementNS(xmlns, 'foreignObject');
    svg.setAttributeNS(null, 'width', width);
    svg.setAttributeNS(null, 'height', height);

    foreignObject.setAttributeNS(null, 'width', '100%');
    foreignObject.setAttributeNS(null, 'height', '100%');
    foreignObject.setAttributeNS(null, 'x', x);
    foreignObject.setAttributeNS(null, 'y', y);
    foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
    svg.appendChild(foreignObject);

    foreignObject.appendChild(node);

    return svg;
};

export const loadSerializedSVG = (svg: Node) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;

        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            new XMLSerializer().serializeToString(svg)
        )}`;
    });
};
