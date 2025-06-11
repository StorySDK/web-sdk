import React from 'react';
import { SwipeUpWidgetParamsType } from '@storysdk/types';
import './SwipeUpWidget.scss';
export declare const SwipeUpWidget: React.FunctionComponent<{
    id?: string;
    params: SwipeUpWidgetParamsType;
    isReadOnly?: boolean;
    onSwipe?(): void;
    handleMuteVideo?(isMuted: boolean): void;
}>;
