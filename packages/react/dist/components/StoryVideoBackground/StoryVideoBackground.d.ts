/// <reference types="react" />
import './StoryVideoBackground.scss';
declare type PropTypes = {
    src: string;
    isLoading?: boolean;
    isMuted?: boolean;
    autoplay?: boolean;
    isFilled?: boolean;
    isPlaying?: boolean;
    isDisplaying?: boolean;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};
export declare const StoryVideoBackground: ({ src, autoplay, isLoading, isPlaying, isDisplaying, isMuted, isFilled, onLoadStart, onLoadEnd }: PropTypes) => JSX.Element;
export {};
