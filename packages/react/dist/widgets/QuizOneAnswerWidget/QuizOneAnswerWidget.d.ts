import { QuizOneAnswerParamsType, WidgetComponent, WidgetPositionLimitsType, WidgetPositionType } from '@types';
import './QuizOneAnswerWidget.scss';
export declare const QuizOneAnswerWidget: WidgetComponent<{
    params: QuizOneAnswerParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    onAnswer?(id: string): any;
    onGoToStory?(storyId: string): void;
}>;
