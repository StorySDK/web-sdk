import React from 'react';
import './GroupsList.scss';
import { GroupType } from '../../types';
interface GroupsListProps {
    groups: GroupType[];
    onOpenGroup?(id: string): void;
    onCloseGroup?(id: string): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string): void;
    onOpenStory?(groupId: string, storyId: string): void;
}
export declare const GroupsList: React.FC<GroupsListProps>;
export {};
