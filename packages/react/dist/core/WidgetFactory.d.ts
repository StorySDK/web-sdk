import React from 'react';
import { WidgetObjectType } from '../types';
interface WidgetFactoryProps {
    storyId: string;
    jsConfetti?: any;
    widget: WidgetObjectType;
    handleGoToStory?: (storyId: string) => void;
}
export declare class WidgetFactory extends React.Component<WidgetFactoryProps> {
    private makeWidget;
    render(): JSX.Element;
}
export {};
