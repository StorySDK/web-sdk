/// <reference types="react" />
import './StoryVideoBackground.scss';
declare type PropTypes = {
    src: string;
    isLoading?: boolean;
    autoplay?: boolean;
    isFilled?: boolean;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};
export declare const StoryVideoBackground: ({ src, autoplay, isLoading, isFilled, onLoadStart, onLoadEnd }: PropTypes) => JSX.Element;
export {};
