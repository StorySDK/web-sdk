import React from 'react';
import { TalkAboutWidgetParamsType, TalkAboutElementsType } from '@storysdk/types';
import './TalkAboutWidget.scss';
export declare const TalkAboutWidget: React.FunctionComponent<{
    id: string;
    params: TalkAboutWidgetParamsType;
    elementsSize?: TalkAboutElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): void;
}>;
