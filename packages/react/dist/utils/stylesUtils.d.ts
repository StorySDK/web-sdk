import { WidgetPositionType, WidgetPositionLimitsType, BackgroundType, BorderType } from '../types';
interface Stroke {
    strokeThickness: number;
    strokeColor: BorderType;
    strokeOpacity: number;
    fillBorderRadius?: number;
}
export declare const renderColor: (color: string, opacity?: number | undefined) => string;
export declare const renderGradient: (colors: string[], opacity?: number | undefined) => string;
export declare const renderBackgroundStyles: (background: BackgroundType, opacity?: number | undefined) => string;
export declare const renderBorderStyles: ({ strokeThickness, strokeColor, strokeOpacity, fillBorderRadius }: Stroke) => any;
export declare const renderTextBackgroundStyles: ({ color, opacity }: {
    color: BorderType;
    opacity?: number | undefined;
}) => React.CSSProperties;
export declare const renderPosition: (position: WidgetPositionType, positionLimits: WidgetPositionLimitsType, zIndex: number) => {
    left: string;
    top: string;
    width: string;
    height: string;
    zIndex: number;
    transform: string;
};
export declare const getScalableValue: (value: number) => number;
export declare const calculateElementSize: (position: WidgetPositionType, positionLimits: WidgetPositionLimitsType, elementSize: number) => number;
export declare const calculateElementSizeByHeight: (position: WidgetPositionType, positionLimits: WidgetPositionLimitsType, elementSize: number) => number;
export {};
