import React from 'react';
import { Group } from '../../types';
interface GroupProps {
    group?: Group;
    isFirstGroup: boolean;
    isLastGroup: boolean;
    isForceCloseAvailable?: boolean;
    isShowing: boolean;
    startStoryId?: string;
    isCacheDisabled?: boolean;
    isEditorMode?: boolean;
    storyWidth?: number;
    storyHeight?: number;
    handleCloseModal: () => void;
    handleNextGroup: () => void;
    handlePrevGroup: () => void;
}
export declare const CustomGroupControl: React.FC<GroupProps>;
export {};
