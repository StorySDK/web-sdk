import React from 'react';
import { BackgroundType } from '../../types';
import './MaterialIcon.scss';
type PropsType = {
    name: string;
    className?: string;
    size?: number | string;
    color?: string;
    background?: BackgroundType;
};
export declare const MaterialIcon: React.MemoExoticComponent<({ name, className, color, background, size }: PropsType) => React.JSX.Element | null>;
export {};
