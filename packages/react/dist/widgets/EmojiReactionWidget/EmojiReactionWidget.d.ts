import { EmojiReactionWidgetParamsType, WidgetComponent, WidgetPositionType, WidgetPositionLimitsType } from '@types';
import './EmojiReactionWidget.scss';
export declare const EmojiReactionWidget: WidgetComponent<{
    id: string;
    params: EmojiReactionWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    isReadOnly?: boolean;
    onAnswer?(emoji: string): void;
}>;
