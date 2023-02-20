import { QuizOneAnswerParamsType, WidgetComponent, WidgetPositionLimitsType, WidgetPositionType } from '@types';
import './QuizOneAnswerWidget.scss';
export declare const QuizOneAnswerWidget: WidgetComponent<{
    params: QuizOneAnswerParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(id: string): any;
    onGoToStory?(storyId: string): void;
}>;
