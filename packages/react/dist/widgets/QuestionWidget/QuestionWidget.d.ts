import { QuestionWidgetParamsType, WidgetComponent, WidgetPositionType, WidgetPositionLimitsType } from '../../types';
import './QuestionWidget.scss';
export declare const QuestionWidget: WidgetComponent<{
    params: QuestionWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    onAnswer?(answer: string): any;
}>;
