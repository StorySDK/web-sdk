import React from 'react';
import { QuizOneAnswerWidgetElementsType, QuizOneAnswerWidgetParamsType } from '@storysdk/types';
import './QuizOneAnswerWidget.scss';
export declare const QuizOneAnswerWidget: React.FunctionComponent<{
    id: string;
    params: QuizOneAnswerWidgetParamsType;
    elementsSize?: QuizOneAnswerWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(id: string): any;
    onGoToStory?(storyId: string): void;
}>;
