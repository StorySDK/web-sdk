import React from 'react';
import { Group } from '../../types';
interface GroupProps {
    group?: Group;
    isFirstGroup: boolean;
    isLastGroup: boolean;
    isForceCloseAvailable?: boolean;
    isShowing: boolean;
    storyWidth?: number;
    storyHeight?: number;
    isProgressHidden?: boolean;
    isShowMockup?: boolean;
    isStatusBarActive?: boolean;
    startStoryId?: string;
    isCacheDisabled?: boolean;
    isEditorMode?: boolean;
    handleCloseModal: () => void;
    handleNextGroup: () => void;
    handlePrevGroup: () => void;
}
export declare const CustomGroupControl: React.FC<GroupProps>;
export {};
