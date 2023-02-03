import { QuizRateParamsType, WidgetComponent, WidgetPositionLimitsType, WidgetPositionType } from '@types';
import './QuizRateWidget.scss';
export declare const QuizRateWidget: WidgetComponent<{
    params: QuizRateParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    onAnswer?(answer: string): any;
}>;
