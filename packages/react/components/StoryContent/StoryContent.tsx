import React, {
  useState, useEffect, useMemo, useCallback, useContext, useRef,
} from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import { IconLoader, IconPlay } from '@components/icons';
import { WidgetFactory } from '../../core';
import { StoryType, WidgetsTypes } from '../../types';
import { StoryVideoBackground } from '../StoryVideoBackground/StoryVideoBackground';
import { renderBackgroundStyles, renderPosition } from '../../utils';
import { PlayStatusType, StoryContext, StoryCurrentSize } from '../StoryModal/StoryModal';
import { useElementSize } from '../../hooks/useElementSize';
import './StoryContent.scss';
import '../StoryModal/StoryModal.scss';

const b = block('StorySdkContent');
const m = block('StorySdkModal');

const WAIT_TIME = 2000;

const loadedImagesCache = new Map<string, boolean>();

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
  [WidgetsTypes.QUIZ_RATE]: true,
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
  nextStory?: StoryType;
  prevStory?: StoryType;
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
    nextStory,
    prevStory,
    handleMuteVideo,
    handleMediaLoading,
    handleLoadStory,
    handleVideoPlaying,
    handleGoToStory,
  } = props;

  const [width, height] = useWindowSize();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const backgroundSize = useElementSize(backgroundRef, [isDisplaying]);

  const desktopScale = useMemo(
    () => desktopContainerWidth / currentStorySize.width,
    [desktopContainerWidth, currentStorySize.width],
  );

  const imageBackgroundRef = React.useRef<HTMLImageElement>(null);
  const nextImageBackgroundRef = React.useRef<HTMLImageElement>(null);
  const prevImageBackgroundRef = React.useRef<HTMLImageElement>(null);

  const [resourcesToLoad, setResourcesToLoad] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const [prevStoryId, setPrevStoryId] = useState<string | null>(null);
  const [nextBackgroundUrl, setNextBackgroundUrl] = useState<string | null>(null);
  const [prevBackgroundUrl, setPrevBackgroundUrl] = useState<string | null>(null);

  const storyContextVal = useContext(StoryContext);

  // Function to preload image
  const preloadImage = useCallback((imageUrl: string, callback?: () => void) => {
    if (!imageUrl || loadedImagesCache.has(imageUrl)) {
      callback?.();
      return;
    }

    const img = new Image();
    img.onload = () => {
      loadedImagesCache.set(imageUrl, true);
      callback?.();
    };
    img.src = imageUrl;
  }, []);

  // Track current story
  useEffect(() => {
    if (isDisplaying && prevStoryId !== story.id) {
      setPrevStoryId(story.id);
    }
  }, [isDisplaying, story.id, prevStoryId]);

  // Preload adjacent stories
  useEffect(() => {
    if (!isDisplaying) return;

    // Preload background images of adjacent stories
    if (nextStory && nextStory.background.type === 'image' && nextStory.background.value) {
      const nextImageUrl = `${nextStory.background.value}?tr=w-${Math.floor(backgroundSize.width)},h-${Math.floor(backgroundSize.height)},fo-center,pr-true`;
      setNextBackgroundUrl(nextImageUrl);
      preloadImage(nextImageUrl);
    } else {
      setNextBackgroundUrl(null);
    }

    if (prevStory && prevStory.background.type === 'image' && prevStory.background.value) {
      const prevImageUrl = `${prevStory.background.value}?tr=w-${Math.floor(backgroundSize.width)},h-${Math.floor(backgroundSize.height)},fo-center,pr-true`;
      setPrevBackgroundUrl(prevImageUrl);
      preloadImage(prevImageUrl);
    } else {
      setPrevBackgroundUrl(null);
    }
  }, [isDisplaying, story.id, preloadImage, nextStory, prevStory, backgroundSize]);

  // Count resources that need to be loaded
  useEffect(() => {
    if (!isDisplaying) {
      if (resourcesToLoad > 0) {
        setResourcesToLoad(1);
      }
      return;
    }

    let resources = 0;

    if (story.background.type === 'image' || story.background.type === 'video') {
      // Skip counting if image is already cached
      if (story.background.type === 'image' && story.background.value && loadedImagesCache.has(story.background.value)) {
        // Image already loaded, no need to count
      } else {
        resources++;
      }
    }

    story.storyData.forEach((widget) => {
      if (
        widget.content.type === WidgetsTypes.IMAGE
        || widget.content.type === WidgetsTypes.VIDEO
      ) {
        resources++;
      }
    });

    setResourcesToLoad(resources);
  }, [story, isDisplaying]);

  const togglePlay = () => {
    handleMuteVideo?.(false);
    handleVideoPlaying(true);
  };

  const handleResourcesLoading = useCallback((isLoading: boolean) => {
    if (!isLoading) {
      setResourcesToLoad((prev) => (prev - 1 > 0 ? prev - 1 : 0));
    } else {
      handleMediaLoading(true);
    }
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      handleResourcesLoading(false);
      if (story.background.type === 'image' && story.background.value) {
        loadedImagesCache.set(story.background.value, true);
      }
    };

    const imageBackgroundElement = imageBackgroundRef.current;
    const imageUrl = story.background.type === 'image'
      ? `${story.background.value}?tr=w-${Math.floor(backgroundSize.width)},h-`
      + `${Math.floor(backgroundSize.height)},fo-center,pr-true`
      : '';

    if (imageBackgroundElement && story.background.type === 'image') {
      if (loadedImagesCache.has(story.background.value)) {
        imageBackgroundElement.src = imageUrl;
        handleResourcesLoading(false);
      } else {
        imageBackgroundElement.addEventListener('load', handleLoad);
        imageBackgroundElement.src = imageUrl;
      }
    }

    return () => {
      if (imageBackgroundElement) {
        imageBackgroundElement.removeEventListener('load', handleLoad);
      }
    };
  }, [isDisplaying, handleResourcesLoading, story.background, backgroundSize]);

  useEffect(() => {
    handleMediaLoading(resourcesToLoad > 0);

    if (resourcesToLoad === 0) {
      handleLoadStory?.(story.id);
    }
  }, [resourcesToLoad]);

  // Show loader only if resources are still loading after WAIT_TIME
  useEffect(() => {
    const shouldShowLoader = resourcesToLoad > 0 && !isLoaded;

    let timeoutId: NodeJS.Timeout | null = null;

    if (shouldShowLoader) {
      timeoutId = setTimeout(() => {
        setShowLoader(true);
      }, WAIT_TIME);
    } else {
      setShowLoader(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [resourcesToLoad, isLoaded]);

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
    width,
  ]);

  if (!isDisplaying) {
    return null;
  }

  return (
    <>
      <div
        className={b('background', {
          noTopShadow: noTopBackgroundShadow,
          onTop: isMobile,
        })}
        ref={backgroundRef}
        style={{
          background: story.background.type ? renderBackgroundStyles(story.background) : '#05051D',
          width: contentWidth,
          height: contentHeight,
        }}
      >
        {/* Preloaded background of previous story */}
        {prevBackgroundUrl && (
          <img
            alt=""
            className={b('imageBackground', { preload: true })}
            ref={prevImageBackgroundRef}
            src={prevBackgroundUrl}
          />
        )}

        {/* Active background of current story */}
        <img
          alt=""
          className={b('imageBackground', { show: story.background.type === 'image' })}
          ref={imageBackgroundRef}
        />

        {/* Preloaded background of next story */}
        {nextBackgroundUrl && (
          <img
            alt=""
            className={b('imageBackground', { preload: true })}
            ref={nextImageBackgroundRef}
            src={nextBackgroundUrl}
          />
        )}

        {story.background.type === 'video' && (
          <StoryVideoBackground
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
        className={b({
          large: isLarge,
          noTopShadow,
        })}
        style={{
          width: contentWidth,
          height: contentHeight,
        }}
      >
        <div
          className={b('scope', { large: isLarge })}
          style={{
            transform: `scale(${contentScale}) translateY(-50%)`,
          }}
        >
          {story.background.type === 'video'
            && isDisplaying
            && !isBackgroundVideoPlaying
            && !isAutoplayVideos
            && !isMediaLoading && (
              <div
                className={b('playBtn')}
                role="button"
                tabIndex={0}
                onClick={togglePlay}
                onKeyDown={(e) => e.key === 'Enter' && togglePlay()}
              >
                <IconPlay />
              </div>
            )}
          {story.storyData.map((widget: any) => (
            <div
              className={b('object', {
                noClickable:
                  !CLICKABLE_WIDGETS[widget.content.type as keyof typeof CLICKABLE_WIDGETS],
              })}
              id={`story-${story.id}-widget-${widget.id}`}
              key={widget.id}
              style={renderPosition(
                widget.positionByResolutions[
                `${currentStorySize.width}x${currentStorySize.height}`
                ],
                widget.positionLimits,
              )}
            >
              <WidgetFactory
                currentStorySize={currentStorySize}
                handleCloseStory={storyContextVal.closeStoryGroup}
                handleGoToStory={handleGoToStory}
                handleMediaLoading={handleResourcesLoading}
                handleMuteVideo={handleMuteVideo}
                handleVideoPlaying={(isPlaying: boolean) => {
                  if (isPlaying) {
                    handleMuteVideo?.(false);
                  }
                  handleVideoPlaying(isPlaying);
                }}
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

      {/* Only show loader if not all resources are loaded and not cached */}
      {!loadedImagesCache.has(story.background.value as string) && (
        <div className={b('loader', { show: showLoader })}>
          <IconLoader className={m('loaderIcon').toString()} />
        </div>
      )}
    </>
  );
};
