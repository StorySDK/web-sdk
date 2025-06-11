import React from 'react';
import { QuizMultipleAnswerWithImageWidgetParamsType, QuizMultipleAnswerWidgetWithImageElementsType } from '@storysdk/types';
import './QuizMultipleAnswerWithImageWidget.scss';
export declare const QuizMultipleAnswerWithImageWidget: React.FunctionComponent<{
    id: string;
    params: QuizMultipleAnswerWithImageWidgetParamsType;
    elementsSize?: QuizMultipleAnswerWidgetWithImageElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): any;
    onGoToStory?(storyId: string): void;
}>;
