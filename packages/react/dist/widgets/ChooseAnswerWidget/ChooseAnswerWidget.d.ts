import { ChooseAnswerWidgetParamsType, WidgetComponent, ChooseAnswerWidgetElemetsType } from '@types';
import './ChooseAnswerWidget.scss';
export declare const ChooseAnswerWidget: WidgetComponent<{
    id: string;
    params: ChooseAnswerWidgetParamsType;
    elementsSize?: ChooseAnswerWidgetElemetsType;
    jsConfetti?: any;
    isReadOnly?: boolean;
    onAnswer?(answerId: string): void;
}>;
