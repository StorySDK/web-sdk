import React, { useState, useEffect, useMemo, useCallback } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import { IconLoader, IconPlay } from '@components/icons';
import { WidgetFactory } from '../../core';
import { StoryType, WidgetsTypes } from '../../types';
import { StoryVideoBackground } from '../StoryVideoBackground/StoryVideoBackground';
import { renderBackgroundStyles, renderPosition } from '../../utils';
import { PlayStatusType, StoryCurrentSize } from '../StoryModal/StoryModal';
import './StoryContent.scss';
import '../StoryModal/StoryModal.scss';

const b = block('StorySdkContent');
const m = block('StorySdkModal');

const CLICKABLE_WIDGETS = {
  [WidgetsTypes.CLICK_ME]: true,
  [WidgetsTypes.LINK]: true,
  [WidgetsTypes.QUESTION]: true,
  [WidgetsTypes.TALK_ABOUT]: true,
  [WidgetsTypes.EMOJI_REACTION]: true,
  [WidgetsTypes.QUIZ_ONE_ANSWER]: true,
  [WidgetsTypes.SWIPE_UP]: true,
  [WidgetsTypes.CHOOSE_ANSWER]: true,
  [WidgetsTypes.QUIZ_OPEN_ANSWER]: true,
  [WidgetsTypes.SLIDER]: true,
  [WidgetsTypes.QUIZ_MULTIPLE_ANSWERS]: true,
  [WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE]: true,
  [WidgetsTypes.QUIZ_RATE]: true
};

interface StoryContentProps {
  story: StoryType;
  isMobile?: boolean;
  isDisplaying?: boolean;
  isAutoplayVideos?: boolean;
  isLoaded?: boolean;
  isBackgroundVideoPlaying?: boolean;
  isVideoPlaying?: boolean;
  contentWidth: number | string;
  contentHeight: number | string;
  currentStorySize: StoryCurrentSize;
  storyPlayStatus: PlayStatusType;
  desktopContainerWidth: number;
  noTopShadow?: boolean;
  noTopBackgroundShadow?: boolean;
  isUnfilledBackground?: boolean;
  jsConfetti?: any;
  isLarge?: boolean;
  isMediaLoading?: boolean;
  isVideoMuted?: boolean;
  handleMuteVideo?: (isMuted: boolean) => void;
  handleLoadStory?: (storyId: string) => void;
  handleGoToStory?: (storyId: string) => void;
  handleMediaLoading: (isLoading: boolean) => void;
  handleVideoPlaying: (isPlaying: boolean) => void;
}

export const StoryContent: React.FC<StoryContentProps> = (props) => {
  const {
    story,
    jsConfetti,
    noTopShadow,
    desktopContainerWidth,
    isMobile,
    isDisplaying,
    isLoaded,
    isBackgroundVideoPlaying,
    isVideoPlaying,
    noTopBackgroundShadow,
    currentStorySize,
    isLarge,
    isUnfilledBackground,
    isAutoplayVideos,
    contentWidth,
    contentHeight,
    isMediaLoading,
    isVideoMuted,
    storyPlayStatus,
    handleMuteVideo,
    handleMediaLoading,
    handleLoadStory,
    handleVideoPlaying,
    handleGoToStory
  } = props;

  const [width, height] = useWindowSize();

  const desktopScale = useMemo(
    () => desktopContainerWidth / currentStorySize.width,
    [desktopContainerWidth, currentStorySize.width]
  );

  const imageBackgroundRef = React.useRef<HTMLImageElement>(null);

  const [resourcesToLoad, setResourcesToLoad] = useState(1);

  useEffect(() => {
    if (!isDisplaying) {
      if (resourcesToLoad > 0) {
        setResourcesToLoad(1);
      }
      return;
    }

    let resources = 0;

    if (story.background.type === 'image' || story.background.type === 'video') {
      resources++;
    }

    story.storyData.forEach((widget) => {
      if (
        widget.content.type === WidgetsTypes.IMAGE ||
        widget.content.type === WidgetsTypes.VIDEO
      ) {
        resources++;
      }
    });

    setResourcesToLoad(resources);
  }, [story, isDisplaying]);

  const togglePlay = () => {
    handleVideoPlaying(!isVideoPlaying);
  };

  const handleResourcesLoading = useCallback((isLoading: boolean) => {
    if (!isLoading) {
      setResourcesToLoad((prev) => (prev - 1 > 0 ? prev - 1 : 0));
    }
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      handleResourcesLoading(false);
    };

    const imageBackgroundElement = imageBackgroundRef.current;

    if (imageBackgroundElement && story.background.type === 'image') {
      imageBackgroundElement.addEventListener('load', handleLoad);
      imageBackgroundElement.src = story.background.value;
    }

    return () => {
      if (imageBackgroundElement) {
        imageBackgroundElement.removeEventListener('load', handleLoad);
      }
    };
  }, [isDisplaying, handleResourcesLoading, story.background]);

  useEffect(() => {
    handleMediaLoading(resourcesToLoad > 0);

    if (resourcesToLoad === 0) {
      handleLoadStory?.(story.id);
    }
  }, [resourcesToLoad]);

  const contentScale = useMemo(() => {
    if (isMobile) {
      if (contentWidth === '100%') {
        return width / currentStorySize.width;
      }
      return height / currentStorySize.height;
    }

    return desktopScale;
  }, [
    contentWidth,
    currentStorySize.height,
    currentStorySize.width,
    desktopScale,
    height,
    isMobile,
    width
  ]);

  if (!isDisplaying) {
    return null;
  }

  return (
    <>
      <div
        className={b('background', { noTopShadow: noTopBackgroundShadow, onTop: isMobile })}
        style={{
          background: story.background.type ? renderBackgroundStyles(story.background) : '#05051D',
          width: contentWidth,
          height: contentHeight
        }}
      >
        <img
          alt=""
          className={b('imageBackground', { show: story.background.type === 'image' })}
          ref={imageBackgroundRef}
        />
        {story.background.type === 'video' && (
          <StoryVideoBackground
            autoplay={isAutoplayVideos}
            isDisplaying={isDisplaying}
            isFilled={!isUnfilledBackground}
            isLoading={isMediaLoading}
            isMuted={isVideoMuted}
            isPlaying={isBackgroundVideoPlaying && storyPlayStatus === 'play'}
            src={story.background.value}
            onLoadEnd={() => {
              handleResourcesLoading(false);
            }}
            onLoadStart={() => {
              handleResourcesLoading(true);
            }}
          />
        )}
      </div>

      <div
        className={b({ large: isLarge, noTopShadow, center: isMobile })}
        style={{
          width: contentWidth,
          height: contentHeight
        }}
      >
        <div
          className={b('scope', { large: isLarge })}
          style={{
            transform: `scale(${contentScale})`
          }}
        >
          {story.background.type === 'video' &&
            isDisplaying &&
            !isVideoPlaying &&
            !isAutoplayVideos &&
            !isMediaLoading && (
              <button className={b('playBtn')} onClick={togglePlay}>
                <IconPlay />
              </button>
            )}
          {story.storyData.map((widget: any) => (
            <div
              className={b('object', {
                noClickable:
                  !CLICKABLE_WIDGETS[widget.content.type as keyof typeof CLICKABLE_WIDGETS]
              })}
              id={`story-${story.id}-widget-${widget.id}`}
              key={widget.id}
              style={renderPosition(
                widget.positionByResolutions[
                  `${currentStorySize.width}x${currentStorySize.height}`
                ],
                widget.positionLimits
              )}
            >
              <WidgetFactory
                currentStorySize={currentStorySize}
                handleGoToStory={handleGoToStory}
                handleMediaLoading={handleResourcesLoading}
                handleMuteVideo={handleMuteVideo}
                handleVideoPlaying={handleVideoPlaying}
                isAutoplayVideos={isAutoplayVideos}
                isDisplaying={isDisplaying}
                isVideoMuted={isVideoMuted}
                isVideoPlaying={isVideoPlaying}
                jsConfetti={jsConfetti}
                storyId={story.id}
                widget={widget}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={b('loader', { show: resourcesToLoad > 0 && !isLoaded })}>
        <IconLoader className={m('loaderIcon').toString()} />
      </div>
    </>
  );
};
