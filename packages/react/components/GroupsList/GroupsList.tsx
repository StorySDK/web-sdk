import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import block from 'bem-cn';
import classNames from 'classnames';
import { useWindowSize } from '@react-hook/window-size';
import { getUniqUserId } from '@utils';
import { Group } from '@storysdk/types';
import { GroupItem } from '..';
import { useStoryModal } from '../../hooks';
import { GroupsListLoader } from './GroupsListLoader';
import './GroupsList.scss';

const b = block('GroupsSdkList');

const DEFAULT_GROUP_IMAGE_HEIGHT = 68;
const DEFAULT_GROUP_IMAGE_WIDTH = 68;
const DEFAULT_GROUP_TITLE_SIZE = 16;
const DEFAULT_GROUP_MIN_HEIGHT = 100;
const DEFAULT_GROUP_TITLE_PADDING = 4;

export interface GroupsListProps {
  groups: Group[];
  groupImageWidth?: number;
  groupImageHeight?: number;
  groupTitleSize?: number;
  groupsClassName?: string;
  storyWidth?: number;
  storyHeight?: number;
  activeGroupOutlineColor?: string;
  groupsOutlineColor?: string;
  isStatusBarActive?: boolean;
  groupClassName?: string;
  isShowMockup?: boolean;
  isOnlyGroups?: boolean;
  isShowLabel?: boolean;
  token?: string;
  arrowsColor?: string;
  preventCloseOnGroupClick?: boolean;
  isLoading?: boolean;
  isInReactNativeWebView?: boolean;
  autoplay?: boolean;
  startStoryId?: string;
  isForceCloseAvailable?: boolean;
  backgroundColor?: string;
  startGroupId?: string;
  forbidClose?: boolean;
  openInExternalModal?: boolean;
  devMode?: 'staging' | 'development';
  groupView: 'circle' | 'square' | 'bigSquare' | 'rectangle';
  container?: Element | HTMLDivElement | null;
  style?: {
    itemStyle?: any;
    isShowMockup?: boolean;
    strokeThickness?: number;
    activeColor?: string;
    inactiveColor?: string;
    width?: number;
    height?: number;
  } | null;
  onOpenGroup?(id: string): void;
  onCloseGroup?(id: string): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string, duration: number): void;
  onOpenStory?(groupId: string, storyId: string): void;
  onStartQuiz?(groupId: string, storyId?: string): void;
  onFinishQuiz?(groupId: string, storyId?: string): void;
  onModalOpen?(groupId: string, storyId: string): void;
  onModalClose?(groupId: string, storyId: string): void;
}

export const GroupsList: React.FC<GroupsListProps> = (props) => {
  const {
    groups,
    groupView,
    isLoading,
    groupClassName,
    groupsClassName,
    groupImageWidth = DEFAULT_GROUP_IMAGE_WIDTH,
    activeGroupOutlineColor,
    groupsOutlineColor,
    groupImageHeight = DEFAULT_GROUP_IMAGE_HEIGHT,
    groupTitleSize = DEFAULT_GROUP_TITLE_SIZE,
    isShowMockup,
    isShowLabel,
    isStatusBarActive,
    autoplay,
    startStoryId,
    arrowsColor,
    backgroundColor,
    startGroupId,
    devMode,
    forbidClose,
    isInReactNativeWebView,
    isForceCloseAvailable,
    openInExternalModal,
    storyWidth,
    preventCloseOnGroupClick,
    storyHeight,
    isOnlyGroups,
    container,
    token,
    style,
    onOpenGroup,
    onCloseGroup,
    onNextStory,
    onPrevStory,
    onCloseStory,
    onOpenStory,
    onStartQuiz,
    onFinishQuiz,
    onModalOpen,
    onModalClose,
  } = props;

  // Apply style settings from groups settings if available
  const finalGroupImageWidth = style?.width || groupImageWidth;
  const finalGroupImageHeight = style?.height || groupImageHeight;
  const finalActiveGroupOutlineColor = style?.activeColor || activeGroupOutlineColor;
  const finalGroupsOutlineColor = style?.inactiveColor || groupsOutlineColor;
  const finalIsShowMockup = style?.isShowMockup !== undefined ? style.isShowMockup : isShowMockup;

  // Use story modal hook
  const { selectGroup } = useStoryModal({
    groups,
    autoplay,
    startStoryId,
    startGroupId,
    forbidClose,
    isOnlyGroups,
    isLoading,
    arrowsColor,
    backgroundColor,
    container,
    devMode,
    isForceCloseAvailable,
    isInReactNativeWebView,
    isShowLabel,
    isShowMockup: finalIsShowMockup,
    isStatusBarActive,
    openInExternalModal,
    storyHeight,
    storyWidth,
    token,
    onOpenGroup,
    onCloseGroup,
    onNextStory,
    onPrevStory,
    onCloseStory,
    onOpenStory,
    onStartQuiz,
    onFinishQuiz,
    onModalOpen,
    onModalClose,
  });

  const [width] = useWindowSize();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselSkeletonRef = useRef<HTMLDivElement | null>(null);
  const [isCentered, setIsCentered] = useState(true);
  const [groupMinHeight, setGroupMinHeight] = useState(DEFAULT_GROUP_MIN_HEIGHT);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const calculateTitleLines = useCallback((
    title: string,
    view: string,
    imageWidth: number,
    fontSize: number,
  ): number => {
    let availableWidth: number;
    let actualFontSize: number;

    switch (view) {
      case 'bigSquare':
        availableWidth = Math.max(imageWidth * 0.93 - 20, 44);
        actualFontSize = 10;
        break;
      case 'rectangle':
        availableWidth = Math.max(imageWidth * 0.97 - 20, 46);
        actualFontSize = 8;
        break;
      default: // circle, square
        availableWidth = Math.max(imageWidth * 1.32 - 10, 80);
        actualFontSize = fontSize;
    }

    const charWidth = actualFontSize * 0.65;

    const charsPerLine = Math.floor(availableWidth / charWidth);

    if (title.length <= charsPerLine) {
      return 1;
    }

    const words = title.split(' ');
    let lines = 1;
    let currentLineLength = 0;

    for (const word of words) {
      const wordLength = word.length + (currentLineLength > 0 ? 1 : 0);

      if (currentLineLength + wordLength > charsPerLine && currentLineLength > 0) {
        lines++;
        currentLineLength = word.length;
      } else {
        currentLineLength += wordLength;
      }
    }

    return lines;
  }, []);

  useEffect(() => {
    const checkMobileDevice = () => {
      setIsMobile(width <= 767);
    };

    checkMobileDevice();
  }, [width]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!isLoading && groups.length > 0) {
      const delay = isInReactNativeWebView ? 100 : 500;
      timer = setTimeout(() => {
        setShowSkeleton(false);
      }, delay);
    } else if (isLoading) {
      setShowSkeleton(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [groups, isLoading, isInReactNativeWebView]);

  const handleGroupClick = useCallback(
    async (groupIndex: number) => {
      const uniqUserId = await getUniqUserId();

      const customEvent = new CustomEvent('storysdk:group:click', {
        detail: {
          groupId: groups[groupIndex].id,
          uniqUserId,
        },
      });

      container?.dispatchEvent(customEvent);

      if (preventCloseOnGroupClick) {
        return;
      }

      selectGroup(groupIndex);
    },
    [preventCloseOnGroupClick, selectGroup, groups, container],
  );

  useEffect(() => {
    const containerElement = containerRef.current;
    const carouselElement = carouselRef.current;
    const carouselSkeletonElement = carouselSkeletonRef.current;

    const updateCentering = () => {
      if (!containerElement) return;

      const containerWidth = containerElement.clientWidth;

      let maxLines = 1;
      if (groups.length > 0) {
        groups.forEach((group) => {
          const lines = calculateTitleLines(
            group.title,
            groupView,
            finalGroupImageWidth,
            groupTitleSize,
          );
          maxLines = Math.max(maxLines, lines);
        });
      }

      const lineHeight = groupTitleSize * 1.2;
      const totalTitleHeight = lineHeight * maxLines;
      const calculatedMinHeight = finalGroupImageHeight + totalTitleHeight
        + DEFAULT_GROUP_TITLE_PADDING * 2;

      setGroupMinHeight(calculatedMinHeight);

      if (showSkeleton && carouselSkeletonElement) {
        const skeletonWidth = carouselSkeletonElement.clientWidth;
        setIsCentered(containerWidth >= skeletonWidth);
      } else if (!showSkeleton && carouselElement) {
        const contentWidth = carouselElement.clientWidth;
        setIsCentered(containerWidth >= contentWidth);
      }
    };

    updateCentering();
    if (isInReactNativeWebView) {
      const fallbackTimer = setTimeout(updateCentering, 200);

      const handleOrientationChange = () => {
        setTimeout(updateCentering, 100);
      };

      window.addEventListener('orientationchange', handleOrientationChange);
      window.addEventListener('resize', handleOrientationChange);

      return () => {
        clearTimeout(fallbackTimer);
        window.removeEventListener('orientationchange', handleOrientationChange);
        window.removeEventListener('resize', handleOrientationChange);
      };
    }

    const resizeObserver = new ResizeObserver(updateCentering);
    if (containerElement) {
      resizeObserver.observe(containerElement);
    }

    return () => {
      if (containerElement) {
        resizeObserver.unobserve(containerElement);
      }
    };
  }, [
    width,
    showSkeleton,
    finalGroupImageHeight,
    groupTitleSize,
    groups,
    groupView,
    finalGroupImageWidth,
    calculateTitleLines,
    isInReactNativeWebView,
  ]);

  return (
    <>
      <div className={classNames(b(), groupsClassName)} ref={containerRef}>
        <div
          className={b('scrollContainer', { mobile: isMobile })}
          ref={scrollRef}
          style={{
            width: '100%',
            minHeight: Math.max(groupMinHeight, DEFAULT_GROUP_MIN_HEIGHT),
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
          }}
        >
          <div className={b('carouselContent', { centered: isCentered })}>
            <>
              {groups.length > 0 && !isLoading ? (
                <div
                  className={b('carousel', {
                    show: !showSkeleton && !autoplay,
                    loading: showSkeleton,
                  })}
                  ref={carouselRef}
                >
                  {groups
                    .map((group, index) => (
                      <GroupItem
                        activeGroupOutlineColor={finalActiveGroupOutlineColor}
                        groupClassName={groupClassName}
                        groupImageHeight={finalGroupImageHeight}
                        groupImageWidth={finalGroupImageWidth}
                        groupTitleSize={groupTitleSize}
                        groupsOutlineColor={finalGroupsOutlineColor}
                        imageUrl={group.imageUrl}
                        index={index}
                        key={group.id}
                        title={group.title}
                        type={group.type}
                        view={groupView}
                        onClick={handleGroupClick}
                      />
                    ))}
                </div>
              ) : (
                <>{!autoplay && !isLoading && <p className={b('emptyText', { show: !showSkeleton })}>Stories will be here</p>}</>
              )}
            </>
          </div>

          <GroupsListLoader
            carouselSkeletonRef={carouselSkeletonRef}
            isCentered={isCentered}
            isReactNativeWebView={isInReactNativeWebView}
            showSkeleton={showSkeleton && !autoplay}
          />
        </div>
      </div>
    </>
  );
};
