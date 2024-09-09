/// <reference types="react" />
import './StoryVideoBackground.scss';
declare type PropTypes = {
    src: string;
    isLoading?: boolean;
    autoplay?: boolean;
    isFilled?: boolean;
    isPlaying?: boolean;
    handleVideoBackgroundPlaying?: (isPlaying: boolean) => void;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};
export declare const StoryVideoBackground: ({ src, autoplay, isLoading, isPlaying, handleVideoBackgroundPlaying, isFilled, onLoadStart, onLoadEnd }: PropTypes) => JSX.Element;
export {};
