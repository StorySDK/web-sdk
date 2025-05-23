import { ClickMeWidgetParamsType, WidgetComponent } from '@types';
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
export declare const ClickMeWidget: WidgetComponent<{
    id?: string;
    params: ClickMeWidgetParamsType;
    isReadOnly?: boolean;
    onClick?(): void;
    onGoToStory?(storyId: string): void;
    onCloseStory?(): void;
    handleMuteVideo?(isMuted: boolean): void;
}>;
