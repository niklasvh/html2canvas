import {
    RGBColor,
    contrastRGB,
    hueRotateRGB,
    grayscaleRGB,
    brightnessRGB,
    invertRGB,
    saturateRGB,
    sepiaRGB
} from '../css/types/color';
import {Filter, FilterItem} from '../css/property-descriptors/filter';
import {stackBlurImage} from '../css/types/functions/stack-blur';

export const processImage = (img: HTMLImageElement, filter: Filter) => {
    return new Promise((resolve, reject) => {
        if (!img || !('naturalWidth' in img)) {
            return resolve();
        }

        const w = img['naturalWidth'];
        const h = img['naturalHeight'];

        const canvas = document.createElement('canvas');
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width = w * 2;
        canvas.height = h * 2;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        context.clearRect(0, 0, w, h);
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, w, h);

        let imageData: ImageData = context.getImageData(0, 0, w, h);

        handlePerPixel(imageData, filter);

        let blurFilter = filter.find((item: FilterItem) => item.name === 'blur');

        if (blurFilter) {
            imageData = stackBlurImage(imageData, w, h, blurFilter.value.number * 2, 1);
        }
        context.putImageData(imageData, 0, 0);
        img.crossOrigin = 'anonymous';
        img.src = canvas.toDataURL();
        img.onload = () => resolve(img);
        img.onerror = reject;

        if (img.complete === true) {
            // Inline XML images may fail to parse, throwing an Error later on
            setTimeout(() => resolve(img), 500);
        }
    });
};

function handlePerPixel(imageData: ImageData, filter: Filter) {
    for (let _j = 0; _j < imageData.height; _j++) {
        for (let _i = 0; _i < imageData.width; _i++) {
            let index = _j * 4 * imageData.width + _i * 4;
            let rgb: RGBColor = {
                r: imageData.data[index],
                g: imageData.data[index + 1],
                b: imageData.data[index + 2]
            };
            filter.forEach((item: FilterItem) => {
                switch (item.name) {
                    case 'contrast':
                        rgb = contrastRGB(rgb, item.value.number);
                        break;
                    case 'hue-rotate':
                        rgb = hueRotateRGB(rgb, item.value.number);
                        break;
                    case 'grayscale':
                        rgb = grayscaleRGB(rgb, item.value.number);
                        break;
                    case 'brightness':
                        rgb = brightnessRGB(rgb, item.value.number);
                        break;
                    case 'invert':
                        rgb = invertRGB(rgb, item.value.number);
                        break;
                    case 'saturate':
                        rgb = saturateRGB(rgb, item.value.number);
                        break;
                    case 'sepia':
                        rgb = sepiaRGB(rgb, item.value.number);
                        break;
                    default:
                        break;
                }
            });

            imageData.data[index] = rgb.r;
            imageData.data[index + 1] = rgb.g;
            imageData.data[index + 2] = rgb.b;
        }
    }
}

export const isSupportedFilter = (ctx: CanvasRenderingContext2D) => 'filter' in ctx;
