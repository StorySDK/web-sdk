import React from 'react';
import { ImageWidgetParamsType } from '@storysdk/types';
import './ImageWidget.scss';
export declare const ImageWidget: React.FunctionComponent<{
    params: ImageWidgetParamsType;
    handleMediaLoading?: (isLoading: boolean) => void;
    width?: number;
    height?: number;
}>;
