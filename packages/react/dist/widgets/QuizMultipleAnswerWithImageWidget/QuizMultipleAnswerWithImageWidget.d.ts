import { WidgetPositionLimitsType, WidgetPositionType, QuizMultipleAnswerWithImageParamsType, WidgetComponent } from '@types';
import './QuizMultipleAnswerWithImageWidget.scss';
export declare const QuizMultipleAnswerWithImageWidget: WidgetComponent<{
    params: QuizMultipleAnswerWithImageParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string[]): any;
    onGoToStory?(storyId: string): void;
}>;
