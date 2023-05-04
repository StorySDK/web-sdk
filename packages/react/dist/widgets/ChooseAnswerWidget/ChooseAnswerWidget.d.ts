import { ChooseAnswerWidgetParamsType, WidgetComponent, WidgetPositionType, WidgetPositionLimitsType } from '@types';
import './ChooseAnswerWidget.scss';
export declare const ChooseAnswerWidget: WidgetComponent<{
    id: string;
    params: ChooseAnswerWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    jsConfetti?: any;
    isReadOnly?: boolean;
    onAnswer?(answerId: string): void;
}>;
