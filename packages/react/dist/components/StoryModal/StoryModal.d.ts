import React from 'react';
import { StoryType, Group, StoryContenxt } from '../../types';
import './StoryModal.scss';
interface StoryModalProps {
    currentGroup?: Group;
    stories?: StoryType[];
    isShowing: boolean;
    forbidClose?: boolean;
    isShowMockup?: boolean;
    isLastGroup: boolean;
    isFirstGroup: boolean;
    startStoryId?: string;
    isStatusBarActive?: boolean;
    isForceCloseAvailable?: boolean;
    isCacheDisabled?: boolean;
    isLoading?: boolean;
    isEditorMode?: boolean;
    onClose(): void;
    onPrevGroup(): void;
    onNextGroup(): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onOpenStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string): void;
    onStartQuiz?(groupId: string, storyId?: string): void;
    onFinishQuiz?(groupId: string, storyId?: string): void;
}
export declare const StoryContext: React.Context<StoryContenxt>;
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
