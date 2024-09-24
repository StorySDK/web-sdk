import React from 'react';
import { StoryType } from '../../types';
import { StoryCurrentSize } from '../StoryModal/StoryModal';
import './StoryContent.scss';
import '../StoryModal/StoryModal.scss';
interface StoryContentProps {
    story: StoryType;
    isMobile?: boolean;
    isDisplaying?: boolean;
    isAutoplayVideos?: boolean;
    isLoaded?: boolean;
    contentWidth: number | string;
    contentHeight: number | string;
    currentStorySize: StoryCurrentSize;
    desktopContainerWidth: number;
    noTopShadow?: boolean;
    noTopBackgroundShadow?: boolean;
    isUnfilledBackground?: boolean;
    jsConfetti?: any;
    isLarge?: boolean;
    isMediaLoading?: boolean;
    handleLoadStory?: (storyId: string) => void;
    handleGoToStory?: (storyId: string) => void;
    handleMediaLoading: (isLoading: boolean) => void;
    handleVideoPlaying: (isPlaying: boolean) => void;
    handleVideoBackgroundPlaying: (isPlaying: boolean) => void;
}
export declare const StoryContent: React.FC<StoryContentProps>;
export {};
