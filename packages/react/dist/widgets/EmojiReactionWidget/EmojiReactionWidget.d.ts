import { EmojiReactionWidgetParamsType, WidgetComponent, WidgetPositionType, WidgetPositionLimitsType } from '@types';
import './EmojiReactionWidget.scss';
export declare const EmojiReactionWidget: WidgetComponent<{
    params: EmojiReactionWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    onAnswer?(emoji: string): void;
}>;
