import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from 'react';
import block from 'bem-cn';
import classNames from 'classnames';
import { useWindowSize } from '@react-hook/window-size';
import { Group } from '@storysdk/types';
import { StoryPreview } from '../StoryPreview';
import { useStoryModal } from '../../hooks';
import { CarouselListLoader } from './CarouselListLoader';
import '../GroupsList/GroupsList.scss';
import './CarouselList.scss';

const b = block('GroupsSdkList');

export interface CarouselListProps {
  group?: Group;
  className?: string;
  isLoading?: boolean;
  isInReactNativeWebView?: boolean;
  onStoryClick?: (groupId: string, storyId: string) => void;
  // StoryModal props
  storyWidth?: number;
  storyHeight?: number;
  isStatusBarActive?: boolean;
  isShowMockup?: boolean;
  isShowLabel?: boolean;
  token?: string;
  arrowsColor?: string;
  autoplay?: boolean;
  startStoryId?: string;
  isForceCloseAvailable?: boolean;
  backgroundColor?: string;
  startGroupId?: string;
  forbidClose?: boolean;
  openInExternalModal?: boolean;
  devMode?: 'staging' | 'development';
  container?: Element | HTMLDivElement | null;
  style?: {
    titlePosition?: any;
    isShowMockup?: boolean;
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

export const CarouselList: React.FC<CarouselListProps> = (props) => {
  const {
    group,
    isLoading,
    className,
    isInReactNativeWebView,
    onStoryClick,
    // StoryModal props
    storyWidth,
    storyHeight,
    isStatusBarActive,
    isShowMockup,
    isShowLabel,
    token,
    arrowsColor,
    autoplay,
    startStoryId,
    isForceCloseAvailable,
    backgroundColor,
    startGroupId,
    forbidClose,
    openInExternalModal,
    devMode,
    container,
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
  const finalIsShowMockup = style?.isShowMockup !== undefined ? style.isShowMockup : isShowMockup;

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [width] = useWindowSize();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Memoize all callbacks to prevent unnecessary re-renders of useStoryModal
  const memoizedOnOpenGroup = useCallback((id: string) => {
    onOpenGroup?.(id);
  }, [onOpenGroup]);

  const memoizedOnCloseGroup = useCallback((id: string) => {
    onCloseGroup?.(id);
  }, [onCloseGroup]);

  const memoizedOnNextStory = useCallback((groupId: string, storyId: string) => {
    onNextStory?.(groupId, storyId);
  }, [onNextStory]);

  const memoizedOnPrevStory = useCallback((groupId: string, storyId: string) => {
    onPrevStory?.(groupId, storyId);
  }, [onPrevStory]);

  const memoizedOnCloseStory = useCallback((groupId: string, storyId: string, duration: number) => {
    onCloseStory?.(groupId, storyId, duration);
  }, [onCloseStory]);

  const memoizedOnOpenStory = useCallback((groupId: string, storyId: string) => {
    onOpenStory?.(groupId, storyId);
  }, [onOpenStory]);

  const memoizedOnStartQuiz = useCallback((groupId: string, storyId?: string) => {
    onStartQuiz?.(groupId, storyId);
  }, [onStartQuiz]);

  const memoizedOnFinishQuiz = useCallback((groupId: string, storyId?: string) => {
    onFinishQuiz?.(groupId, storyId);
  }, [onFinishQuiz]);

  const memoizedOnModalOpen = useCallback((groupId: string, storyId: string) => {
    onModalOpen?.(groupId, storyId);
  }, [onModalOpen]);

  const memoizedOnModalClose = useCallback((groupId: string, storyId: string) => {
    onModalClose?.(groupId, storyId);
  }, [onModalClose]);

  // Memoize modal options to prevent hook re-creation
  const storyModalOptions = useMemo(() => ({
    group,
    autoplay,
    startStoryId,
    startGroupId,
    forbidClose,
    isOnlyGroups: false,
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
    onOpenGroup: memoizedOnOpenGroup,
    onCloseGroup: memoizedOnCloseGroup,
    onNextStory: memoizedOnNextStory,
    onPrevStory: memoizedOnPrevStory,
    onCloseStory: memoizedOnCloseStory,
    onOpenStory: memoizedOnOpenStory,
    onStartQuiz: memoizedOnStartQuiz,
    onFinishQuiz: memoizedOnFinishQuiz,
    onModalOpen: memoizedOnModalOpen,
    onModalClose: memoizedOnModalClose,
  }), [
    group,
    autoplay,
    startStoryId,
    startGroupId,
    forbidClose,
    isLoading,
    arrowsColor,
    backgroundColor,
    container,
    devMode,
    isForceCloseAvailable,
    isInReactNativeWebView,
    isShowLabel,
    finalIsShowMockup,
    isStatusBarActive,
    openInExternalModal,
    storyHeight,
    storyWidth,
    token,
    memoizedOnOpenGroup,
    memoizedOnCloseGroup,
    memoizedOnNextStory,
    memoizedOnPrevStory,
    memoizedOnCloseStory,
    memoizedOnOpenStory,
    memoizedOnStartQuiz,
    memoizedOnFinishQuiz,
    memoizedOnModalOpen,
    memoizedOnModalClose,
  ]);

  // Initialize story modal hook
  const { openStoryInGroup } = useStoryModal(storyModalOptions);

  // Memoize story click handler to prevent unnecessary re-renders
  const handleStoryClick = useCallback((groupId: string, storyId: string) => {
    // Call the optional callback first
    onStoryClick?.(groupId, storyId);

    // Open story modal
    openStoryInGroup(groupId, storyId);
  }, [onStoryClick, openStoryInGroup]);

  useEffect(() => {
    const checkMobileDevice = () => {
      setIsMobile(width <= 767);
    };

    checkMobileDevice();
  }, [width]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loader while loading
  if (isLoading) {
    return (
      <CarouselListLoader
        isReactNativeWebView={isInReactNativeWebView}
        showSkeleton={showSkeleton}
      />
    );
  }

  // Render carousel list content with story previews
  return (
    <div className={classNames(b(), className)} ref={containerRef}>
      <div
        className={b('scrollContainer', { mobile: isMobile })}
        ref={scrollRef}
        style={{
          width: '100%',
          minHeight: 171,
          overflowY: 'hidden',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
        }}
      >
        <div className={b('carouselContent')}>
          {group?.stories ? (
            <div
              className={b('carousel', {
                show: !showSkeleton,
                loading: showSkeleton,
              })}
              ref={carouselRef}
            >
              <div className="carousel-list">
                <div className="carousel-list__stories">
                  {group.stories?.map((story) => (
                    <div
                      className="carousel-list__story"
                      key={story.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleStoryClick(group.id, story.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStoryClick(group.id, story.id)}
                    >
                      <StoryPreview
                        disableInteraction
                        height={171}
                        story={story}
                        width={100}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className={b('emptyText', { show: !showSkeleton })}>Stories will be here</p>
          )}
        </div>
      </div>
    </div>
  );
};
