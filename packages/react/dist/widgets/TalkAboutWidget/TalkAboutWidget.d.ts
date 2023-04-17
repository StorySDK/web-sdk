import { TalkAboutWidgetParamsType, WidgetComponent, WidgetPositionType, WidgetPositionLimitsType } from '@types';
import './TalkAboutWidget.scss';
export declare const TalkAboutWidget: WidgetComponent<{
    id: string;
    params: TalkAboutWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): void;
}>;
