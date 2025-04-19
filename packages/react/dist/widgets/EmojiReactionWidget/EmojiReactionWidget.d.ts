import { EmojiReactionWidgetParamsType, WidgetComponent, EmojiReactionWidgetElemetsType } from '@types';
import './EmojiReactionWidget.scss';
export declare const EmojiReactionWidget: WidgetComponent<{
    id: string;
    params: EmojiReactionWidgetParamsType;
    elementsSize?: EmojiReactionWidgetElemetsType;
    isReadOnly?: boolean;
    onAnswer?(emoji: string): void;
}>;
