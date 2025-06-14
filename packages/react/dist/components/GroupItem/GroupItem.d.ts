import React from 'react';
import { GroupType } from '@storysdk/types';
import './GroupItem.scss';
interface Props {
    index: number;
    groupTitleSize?: number;
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupClassName?: string;
    activeGroupOutlineColor?: string;
    groupsOutlineColor?: string;
    isChosen?: boolean;
    imageUrl: string;
    title: string;
    view: 'circle' | 'square' | 'bigSquare' | 'rectangle';
    type: GroupType;
    onClick?(index: number): void;
}
export declare const GroupItem: React.FunctionComponent<Props>;
export {};
