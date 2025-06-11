import React from 'react';
import { ChooseAnswerWidgetParamsType, ChooseAnswerWidgetElemetsType } from '@storysdk/types';
import './ChooseAnswerWidget.scss';
export declare const ChooseAnswerWidget: React.FunctionComponent<{
    id: string;
    params: ChooseAnswerWidgetParamsType;
    elementsSize?: ChooseAnswerWidgetElemetsType;
    jsConfetti?: any;
    isReadOnly?: boolean;
    onAnswer?(answerId: string): void;
}>;
