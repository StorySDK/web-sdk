import { WidgetPositionLimitsType, WidgetPositionType } from '@features';
import { QuizRateWidgetParamsType } from '@modules';
import React from 'react';
import './QuizRateWidgetControl.scss';
interface QuizRateWidgetControlPropsType {
    params: QuizRateWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
}
export declare const QuizRateWidgetControl: React.MemoExoticComponent<(props: QuizRateWidgetControlPropsType) => JSX.Element>;
export {};
