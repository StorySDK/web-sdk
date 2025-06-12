import {
  QuizAnswersScoreParams, EmojiItemType,
  MaterialIconValueType
} from './common/types';
import {
  BackgroundType, BorderType, ColorValue, FontParamsType, VideoMetadataType
} from './WidgetType';

export type RectangleWidgetParamsType = {
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

export type ImageWidgetParamsType = {
  borderRadius: number;
  widgetOpacity: number;
  imageUrl: string;
  fileId?: string;
};

export type VideoWidgetParamsType = {
  widgetOpacity: number;
  videoUrl: string;
  borderRadius: number;
  videoPreviewUrl?: string;
  fileId?: string;
  stopAutoplay?: boolean;
  metadata?: VideoMetadataType;
};

export type EllipseWidgetParamsType = {
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

export type ClickMeWidgetParamsType = {
  fontFamily: string;
  fontSize: number;
  iconSize: number;
  fontParams: FontParamsType;
  opacity: number;
  color: BorderType;
  text: string;
  icon: MaterialIconValueType;
  actionType: 'link' | 'story' | 'custom' | 'close';
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

export type LinkWidgetParamsType = {
  fontFamily: string;
  fontSize: number;
  color: ColorValue;
  opacity: number;
  fontParams: FontParamsType;
  text: string;
  backgroundColor: BorderType;
  url?: string;
};

export type ChooseAnswerWidgetParamsType = {
  text: string;
  color: string;
  markCorrectAnswer: boolean;
  answers: Array<{ id: string; title: string; score: QuizAnswersScoreParams }>;
  correct: string;
  isTitleHidden: boolean;
};

export type EmojiReactionWidgetParamsType = {
  emoji: EmojiItemType[];
  color: string;
};

export type GiphyWidgetParamsType = {
  gif: string;
  widgetOpacity: number;
  borderRadius: number;
  editor?: {
    borderRadius?: number;
  };
};

export type QuestionWidgetParamsType = {
  question: string;
  confirm: string;
  decline: string;
  color: string;
  fontFamily: string;
  fontParams: FontParamsType;
  fontColor: BorderType;
  isTitleHidden: boolean;
};

export type SliderWidgetParamsType = {
  color: string;
  fontFamily: string;
  fontParams: FontParamsType;
  fontColor: BorderType;
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
  editor?: {
    iconSize?: number;
    fontSize?: number;
  };
};

export type TalkAboutWidgetParamsType = {
  text: string;
  fontFamily: string;
  fontParams: FontParamsType;
  fontColor: BorderType;
  image: string | null;
  color: string;
  isTitleHidden: boolean;
};

export type TextWidgetParamsType = {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontParams: FontParamsType;
  lineHeight: number;
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

export type TimerWidgetParamsType = {
  time: number;
  text: string;
  color: string;
};

export type QuizMultipleAnswerWidgetParamsType = {
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

export type QuizMultipleAnswerWithImageWidgetParamsType = {
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

export type QuizOneAnswerWidgetParamsType = {
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

export type QuizOpenAnswerWidgetParamsType = {
  title: string;
  isTitleHidden: boolean;
  storyId?: string;
  fontFamily: string;
  fontParams: FontParamsType;
  fontColor: BorderType;
};

export type QuizRateWidgetParamsType = {
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
