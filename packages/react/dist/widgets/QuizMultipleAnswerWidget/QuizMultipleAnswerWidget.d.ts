import { QuizMultipleAnswerWidgetParamsType, WidgetComponent, WidgetPositionLimitsType, WidgetPositionType } from '@types';
import './QuizMultipleAnswerWidget.scss';
export declare const QuizMultipleAnswerWidget: WidgetComponent<{
    id: string;
    params: QuizMultipleAnswerWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
