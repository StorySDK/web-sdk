import { LinkWidgetParamsType, WidgetComponent } from '@types';
import './LinkWidget.scss';
export declare const LinkWidget: WidgetComponent<{
    id?: string;
    params: LinkWidgetParamsType;
    isReadOnly?: boolean;
    onClick?: () => void;
    handleMuteVideo?(isMuted: boolean): void;
}>;
