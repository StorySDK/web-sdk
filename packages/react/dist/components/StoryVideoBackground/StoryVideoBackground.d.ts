/// <reference types="react" />
import './StoryVideoBackground.scss';
declare type PropTypes = {
    src: string;
    isLoading?: boolean;
    isMuted?: boolean;
    isFilled?: boolean;
    isPlaying?: boolean;
    isDisplaying?: boolean;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};
export declare const StoryVideoBackground: ({ src, isLoading, isPlaying, isDisplaying, isMuted, isFilled, onLoadStart, onLoadEnd }: PropTypes) => JSX.Element;
export {};
