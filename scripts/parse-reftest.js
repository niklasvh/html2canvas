const ACTION = /^\s*(\w+ ?\w*):\s+(.+)/;
const TEXT = /^\s*\[(-?\d+), (-?\d+)\]:\s+(.+)/;
const WINDOW_SIZE = /^\[(-?\d+), (-?\d+)\]$/;
const RECTANGLE = /^\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\s+(.+)$/;
const REPEAT = /^Image\s+\("(.+)"\)\s+\[(-?\d+), (-?\d+)\]\s+Size\s+\((-?\d+), (-?\d+)\)\s+(.+)$/;
const PATH = /^Path \((.+)\)$/;
const VECTOR = /^Vector\(x: (-?\d+), y: (-?\d+)\)$/;
const BEZIER_CURVE = /^BezierCurve\(x0: (-?\d+), y0: (-?\d+), x1: (-?\d+), y1: (-?\d+), cx0: (-?\d+), cy0: (-?\d+), cx1: (-?\d+), cy1: (-?\d+)\)$/;
const SHAPE = /^(rgba?\((:?.+)\)) (Path .+)$/;
const CIRCLE = /^(rgba?\((:?.+)\)) Circle\(x: (-?\d+), y: (-?\d+), r: (-?\d+)\)$/;
const IMAGE = /^Image\s+\("(.+)"\)\s+\(source:\s+\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\)\s+\(destination:\s+\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\)$/;
const CANVAS = /^(Canvas)\s+\(source:\s+\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\)\s+\(destination:\s+\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\)$/;
const GRADIENT = /^\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\s+linear-gradient\(x0: (-?\d+), x1: (-?\d+), y0: (-?\d+), y1: (-?\d+) (.+)\)$/;
const TRANSFORM = /^\((-?\d+), (-?\d+)\) \[(.+)\]$/;

function parsePath(path) {
    const parts = path.match(PATH)[1];
    return parts.split(' > ').map(p => {
        const vector = p.match(VECTOR);
        if (vector) {
            return {
                type: 'Vector',
                x: parseInt(vector[1], 10),
                y: parseInt(vector[2], 10)
            };
        } else {
            const bezier = p.match(BEZIER_CURVE);
            return {
                type: 'BezierCurve',
                x0: parseInt(bezier[1], 10),
                y0: parseInt(bezier[2], 10),
                x1: parseInt(bezier[3], 10),
                y1: parseInt(bezier[4], 10),
                cx0: parseInt(bezier[5], 10),
                cy0: parseInt(bezier[6], 10),
                cx1: parseInt(bezier[7], 10),
                cy1: parseInt(bezier[8], 10)
            };
        }
    });
}

function parseRefTest(txt) {
    return txt.split(/\n/g).filter(l => l.length > 0).map((l, i) => {
        const parseAction = l.match(ACTION);
        if (!parseAction) {
            const text = l.match(TEXT);
            return {
                action: 'T',
                x: parseInt(text[1], 10),
                y: parseInt(text[2], 10),
                text: text[3],
                line: i + 1
            };
        }
        const args = parseAction[2];

        const data = {
            action: parseAction[1],
            line: i + 1
        };

        switch (data.action) {
            case 'Opacity':
                data.opacity = parseFloat(args);
                break;
            case 'Fill':
                data.color = args;
                break;
            case 'Clip':
                data.path = args.split(' | ').map(path => parsePath(path));
                break;
            case 'Window':
                const windowSize = args.match(WINDOW_SIZE);
                data.width = parseInt(windowSize[1], 10);
                data.height = parseInt(windowSize[2], 10);
                break;
            case 'Rectangle':
                const rectangle = args.match(RECTANGLE);
                data.x = parseInt(rectangle[1], 10);
                data.y = parseInt(rectangle[2], 10);
                data.width = parseInt(rectangle[3], 10);
                data.height = parseInt(rectangle[4], 10);
                data.color = rectangle[5];
                break;
            case 'Repeat':
                const repeat = args.match(REPEAT);
                data.imageSrc = repeat[1];
                data.x = parseInt(repeat[2], 10);
                data.y = parseInt(repeat[3], 10);
                data.width = parseInt(repeat[4], 10);
                data.height = parseInt(repeat[5], 10);
                data.path = parsePath(repeat[6]);
                break;
            case 'Shape':
                const shape = args.match(SHAPE);
                if (!shape) {
                    const circle = args.match(CIRCLE);
                    data.color = circle[1];
                    data.path = [
                        {
                            type: 'Circle',
                            x: parseInt(circle[2], 10),
                            y: parseInt(circle[3], 10),
                            r: parseInt(circle[4], 10)
                        }
                    ];
                } else {
                    data.color = shape[1];
                    data.path = parsePath(shape[3]);
                }
                break;
            case 'Text':
                data.font = args;
                break;
            case 'Draw image':
                const image = args.match(IMAGE) ? args.match(IMAGE) : args.match(CANVAS);
                data.imageSrc = image[1];
                data.sx = parseInt(image[2], 10);
                data.xy = parseInt(image[3], 10);
                data.sw = parseInt(image[4], 10);
                data.sh = parseInt(image[5], 10);
                data.dx = parseInt(image[6], 10);
                data.dy = parseInt(image[7], 10);
                data.dw = parseInt(image[8], 10);
                data.dh = parseInt(image[9], 10);
                break;
            case 'Gradient':
                const gradient = args.match(GRADIENT);
                data.x = parseInt(gradient[1], 10);
                data.y = parseInt(gradient[2], 10);
                data.width = parseInt(gradient[3], 10);
                data.height = parseInt(gradient[4], 10);
                data.x0 = parseInt(gradient[5], 10);
                data.x1 = parseInt(gradient[6], 10);
                data.y0 = parseInt(gradient[7], 10);
                data.y1 = parseInt(gradient[8], 10);
                data.stops = gradient[9];
                break;
            case 'Transform':
                const transform = args.match(TRANSFORM);
                data.x = parseInt(transform[1], 10);
                data.y = parseInt(transform[2], 10);
                data.matrix = transform[3];
                break;
            default:
                console.log(args);
                throw new Error('Unhandled action ' + data.action);
        }

        return data;
    });
}

module.exports = parseRefTest;
