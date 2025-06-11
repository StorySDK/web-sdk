import { MaterialIconValueType, BackgroundType, BorderType, ColorValue, FontParamsType, VideoMetadataType, QuizAnswersScoreParams, EmojiItemType } from '../common/types';
/**
 * Rectangle widget parameters
 */
export type RectangleWidgetParamsType = {
    /** Fill color */
    fillColor: BackgroundType;
    /** Border radius */
    fillBorderRadius: number;
    /** Fill opacity */
    fillOpacity: number;
    /** Widget opacity */
    widgetOpacity: number;
    /** Stroke thickness */
    strokeThickness: number;
    /** Stroke color */
    strokeColor: BorderType;
    /** Stroke opacity */
    strokeOpacity: number;
    /** Has border */
    hasBorder: boolean;
    /** Editor parameters */
    editor?: {
        strokeThickness?: number;
        fillBorderRadius?: number;
    };
};
/**
 * Text widget parameters
 */
export type TextWidgetParamsType = {
    /** Text content */
    text: string;
    /** Text color */
    textColor: ColorValue;
    /** Font parameters */
    fontParams: FontParamsType;
    /** Font size */
    fontSize: number;
    /** Line height */
    lineHeight: number;
    /** Letter spacing */
    letterSpacing: number;
    /** Text alignment */
    textAlign: string;
    /** Opacity */
    opacity: number;
    /** Editor parameters */
    editor?: {
        fontSize?: number;
        lineHeight?: number;
        letterSpacing?: number;
    };
};
/**
 * Image widget parameters
 */
export type ImageWidgetParamsType = {
    /** Image URL */
    imageUrl: string;
    /** Opacity */
    opacity: number;
    /** Editor parameters */
    editor?: {
        imageUrl?: string;
    };
};
/**
 * Video widget parameters
 */
export type VideoWidgetParamsType = {
    /** Video URL */
    videoUrl: string;
    /** Preview URL */
    previewUrl: string;
    /** Video metadata */
    videoMetadata: VideoMetadataType;
    /** Opacity */
    opacity: number;
    /** Editor parameters */
    editor?: {
        videoUrl?: string;
        previewUrl?: string;
    };
};
/**
 * Quiz widget parameters
 */
export type QuizWidgetParamsType = {
    /** Question */
    question: string;
    /** Answers */
    answers: string[];
    /** Correct answers */
    correctAnswers: string[];
    /** Score parameters */
    scoreParams: QuizAnswersScoreParams[];
    /** Opacity */
    opacity: number;
    /** Editor parameters */
    editor?: {
        question?: string;
        answers?: string[];
        correctAnswers?: string[];
    };
};
/**
 * Emoji widget parameters
 */
export type EmojiWidgetParamsType = {
    /** Emoji */
    emoji: EmojiItemType;
    /** Size */
    size: number;
    /** Opacity */
    opacity: number;
    /** Editor parameters */
    editor?: {
        size?: number;
    };
};
/**
 * Icon widget parameters
 */
export type IconWidgetParamsType = {
    /** Icon */
    icon: MaterialIconValueType;
    /** Color */
    color: ColorValue;
    /** Size */
    size: number;
    /** Opacity */
    opacity: number;
    /** Editor parameters */
    editor?: {
        size?: number;
    };
};
/**
 * General widget type
 */
export type WidgetType = {
    /** Widget ID */
    id: string;
    /** Widget type */
    type: string;
    /** Widget parameters */
    params: RectangleWidgetParamsType | TextWidgetParamsType | ImageWidgetParamsType | VideoWidgetParamsType | QuizWidgetParamsType | EmojiWidgetParamsType | IconWidgetParamsType;
    /** X position */
    x: number;
    /** Y position */
    y: number;
    /** Width */
    width: number;
    /** Height */
    height: number;
    /** Rotation angle */
    rotation: number;
    /** Scale */
    scale: number;
    /** Opacity */
    opacity: number;
    /** Visibility */
    visible: boolean;
    /** Lock status */
    locked: boolean;
    /** Editor parameters */
    editor?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        rotation?: number;
        scale?: number;
        opacity?: number;
        visible?: boolean;
        locked?: boolean;
    };
};
