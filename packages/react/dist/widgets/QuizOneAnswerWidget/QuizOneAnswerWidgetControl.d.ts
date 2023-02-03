import { WidgetPositionLimitsType, WidgetPositionType } from '@features';
import { QuizOneAnswerWidgetParamsType } from '@modules';
import React from 'react';
import './QuizOneAnswerWidgetControl.scss';
interface QuizOneAnswerWidgetControlPropsType {
    params: QuizOneAnswerWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
}
export declare const QuizOneAnswerWidgetControl: React.MemoExoticComponent<(props: QuizOneAnswerWidgetControlPropsType) => JSX.Element>;
export {};
