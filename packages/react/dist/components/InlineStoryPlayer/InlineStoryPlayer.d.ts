import React from 'react';
import { StoryType, Group } from '@storysdk/types';
import './InlineStoryPlayer.scss';
import '../StoryModal/StoryModal.scss';
interface InlineStoryPlayerProps {
    /** Story group to display */
    group: Group;
    /** Stories to display (if not provided, will use group.stories) */
    stories?: StoryType[];
    /** Container width (defaults to 100%) */
    width?: number | string;
    /** Container height (defaults to 100%) */
    height?: number | string;
    /** Story content width */
    storyWidth?: number;
    /** Story content height */
    storyHeight?: number;
    /** Border radius */
    borderRadius?: number;
    /** Autoplay videos */
    autoplayVideos?: boolean;
    /** Initial video muted state */
    isVideoMutedInitial?: boolean;
    /** Show navigation arrows */
    showArrows?: boolean;
    /** Arrows color */
    arrowsColor?: string;
    /** Show play/pause and mute controls */
    showControls?: boolean;
    /** Disable all user interaction */
    disableInteraction?: boolean;
    /** Loop stories */
    loop?: boolean;
    /** Starting story ID */
    startStoryId?: string;
    /** Hide progress indicators */
    isProgressHidden?: boolean;
    /** Callback when story opens */
    onOpenStory?: (groupId: string, storyId: string) => void;
    /** Callback when story closes */
    onCloseStory?: (groupId: string, storyId: string, duration: number) => void;
    /** Callback when navigating to next story */
    onNextStory?: (groupId: string, storyId: string, duration: number) => void;
    /** Callback when navigating to previous story */
    onPrevStory?: (groupId: string, storyId: string, duration: number) => void;
    /** Callback when all stories complete */
    onComplete?: (groupId: string) => void;
}
export declare const InlineStoryPlayer: React.FC<InlineStoryPlayerProps>;
export default InlineStoryPlayer;
