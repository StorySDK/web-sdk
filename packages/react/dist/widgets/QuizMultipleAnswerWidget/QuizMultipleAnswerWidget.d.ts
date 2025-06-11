import React from 'react';
import { QuizMultipleAnswerWidgetElementsType, QuizMultipleAnswerWidgetParamsType } from '@storysdk/types';
import './QuizMultipleAnswerWidget.scss';
export declare const QuizMultipleAnswerWidget: React.FunctionComponent<{
    id: string;
    params: QuizMultipleAnswerWidgetParamsType;
    elementsSize?: QuizMultipleAnswerWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
