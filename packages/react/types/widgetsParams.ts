import { MaterialIconValueType } from '../components/MaterialIcon/_types';
import { BackgroundType, BorderType, FontParamsType } from '.';

type EmojiItemType = {
  name: string;
  unicode: string;
};

export type RectangleWidgetParamsType = {
  fillColor: BackgroundType;
  fillBorderRadius: number;
  fillOpacity: number;
  widgetOpacity: number;
  strokeThickness: number;
  strokeColor: BorderType;
  strokeOpacity: number;
  hasBorder: boolean;
};

export type EllipseWidgetParamsType = {
  fillColor: BackgroundType;
  fillOpacity: number;
  strokeThickness: number;
  strokeColor: BorderType;
  strokeOpacity: number;
  widgetOpacity: number;
  hasBorder: false;
};

export type ClickMeWidgetParamsType = {
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

export type ChooseAnswerWidgetParamsType = {
  text: string;
  color: string;
  markCorrectAnswer: boolean;
  answers: Array<{ id: string; title: string }>;
  correct: string;
};

export type EmojiReactionWidgetParamsType = {
  emoji: EmojiItemType[];
  color: string;
};

export type GiphyWidgetParamsType = {
  gif: string;
  widgetOpacity: number;
  borderRadius: number;
};

export type QuestionWidgetParamsType = {
  question: string;
  confirm: string;
  decline: string;
  color: string;
};

export type SliderWidgetParamsType = {
  color: string;
  emoji: EmojiItemType;
  text?: string;
  value: number;
};

export type SwipeUpWidgetParamsType = {
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

export type TalkAboutWidgetParamsType = {
  text: string;
  image: string | null;
  color: string;
};

export type TextWidgetParamsType = {
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

export type TimerWidgetParamsType = {
  time: number;
  text: string;
  color: string;
};
