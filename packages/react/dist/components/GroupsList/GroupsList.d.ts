import React from 'react';
import { GroupType } from '../../types';
import 'react-loading-skeleton/dist/skeleton.css';
import './GroupsList.scss';
interface GroupsListProps {
    groups: GroupType[];
    isLoading?: boolean;
    groupView: 'circle' | 'square' | 'bigSquare' | 'rectangle';
    onOpenGroup?(id: string): void;
    onCloseGroup?(id: string): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string): void;
    onOpenStory?(groupId: string, storyId: string): void;
}
export declare const GroupsList: React.FC<GroupsListProps>;
export {};
