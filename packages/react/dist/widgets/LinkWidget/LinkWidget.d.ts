import { LinkWidgetParamsType, WidgetComponent } from '@types';
import './LinkWidget.scss';
export declare const LinkWidget: WidgetComponent<{
    params: LinkWidgetParamsType;
    isReadOnly?: boolean;
    handleMediaPlaying?: (isPlaying: boolean) => void;
    handleVideoBackgroundPlaying?: (isPlaying: boolean) => void;
}>;
