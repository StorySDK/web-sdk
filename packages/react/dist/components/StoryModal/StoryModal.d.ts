import React from 'react';
import './StoryModal.scss';
import { StoryType, GroupType } from '../../types';
interface StoryModalProps {
    currentGroup: GroupType;
    stories: StoryType[];
    isShowing: boolean;
    isLastGroup: boolean;
    isFirstGroup: boolean;
    startStoryId?: string;
    onClose(): void;
    onPrevGroup(): void;
    onNextGroup(): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onOpenStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string): void;
}
export declare const StoryContext: React.Context<{
    currentStoryId: string;
    playStatusChange?: any;
    confetti?: any;
}>;
export declare const StoryModal: React.FC<StoryModalProps>;
export {};
