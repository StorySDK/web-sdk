import React from 'react';
import { WidgetObjectType } from '../types';
interface WidgetFactoryProps {
    storyId: string;
    canvasRef?: any;
    widget: WidgetObjectType;
}
export declare class WidgetFactory extends React.Component<WidgetFactoryProps> {
    private makeWidget;
    render(): JSX.Element;
}
export {};
