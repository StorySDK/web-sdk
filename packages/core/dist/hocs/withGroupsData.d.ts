import React from 'react';
import { GroupsListProps } from '@storysdk/react';
declare const withGroupsData: (GroupsList: React.FC<GroupsListProps>, viewOptions?: {
    groupImageWidth?: number | undefined;
    groupImageHeight?: number | undefined;
    groupTitleSize?: number | undefined;
    groupClassName?: string | undefined;
    groupsClassName?: string | undefined;
} | undefined, playOptions?: {
    autoplay?: boolean | undefined;
    groupId?: string | undefined;
    startStoryId?: string | undefined;
    forbidClose?: boolean | undefined;
    devMode?: boolean | undefined;
} | undefined) => () => JSX.Element;
export default withGroupsData;
