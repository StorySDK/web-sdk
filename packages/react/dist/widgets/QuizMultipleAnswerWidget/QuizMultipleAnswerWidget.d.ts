import { QuizMultipleAnswerWidgetElementsType, QuizMultipleAnswerWidgetParamsType, WidgetComponent } from '@types';
import './QuizMultipleAnswerWidget.scss';
export declare const QuizMultipleAnswerWidget: WidgetComponent<{
    id: string;
    params: QuizMultipleAnswerWidgetParamsType;
    elementsSize?: QuizMultipleAnswerWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
