import { ElementPaint, StackingContext } from '../stacking-context';
import { Color } from '../../css/types/color';
import { ElementContainer } from '../../dom/element-container';
import { BORDER_STYLE } from '../../css/property-descriptors/border-style';
import { CSSParsedDeclaration } from '../../css/index';
import { TextContainer } from '../../dom/text-container';
import { Path } from '../path';
import { BoundCurves } from '../bound-curves';
import { TextBounds } from '../../css/layout/text';
import { ReplacedElementContainer } from '../../dom/replaced-elements/index';
import { IElementEffect } from '../effects';
import { Renderer } from '../renderer';
import { Context } from '../../core/context';
export declare type RenderConfigurations = RenderOptions & {
    backgroundColor: Color | null;
};
export interface RenderOptions {
    scale: number;
    canvas?: HTMLCanvasElement;
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class CanvasRenderer extends Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    private readonly _activeEffects;
    private readonly fontMetrics;
    constructor(context: Context, options: RenderConfigurations);
    applyEffects(effects: IElementEffect[]): void;
    applyEffect(effect: IElementEffect): void;
    popEffect(): void;
    renderStack(stack: StackingContext): Promise<void>;
    renderNode(paint: ElementPaint): Promise<void>;
    renderTextWithLetterSpacing(text: TextBounds, letterSpacing: number, baseline: number): void;
    private createFontStyle;
    renderTextNode(text: TextContainer, styles: CSSParsedDeclaration): Promise<void>;
    renderReplacedElement(container: ReplacedElementContainer, curves: BoundCurves, image: HTMLImageElement | HTMLCanvasElement): void;
    renderNodeContent(paint: ElementPaint): Promise<void>;
    renderStackContent(stack: StackingContext): Promise<void>;
    mask(paths: Path[]): void;
    path(paths: Path[]): void;
    formatPath(paths: Path[]): void;
    renderRepeat(path: Path[], pattern: CanvasPattern | CanvasGradient, offsetX: number, offsetY: number): void;
    resizeImage(image: HTMLImageElement, width: number, height: number): HTMLCanvasElement | HTMLImageElement;
    renderBackgroundImage(container: ElementContainer): Promise<void>;
    renderSolidBorder(color: Color, side: number, curvePoints: BoundCurves): Promise<void>;
    renderDoubleBorder(color: Color, width: number, side: number, curvePoints: BoundCurves): Promise<void>;
    renderNodeBackgroundAndBorders(paint: ElementPaint): Promise<void>;
    renderDashedDottedBorder(color: Color, width: number, side: number, curvePoints: BoundCurves, style: BORDER_STYLE): Promise<void>;
    render(element: ElementContainer): Promise<HTMLCanvasElement>;
}
