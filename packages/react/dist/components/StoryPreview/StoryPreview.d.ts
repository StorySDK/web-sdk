import React from 'react';
import { StoryType } from '@storysdk/types';
import './StoryPreview.scss';
export interface StoryPreviewProps {
    story: StoryType;
    width: number | string;
    height: number | string;
    className?: string;
    isVideoMuted?: boolean;
    disableInteraction?: boolean;
    storyWidth?: number;
    storyHeight?: number;
}
export declare const StoryPreview: React.FC<StoryPreviewProps>;
