import React, { RefObject } from 'react';
import './GroupsList.scss';
interface GroupsListLoaderProps {
    isCentered?: boolean;
    showSkeleton?: boolean;
    carouselSkeletonRef?: RefObject<HTMLDivElement | null>;
    isReactNativeWebView?: boolean;
}
export declare const GroupsListLoader: React.FC<GroupsListLoaderProps>;
export {};
