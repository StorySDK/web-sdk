import React from 'react';
import './StoryModal.scss';
import { StoryType, GroupType } from '../../types';
interface StoryModalProps {
    currentGroup: GroupType;
    stories: StoryType[];
    showed: boolean;
    isLastGroup: boolean;
    isFirstGroup: boolean;
    onClose(): void;
    onPrevGroup(): void;
    onNextGroup(): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onOpenStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string): void;
}
export declare const CurrentStoryContext: React.Context<string>;
export declare const StoryModal: React.FC<StoryModalProps>;
export {};
