import { ClickMeWidgetParamsType, WidgetComponent } from '@types';
import './ClickMeWidget.scss';
export declare const ClickMeWidget: WidgetComponent<{
    params: ClickMeWidgetParamsType;
    isReadOnly?: boolean;
    onClick?(): void;
    onGoToStory?(storyId: string): void;
}>;
