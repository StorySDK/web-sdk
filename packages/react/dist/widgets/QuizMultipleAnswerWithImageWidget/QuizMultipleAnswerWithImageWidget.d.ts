import { WidgetPositionLimitsType, WidgetPositionType, QuizMultipleAnswerWithImageWidgetParamsType, WidgetComponent } from '@types';
import './QuizMultipleAnswerWithImageWidget.scss';
export declare const QuizMultipleAnswerWithImageWidget: WidgetComponent<{
    params: QuizMultipleAnswerWithImageWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string[]): any;
    onGoToStory?(storyId: string): void;
}>;
