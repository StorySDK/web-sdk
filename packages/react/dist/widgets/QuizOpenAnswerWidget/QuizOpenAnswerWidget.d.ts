import { QuizOpenAnswerWidgetParamsType, WidgetComponent, WidgetPositionLimitsType, WidgetPositionType } from '@types';
import './QuizOpenAnswerWidget.scss';
export declare const QuizOpenAnswerWidget: WidgetComponent<{
    params: QuizOpenAnswerWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
