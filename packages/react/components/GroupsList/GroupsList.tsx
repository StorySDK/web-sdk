import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import block from 'bem-cn';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames';
import SimpleBar from 'simplebar-react';
import ReactDOM from 'react-dom';
import { useWindowSize } from '@react-hook/window-size';
import { getUniqUserId } from '@utils';
import { Group } from '../../types';
import { GroupItem, StoryModal } from '..';
import 'simplebar-react/dist/simplebar.min.css';
import 'react-loading-skeleton/dist/skeleton.css';
import './GroupsList.scss';

const b = block('GroupsSdkList');
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
    groupImageWidth,
    activeGroupOutlineColor,
    groupsOutlineColor,
    groupImageHeight,
    groupTitleSize,
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
  const scrollRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselSkeletonRef = useRef<HTMLDivElement | null>(null);
  const [isCentered, setIsCentered] = useState(true);
  const [groupMinHeight, setGroupMinHeight] = useState(100);
  const [currentGroupItem, setCurrentGroupItem] = useState<Group | undefined>();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const handlePause = () => {
      setModalShow(false);
    };

    document.addEventListener('pause', handlePause, false);

    return () => {
      document.removeEventListener('pause', handlePause, false);
    };
  }, []);

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
  }, [autoplay, groups, startGroupId, onOpenGroup]);

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
      timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
    } else {
      setShowSkeleton(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [groups, isLoading]);

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
    (groupIndex: number) => {
      const customEvent = new CustomEvent('storysdk:group:click', {
        detail: {
          groupId: groups[groupIndex].id,
          uniqUserId: getUniqUserId(),
        },
      });

      container?.dispatchEvent(customEvent);

      if (preventCloseOnGroupClick) {
        return;
      }

      handleSelectGroup(groupIndex);
    },
    [preventCloseOnGroupClick, handleSelectGroup],
  );

  useEffect(() => {
    const containerElement = containerRef.current;
    const carouselElement = carouselRef.current;
    const carouselSkeletonElement = carouselSkeletonRef.current;

    const updateCentering = () => {
      if (!containerElement) return;

      const containerWidth = containerElement.clientWidth;
      const containerHeight = containerElement.clientHeight;
      setGroupMinHeight(containerHeight);

      if (showSkeleton && carouselSkeletonElement) {
        const skeletonWidth = carouselSkeletonElement.clientWidth;
        setIsCentered(containerWidth >= skeletonWidth);
      } else if (!showSkeleton && carouselElement) {
        const contentWidth = carouselElement.clientWidth;
        setIsCentered(containerWidth >= contentWidth);
      }
    };

    updateCentering();

    const resizeObserver = new ResizeObserver(updateCentering);
    if (containerElement) {
      resizeObserver.observe(containerElement);
    }

    return () => {
      if (containerElement) {
        resizeObserver.unobserve(containerElement);
      }
    };
  }, [width, showSkeleton, isInReactNativeWebView]);

  return (
    <>
      <div className={classNames(b(), groupsClassName)} ref={containerRef}>
        <SimpleBar
          classNames={{
            contentEl: b('carouselContent', { centered: isCentered }).toString(),
            track: b('track').toString(),
          }}
          ref={scrollRef}
          style={{
            width: '100%',
            minHeight: groupMinHeight,
            overflowY: 'hidden',
          }}

        >
          <div className={b('carousel', { show: showSkeleton && !autoplay, skeleton: true, centered: isInReactNativeWebView ? false : isCentered })} ref={carouselSkeletonRef}>
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

          <>
            {groups.length ? (
              <div className={b('carousel', { show: !showSkeleton && !autoplay, loading: showSkeleton })} ref={carouselRef}>
                {groups
                  .filter((group: any) => group.stories.length)
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
              <>{!autoplay && !isLoading && <p className={b('emptyText')}>Stories will be here</p>}</>
            )}
          </>
          {/* )} */}
        </SimpleBar>
      </div>
    </>
  );
};
