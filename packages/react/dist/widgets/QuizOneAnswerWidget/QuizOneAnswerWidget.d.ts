import { QuizOneAnswerWidgetElementsType, QuizOneAnswerWidgetParamsType, WidgetComponent } from '@types';
import './QuizOneAnswerWidget.scss';
export declare const QuizOneAnswerWidget: WidgetComponent<{
    id: string;
    params: QuizOneAnswerWidgetParamsType;
    elementsSize?: QuizOneAnswerWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(id: string): any;
    onGoToStory?(storyId: string): void;
}>;
