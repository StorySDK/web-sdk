import React from 'react';
import { StoryType, Group } from '../../types';
import './StoryModal.scss';
interface StoryModalProps {
    currentGroup: Group;
    stories: StoryType[];
    isShowing: boolean;
    isShowMockup?: boolean;
    isLastGroup: boolean;
    isFirstGroup: boolean;
    startStoryId?: string;
    isForceCloseAvailable?: boolean;
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
export declare type StoryCurrentSize = {
    width: number;
    height: number;
};
export declare const STORY_SIZE: {
    width: number;
    height: number;
};
export declare const STORY_SIZE_LARGE: {
    width: number;
    height: number;
};
export declare const PADDING_SIZE = 20;
export declare const MOBILE_BREAKPOINT = 768;
export declare const StoryModal: React.FC<StoryModalProps>;
export {};
