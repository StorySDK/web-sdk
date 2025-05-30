import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import block from 'bem-cn';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { useWindowSize } from '@react-hook/window-size';
import { getUniqUserId } from '@utils';
import { Group } from '../../types';
import { GroupItem, StoryModal } from '..';
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
    container,
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
  } = props;

  const [currentGroup, setCurrentGroup] = useState(-1);
  const [modalShow, setModalShow] = useState(!!autoplay);
  const [width] = useWindowSize();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselSkeletonRef = useRef<HTMLDivElement | null>(null);
  const [isCentered, setIsCentered] = useState(true);
  const [groupMinHeight, setGroupMinHeight] = useState(DEFAULT_GROUP_MIN_HEIGHT);
  const [currentGroupItem, setCurrentGroupItem] = useState<Group | undefined>();
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
    const handlePause = () => {
      setModalShow(false);
    };

    const checkMobileDevice = () => {
      setIsMobile(width <= 767);
    };

    checkMobileDevice();

    document.addEventListener('pause', handlePause, false);

    return () => {
      document.removeEventListener('pause', handlePause, false);
    };
  }, [width]);

  useEffect(() => {
    if (startGroupId) {
      const groupIndex = groups.findIndex((group) => group.id === startGroupId);

      if (groupIndex !== -1) {
        setCurrentGroup(groupIndex);
      }
    } else if (groups?.length) {
      setCurrentGroup(0);
    }
  }, [groups, startGroupId]);

  useEffect(() => {
    if (autoplay && onOpenGroup && groups?.length) {
      onOpenGroup(startGroupId ?? groups[0].id);
    }
  }, [autoplay, groups?.length, startGroupId]);

  const handleSelectGroup = useCallback(
    (groupIndex: number) => {
      setCurrentGroup(groupIndex);
      setModalShow(true);

      if (onOpenGroup) {
        onOpenGroup(groups[groupIndex].id);
      }
    },
    [groups, onOpenGroup],
  );

  const handlePrevGroup = useCallback(() => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);

      if (onOpenGroup && onCloseGroup) {
        onCloseGroup(groups[currentGroup].id);

        setTimeout(() => {
          onOpenGroup(groups[currentGroup - 1].id);
        }, 0);
      }
    }
  }, [currentGroup, groups, onCloseGroup, onOpenGroup]);

  const handleNextGroup = useCallback(() => {
    if (currentGroup < groups.length) {
      setCurrentGroup(currentGroup + 1);

      if (onOpenGroup && onCloseGroup) {
        onCloseGroup(groups[currentGroup].id);

        setTimeout(() => {
          onOpenGroup(groups[currentGroup + 1].id);
        }, 0);
      }
    }
  }, [currentGroup, groups, onCloseGroup, onOpenGroup]);

  const handleCloseModal = useCallback(() => {
    if (onCloseGroup && groups?.[currentGroup]) {
      onCloseGroup(groups[currentGroup].id);
    }

    if (!forbidClose) {
      setModalShow(false);
    }
  }, [currentGroup, forbidClose, groups, onCloseGroup]);

  const rootElement = useMemo(() => {
    const element = document.createElement('div');
    element.id = 'storysdk-modal-root';
    return element;
  }, []);

  useEffect(() => {
    document.body.appendChild(rootElement);
  }, [rootElement]);

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

  useEffect(() => {
    if (groups?.[currentGroup]) {
      setCurrentGroupItem(groups[currentGroup]);
    } else {
      setCurrentGroupItem(undefined);
    }
  }, [currentGroup, groups]);

  useEffect(() => {
    if (!isLoading || autoplay) {
      ReactDOM.render(
        <StoryModal
          arrowsColor={arrowsColor}
          backgroundColor={backgroundColor}
          container={container}
          currentGroup={currentGroupItem}
          devMode={devMode}
          forbidClose={forbidClose}
          isFirstGroup={currentGroup === 0}
          isForceCloseAvailable={isForceCloseAvailable}
          isInReactNativeWebView={isInReactNativeWebView}
          isLastGroup={currentGroup === groups?.length - 1}
          isLoading={isLoading}
          isShowLabel={isShowLabel}
          isShowMockup={isShowMockup}
          isShowing={modalShow}
          isStatusBarActive={isStatusBarActive}
          openInExternalModal={openInExternalModal}
          startStoryId={startStoryId}
          stories={currentGroupItem?.stories}
          storyHeight={storyHeight}
          storyWidth={storyWidth}
          token={token}
          onClose={handleCloseModal}
          onCloseStory={onCloseStory}
          onFinishQuiz={onFinishQuiz}
          onModalClose={onModalClose}
          onModalOpen={onModalOpen}
          onNextGroup={handleNextGroup}
          onNextStory={onNextStory}
          onOpenStory={onOpenStory}
          onPrevGroup={handlePrevGroup}
          onPrevStory={onPrevStory}
          onStartQuiz={onStartQuiz}
        />,
        rootElement,
      );
    }
  }, [isLoading, autoplay, modalShow, currentGroupItem]);

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

      handleSelectGroup(groupIndex);
    },
    [preventCloseOnGroupClick, handleSelectGroup, groups, container],
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
            groupImageWidth,
            groupTitleSize,
          );
          maxLines = Math.max(maxLines, lines);
        });
      }

      const lineHeight = groupTitleSize * 1.2;
      const totalTitleHeight = lineHeight * maxLines;
      const calculatedMinHeight = groupImageHeight + totalTitleHeight
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
    groupImageHeight,
    groupTitleSize,
    groups,
    groupView,
    groupImageWidth,
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
                        activeGroupOutlineColor={activeGroupOutlineColor}
                        groupClassName={groupClassName}
                        groupImageHeight={groupImageHeight}
                        groupImageWidth={groupImageWidth}
                        groupTitleSize={groupTitleSize}
                        groupsOutlineColor={groupsOutlineColor}
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
