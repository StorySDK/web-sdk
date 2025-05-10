import { VideoWidgetParamsType, WidgetComponent } from '@types';
import { VideoCache } from '../../services/VideoCache';
import './VideoWidget.scss';
export declare const preloadVideo: typeof VideoCache.preloadVideo;
export declare const VideoWidget: WidgetComponent<{
    params: VideoWidgetParamsType;
    isVideoPlaying?: boolean;
    isMuted?: boolean;
    isAutoplay?: boolean;
    isDisplaying?: boolean;
    handleMediaPlaying?: (isPlaying: boolean) => void;
    handleMediaLoading?: (isLoading: boolean) => void;
    nextVideoUrl?: string;
}>;
