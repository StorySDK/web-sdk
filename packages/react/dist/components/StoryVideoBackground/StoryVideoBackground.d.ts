/// <reference types="react" />
import './StoryVideoBackground.scss';
declare type PropTypes = {
    src: string;
    isLoading?: boolean;
    autoplay?: boolean;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};
export declare const StoryVideoBackground: ({ src, autoplay, isLoading, onLoadStart, onLoadEnd }: PropTypes) => JSX.Element;
export {};
