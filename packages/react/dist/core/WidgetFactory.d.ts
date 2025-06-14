import React from 'react';
import { StoryCurrentSize } from '@components';
import { WidgetObjectType } from '@storysdk/types';
interface WidgetFactoryProps {
    storyId: string;
    currentStorySize: StoryCurrentSize;
    jsConfetti?: any;
    isDisplaying?: boolean;
    isVideoMuted?: boolean;
    isVideoPlaying?: boolean;
    isAutoplayVideos?: boolean;
    widget: WidgetObjectType;
    handleMuteVideo?: (isMuted: boolean) => void;
    handleGoToStory?: (storyId: string) => void;
    handleCloseStory?: () => void;
    handleVideoPlaying?: (isPlaying: boolean) => void;
    handleMediaLoading?: (isLoading: boolean) => void;
}
export declare class WidgetFactory extends React.Component<WidgetFactoryProps> {
    private makeWidget;
    render(): React.JSX.Element;
}
export {};
