import { QuizOpenAnswerWidgetElementsType, QuizOpenAnswerWidgetParamsType, WidgetComponent } from '@types';
import './QuizOpenAnswerWidget.scss';
export declare const QuizOpenAnswerWidget: WidgetComponent<{
    id: string;
    params: QuizOpenAnswerWidgetParamsType;
    elementsSize?: QuizOpenAnswerWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
