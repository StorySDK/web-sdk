import React from 'react';
import { QuestionWidgetParamsType, QuestionWidgetElementsType } from '@storysdk/types';
import './QuestionWidget.scss';
export declare const QuestionWidget: React.FunctionComponent<{
    id: string;
    params: QuestionWidgetParamsType;
    elementsSize?: QuestionWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
}>;
