import React from 'react';
import { StoryType } from '../../types';
import { StoryCurrentSize } from '../StoryModal/StoryModal';
import './StoryContent.scss';
interface StoryContentProps {
    story: StoryType;
    currentStorySize: StoryCurrentSize;
    backgroundHeightGap: number;
    desktopContainerWidth: number;
    noTopShadow?: boolean;
    noTopBackgroundShadow?: boolean;
    isUnfilledBackground?: boolean;
    jsConfetti?: any;
    isLarge?: boolean;
    handleGoToStory?: (storyId: string) => void;
}
export declare const StoryContent: React.FC<StoryContentProps>;
export {};
