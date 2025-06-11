import React from 'react';
import { EmojiReactionWidgetParamsType, EmojiReactionWidgetElemetsType } from '@storysdk/types';
import './EmojiReactionWidget.scss';
export declare const EmojiReactionWidget: React.FunctionComponent<{
    id: string;
    params: EmojiReactionWidgetParamsType;
    elementsSize?: EmojiReactionWidgetElemetsType;
    isReadOnly?: boolean;
    onAnswer?(emoji: string): void;
}>;
