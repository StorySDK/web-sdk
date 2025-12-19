import React from 'react';
import { Group } from '@storysdk/types';
import './InlineStoryPlayer.scss';
interface InlineStoryPlayerWithDataProps {
    /** Your StorySDK app token */
    token: string;
    /** Optional group ID to display specific group. If not provided, displays first available group */
    groupId?: string;
    /** Container width (defaults to 100%) */
    width?: number | string;
    /** Container height (defaults to auto based on aspect ratio) */
    height?: number | string;
    /** Story content width (defaults to 360) */
    storyWidth?: number;
    /** Story content height (defaults to 640) */
    storyHeight?: number;
    /** Initial story ID to start with */
    startStoryId?: string;
    /** Hide progress indicators */
    isProgressHidden?: boolean;
    /** Show status bar */
    isStatusBarActive?: boolean;
    /** Disable caching */
    isCacheDisabled?: boolean;
    /** Dev mode */
    devMode?: 'staging' | 'development';
    /** Background color */
    backgroundColor?: string;
    /** Autoplay videos */
    autoplayVideos?: boolean;
    /** Initial muted state for videos */
    isVideoMutedInitial?: boolean;
    /** Show navigation arrows */
    showArrows?: boolean;
    /** Arrows color */
    arrowsColor?: string;
    /** Border radius */
    borderRadius?: number;
    /** Show controls (play/pause, mute) */
    showControls?: boolean;
    /** Disable user interaction with widgets */
    disableInteraction?: boolean;
    /** Loop stories */
    loop?: boolean;
    /** Pause on hover */
    pauseOnHover?: boolean;
    /** Custom loader component */
    loader?: React.ReactNode;
    /** Custom error component */
    errorComponent?: React.ReactNode;
    /** Callback when data is loaded */
    onDataLoaded?(group: Group): void;
    /** Callback when error occurs */
    onError?(error: Error): void;
    /** Callback when story opens */
    onOpenStory?(groupId: string, storyId: string): void;
    /** Callback when story closes */
    onCloseStory?(groupId: string, storyId: string, duration: number): void;
    /** Callback when navigating to next story */
    onNextStory?(groupId: string, storyId: string): void;
    /** Callback when navigating to previous story */
    onPrevStory?(groupId: string, storyId: string): void;
    /** Callback when quiz starts */
    onStartQuiz?(groupId: string, storyId?: string): void;
    /** Callback when quiz finishes */
    onFinishQuiz?(groupId: string, storyId?: string): void;
    /** Callback when all stories are viewed */
    onComplete?(groupId: string): void;
}
export declare const InlineStoryPlayerWithData: React.FC<InlineStoryPlayerWithDataProps>;
export default InlineStoryPlayerWithData;
