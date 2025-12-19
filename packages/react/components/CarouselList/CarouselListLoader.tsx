import React from 'react';
import block from 'bem-cn';
import './CarouselList.scss';

const b = block('GroupsSdkList');

interface SkeletonItemProps {
  height: number;
  style?: React.CSSProperties;
  width: number;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ height, style, width }) => (
  <div
    className={b('skeleton')}
    style={{
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
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

interface CarouselListLoaderProps {
  isReactNativeWebView?: boolean;
  itemsCount?: number;
  showSkeleton?: boolean;
}

export const CarouselListLoader: React.FC<CarouselListLoaderProps> = ({
  isReactNativeWebView,
  itemsCount = 5,
  showSkeleton = true,
}) => (
  <div
    className={b({
      show: showSkeleton,
      loading: showSkeleton,
    })}
  >
    <div className="carousel-list">
      <div className="carousel-list__stories">
        {Array.from({ length: itemsCount }).map((_, index) => (
          <div
            className="carousel-list__story carousel-list__story--loading"
            key={index}
          >
            <SkeletonItem
              height={171}
              style={{
                borderRadius: '12px',
              }}
              width={100}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);
