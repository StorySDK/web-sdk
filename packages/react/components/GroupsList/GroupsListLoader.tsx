import React, { RefObject } from 'react';
import block from 'bem-cn';
import './GroupsList.scss';

const b = block('GroupsSdkList');

interface SkeletonItemProps {
  width: number;
  height: number;
  style?: React.CSSProperties;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ width, height, style }) => (
  <div
    className={b('skeleton')}
    style={{
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      className={b('skeletonShimmer')}
      style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  </div>
);

interface GroupsListLoaderProps {
  isCentered?: boolean;
  showSkeleton?: boolean;
  carouselSkeletonRef?: RefObject<HTMLDivElement | null>;
  isReactNativeWebView?: boolean;
}

export const GroupsListLoader: React.FC<GroupsListLoaderProps> = ({
  isCentered,
  showSkeleton,
  carouselSkeletonRef,
  isReactNativeWebView,
}) => (

  <div
    className={b('carousel', {
      hide: !showSkeleton,
      skeleton: true,
      centered: isCentered,
    })}
    ref={carouselSkeletonRef}
  >
    {Array.from({ length: isReactNativeWebView ? 5 : 4 }).map((_, index) => (
      <div className={b('loaderItem')} key={index}>
        <SkeletonItem height={64} width={64} />
        <SkeletonItem height={16} style={{ marginTop: 8 }} width={64} />
      </div>
    ))}
  </div>

);
