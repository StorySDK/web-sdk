import React from 'react';
import { SliderWidgetElementsType, SliderWidgetParamsType } from '@storysdk/types';
import './SliderWidget.scss';
export declare const SliderWidget: React.FunctionComponent<{
    id: string;
    storyId: string;
    params: SliderWidgetParamsType;
    elementsSize?: SliderWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(value: number): void;
}>;
