import React from 'react';
import { Group } from '@storysdk/types';
interface GroupProps {
    children?: React.ReactNode;
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
    forbidClose?: boolean;
    isCacheDisabled?: boolean;
    isEditorMode?: boolean;
    handleCloseModal: () => void;
    handleNextGroup: () => void;
    handlePrevGroup: () => void;
}
export declare const CustomGroupControl: React.FC<GroupProps>;
export {};
