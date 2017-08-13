/* @flow */
'use strict';

const testRangeBounds = document => {
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

// iOS 10.3 taints canvas with base64 images unless crossOrigin = 'anonymous'
const testBase64 = (document: Document): Promise<boolean> => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return new Promise(resolve => {
        // Single pixel base64 image renders fine on iOS 10.3???
        // TODO add a smaller base64 image that still fails on iOS 10.3
        img.src = "data:image/jpeg;base64,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";

        const onload = () => {
            try {
                ctx.drawImage(img, 0, 0);
                canvas.toDataURL();
            } catch (e) {
                return resolve(false);
            }

            return resolve(true);
        };

        img.onload = onload;

        if (img.complete === true) {
            setTimeout(() => {
                onload();
            }, 500);
        }
    });
};

const testSVG = document => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>`;

    try {
        ctx.drawImage(img, 0, 0);
        canvas.toDataURL();
    } catch (e) {
        return false;
    }
    return true;
};

const FEATURES = {
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_RANGE_BOUNDS() {
        'use strict';
        const value = testRangeBounds(document);
        Object.defineProperty(FEATURES, 'SUPPORT_RANGE_BOUNDS', {value});
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_SVG_DRAWING() {
        'use strict';
        const value = testSVG(document);
        Object.defineProperty(FEATURES, 'SUPPORT_SVG_DRAWING', {value});
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_BASE64_DRAWING() {
        'use strict';
        const value = testBase64(document);
        Object.defineProperty(FEATURES, 'SUPPORT_BASE64_DRAWING', {value});
        return value;
    }
};

export default FEATURES;
