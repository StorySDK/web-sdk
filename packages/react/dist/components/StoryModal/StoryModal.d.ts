import React from 'react';
import { StoryType, Group, StoryContenxt } from '@storysdk/types';
import './StoryModal.scss';
interface StoryModalProps {
    currentGroup?: Group;
    stories?: StoryType[];
    isShowing: boolean;
    forbidClose?: boolean;
    isProgressHidden?: boolean;
    isShowMockup?: boolean;
    isShowLabel?: boolean;
    storyWidth?: number;
    storyHeight?: number;
    isLastGroup: boolean;
    isFirstGroup: boolean;
    startStoryId?: string;
    isStatusBarActive?: boolean;
    isForceCloseAvailable?: boolean;
    isCacheDisabled?: boolean;
    isInReactNativeWebView?: boolean;
    devMode?: 'staging' | 'development';
    arrowsColor?: string;
    isLoading?: boolean;
    isEditorMode?: boolean;
    openInExternalModal?: boolean;
    backgroundColor?: string;
    container?: Element | HTMLDivElement | null;
    token?: string;
    onClose(): void;
    onPrevGroup(): void;
    onNextGroup(): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onOpenStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string, duration: number): void;
    onStartQuiz?(groupId: string, storyId?: string): void;
    onFinishQuiz?(groupId: string, storyId?: string): void;
    onModalOpen?(groupId: string, storyId: string): void;
    onModalClose?(groupId: string, storyId: string): void;
}
export declare const StoryContext: React.Context<StoryContenxt>;
export type StoryCurrentSize = {
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
