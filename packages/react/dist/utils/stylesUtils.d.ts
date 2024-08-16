/// <reference types="react" />
import { GradientDirection } from 'dist';
import { WidgetPositionType, WidgetPositionLimitsType, BackgroundType, BorderType } from '../types';
interface Stroke {
    strokeThickness: number;
    strokeColor: BorderType;
    strokeOpacity: number;
    fillBorderRadius?: number;
}
export declare const block: import("bem-cn").BemCn;
export declare const renderColor: (color: string, opacity?: number | undefined) => string;
export declare const getGradientDirection: (direction?: GradientDirection | undefined) => "180deg" | "90deg";
export declare const renderGradient: (colors: string[], opacity?: number | undefined) => string;
export declare const renderBackgroundStyles: (background: BackgroundType, opacity?: number | undefined) => string;
export declare const renderBorderStyles: ({ strokeThickness, strokeColor, strokeOpacity, fillBorderRadius }: Stroke) => any;
export declare const renderTextBackgroundStyles: ({ color, opacity }: {
    color: BorderType;
    opacity?: number | undefined;
}) => React.CSSProperties;
export declare const renderPosition: (position: WidgetPositionType, positionLimits: WidgetPositionLimitsType) => {
    left: string;
    top: string;
    width: string;
    height: string;
    transform: string;
};
export declare const getScalableValue: (value: number) => number;
export declare const calculateElementSize: (width: number, elementSize: number, minWidth?: number | undefined) => number;
export declare const calculateElementSizeByHeight: (height: number, elementSize: number, minHeight?: number | undefined) => number;
export declare const getTextStyles: (fontColor: BorderType) => import("react").CSSProperties | undefined;
export {};
