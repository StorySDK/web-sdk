import React from 'react';
import { ClickMeWidgetParamsType } from '@storysdk/types';
import './ClickMeWidget.scss';
declare global {
    interface Window {
        cordova?: {
            InAppBrowser?: {
                open: (url: string, target: string) => void;
            };
        };
    }
}
export declare const ClickMeWidget: React.FunctionComponent<{
    id?: string;
    params: ClickMeWidgetParamsType;
    isReadOnly?: boolean;
    onClick?(): void;
    onGoToStory?(storyId: string): void;
    onCloseStory?(): void;
    handleMuteVideo?(isMuted: boolean): void;
}>;
