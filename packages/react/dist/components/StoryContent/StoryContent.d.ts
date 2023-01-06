import React from 'react';
import { StoryType } from '../../types';
import './StoryContent.scss';
interface StoryContentProps {
    story: StoryType;
    noTopShadow?: boolean;
    jsConfetti?: any;
    handleGoToStory?: (storyId: string) => void;
}
export declare const StoryContent: React.FC<StoryContentProps>;
export {};
