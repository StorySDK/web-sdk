import { QuizOpenAnswerParamsType, WidgetComponent, WidgetPositionLimitsType, WidgetPositionType } from '@types';
import './QuizOpenAnswerWidget.scss';
export declare const QuizOpenAnswerWidget: WidgetComponent<{
    params: QuizOpenAnswerParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    onAnswer?(answer: string): any;
}>;
