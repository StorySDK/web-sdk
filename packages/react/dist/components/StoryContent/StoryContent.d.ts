import React from 'react';
import { StoryType } from '../../types';
import { StoryCurrentSize } from '../StoryModal/StoryModal';
import './StoryContent.scss';
interface StoryContentProps {
    story: StoryType;
    isMobile?: boolean;
    isDisplaying?: boolean;
    isAutoplayVideos?: boolean;
    contentHeight: number | string;
    currentStorySize: StoryCurrentSize;
    desktopContainerWidth: number;
    noTopShadow?: boolean;
    noTopBackgroundShadow?: boolean;
    isUnfilledBackground?: boolean;
    jsConfetti?: any;
    isLarge?: boolean;
    handleGoToStory?: (storyId: string) => void;
    handleMediaLoading: (isLoading: boolean) => void;
    isMediaLoading?: boolean;
}
export declare const StoryContent: React.FC<StoryContentProps>;
export {};
