import React from 'react';
interface StoryGroupsProps {
    token: string;
    onGroupClick?: (groupId: string) => void;
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupTitleSize?: number;
    groupClassName?: string;
    groupsClassName?: string;
    activeGroupOutlineColor?: string;
    groupsOutlineColor?: string;
    arrowsColor?: string;
    backgroundColor?: string;
    isDebugMode?: boolean;
    devMode?: 'staging' | 'development';
    onError?: (error: {
        message: string;
        details?: string;
    }) => void;
}
/**
 * Component for displaying a list of story groups
 * Uses WebView to render the groups and handles group click events
 */
export declare const StoryGroups: React.FC<StoryGroupsProps>;
export {};
