import { WidgetPositionLimitsType, WidgetPositionType, QuizMultipleAnswerWithImageParamsType, WidgetComponent } from '@types';
import './QuizMultipleAnswerWithImageWidget.scss';
export declare const QuizMultipleAnswerWithImageWidget: WidgetComponent<{
    params: QuizMultipleAnswerWithImageParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    onAnswer?(answer: string[]): any;
}>;
