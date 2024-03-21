import React from 'react';
import { GroupsListProps } from '@storysdk/react';
declare const withGroupsData: (GroupsList: React.FC<GroupsListProps>, options?: {
    groupImageWidth?: number | undefined;
    groupImageHeight?: number | undefined;
    groupTitleSize?: number | undefined;
    groupClassName?: string | undefined;
    isShowMockup?: boolean | undefined;
    isStatusBarActive?: boolean | undefined;
    storyWidth?: number | undefined;
    storyHeight?: number | undefined;
    groupsClassName?: string | undefined;
    autoplay?: boolean | undefined;
    openInExternalModal?: boolean | undefined;
    groupId?: string | undefined;
    startStoryId?: string | undefined;
    forbidClose?: boolean | undefined;
    devMode?: "staging" | "development" | undefined;
} | undefined) => () => JSX.Element;
export default withGroupsData;
