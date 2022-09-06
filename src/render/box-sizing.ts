import {getAbsoluteValue} from '../css/types/length-percentage';
import {Bounds} from '../css/layout/bounds';
import {ElementContainer} from '../dom/element-container';

export const paddingBox = (element: ElementContainer): Bounds[] => {
    const styles = element.styles;
    return element.bounds.map((bound) => {
        return bound.add(
            styles.borderLeftWidth,
            styles.borderTopWidth,
            -(styles.borderRightWidth + styles.borderLeftWidth),
            -(styles.borderTopWidth + styles.borderBottomWidth)
        );
    });
};

export const contentBox = (element: ElementContainer): Bounds[] => {
    const styles = element.styles;
    return element.bounds.map((bound) => {
        const paddingLeft = getAbsoluteValue(styles.paddingLeft, bound.width);
        const paddingRight = getAbsoluteValue(styles.paddingRight, bound.width);
        const paddingTop = getAbsoluteValue(styles.paddingTop, bound.width);
        const paddingBottom = getAbsoluteValue(styles.paddingBottom, bound.width);
        return bound.add(
            paddingLeft + styles.borderLeftWidth,
            paddingTop + styles.borderTopWidth,
            -(styles.borderRightWidth + styles.borderLeftWidth + paddingLeft + paddingRight),
            -(styles.borderTopWidth + styles.borderBottomWidth + paddingTop + paddingBottom)
        );
    });
};
