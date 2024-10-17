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
import { ImageWidget } from './ImageWidget';
import { VideoWidget } from './VideoWidget';
import { LinkWidget } from './LinkWidget';
declare const widgets: {
    choose_answer: import("@types").WidgetComponent<{
        id: string;
        params: import("@types").ChooseAnswerWidgetParamsType;
        elementsSize?: import("@types").ChooseAnswerWidgetElemetsType | undefined;
        jsConfetti?: any;
        isReadOnly?: boolean | undefined;
        onAnswer?(answerId: string): void;
    }>;
    image: import("@types").WidgetComponent<{
        params: import("@types").ImageWidgetParamsType;
        handleMediaLoading?: ((isLoading: boolean) => void) | undefined;
    }>;
    video: import("@types").WidgetComponent<{
        params: import("@types").VideoWidgetParamsType;
        isVideoPlaying?: boolean | undefined;
        isMuted?: boolean | undefined;
        isAutoplay?: boolean | undefined;
        isDisplaying?: boolean | undefined;
        handleMediaPlaying?: ((isPlaying: boolean) => void) | undefined;
        handleMediaLoading?: ((isLoading: boolean) => void) | undefined;
    }>;
    click_me: import("@types").WidgetComponent<{
        params: import("@types").ClickMeWidgetParamsType;
        isReadOnly?: boolean | undefined;
        onClick?(): void;
        onGoToStory?(storyId: string): void;
        handleMuteVideo?(isMuted: boolean): void;
    }>;
    ellipse: import("@types").WidgetComponent<{
        params: import("@types").EllipseWidgetParamsType;
    }>;
    emoji_reaction: import("@types").WidgetComponent<{
        id: string;
        params: import("@types").EmojiReactionWidgetParamsType;
        elementsSize?: import("@types").EmojiReactionWidgetElemetsType | undefined;
        isReadOnly?: boolean | undefined;
        onAnswer?(emoji: string): void;
    }>;
    giphy: import("@types").WidgetComponent<{
        params: import("@types").GiphyWidgetParamsType;
    }>;
    question: import("@types").WidgetComponent<{
        id: string;
        params: import("@types").QuestionWidgetParamsType;
        elementsSize?: import("@types").QuestionWidgetElementsType | undefined;
        isReadOnly?: boolean | undefined;
        onAnswer?(answer: string): any;
    }>;
    rectangle: import("@types").WidgetComponent<{
        params: import("@types").RectangleWidgetParamsType;
    }>;
    slider: import("@types").WidgetComponent<{
        id: string;
        storyId: string;
        params: import("@types").SliderWidgetParamsType;
        elementsSize?: import("@types").SliderWidgetElementsType | undefined;
        isReadOnly?: boolean | undefined;
        onAnswer?(value: number): void;
    }>;
    swipe_up: import("@types").WidgetComponent<{
        params: import("@types").SwipeUpWidgetParamsType;
        isReadOnly?: boolean | undefined;
        onSwipe?(): void;
        handleMuteVideo?(isMuted: boolean): void;
    }>;
    talk_about: import("@types").WidgetComponent<{
        id: string;
        params: import("@types").TalkAboutWidgetParamsType;
        elementsSize?: import("@types").TalkAboutElementsType | undefined;
        isReadOnly?: boolean | undefined;
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
        id: string;
        params: import("@types").QuizMultipleAnswerWidgetParamsType;
        elementsSize?: import("@types").QuizMultipleAnswerWidgetElementsType | undefined;
        isReadOnly?: boolean | undefined;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_one_answer: import("@types").WidgetComponent<{
        id: string;
        params: import("@types").QuizOneAnswerWidgetParamsType;
        elementsSize?: import("@types").QuizOneAnswerWidgetElementsType | undefined;
        isReadOnly?: boolean | undefined;
        onAnswer?(id: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_open_answer: import("@types").WidgetComponent<{
        id: string;
        params: import("@types").QuizOpenAnswerWidgetParamsType;
        elementsSize?: import("@types").QuizOpenAnswerWidgetElementsType | undefined;
        isReadOnly?: boolean | undefined;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_rate: import("@types").WidgetComponent<{
        params: import("@types").QuizRateWidgetParamsType;
        elementsSize: import("@types").QuizRateWidgetElementsType;
        isReadOnly?: boolean | undefined;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_one_multiple_with_image: import("@types").WidgetComponent<{
        id: string;
        params: import("@types").QuizMultipleAnswerWithImageWidgetParamsType;
        elementsSize?: import("@types").QuizMultipleAnswerWidgetWithImageElementsType | undefined;
        isReadOnly?: boolean | undefined;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    link: import("@types").WidgetComponent<{
        params: import("@types").LinkWidgetParamsType;
        isReadOnly?: boolean | undefined;
        handleMuteVideo?(isMuted: boolean): void;
    }>;
};
export default widgets;
export { ChooseAnswerWidget, ImageWidget, VideoWidget, ClickMeWidget, EllipseWidget, EmojiReactionWidget, GiphyWidget, QuestionWidget, RectangleWidget, SliderWidget, SwipeUpWidget, TalkAboutWidget, TextWidget, TimerWidget, QuizMultipleAnswerWidget, QuizOneAnswerWidget, QuizOpenAnswerWidget, QuizRateWidget, QuizMultipleAnswerWithImageWidget, LinkWidget };
