import { SwipeUpWidgetParamsType, WidgetComponent } from '@types';
import './SwipeUpWidget.scss';
export declare const SwipeUpWidget: WidgetComponent<{
    params: SwipeUpWidgetParamsType;
    isReadOnly?: boolean;
    onSwipe?(): void;
    handleMuteVideo?(isMuted: boolean): void;
}>;
