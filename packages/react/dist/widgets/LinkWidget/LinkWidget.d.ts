import React from 'react';
import { LinkWidgetParamsType } from '@storysdk/types';
import './LinkWidget.scss';
export declare const LinkWidget: React.FunctionComponent<{
    id?: string;
    params: LinkWidgetParamsType;
    isReadOnly?: boolean;
    onClick?: () => void;
    handleMuteVideo?(isMuted: boolean): void;
}>;
