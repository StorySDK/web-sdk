import React, { useMemo } from 'react';
import block from 'bem-cn';
import { IconClose, IconLoader } from '@components/icons';
import { LongPressTouchHandlers } from 'use-long-press';
import { GroupType, StoryType } from '@types';
import JSConfetti from 'js-confetti';
import { SwipeOutput, useAdaptiveValue } from '@hooks';
import { PADDING_SIZE, STORY_SIZE_LARGE, StoryContent } from '../../..';
import { StatusBar } from '../StatusBar';
import '../../StoryModal.scss';

const b = block('StorySdkModal');

interface StorySwiperContentProps {
  isMobile: boolean;
  isLarge: boolean;
  isAutoplayVideos: boolean;
  isShowMockupCurrent?: boolean;
  isGroupWithFilledBackground?: boolean;
  isProgressHidden?: boolean;
  isBackroundFilled?: boolean;
  currentGroupType: GroupType;
  currentGroup: any;
  currentStory: number;
  isOpened: boolean;
  isMediaLoading: boolean;
  isLoading?: boolean;
  activeStoriesWithResult: StoryType[];
  height: number;
  currentStorySize: any;
  heightGap: number;
  contentHeight: number | string;
  forbidClose?: boolean;
  isStatusBarActive?: boolean;
  storyWidth?: number;
  storyHeight?: number;
  isForceCloseAvailable?: boolean;
  playStatus: string;
  jsConfetti: React.MutableRefObject<JSConfetti>;
  handleClose: () => void;
  handleAnimationEnd: () => void;
  handleMediaLoading: (isMediaLoading: boolean) => void;
  handleVideoPlaying: (isPlaying: boolean) => void;
  handleVideoBackgroundPlaying: (isPlaying: boolean) => void;
  handleGoToStory: (storyId: string) => void;
  pressHandlers: () => LongPressTouchHandlers<Element>;
  swipeHandlers: SwipeOutput;
}

const INIT_TOP_ELEMENTS = 20;
const INIT_TOP_INDICATOR = 10;
const INIT_CONTROL_TOP = 10;
const INIT_CONTROL_TOP_LARGE = 35;
const INIT_CONTROL_SIDE_PADDING = 8;
const INIT_CONTROL_GAP_LARGE = 8;
const INIT_LARGE_RADIUS = 43;
const INIT_SMALL_RADIUS = 5;

export const StorySwiperContent: React.FC<StorySwiperContentProps> = (props) => {
  const {
    isMobile,
    isLarge,
    isShowMockupCurrent,
    isGroupWithFilledBackground,
    isProgressHidden,
    isBackroundFilled,
    currentGroupType,
    currentGroup,
    currentStory,
    isOpened,
    isMediaLoading,
    isLoading,
    activeStoriesWithResult,
    height,
    currentStorySize,
    heightGap,
    contentHeight,
    forbidClose,
    isStatusBarActive,
    storyWidth,
    storyHeight,
    isForceCloseAvailable,
    playStatus,
    jsConfetti,
    isAutoplayVideos,
    handleClose,
    handleAnimationEnd,
    handleMediaLoading,
    handleGoToStory,
    pressHandlers,
    handleVideoPlaying,
    handleVideoBackgroundPlaying,
    swipeHandlers
  } = props;

  const defaultRatioIndex = useMemo(() => STORY_SIZE_LARGE.width / STORY_SIZE_LARGE.height, []);

  const largeElementsTop = useAdaptiveValue(INIT_TOP_ELEMENTS);
  const largeIndicatorTop = useAdaptiveValue(INIT_TOP_INDICATOR);
  const controlTopSmall = useAdaptiveValue(INIT_CONTROL_TOP);
  const controlTopLarge = useAdaptiveValue(INIT_CONTROL_TOP_LARGE);
  const controlSidePaddingSmall = useAdaptiveValue(INIT_CONTROL_SIDE_PADDING);
  const controlGapLarge = useAdaptiveValue(INIT_CONTROL_GAP_LARGE);
  const largeBorderRadius = useAdaptiveValue(INIT_LARGE_RADIUS);
  const smallBorderRadius = useAdaptiveValue(INIT_SMALL_RADIUS);

  const controlTop = isLarge ? controlTopLarge : controlTopSmall;
  const controlGap = isLarge ? controlGapLarge : controlSidePaddingSmall;
  const borderRadius = isLarge ? largeBorderRadius : smallBorderRadius;

  const currentRatioIndex = useMemo(() => {
    if (storyWidth && storyHeight) {
      return storyWidth / storyHeight;
    }

    return defaultRatioIndex;
  }, [storyHeight, storyWidth]);

  const currentPaddingSize = isShowMockupCurrent ? PADDING_SIZE + heightGap : PADDING_SIZE;
  const isShowStatusBarInStory = isShowMockupCurrent && !isMobile && isLarge && isStatusBarActive;
  const desktopWidth = Math.ceil(currentRatioIndex * (height - currentPaddingSize));

  const noTopShadow =
    (currentGroupType === GroupType.ONBOARDING &&
      currentGroup?.settings?.isProgressHidden &&
      currentGroup?.settings?.isProhibitToClose) ||
    isGroupWithFilledBackground;

  const noTopBackgroundShadow =
    currentGroupType === GroupType.ONBOARDING ||
    (currentGroupType === GroupType.GROUP && !isBackroundFilled);

  const heightModalGap = useMemo(() => {
    if (isMobile) {
      return 0;
    }

    if (isShowMockupCurrent) {
      return heightGap + PADDING_SIZE;
    }

    return PADDING_SIZE;
  }, [isMobile, isShowMockupCurrent, heightGap]);

  return (
    <div
      className={b('swiper', {
        mockup: !isMobile && isShowMockupCurrent
      })}
      style={{
        width: !isMobile ? desktopWidth : '100%',
        height: `calc(100vh - ${heightModalGap}px)`,
        borderRadius: isShowMockupCurrent && !isMobile ? borderRadius : undefined
      }}
    >
      <>
        {isLoading || !currentGroup?.stories ? (
          <div className={b('loader')}>
            <IconLoader className={b('loaderIcon').toString()} />
          </div>
        ) : (
          <>
            <div className={b('swiperContent')}>
              {activeStoriesWithResult.map((story, index) => (
                <div
                  className={b('story', { current: index === currentStory && isOpened })}
                  key={story.id}
                  {...pressHandlers()}
                  {...swipeHandlers}
                >
                  <StoryContent
                    contentHeight={contentHeight}
                    currentStorySize={currentStorySize}
                    desktopContainerWidth={desktopWidth}
                    handleGoToStory={handleGoToStory}
                    handleMediaLoading={handleMediaLoading}
                    handleVideoBackgroundPlaying={handleVideoBackgroundPlaying}
                    handleVideoPlaying={handleVideoPlaying}
                    isAutoplayVideos={isAutoplayVideos}
                    isDisplaying={index === currentStory && isOpened}
                    isLarge={isLarge}
                    isMediaLoading={isMediaLoading}
                    isMobile={isMobile}
                    isUnfilledBackground={
                      currentGroupType === GroupType.GROUP && !story.background.isFilled
                    }
                    jsConfetti={jsConfetti}
                    noTopBackgroundShadow={noTopBackgroundShadow}
                    noTopShadow={noTopShadow}
                    story={story}
                  />
                </div>
              ))}
            </div>
            <div className={b('topContainer')}>
              <>
                {isShowStatusBarInStory && <StatusBar />}
                <div
                  className={b('controls')}
                  style={{
                    gap: !isShowStatusBarInStory && !isMobile ? controlGap : undefined,
                    paddingTop:
                      !isShowStatusBarInStory && isShowMockupCurrent && !isMobile
                        ? controlTop
                        : undefined
                  }}
                >
                  {!currentGroup?.settings?.isProgressHidden && !isProgressHidden && (
                    <div
                      className={b('indicators', {
                        playAnimation: playStatus === 'play',
                        stopAnimation: playStatus === 'pause',
                        widePadding: isShowMockupCurrent && (isLarge || isGroupWithFilledBackground)
                      })}
                      style={{
                        top:
                          isShowMockupCurrent && (isLarge || isGroupWithFilledBackground)
                            ? largeIndicatorTop
                            : undefined
                      }}
                    >
                      {activeStoriesWithResult
                        .filter((story) => story.layerData?.isDefaultLayer)
                        .map((story, index) => (
                          <div
                            className={b('indicator', {
                              filled: index < currentStory,
                              current: index === currentStory
                            })}
                            key={story.id}
                            style={{
                              animationDuration: `${story.layerData?.duration}s`
                            }}
                            onAnimationEnd={handleAnimationEnd}
                          />
                        ))}
                    </div>
                  )}

                  {currentGroupType === GroupType.GROUP && (
                    <div
                      className={b('group', {
                        noProgress: currentGroup?.settings?.isProgressHidden || isProgressHidden,
                        wideLeft: isShowMockupCurrent && (isLarge || isGroupWithFilledBackground)
                      })}
                      style={{
                        top:
                          isShowMockupCurrent && (isLarge || isGroupWithFilledBackground)
                            ? largeElementsTop
                            : undefined
                      }}
                    >
                      {currentGroup?.imageUrl && (
                        <div className={b('groupImgWrapper')}>
                          <img alt="" className={b('groupImg')} src={currentGroup?.imageUrl} />
                        </div>
                      )}
                      {currentGroup?.title && (
                        <p className={b('groupTitle')}>{currentGroup?.title}</p>
                      )}
                    </div>
                  )}

                  {!currentGroup?.settings?.isProhibitToClose &&
                    !forbidClose &&
                    !isForceCloseAvailable && (
                      <button
                        className={b('close', {
                          noProgress: currentGroup?.settings?.isProgressHidden || isProgressHidden,
                          wideRight: isShowMockupCurrent && (isLarge || isGroupWithFilledBackground)
                        })}
                        style={{
                          top:
                            isShowMockupCurrent && (isLarge || isGroupWithFilledBackground)
                              ? largeElementsTop
                              : undefined
                        }}
                        onClick={handleClose}
                      >
                        <IconClose />
                      </button>
                    )}
                </div>
              </>
            </div>
          </>
        )}
      </>
    </div>
  );
};
