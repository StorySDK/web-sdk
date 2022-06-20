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
declare const widgets: {
    choose_answer: import("../types").WidgetComponent<{
        params: import("../types").ChooseAnswerWidgetParamsType;
        position?: import("../types").WidgetPositionType | undefined;
        positionLimits?: import("../types").WidgetPositionLimitsType | undefined;
        jsConfetti?: any;
        onAnswer?(answerId: string): void;
    }>;
    click_me: import("../types").WidgetComponent<{
        params: import("../types").ClickMeWidgetParamsType;
        onClick?(): void;
    }>;
    ellipse: import("../types").WidgetComponent<{
        params: import("../types").EllipseWidgetParamsType;
    }>;
    emoji_reaction: import("../types").WidgetComponent<{
        params: import("../types").EmojiReactionWidgetParamsType;
        position?: import("../types").WidgetPositionType | undefined;
        positionLimits?: import("../types").WidgetPositionLimitsType | undefined;
        onReact?(emoji: string): void;
    }>;
    giphy: import("../types").WidgetComponent<{
        params: import("../types").GiphyWidgetParamsType;
    }>;
    question: import("../types").WidgetComponent<{
        params: import("../types").QuestionWidgetParamsType;
        position?: import("../types").WidgetPositionType | undefined;
        positionLimits?: import("../types").WidgetPositionLimitsType | undefined;
        onAnswer?(answer: string): any;
    }>;
    rectangle: import("../types").WidgetComponent<{
        params: import("../types").RectangleWidgetParamsType;
    }>;
    slider: import("../types").WidgetComponent<{
        storyId: string;
        params: import("../types").SliderWidgetParamsType;
        position?: import("../types").WidgetPositionType | undefined;
        positionLimits?: import("../types").WidgetPositionLimitsType | undefined;
        onSlide?(value: number): void;
    }>;
    swipe_up: import("../types").WidgetComponent<{
        params: import("../types").SwipeUpWidgetParamsType;
        onSwipe?(): void;
    }>;
    talk_about: import("../types").WidgetComponent<{
        params: import("../types").TalkAboutWidgetParamsType;
        position?: import("../types").WidgetPositionType | undefined;
        positionLimits?: import("../types").WidgetPositionLimitsType | undefined;
        onAnswer?(answer: string): void;
    }>;
    text: import("../types").WidgetComponent<{
        params: import("../types").TextWidgetParamsType;
    }>;
    timer: import("../types").WidgetComponent<{
        params: import("../types").TimerWidgetParamsType;
        position?: import("../types").WidgetPositionType | undefined;
        positionLimits?: import("../types").WidgetPositionLimitsType | undefined;
    }>;
};
export default widgets;
export { ChooseAnswerWidget, ClickMeWidget, EllipseWidget, EmojiReactionWidget, GiphyWidget, QuestionWidget, RectangleWidget, SliderWidget, SwipeUpWidget, TalkAboutWidget, TextWidget, TimerWidget };
