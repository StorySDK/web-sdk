import { QuestionWidgetParamsType, WidgetComponent, QuestionWidgetElementsType } from '@types';
import './QuestionWidget.scss';
export declare const QuestionWidget: WidgetComponent<{
    id: string;
    params: QuestionWidgetParamsType;
    elementsSize?: QuestionWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
}>;
