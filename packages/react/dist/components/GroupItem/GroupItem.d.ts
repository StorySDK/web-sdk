import React from 'react';
import './GroupItem.scss';
interface Props {
    index: number;
    groupTitleSize?: number;
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupClassName?: string;
    imageUrl: string;
    title: string;
    type: 'circle' | 'square' | 'bigSquare' | 'rectangle';
    onClick?(index: number): void;
}
export declare const GroupItem: React.FunctionComponent<Props>;
export {};
