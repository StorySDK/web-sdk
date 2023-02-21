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
declare const widgets: {
    choose_answer: import("@types").WidgetComponent<{
        params: import("@types").ChooseAnswerWidgetParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        jsConfetti?: any;
        onAnswer?(answerId: string): void;
    }>;
    click_me: import("@types").WidgetComponent<{
        params: import("@types").ClickMeWidgetParamsType;
        onClick?(): void;
        onGoToStory?(storyId: string): void;
    }>;
    ellipse: import("@types").WidgetComponent<{
        params: import("@types").EllipseWidgetParamsType;
    }>;
    emoji_reaction: import("@types").WidgetComponent<{
        params: import("@types").EmojiReactionWidgetParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onReact?(emoji: string): void;
    }>;
    giphy: import("@types").WidgetComponent<{
        params: import("@types").GiphyWidgetParamsType;
    }>;
    question: import("@types").WidgetComponent<{
        params: import("@types").QuestionWidgetParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onAnswer?(answer: string): any;
    }>;
    rectangle: import("@types").WidgetComponent<{
        params: import("@types").RectangleWidgetParamsType;
    }>;
    slider: import("@types").WidgetComponent<{
        storyId: string;
        params: import("@types").SliderWidgetParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onSlide?(value: number): void;
    }>;
    swipe_up: import("@types").WidgetComponent<{
        params: import("@types").SwipeUpWidgetParamsType;
        onSwipe?(): void;
    }>;
    talk_about: import("@types").WidgetComponent<{
        params: import("@types").TalkAboutWidgetParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onAnswer?(answer: string): void;
    }>;
    text: import("@types").WidgetComponent<{
        params: import("@types").TextWidgetParamsType;
    }>;
    timer: import("@types").WidgetComponent<{
        params: import("@types").TimerWidgetParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
    }>;
    quiz_multiple_answers: import("@types").WidgetComponent<{
        params: import("@types").QuizMultipleAnswerParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onAnswer?(answer: string[]): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_one_answer: import("@types").WidgetComponent<{
        params: import("@types").QuizOneAnswerParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onAnswer?(id: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_open_answer: import("@types").WidgetComponent<{
        params: import("@types").QuizOpenAnswerParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_rate: import("@types").WidgetComponent<{
        params: import("@types").QuizRateParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_one_multiple_with_image: import("@types").WidgetComponent<{
        params: import("@types").QuizMultipleAnswerWithImageParamsType;
        position?: import("@types").WidgetPositionType | undefined;
        positionLimits?: import("@types").WidgetPositionLimitsType | undefined;
        onAnswer?(answer: string[]): any;
        onGoToStory?(storyId: string): void;
    }>;
};
export default widgets;
export { ChooseAnswerWidget, ClickMeWidget, EllipseWidget, EmojiReactionWidget, GiphyWidget, QuestionWidget, RectangleWidget, SliderWidget, SwipeUpWidget, TalkAboutWidget, TextWidget, TimerWidget, QuizMultipleAnswerWidget, QuizOneAnswerWidget, QuizOpenAnswerWidget, QuizRateWidget, QuizMultipleAnswerWithImageWidget };
