import { QuizRateWidgetElementsType, QuizRateWidgetParamsType, WidgetComponent } from '@types';
import './QuizRateWidget.scss';
export declare const QuizRateWidget: WidgetComponent<{
    id?: string;
    params: QuizRateWidgetParamsType;
    elementsSize: QuizRateWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
