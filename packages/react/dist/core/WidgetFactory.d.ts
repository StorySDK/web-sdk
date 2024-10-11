import React from 'react';
import { StoryCurrentSize } from '@components';
import { WidgetObjectType } from '../types';
interface WidgetFactoryProps {
    storyId: string;
    currentStorySize: StoryCurrentSize;
    jsConfetti?: any;
    isDisplaying?: boolean;
    isVideoMuted?: boolean;
    isAutoplayVideos?: boolean;
    widget: WidgetObjectType;
    handleGoToStory?: (storyId: string) => void;
    handleVideoPlaying?: (isPlaying: boolean) => void;
    handleVideoBackgroundPlaying?: (isPlaying: boolean) => void;
    handleMediaLoading?: (isLoading: boolean) => void;
}
export declare class WidgetFactory extends React.Component<WidgetFactoryProps> {
    private makeWidget;
    render(): JSX.Element;
}
export {};
