import React from 'react';
import './GroupsList.scss';
interface GroupsListLoaderProps {
    isCentered?: boolean;
    showSkeleton?: boolean;
    carouselSkeletonRef?: React.RefObject<HTMLDivElement>;
    isReactNativeWebView?: boolean;
}
export declare const GroupsListLoader: React.FC<GroupsListLoaderProps>;
export {};
