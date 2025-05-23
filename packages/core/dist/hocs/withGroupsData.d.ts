import React from 'react';
import { GroupsListProps } from '@storysdk/react';
export interface DurationProps {
    storyId?: string;
    groupId: string;
    startTime: number;
    endTime?: number;
}
declare const withGroupsData: (GroupsList: React.FC<GroupsListProps>, options?: {
    groupImageWidth?: number | undefined;
    groupImageHeight?: number | undefined;
    groupTitleSize?: number | undefined;
    groupClassName?: string | undefined;
    activeGroupOutlineColor?: string | undefined;
    groupsOutlineColor?: string | undefined;
    isShowMockup?: boolean | undefined;
    isShowLabel?: boolean | undefined;
    isDebugMode?: boolean | undefined;
    arrowsColor?: string | undefined;
    backgroundColor?: string | undefined;
    isStatusBarActive?: boolean | undefined;
    storyWidth?: number | undefined;
    storyHeight?: number | undefined;
    preventCloseOnGroupClick?: boolean | undefined;
    groupsClassName?: string | undefined;
    autoplay?: boolean | undefined;
    isForceCloseAvailable?: boolean | undefined;
    openInExternalModal?: boolean | undefined;
    isInReactNativeWebView?: boolean | undefined;
    groupId?: string | undefined;
    startStoryId?: string | undefined;
    forbidClose?: boolean | undefined;
    devMode?: "staging" | "development" | undefined;
    on?(event: string, callback: (data: any) => void): void;
    off?(event: string, callback: (data: any) => void): void;
    destroy?(): void;
} | undefined, container?: Element | HTMLDivElement | null) => () => React.JSX.Element;
export default withGroupsData;
