import React from 'react';
import { StoryType } from '../../types';
import { StoryCurrentSize } from '../StoryModal/StoryModal';
import './StoryContent.scss';
interface StoryContentProps {
    story: StoryType;
    currentStorySize: StoryCurrentSize;
    currentPaddingSize: number;
    innerHeightGap: number;
    backgroundHeightGap: number;
    noTopShadow?: boolean;
    noTopBackgroundShadow?: boolean;
    jsConfetti?: any;
    isLarge?: boolean;
    isLargeBackground?: boolean;
    handleGoToStory?: (storyId: string) => void;
}
export declare const StoryContent: React.FC<StoryContentProps>;
export {};
