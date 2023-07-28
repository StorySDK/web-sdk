import React from 'react';
import { Group } from '../../types';
interface GroupProps {
    group?: Group;
    isFirstGroup: boolean;
    isLastGroup: boolean;
    isForceCloseAvailable?: boolean;
    handleCloseModal: () => void;
    handleNextGroup: () => void;
    handlePrevGroup: () => void;
    isShowing: boolean;
    isShowMockup?: boolean;
    isStatusBarActive?: boolean;
    startStoryId?: string;
    isCacheDisabled?: boolean;
    isEditorMode?: boolean;
}
export declare const CustomGroupControl: React.FC<GroupProps>;
export {};
