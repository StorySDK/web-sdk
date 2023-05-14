import React from 'react';
import { Group } from '../../types';
import 'react-loading-skeleton/dist/skeleton.css';
import './GroupsList.scss';
interface GroupsListProps {
    groups: Group[];
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupTitleSize?: number;
    groupsClassName?: string;
    groupClassName?: string;
    isShowMockup?: boolean;
    isLoading?: boolean;
    groupView: 'circle' | 'square' | 'bigSquare' | 'rectangle';
    onOpenGroup?(id: string): void;
    onCloseGroup?(id: string): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string): void;
    onOpenStory?(groupId: string, storyId: string): void;
    onStartQuiz?(groupId: string, storyId?: string): void;
    onFinishQuiz?(groupId: string, storyId?: string): void;
}
export declare const GroupsList: React.FC<GroupsListProps>;
export {};
