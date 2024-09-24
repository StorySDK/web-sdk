import React from 'react';
import { Group, LoadStory } from '../../types';
import 'simplebar-react/dist/simplebar.min.css';
import 'react-loading-skeleton/dist/skeleton.css';
import './GroupsList.scss';
export interface GroupsListProps {
    groups: Group[];
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupTitleSize?: number;
    groupsClassName?: string;
    initLoadStories: {
        [key: string]: LoadStory[];
    };
    storyWidth?: number;
    storyHeight?: number;
    isStatusBarActive?: boolean;
    groupClassName?: string;
    isShowMockup?: boolean;
    isLoading?: boolean;
    autoplay?: boolean;
    startStoryId?: string;
    startGroupId?: string;
    forbidClose?: boolean;
    openInExternalModal?: boolean;
    devMode?: 'staging' | 'development';
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
