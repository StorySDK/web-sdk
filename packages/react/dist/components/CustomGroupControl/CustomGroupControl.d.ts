import React from 'react';
import { GroupType } from '../../types';
interface GroupProps {
    group: GroupType;
    isFirstGroup: boolean;
    isLastGroup: boolean;
    handleCloseModal: () => void;
    handleNextGroup: () => void;
    handlePrevGroup: () => void;
    isShowing: boolean;
}
export declare const CustomGroupControl: React.FC<GroupProps>;
export {};
