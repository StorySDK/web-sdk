import React from 'react';
import { QuizRateWidgetElementsType, QuizRateWidgetParamsType } from '@storysdk/types';
import './QuizRateWidget.scss';
export declare const QuizRateWidget: React.FunctionComponent<{
    id?: string;
    params: QuizRateWidgetParamsType;
    elementsSize: QuizRateWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
