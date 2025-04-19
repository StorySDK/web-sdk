import { VideoWidgetParamsType, WidgetComponent } from '@types';
import './VideoWidget.scss';
export declare const VideoWidget: WidgetComponent<{
    params: VideoWidgetParamsType;
    isVideoPlaying?: boolean;
    isMuted?: boolean;
    isAutoplay?: boolean;
    isDisplaying?: boolean;
    handleMediaPlaying?: (isPlaying: boolean) => void;
    handleMediaLoading?: (isLoading: boolean) => void;
}>;
