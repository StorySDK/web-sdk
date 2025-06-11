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
    choose_answer: import("react").FunctionComponent<{
        id: string;
        params: import("@storysdk/types").ChooseAnswerWidgetParamsType;
        elementsSize?: import("@storysdk/types").ChooseAnswerWidgetElemetsType;
        jsConfetti?: any;
        isReadOnly?: boolean;
        onAnswer?(answerId: string): void;
    }>;
    image: import("react").FunctionComponent<{
        params: import("@storysdk/types").ImageWidgetParamsType;
        handleMediaLoading?: (isLoading: boolean) => void;
        width?: number;
        height?: number;
    }>;
    video: import("react").FunctionComponent<{
        params: import("@storysdk/types").VideoWidgetParamsType;
        isVideoPlaying?: boolean;
        isMuted?: boolean;
        isAutoplay?: boolean;
        isDisplaying?: boolean;
        handleMediaPlaying?: (isPlaying: boolean) => void;
        handleMediaLoading?: (isLoading: boolean) => void;
        nextVideoUrl?: string;
    }>;
    click_me: import("react").FunctionComponent<{
        id?: string;
        params: import("@storysdk/types").ClickMeWidgetParamsType;
        isReadOnly?: boolean;
        onClick?(): void;
        onGoToStory?(storyId: string): void;
        onCloseStory?(): void;
        handleMuteVideo?(isMuted: boolean): void;
    }>;
    ellipse: import("react").FunctionComponent<{
        params: import("@storysdk/types").EllipseWidgetParamsType;
    }>;
    emoji_reaction: import("react").FunctionComponent<{
        id: string;
        params: import("@storysdk/types").EmojiReactionWidgetParamsType;
        elementsSize?: import("@storysdk/types").EmojiReactionWidgetElemetsType;
        isReadOnly?: boolean;
        onAnswer?(emoji: string): void;
    }>;
    giphy: import("react").FunctionComponent<{
        params: import("@storysdk/types").GiphyWidgetParamsType;
    }>;
    question: import("react").FunctionComponent<{
        id: string;
        params: import("@storysdk/types").QuestionWidgetParamsType;
        elementsSize?: import("@storysdk/types").QuestionWidgetElementsType;
        isReadOnly?: boolean;
        onAnswer?(answer: string): any;
    }>;
    rectangle: import("react").FunctionComponent<{
        params: import("@storysdk/types").RectangleWidgetParamsType;
    }>;
    slider: import("react").FunctionComponent<{
        id: string;
        storyId: string;
        params: import("@storysdk/types").SliderWidgetParamsType;
        elementsSize?: import("@storysdk/types").SliderWidgetElementsType;
        isReadOnly?: boolean;
        onAnswer?(value: number): void;
    }>;
    swipe_up: import("react").FunctionComponent<{
        id?: string;
        params: import("@storysdk/types").SwipeUpWidgetParamsType;
        isReadOnly?: boolean;
        onSwipe?(): void;
        handleMuteVideo?(isMuted: boolean): void;
    }>;
    talk_about: import("react").FunctionComponent<{
        id: string;
        params: import("@storysdk/types").TalkAboutWidgetParamsType;
        elementsSize?: import("@storysdk/types").TalkAboutElementsType;
        isReadOnly?: boolean;
        onAnswer?(answer: string): void;
    }>;
    text: import("react").FunctionComponent<{
        params: import("@storysdk/types").TextWidgetParamsType;
    }>;
    timer: import("react").FunctionComponent<{
        params: import("@storysdk/types").TimerWidgetParamsType;
        position?: import("@storysdk/types").WidgetPositionType;
        positionLimits?: import("@storysdk/types").WidgetPositionLimitsType;
    }>;
    quiz_multiple_answers: import("react").FunctionComponent<{
        id: string;
        params: import("@storysdk/types").QuizMultipleAnswerWidgetParamsType;
        elementsSize?: import("@storysdk/types").QuizMultipleAnswerWidgetElementsType;
        isReadOnly?: boolean;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_one_answer: import("react").FunctionComponent<{
        id: string;
        params: import("@storysdk/types").QuizOneAnswerWidgetParamsType;
        elementsSize?: import("@storysdk/types").QuizOneAnswerWidgetElementsType;
        isReadOnly?: boolean;
        onAnswer?(id: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_open_answer: import("react").FunctionComponent<{
        id: string;
        params: import("@storysdk/types").QuizOpenAnswerWidgetParamsType;
        elementsSize?: import("@storysdk/types").QuizOpenAnswerWidgetElementsType;
        isReadOnly?: boolean;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_rate: import("react").FunctionComponent<{
        id?: string;
        params: import("@storysdk/types").QuizRateWidgetParamsType;
        elementsSize: import("@storysdk/types").QuizRateWidgetElementsType;
        isReadOnly?: boolean;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    quiz_one_multiple_with_image: import("react").FunctionComponent<{
        id: string;
        params: import("@storysdk/types").QuizMultipleAnswerWithImageWidgetParamsType;
        elementsSize?: import("@storysdk/types").QuizMultipleAnswerWidgetWithImageElementsType;
        isReadOnly?: boolean;
        onAnswer?(answer: string): any;
        onGoToStory?(storyId: string): void;
    }>;
    link: import("react").FunctionComponent<{
        id?: string;
        params: import("@storysdk/types").LinkWidgetParamsType;
        isReadOnly?: boolean;
        onClick?: () => void;
        handleMuteVideo?(isMuted: boolean): void;
    }>;
};
export default widgets;
export { ChooseAnswerWidget, ImageWidget, VideoWidget, ClickMeWidget, EllipseWidget, EmojiReactionWidget, GiphyWidget, QuestionWidget, RectangleWidget, SliderWidget, SwipeUpWidget, TalkAboutWidget, TextWidget, TimerWidget, QuizMultipleAnswerWidget, QuizOneAnswerWidget, QuizOpenAnswerWidget, QuizRateWidget, QuizMultipleAnswerWithImageWidget, LinkWidget, };
