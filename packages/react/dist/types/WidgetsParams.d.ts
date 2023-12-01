import { MaterialIconValueType } from '../components/MaterialIcon/_types';
import { BackgroundType, BorderType, FontParamsType, VideoMetadataType } from '.';
export declare type QuizAnswersScoreParams = {
    letter: string;
    points: number;
};
export declare type EmojiItemType = {
    name: string;
    unicode: string;
};
export declare type RectangleWidgetParamsType = {
    fillColor: BackgroundType;
    fillBorderRadius: number;
    fillOpacity: number;
    widgetOpacity: number;
    strokeThickness: number;
    strokeColor: BorderType;
    strokeOpacity: number;
    hasBorder: boolean;
    editor?: {
        strokeThickness?: number;
        fillBorderRadius?: number;
    };
};
export declare type ImageWidgetParamsType = {
    borderRadius: number;
    widgetOpacity: number;
    imageUrl: string;
    fileId?: string;
};
export declare type VideoWidgetParamsType = {
    widgetOpacity: number;
    videoUrl: string;
    videoPreviewUrl?: string;
    fileId?: string;
    stopAutoplay?: boolean;
    metadata?: VideoMetadataType;
};
export declare type EllipseWidgetParamsType = {
    fillColor: BackgroundType;
    fillOpacity: number;
    strokeThickness: number;
    strokeColor: BorderType;
    strokeOpacity: number;
    widgetOpacity: number;
    hasBorder: boolean;
    editor?: {
        strokeThickness?: number;
    };
};
export declare type ClickMeWidgetParamsType = {
    fontFamily: string;
    fontSize: number;
    iconSize: number;
    fontParams: FontParamsType;
    opacity: number;
    color: BorderType;
    text: string;
    icon: MaterialIconValueType;
    actionType: 'link' | 'story' | 'custom';
    borderRadius: number;
    backgroundColor: BackgroundType;
    hasBorder: boolean;
    hasIcon: boolean;
    borderWidth: number;
    borderColor: BorderType;
    borderOpacity: number;
    storyId?: string;
    url?: string;
    customFields?: {
        [key: string]: string;
    };
    editor?: {
        iconSize?: number;
        fontSize?: number;
        borderWidth?: number;
        borderRadius?: number;
    };
};
export declare type ChooseAnswerWidgetParamsType = {
    text: string;
    color: string;
    markCorrectAnswer: boolean;
    answers: Array<{
        id: string;
        title: string;
        score: QuizAnswersScoreParams;
    }>;
    correct: string;
    isTitleHidden: boolean;
};
export declare type EmojiReactionWidgetParamsType = {
    emoji: EmojiItemType[];
    color: string;
};
export declare type GiphyWidgetParamsType = {
    gif: string;
    widgetOpacity: number;
    borderRadius: number;
    editor?: {
        borderRadius?: number;
    };
};
export declare type QuestionWidgetParamsType = {
    question: string;
    confirm: string;
    decline: string;
    color: string;
    fontFamily: string;
    fontParams: FontParamsType;
    fontColor: BorderType;
    isTitleHidden: boolean;
};
export declare type SliderWidgetParamsType = {
    color: string;
    fontFamily: string;
    fontParams: FontParamsType;
    fontColor: BorderType;
    emoji: EmojiItemType;
    text?: string;
    value: number;
};
export declare type SwipeUpWidgetParamsType = {
    text: string;
    opacity: number;
    iconSize: number;
    fontParams: FontParamsType;
    fontFamily: string;
    fontSize: number;
    color: BorderType;
    url: string;
    icon: MaterialIconValueType;
    editor?: {
        iconSize?: number;
        fontSize?: number;
    };
};
export declare type TalkAboutWidgetParamsType = {
    text: string;
    fontFamily: string;
    fontParams: FontParamsType;
    fontColor: BorderType;
    image: string | null;
    color: string;
    isTitleHidden: boolean;
};
export declare type TextWidgetParamsType = {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontParams: FontParamsType;
    align: 'left' | 'center' | 'right';
    color: BorderType;
    backgroundColor: BackgroundType;
    withFill: boolean;
    opacity: number;
    widgetOpacity: number;
    backgroundOpacity: number;
    editor?: {
        fontSize?: number;
    };
};
export declare type TimerWidgetParamsType = {
    time: number;
    text: string;
    color: string;
};
export declare type QuizMultipleAnswerWidgetParamsType = {
    title: string;
    color?: string;
    answers: Array<{
        id: string;
        title: string;
        emoji: EmojiItemType | undefined;
        score: QuizAnswersScoreParams;
    }>;
    isTitleHidden: boolean;
    storyId?: string;
    titleFont: {
        fontFamily: string;
        fontParams: FontParamsType;
        fontColor: BorderType;
    };
    answersFont: {
        fontFamily: string;
        fontParams: FontParamsType;
        fontColor: BorderType;
    };
};
export declare type QuizMultipleAnswerWithImageWidgetParamsType = {
    title: string;
    color?: string;
    answers: Array<{
        id: string;
        title: string;
        score: QuizAnswersScoreParams;
        image?: {
            url: string;
            fileId: string;
        };
    }>;
    isTitleHidden: boolean;
    storyId?: string;
    titleFont: {
        fontFamily: string;
        fontParams: FontParamsType;
        fontColor: BorderType;
    };
    answersFont: {
        fontFamily: string;
        fontParams: FontParamsType;
        fontColor: BorderType;
    };
};
export declare type QuizOneAnswerWidgetParamsType = {
    title: string;
    color?: string;
    answers: Array<{
        id: string;
        title: string;
        emoji: EmojiItemType | undefined;
        score: QuizAnswersScoreParams;
    }>;
    isTitleHidden: boolean;
    storyId?: string;
    titleFont: {
        fontFamily: string;
        fontParams: FontParamsType;
        fontColor: BorderType;
    };
    answersFont: {
        fontFamily: string;
        fontParams: FontParamsType;
        fontColor: BorderType;
    };
};
export declare type QuizOpenAnswerWidgetParamsType = {
    title: string;
    isTitleHidden: boolean;
    storyId?: string;
    fontFamily: string;
    fontParams: FontParamsType;
    fontColor: BorderType;
};
export declare type QuizRateWidgetParamsType = {
    title: string;
    isTitleHidden: boolean;
    storeLinks: {
        [key: string]: string;
    };
    storyId?: string;
    fontFamily: string;
    fontParams: FontParamsType;
    fontColor: BorderType;
};
