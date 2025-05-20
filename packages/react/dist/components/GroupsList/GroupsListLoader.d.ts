import React, { RefObject } from 'react';
import './GroupsList.scss';
interface GroupsListLoaderProps {
    groupImageWidth?: number;
    isInReactNativeWebView?: boolean;
    isCentered: boolean;
    showSkeleton: boolean;
    autoplay?: boolean;
    carouselSkeletonRef: RefObject<HTMLDivElement>;
}
export declare const GroupsListLoader: React.FC<GroupsListLoaderProps>;
export {};
