import { WidgetsTypes } from '@types';
import { ChooseAnswerWidget } from './ChooseAnswerWidget';
import { ClickMeWidget } from './ClickMeWidget';
import { EllipseWidget } from './EllipseWidget';
import { EmojiReactionWidget } from './EmojiReactionWidget';
import { GiphyWidget } from './GiphyWidget';
import { QuestionWidget } from './QuestionWidget';
import { RectangleWidget } from './RectangleWidget';
import { SliderWidget } from './SliderWidget';
import { SwipeUpWidget } from './SwipeUpWidget';
import { TalkAboutWidget } from './TalkAboutWidget';
import { TextWidget } from './TextWidget';
import { TimerWidget } from './TimerWidget';
import { QuizMultipleAnswerWidget } from './QuizMultipleAnswerWidget';
import { QuizOneAnswerWidget } from './QuizOneAnswerWidget';
import { QuizOpenAnswerWidget } from './QuizOpenAnswerWidget';
import { QuizRateWidget } from './QuizRateWidget';
import { QuizMultipleAnswerWithImageWidget } from './QuizMultipleAnswerWithImageWidget';

const widgets = {
  [WidgetsTypes.CHOOSE_ANSWER]: ChooseAnswerWidget,
  [WidgetsTypes.CLICK_ME]: ClickMeWidget,
  [WidgetsTypes.ELLIPSE]: EllipseWidget,
  [WidgetsTypes.EMOJI_REACTION]: EmojiReactionWidget,
  [WidgetsTypes.GIPHY]: GiphyWidget,
  [WidgetsTypes.QUESTION]: QuestionWidget,
  [WidgetsTypes.RECTANGLE]: RectangleWidget,
  [WidgetsTypes.SLIDER]: SliderWidget,
  [WidgetsTypes.SWIPE_UP]: SwipeUpWidget,
  [WidgetsTypes.TALK_ABOUT]: TalkAboutWidget,
  [WidgetsTypes.TEXT]: TextWidget,
  [WidgetsTypes.TIMER]: TimerWidget,
  [WidgetsTypes.QUIZ_MULTIPLE_ANSWERS]: QuizMultipleAnswerWidget,
  [WidgetsTypes.QUIZ_ONE_ANSWER]: QuizOneAnswerWidget,
  [WidgetsTypes.QUIZ_OPEN_ANSWER]: QuizOpenAnswerWidget,
  [WidgetsTypes.QUIZ_RATE]: QuizRateWidget,
  [WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE]: QuizMultipleAnswerWithImageWidget
};

export default widgets;

export {
  ChooseAnswerWidget,
  ClickMeWidget,
  EllipseWidget,
  EmojiReactionWidget,
  GiphyWidget,
  QuestionWidget,
  RectangleWidget,
  SliderWidget,
  SwipeUpWidget,
  TalkAboutWidget,
  TextWidget,
  TimerWidget,
  QuizMultipleAnswerWidget,
  QuizOneAnswerWidget,
  QuizOpenAnswerWidget,
  QuizRateWidget,
  QuizMultipleAnswerWithImageWidget
};
