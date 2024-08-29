import React from 'react';
import { StoryCurrentSize } from '@components';
import { WidgetObjectType } from '../types';
interface WidgetFactoryProps {
    storyId: string;
    currentStorySize: StoryCurrentSize;
    jsConfetti?: any;
    isDisplaying?: boolean;
    isAutoplayVideos?: boolean;
    widget: WidgetObjectType;
    handleGoToStory?: (storyId: string) => void;
}
export declare class WidgetFactory extends React.Component<WidgetFactoryProps> {
    private makeWidget;
    render(): JSX.Element;
}
export {};
