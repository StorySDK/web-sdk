import { MaterialIconValueType } from '../components/MaterialIcon/_types';
import { BackgroundType, BorderType, FontParamsType } from '.';
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
};
export declare type EllipseWidgetParamsType = {
    fillColor: BackgroundType;
    fillOpacity: number;
    strokeThickness: number;
    strokeColor: BorderType;
    strokeOpacity: number;
    widgetOpacity: number;
    hasBorder: false;
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
    url: string;
    borderRadius: number;
    backgroundColor: BackgroundType;
    hasBorder: boolean;
    hasIcon: boolean;
    borderWidth: number;
    borderColor: BorderType;
    borderOpacity: number;
};
export declare type ChooseAnswerWidgetParamsType = {
    text: string;
    color: string;
    markCorrectAnswer: boolean;
    answers: Array<{
        id: string;
        title: string;
    }>;
    correct: string;
};
export declare type EmojiReactionWidgetParamsType = {
    emoji: EmojiItemType[];
    color: string;
};
export declare type GiphyWidgetParamsType = {
    gif: string;
    widgetOpacity: number;
    borderRadius: number;
};
export declare type QuestionWidgetParamsType = {
    question: string;
    confirm: string;
    decline: string;
    color: string;
};
export declare type SliderWidgetParamsType = {
    color: string;
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
};
export declare type TalkAboutWidgetParamsType = {
    text: string;
    image: string | null;
    color: string;
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
};
export declare type TimerWidgetParamsType = {
    time: number;
    text: string;
    color: string;
};
