import { EmojiItemType } from '@features';
export interface QuizOneAnswerWidgetParamsType {
    title: string;
    color?: string;
    answers: Array<{
        id: string;
        title: string;
        emoji: EmojiItemType | undefined;
    }>;
    isTitleHidden: boolean;
    storyId?: string;
}
