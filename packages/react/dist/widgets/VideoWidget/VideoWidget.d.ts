import { VideoWidgetParamsType, WidgetComponent } from '@types';
import './VideoWidget.scss';
export declare const VideoWidget: WidgetComponent<{
    params: VideoWidgetParamsType;
    autoplay?: boolean;
    isMuted?: boolean;
    isDisplaying?: boolean;
    handleMediaPlaying?: (isPlaying: boolean) => void;
    handleMediaLoading?: (isLoading: boolean) => void;
}>;
