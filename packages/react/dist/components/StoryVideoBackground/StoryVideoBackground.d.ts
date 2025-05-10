import React from 'react';
import { VideoCache } from '../../services/VideoCache';
import './StoryVideoBackground.scss';
export declare const preloadVideo: typeof VideoCache.preloadVideo;
type PropTypes = {
    src: string;
    nextSrc?: string;
    isLoading?: boolean;
    isMuted?: boolean;
    isFilled?: boolean;
    isPlaying?: boolean;
    isDisplaying?: boolean;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};
export declare const StoryVideoBackground: ({ src, nextSrc, isLoading, isPlaying, isDisplaying, isMuted, isFilled, onLoadStart, onLoadEnd, }: PropTypes) => React.JSX.Element;
export {};
