import { ClickMeWidgetParamsType, WidgetComponent } from '@types';
import './ClickMeWidget.scss';
export declare const ClickMeWidget: WidgetComponent<{
    params: ClickMeWidgetParamsType;
    onClick?(): void;
    onGoToStory?(storyId: string): void;
}>;
