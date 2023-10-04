import { QuizMultipleAnswerWithImageWidgetParamsType, WidgetComponent, QuizMultipleAnswerWidgetWithImageElementsType } from '@types';
import './QuizMultipleAnswerWithImageWidget.scss';
export declare const QuizMultipleAnswerWithImageWidget: WidgetComponent<{
    id: string;
    params: QuizMultipleAnswerWithImageWidgetParamsType;
    elementsSize?: QuizMultipleAnswerWidgetWithImageElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
