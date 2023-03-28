/* eslint-disable no-shadow */
import {
  ChooseAnswerWidgetParamsType,
  ClickMeWidgetParamsType,
  EllipseWidgetParamsType,
  EmojiReactionWidgetParamsType,
  GiphyWidgetParamsType,
  QuestionWidgetParamsType,
  QuizMultipleAnswerWidgetParamsType,
  QuizOneAnswerWidgetParamsType,
  RectangleWidgetParamsType,
  SliderWidgetParamsType,
  SwipeUpWidgetParamsType,
  TalkAboutWidgetParamsType,
  TextWidgetParamsType,
  TimerWidgetParamsType,
  QuizMultipleAnswerWithImageWidgetParamsType,
  QuizRateWidgetParamsType,
  QuizOpenAnswerWidgetParamsType
} from './WidgetsParams';

type ColorValue = { type: 'color'; value: string; isFilled?: boolean };
type GradientValue = { type: 'gradient'; value: string[]; isFilled?: boolean };
type BackgrounValue = {
  type: 'image' | 'video';
  value: string;
  isFilled?: boolean;
  fileId?: string;
};

export type BorderType = GradientValue | ColorValue;
export type BackgroundType = GradientValue | ColorValue | BackgrounValue;
export interface FontParamsType {
  style: string;
  weight: number;
}

export enum WidgetsTypes {
  RECTANGLE = 'rectangle',
  ELLIPSE = 'ellipse',
  TEXT = 'text',
  SWIPE_UP = 'swipe_up',
  SLIDER = 'slider',
  QUESTION = 'question',
  CLICK_ME = 'click_me',
  TALK_ABOUT = 'talk_about',
  EMOJI_REACTION = 'emoji_reaction',
  TIMER = 'timer',
  CHOOSE_ANSWER = 'choose_answer',
  GIPHY = 'giphy',
  QUIZ_ONE_ANSWER = 'quiz_one_answer',
  QUIZ_MULTIPLE_ANSWERS = 'quiz_multiple_answers',
  QUIZ_OPEN_ANSWER = 'quiz_open_answer',
  QUIZ_MULTIPLE_ANSWER_WITH_IMAGE = 'quiz_one_multiple_with_image',
  QUIZ_RATE = 'quiz_rate'
}

export interface RectangleState {
  type: WidgetsTypes.RECTANGLE;
  params: RectangleWidgetParamsType;
  widgetImage?: string;
}

export interface EllipseState {
  type: WidgetsTypes.ELLIPSE;
  params: EllipseWidgetParamsType;
  widgetImage?: string;
}

export interface TextState {
  type: WidgetsTypes.TEXT;
  params: TextWidgetParamsType;
  widgetImage?: string;
}

export interface SwipeUpState {
  type: WidgetsTypes.SWIPE_UP;
  params: SwipeUpWidgetParamsType;
  widgetImage?: string;
}

export interface SliderState {
  type: WidgetsTypes.SLIDER;
  params: SliderWidgetParamsType;
}

export interface QuestionState {
  type: WidgetsTypes.QUESTION;
  params: QuestionWidgetParamsType;
}

export interface ClickMeState {
  type: WidgetsTypes.CLICK_ME;
  params: ClickMeWidgetParamsType;
  widgetImage?: string;
}

export interface TalkAboutState {
  type: WidgetsTypes.TALK_ABOUT;
  params: TalkAboutWidgetParamsType;
}

export interface EmojiReactionState {
  type: WidgetsTypes.EMOJI_REACTION;
  params: EmojiReactionWidgetParamsType;
}

export interface TimerState {
  type: WidgetsTypes.TIMER;
  params: TimerWidgetParamsType;
}

export interface ChooseAnswerState {
  type: WidgetsTypes.CHOOSE_ANSWER;
  params: ChooseAnswerWidgetParamsType;
}

export interface GiphyState {
  type: WidgetsTypes.GIPHY;
  params: GiphyWidgetParamsType;
}

export interface QuizOneAnswerState {
  type: WidgetsTypes.QUIZ_ONE_ANSWER;
  params: QuizOneAnswerWidgetParamsType;
}

export interface QuizMultipleAnswerState {
  type: WidgetsTypes.QUIZ_MULTIPLE_ANSWERS;
  params: QuizMultipleAnswerWidgetParamsType;
}

export interface QuizMultipleAnswerWithImageState {
  type: WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE;
  params: QuizMultipleAnswerWithImageWidgetParamsType;
}

export interface QuizRateState {
  type: WidgetsTypes.QUIZ_RATE;
  params: QuizRateWidgetParamsType;
}

export interface QuizOpenAnswerState {
  type: WidgetsTypes.QUIZ_OPEN_ANSWER;
  params: QuizOpenAnswerWidgetParamsType;
}

export interface ElementSizeType {
  width: number | string;
  height: number | string;
}

export interface WidgetPositionLimitsType {
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  isAutoHeight?: boolean;
  isAutoWidth?: boolean;
  keepRatio?: boolean;
  ratioIndex?: number;
  isResizableX: boolean;
  isResizableY: boolean;
  isRotatable: boolean;
}

export interface WidgetPositionType {
  x: number;
  y: number;
  origin: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  width: number | string;
  height: number;
  rotate: number;
  realWidth: number;
  realHeight: number;
  elementsSize?: { [key: string]: any };
}

export interface WidgetObjectType {
  id: string;
  position: WidgetPositionType;
  positionLimits: WidgetPositionLimitsType;
  content:
    | RectangleState
    | EllipseState
    | TextState
    | SwipeUpState
    | SliderState
    | QuestionState
    | ClickMeState
    | TalkAboutState
    | EmojiReactionState
    | TimerState
    | ChooseAnswerState
    | GiphyState
    | QuizOneAnswerState
    | QuizMultipleAnswerState
    | QuizMultipleAnswerWithImageState
    | QuizRateState
    | QuizOpenAnswerState;
  action?(): void;
}

export interface LayerData {
  layersGroupId: string;
  positionInGroup: number;
  isActiveLayer: boolean;
  score: {
    letter: string;
    points: number;
  };
}

export interface StoryType {
  id: string;
  storyData: WidgetObjectType[];
  layerData: LayerData;
  background: BackgroundType;
  positionIndex: number;
}

export const ScoreWidgets = [
  WidgetsTypes.CHOOSE_ANSWER,
  WidgetsTypes.QUIZ_ONE_ANSWER,
  WidgetsTypes.QUIZ_MULTIPLE_ANSWERS,
  WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE
];
