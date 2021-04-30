import { ElementPaint, StackingContext } from '../stacking-context';
import { Color } from '../../css/types/color';
import { ElementContainer } from '../../dom/element-container';
import { CSSParsedDeclaration } from '../../css/index';
import { TextContainer } from '../../dom/text-container';
import { Path } from '../path';
import { BoundCurves } from '../bound-curves';
import { Cache } from '../../core/cache-storage';
import { TextBounds } from '../../css/layout/text';
import { ReplacedElementContainer } from '../../dom/replaced-elements/index';
import { EffectTarget, IElementEffect } from '../effects';
export declare type RenderConfigurations = RenderOptions & {
    backgroundColor: Color | null;
};
export interface RenderOptions {
    id: string;
    scale: number;
    canvas?: HTMLCanvasElement;
    x: number;
    y: number;
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
    windowWidth: number;
    windowHeight: number;
    cache: Cache;
}
export declare class CanvasRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: RenderConfigurations;
    private readonly _activeEffects;
    private readonly fontMetrics;
    constructor(options: RenderConfigurations);
    applyEffects(effects: IElementEffect[], target: EffectTarget): void;
    applyEffect(effect: IElementEffect): void;
    popEffect(): void;
    renderStack(stack: StackingContext): Promise<void>;
    renderNode(paint: ElementPaint): Promise<void>;
    renderTextWithLetterSpacing(text: TextBounds, letterSpacing: number): void;
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
    renderBorder(color: Color, side: number, curvePoints: BoundCurves): Promise<void>;
    renderNodeBackgroundAndBorders(paint: ElementPaint): Promise<void>;
    render(element: ElementContainer): Promise<HTMLCanvasElement>;
}
