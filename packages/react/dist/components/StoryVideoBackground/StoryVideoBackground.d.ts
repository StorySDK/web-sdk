/// <reference types="react" />
import './StoryVideoBackground.scss';
declare type PropTypes = {
    src: string;
    isLoading?: boolean;
    autoplay?: boolean;
    isFilled?: boolean;
    isPlaying?: boolean;
    setIsPlaying?: (isPlaying: boolean) => void;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};
export declare const StoryVideoBackground: ({ src, autoplay, isLoading, isPlaying, setIsPlaying, isFilled, onLoadStart, onLoadEnd }: PropTypes) => JSX.Element;
export {};
