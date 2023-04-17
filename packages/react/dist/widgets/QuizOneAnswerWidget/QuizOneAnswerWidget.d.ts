import { QuizOneAnswerWidgetParamsType, WidgetComponent, WidgetPositionLimitsType, WidgetPositionType } from '@types';
import './QuizOneAnswerWidget.scss';
export declare const QuizOneAnswerWidget: WidgetComponent<{
    id: string;
    params: QuizOneAnswerWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(id: string): any;
    onGoToStory?(storyId: string): void;
}>;
