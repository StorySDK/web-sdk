import { WidgetPositionLimitsType, WidgetPositionType } from '@features';
import React from 'react';
import { QuizOpenAnswerWidgetParamsType } from '../../types';
import './QuizOpenAnswerWidgetControl.scss';
interface QuizOpenAnswerWidgetControlPropsType {
    params: QuizOpenAnswerWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
}
export declare const QuizOpenAnswerWidgetControl: React.MemoExoticComponent<(props: QuizOpenAnswerWidgetControlPropsType) => JSX.Element>;
export {};
