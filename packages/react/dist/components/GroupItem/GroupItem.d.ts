import React from 'react';
import './GroupItem.scss';
interface Props {
    index: number;
    imageUrl: string;
    title: string;
    theme: 'light' | 'dark';
    size: 'sm' | 'md' | 'lg';
    rounded?: boolean;
    onClick?(index: number): void;
}
export declare const GroupItem: React.FunctionComponent<Props>;
export {};
