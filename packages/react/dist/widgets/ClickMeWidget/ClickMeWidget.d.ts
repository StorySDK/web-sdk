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
    params: ClickMeWidgetParamsType;
    isReadOnly?: boolean;
    onClick?(): void;
    onGoToStory?(storyId: string): void;
    handleMuteVideo?(isMuted: boolean): void;
}>;
