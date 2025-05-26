import React, { RefObject } from 'react';
import './GroupsList.scss';
interface GroupsListLoaderProps {
    isInReactNativeWebView?: boolean;
    isCentered?: boolean;
    showSkeleton?: boolean;
    carouselSkeletonRef?: RefObject<HTMLDivElement>;
}
export declare const GroupsListLoader: React.FC<GroupsListLoaderProps>;
export {};
