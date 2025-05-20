import React, { RefObject } from 'react';
import block from 'bem-cn';
import Skeleton from 'react-loading-skeleton';
import './GroupsList.scss';

const b = block('GroupsSdkList');

interface GroupsListLoaderProps {
  groupImageWidth?: number;
  isInReactNativeWebView?: boolean;
  isCentered: boolean;
  showSkeleton: boolean;
  autoplay?: boolean;
  carouselSkeletonRef: RefObject<HTMLDivElement>;
}

export const GroupsListLoader: React.FC<GroupsListLoaderProps> = ({
  groupImageWidth,
  isInReactNativeWebView,
  isCentered,
  showSkeleton,
  autoplay,
  carouselSkeletonRef,
}) => (
  <div
    className={b('carousel', {
      hide: !(showSkeleton && !autoplay),
      skeleton: true,
      centered: isInReactNativeWebView ? false : isCentered,
    })}
    ref={carouselSkeletonRef}
  >
    <div className={b('loaderItem')}>
      <Skeleton height={groupImageWidth || 64} width={groupImageWidth || 64} />
      <Skeleton height={16} style={{ marginTop: 8 }} width={groupImageWidth || 64} />
    </div>
    <div className={b('loaderItem')}>
      <Skeleton height={groupImageWidth || 64} width={groupImageWidth || 64} />
      <Skeleton height={16} style={{ marginTop: 8 }} width={groupImageWidth || 64} />
    </div>
    <div className={b('loaderItem')}>
      <Skeleton height={groupImageWidth || 64} width={groupImageWidth || 64} />
      <Skeleton height={16} style={{ marginTop: 8 }} width={groupImageWidth || 64} />
    </div>
    <div className={b('loaderItem')}>
      <Skeleton height={groupImageWidth || 64} width={groupImageWidth || 64} />
      <Skeleton height={16} style={{ marginTop: 8 }} width={groupImageWidth || 64} />
    </div>
  </div>
);
