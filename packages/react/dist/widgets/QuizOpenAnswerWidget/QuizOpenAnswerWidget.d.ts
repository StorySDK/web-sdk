import React from 'react';
import { QuizOpenAnswerWidgetElementsType, QuizOpenAnswerWidgetParamsType } from '@storysdk/types';
import './QuizOpenAnswerWidget.scss';
export declare const QuizOpenAnswerWidget: React.FunctionComponent<{
    id: string;
    params: QuizOpenAnswerWidgetParamsType;
    elementsSize?: QuizOpenAnswerWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
