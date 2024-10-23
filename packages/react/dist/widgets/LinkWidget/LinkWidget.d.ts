import { LinkWidgetParamsType, WidgetComponent } from '@types';
import './LinkWidget.scss';
export declare const LinkWidget: WidgetComponent<{
    params: LinkWidgetParamsType;
    isReadOnly?: boolean;
    handleMuteVideo?(isMuted: boolean): void;
}>;
