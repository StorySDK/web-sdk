import React from 'react';
import './StoryVideoBackground.scss';
type PropTypes = {
    src: string;
    isLoading?: boolean;
    isMuted?: boolean;
    isFilled?: boolean;
    isPlaying?: boolean;
    isDisplaying?: boolean;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};
export declare const StoryVideoBackground: ({ src, isLoading, isPlaying, isDisplaying, isMuted, isFilled, onLoadStart, onLoadEnd }: PropTypes) => React.JSX.Element;
export {};
