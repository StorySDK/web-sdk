import { TalkAboutWidgetParamsType, WidgetComponent, WidgetPositionType, WidgetPositionLimitsType } from '../../types';
import './TalkAboutWidget.scss';
export declare const TalkAboutWidget: WidgetComponent<{
    params: TalkAboutWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    onAnswer?(answer: string): void;
}>;
