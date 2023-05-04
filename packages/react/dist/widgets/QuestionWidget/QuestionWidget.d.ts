import { QuestionWidgetParamsType, WidgetComponent, WidgetPositionType, WidgetPositionLimitsType } from '@types';
import './QuestionWidget.scss';
export declare const QuestionWidget: WidgetComponent<{
    id: string;
    params: QuestionWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
}>;
