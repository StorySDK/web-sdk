import React from 'react';
import { StoryType, Group, StoryContenxt } from '../../types';
import './StoryModal.scss';
interface StoryModalProps {
    currentGroup?: Group;
    stories?: StoryType[];
    isShowing: boolean;
    forbidClose?: boolean;
    isProgressHidden?: boolean;
    isShowMockup?: boolean;
    storyWidth?: number;
    storyHeight?: number;
    isLastGroup: boolean;
    isFirstGroup: boolean;
    startStoryId?: string;
    isStatusBarActive?: boolean;
    isForceCloseAvailable?: boolean;
    isCacheDisabled?: boolean;
    devMode?: 'staging' | 'development';
    isLoading?: boolean;
    isEditorMode?: boolean;
    openInExternalModal?: boolean;
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
export declare const STORY_SIZE_DEFAULT: {
    width: number;
    height: number;
};
export declare const STORY_SIZE_LARGE: {
    width: number;
    height: number;
};
export declare const DEFAULT_STORY_DURATION = 7;
export declare const PADDING_SIZE = 25;
export declare const MOBILE_BREAKPOINT = 768;
export declare const StoryModal: React.FC<StoryModalProps>;
export {};
