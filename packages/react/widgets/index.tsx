import { WidgetsTypes } from '../types';
import { ChooseAnswerWidget } from './ChooseAnswerWidget/ChooseAnswerWidget';
import { ClickMeWidget } from './ClickMeWidget/ClickMeWidget';
import { EllipseWidget } from './EllipseWidget/EllipseWidget';
import { EmojiReactionWidget } from './EmojiReactionWidget/EmojiReactionWidget';
import { GiphyWidget } from './GiphyWidget/GiphyWidget';
import { QuestionWidget } from './QuestionWidget/QuestionWidget';
import { RectangleWidget } from './RectangleWidget/RectangleWidget';
import { SliderWidget } from './SliderWidget/SliderWidget';
import { SwipeUpWidget } from './SwipeUpWidget/SwipeUpWidget';
import { TalkAboutWidget } from './TalkAboutWidget/TalkAboutWidget';
import { TextWidget } from './TextWidget/TextWidget';
import { TimerWidget } from './TimerWidget/TimerWidget';

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
  [WidgetsTypes.TIMER]: TimerWidget
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
  TimerWidget
};
