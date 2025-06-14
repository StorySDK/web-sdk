import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import block from 'bem-cn';
import {
  IconClose,
  IconLoader,
  IconMute,
  IconStoryPause,
  IconStoryPlay,
  IconUnmute,
} from '@components/icons';
import { LongPressTouchHandlers } from 'use-long-press';
import { GroupType, StoryType, PlayStatusType } from '@storysdk/types';
import JSConfetti from 'js-confetti';
import { SwipeOutput, useAdaptiveValue } from '@hooks';
import { StoryContent, StoryContext } from '../../..';
import { StatusBar } from '../StatusBar';
import '../../StoryModal.scss';

const b = block('StorySdkModal');
interface StorySwiperContentProps {
  isMobile: boolean;
  isLarge: boolean;
  isAutoplayVideos: boolean;
  isShowMockupCurrent?: boolean;
  isProgressHidden?: boolean;
  isVideoMuted: boolean;
  isVideoExists?: boolean;
  currentGroupType: GroupType;
  currentGroup: any;
  currentStory: number;
  isOpened: boolean;
  isMediaLoading: boolean;
  isLoading?: boolean;
  isInReactNativeWebView?: boolean;
  activeStoriesWithResult: StoryType[];
  currentStorySize: any;
  contentWidth: number | string;
  contentHeight: number;
  forbidClose?: boolean;
  isStatusBarActive?: boolean;
  storyWidth?: number;
  storyHeight?: number;
  isForceCloseAvailable?: boolean;
  isVideoPlaying?: boolean;
  isBackgroundVideoPlaying?: boolean;
  playStatus: PlayStatusType;
  jsConfetti: React.MutableRefObject<JSConfetti>;
  loadedStoriesIds: { [key: string]: boolean };
  handleClose: () => void;
  handleLoadStory: (storyId: string) => void;
  handleAnimationEnd: () => void;
  handleMediaLoading: (isMediaLoading: boolean) => void;
  handleVideoPlaying: (isPlaying: boolean) => void;
  handleGoToStory: (storyId: string) => void;
  handleMuteVideo: (isMuted: boolean) => void;
  pressHandlers?: () => LongPressTouchHandlers<Element>;
  swipeHandlers: SwipeOutput;
}

const INIT_TOP_ELEMENTS = 20;
const INIT_TOP_INDICATOR = 10;
const INIT_CONTROL_TOP = 10;
const INIT_CONTROL_TOP_LARGE = 35;
const INIT_CONTROL_SIDE_PADDING = 8;
const INIT_CONTROL_GAP_LARGE = 8;
const INIT_LARGE_RADIUS = 43;

export const StorySwiperContent: React.FC<StorySwiperContentProps> = (props) => {
  const {
    isMobile,
    isLarge,
    isShowMockupCurrent,
    isProgressHidden,
    currentGroupType,
    currentGroup,
    currentStory,
    isOpened,
    isMediaLoading,
    isVideoPlaying,
    isVideoExists,
    isBackgroundVideoPlaying,
    isLoading,
    activeStoriesWithResult,
    currentStorySize,
    contentWidth,
    contentHeight,
    forbidClose,
    isStatusBarActive,
    storyWidth,
    storyHeight,
    isInReactNativeWebView,
    isForceCloseAvailable,
    playStatus,
    jsConfetti,
    isAutoplayVideos,
    isVideoMuted,
    handleMuteVideo,
    handleLoadStory,
    handleClose,
    handleAnimationEnd,
    handleMediaLoading,
    handleGoToStory,
    pressHandlers,
    handleVideoPlaying,
    swipeHandlers,
  } = props;

  const [isGroupImageLoading, setIsGroupImageLoading] = useState(true);

  useEffect(() => {
    if (currentGroup?.imageUrl) {
      setIsGroupImageLoading(true);

      const timeout = setTimeout(() => {
        setIsGroupImageLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }

    return () => { };
  }, [currentGroup]);

  const defaultRatioIndex = useMemo(
    () => currentStorySize.width / currentStorySize.height,
    [currentStorySize],
  );

  const largeElementsTop = useAdaptiveValue(INIT_TOP_ELEMENTS);
  const largeIndicatorTop = useAdaptiveValue(INIT_TOP_INDICATOR);
  const controlTopSmall = useAdaptiveValue(INIT_CONTROL_TOP);
  const controlTopLarge = useAdaptiveValue(INIT_CONTROL_TOP_LARGE);
  const controlSidePaddingSmall = useAdaptiveValue(INIT_CONTROL_SIDE_PADDING);
  const controlGapLarge = useAdaptiveValue(INIT_CONTROL_GAP_LARGE);
  const largeBorderRadius = useAdaptiveValue(INIT_LARGE_RADIUS);

  const controlTop = isLarge ? controlTopLarge : controlTopSmall;
  const controlGap = isLarge ? controlGapLarge : controlSidePaddingSmall;

  const currentRatioIndex = useMemo(() => {
    if (storyWidth && storyHeight && !isInReactNativeWebView) {
      return storyWidth / storyHeight;
    }

    return defaultRatioIndex;
  }, [storyHeight, storyWidth, defaultRatioIndex, isInReactNativeWebView]);

  const isShowStatusBarInStory = isShowMockupCurrent && !isMobile && isLarge && isStatusBarActive;
  const desktopWidth = Math.ceil(currentRatioIndex * contentHeight);

  const noTopShadow = currentGroupType === GroupType.ONBOARDING
    && currentGroup?.settings?.isProgressHidden;

  const noTopBackgroundShadow = currentGroupType === GroupType.ONBOARDING || currentGroupType === GroupType.GROUP;

  const storyContextVal = useContext(StoryContext);

  let borderRadius;
  if (!isMobile && isShowMockupCurrent) {
    borderRadius = isLarge ? largeBorderRadius : 0;
  }

  return (
    <div
      className={b('swiper', {
        mockup: !isMobile && isShowMockupCurrent,
      })}
      style={{
        width: !isMobile ? desktopWidth : '100%',
        height: contentHeight,
        borderRadius,
      }}
    >
      <>
        {isLoading || !currentGroup?.stories ? (
          <div className={b('loader')} style={{ height: isMobile ? contentHeight : undefined }}>
            <IconLoader className={b('loaderIcon').toString()} />
          </div>
        ) : (
          <>
            <div className={b('swiperContent')}>
              {activeStoriesWithResult.map((story, index) => (
                <div
                  className={b('story', { current: index === currentStory && isOpened })}
                  key={story.id}
                  {...pressHandlers?.()}
                  {...(isMobile ? swipeHandlers : {})}
                >
                  <StoryContent
                    contentHeight={contentHeight}
                    contentWidth={contentWidth}
                    currentStorySize={currentStorySize}
                    desktopContainerWidth={desktopWidth}
                    handleGoToStory={handleGoToStory}
                    handleLoadStory={handleLoadStory}
                    handleMediaLoading={handleMediaLoading}
                    handleMuteVideo={handleMuteVideo}
                    handleVideoPlaying={handleVideoPlaying}
                    isAutoplayVideos={isAutoplayVideos}
                    isBackgroundVideoPlaying={isBackgroundVideoPlaying}
                    isDisplaying={index === currentStory && isOpened}
                    isLarge={isLarge}
                    isLoaded={props.loadedStoriesIds[story.id]}
                    isMediaLoading={isMediaLoading}
                    isMobile={isMobile}
                    isVideoMuted={isVideoMuted}
                    isVideoPlaying={isVideoPlaying}
                    jsConfetti={jsConfetti}
                    nextStory={index < activeStoriesWithResult.length - 1 ? activeStoriesWithResult[index + 1] : undefined}
                    noTopBackgroundShadow={noTopBackgroundShadow}
                    noTopShadow={noTopShadow}
                    prevStory={index > 0 ? activeStoriesWithResult[index - 1] : undefined}
                    story={story}
                    storyPlayStatus={playStatus}
                  />
                </div>
              ))}
            </div>
            <div
              className={b('topContainer')}
              style={{
                paddingTop: isInReactNativeWebView && currentGroup?.type === GroupType.ONBOARDING ? '88px' : undefined,
              }}
            >
              <>
                {isShowStatusBarInStory && <StatusBar />}
                <div
                  className={b('controls', {
                    noClose:
                      currentGroup?.settings?.isProhibitToClose
                      || forbidClose
                      || isForceCloseAvailable,
                  })}
                  style={{
                    gap: !isShowStatusBarInStory && !isMobile ? controlGap : undefined,
                    paddingTop:
                      !isShowStatusBarInStory && isShowMockupCurrent && !isMobile
                        ? controlTop
                        : undefined,
                  }}
                >
                  {!currentGroup?.settings?.isProgressHidden && !isProgressHidden && (
                    <div
                      className={b('indicators', {
                        playAnimation: playStatus === 'play',
                        stopAnimation: playStatus === 'pause',
                        widePadding: isShowMockupCurrent && isLarge,
                      })}
                      style={{
                        top: isShowMockupCurrent && isLarge ? largeIndicatorTop : undefined,
                      }}
                    >
                      {activeStoriesWithResult
                        .filter((story) => story.layerData?.isDefaultLayer)
                        .map((story, index) => (
                          <div
                            className={b('indicator', {
                              filled: index < currentStory,
                              current: index === currentStory,
                            })}
                            key={story.id}
                            style={{
                              animationDuration: `${story.layerData?.duration}s`,
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
                        wideLeft: isShowMockupCurrent && isLarge,
                      })}
                      style={{
                        top: isShowMockupCurrent && isLarge ? largeElementsTop : undefined,
                      }}
                    >
                      {currentGroup?.imageUrl && (
                        <div className={b('groupImgWrapper')}>
                          <img
                            alt=""
                            className={b('groupImg', { loading: isGroupImageLoading })}
                            src={`${currentGroup?.imageUrl}?tr=n-group_thumbnail_small`}
                            onLoad={() => setIsGroupImageLoading(false)}
                          />
                        </div>
                      )}
                      {currentGroup?.title && (
                        <p className={b('groupTitle')}>{currentGroup?.title}</p>
                      )}
                    </div>
                  )}

                  {currentGroup.type !== GroupType.ONBOARDING
                    && currentGroup.category !== 'onboarding' && (
                      <div className={b('rightTopContainer')}>
                        {!currentGroup?.settings?.isProgressHidden && playStatus !== 'wait' && (
                          <>
                            <div
                              className={b('topBtn')}
                              onClick={
                                playStatus === 'play'
                                  ? () => storyContextVal.playStatusChange?.('pause')
                                  : () => storyContextVal.playStatusChange?.('play')
                              }
                            >
                              {playStatus === 'play' ? (
                                <IconStoryPause className={b('playBtnIcon').toString()} />
                              ) : (
                                <IconStoryPlay className={b('playBtnIcon').toString()} />
                              )}
                            </div>
                          </>
                        )}

                        {isVideoExists && (
                          <div
                            className={b('topBtn')}
                            onClick={() => {
                              handleMuteVideo(!isVideoMuted);
                            }}
                          >
                            {isVideoMuted ? (
                              <IconUnmute className={b('muteBtnIcon').toString()} />
                            ) : (
                              <IconMute className={b('muteBtnIcon').toString()} />
                            )}
                          </div>
                        )}

                        {((isInReactNativeWebView
                          && !(currentGroup?.type === GroupType.ONBOARDING))
                          || (!currentGroup?.settings?.isProhibitToClose
                            && !forbidClose
                            && !(
                              isForceCloseAvailable
                              && (currentGroup?.type === GroupType.ONBOARDING
                                || (currentGroup?.type === GroupType.TEMPLATE
                                  && currentGroup?.category === 'onboarding'))
                            ))) && (
                            <div
                              className={b('close', {
                                noProgress:
                                  currentGroup?.settings?.isProgressHidden || isProgressHidden,
                                wideRight: isShowMockupCurrent && isLarge,
                              })}
                              style={{
                                top: isShowMockupCurrent && isLarge ? largeElementsTop : undefined,
                              }}
                              onClick={handleClose}
                            >
                              <IconClose />
                            </div>
                          )}
                      </div>
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
