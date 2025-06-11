import React from 'react';
import { VideoWidgetParamsType } from '@storysdk/types';
import { VideoCache } from '../../services/VideoCache';
import './VideoWidget.scss';
export declare const preloadVideo: typeof VideoCache.preloadVideo;
export declare const VideoWidget: React.FunctionComponent<{
    params: VideoWidgetParamsType;
    isVideoPlaying?: boolean;
    isMuted?: boolean;
    isAutoplay?: boolean;
    isDisplaying?: boolean;
    handleMediaPlaying?: (isPlaying: boolean) => void;
    handleMediaLoading?: (isLoading: boolean) => void;
    nextVideoUrl?: string;
}>;
