import {
  ChooseAnswerWidgetParamsType,
  ClickMeWidgetParamsType,
  EllipseWidgetParamsType,
  EmojiReactionWidgetParamsType,
  GiphyWidgetParamsType,
  QuestionWidgetParamsType,
  QuizMultipleAnswerParamsType,
  QuizOneAnswerParamsType,
  RectangleWidgetParamsType,
  SliderWidgetParamsType,
  SwipeUpWidgetParamsType,
  TalkAboutWidgetParamsType,
  TextWidgetParamsType,
  TimerWidgetParamsType,
  QuizMultipleAnswerWithImageParamsType,
  QuizRateParamsType,
  QuizOpenAnswerParamsType
} from './WidgetsParams';

type ColorValue = { type: 'color'; value: string; isFilled?: boolean };
type GradientValue = { type: 'gradient'; value: string[]; isFilled?: boolean };
type BackgrounValue = { type: 'image' | 'video'; value: string; isFilled?: boolean };

export type BorderType = GradientValue | ColorValue;
export type BackgroundType = GradientValue | ColorValue | BackgrounValue;
export interface FontParamsType {
  style: string;
  weight: number;
}

// eslint-disable-next-line no-shadow
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
}

export interface EllipseState {
  type: WidgetsTypes.ELLIPSE;
  params: EllipseWidgetParamsType;
}

export interface TextState {
  type: WidgetsTypes.TEXT;
  params: TextWidgetParamsType;
}

export interface SwipeUpState {
  type: WidgetsTypes.SWIPE_UP;
  params: SwipeUpWidgetParamsType;
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
  params: QuizOneAnswerParamsType;
}

export interface QuizMultipleAnswerState {
  type: WidgetsTypes.QUIZ_MULTIPLE_ANSWERS;
  params: QuizMultipleAnswerParamsType;
}

export interface QuizMultipleAnswerWithImageState {
  type: WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE;
  params: QuizMultipleAnswerWithImageParamsType;
}

export interface QuizRateState {
  type: WidgetsTypes.QUIZ_RATE;
  params: QuizRateParamsType;
}

export interface QuizOpenAnswerState {
  type: WidgetsTypes.QUIZ_OPEN_ANSWER;
  params: QuizOpenAnswerParamsType;
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
  width: number | string;
  height: number;
  rotate: number;
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

export interface StoryType {
  id: string;
  storyData: WidgetObjectType[];
  background: BackgroundType;
  positionIndex: number;
}
