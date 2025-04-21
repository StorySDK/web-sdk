import React from 'react';
interface StoryModalProps {
    token: string;
    groupId?: string;
    onClose?: () => void;
    storyWidth?: number;
    storyHeight?: number;
    isShowMockup?: boolean;
    isShowLabel?: boolean;
    isStatusBarActive?: boolean;
    arrowsColor?: string;
    backgroundColor?: string;
    isDebugMode?: boolean;
    devMode?: 'staging' | 'development';
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupTitleSize?: number;
    groupClassName?: string;
    groupsClassName?: string;
    forbidClose?: boolean;
    autoplay?: boolean;
    onError?: (error: {
        message: string;
        details?: string;
    }) => void;
    onEvent?: (event: string, data: any) => void;
}
/**
 * Component for displaying stories in a modal window
 * Uses WebView to render stories and handles modal close events
 */
export declare const StoryModal: React.FC<StoryModalProps>;
export {};
