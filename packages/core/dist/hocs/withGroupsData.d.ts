import React from 'react';
import { GroupType } from '@storysdk/react';
interface GroupsListProps {
    groups: GroupType[];
    groupClassName?: string;
    groupsClassName?: string;
    groupView: 'circle' | 'square' | 'bigSquare' | 'rectangle' | string;
    isLoading?: boolean;
    onOpenGroup?(id: string): void;
    onCloseGroup?(id: string): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onOpenStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string): void;
}
declare const withGroupsData: (GroupsList: React.FC<GroupsListProps>, token: string, groupClassName?: string | undefined, groupsClassName?: string | undefined) => () => JSX.Element;
export default withGroupsData;
