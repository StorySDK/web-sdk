import React from 'react';
import './GroupItem.scss';
interface Props {
    imageUrl: string;
    title: string;
    theme: 'light' | 'dark';
    size: 'sm' | 'md' | 'lg';
    rounded?: boolean;
    onClick?(): void;
}
export declare const GroupItem: React.FunctionComponent<Props>;
export {};
