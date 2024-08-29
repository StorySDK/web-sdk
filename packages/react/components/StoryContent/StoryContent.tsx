import React, { useEffect, useMemo } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import { IconPlay } from '@components/icons';
import { WidgetFactory } from '../../core';
import { StoryType } from '../../types';
import { StoryVideoBackground } from '../StoryVideoBackground/StoryVideoBackground';
import { renderBackgroundStyles, renderPosition } from '../../utils';
import { StoryCurrentSize } from '../StoryModal/StoryModal';
import './StoryContent.scss';

const b = block('StorySdkContent');

interface StoryContentProps {
  story: StoryType;
  isMobile?: boolean;
  isDisplaying?: boolean;
  isAutoplayVideos?: boolean;
  contentHeight: number | string;
  currentStorySize: StoryCurrentSize;
  desktopContainerWidth: number;
  noTopShadow?: boolean;
  noTopBackgroundShadow?: boolean;
  isUnfilledBackground?: boolean;
  jsConfetti?: any;
  isLarge?: boolean;
  handleGoToStory?: (storyId: string) => void;
  handleMediaLoading: (isLoading: boolean) => void;
  isMediaLoading?: boolean;
}

export const StoryContent: React.FC<StoryContentProps> = (props) => {
  const {
    story,
    jsConfetti,
    noTopShadow,
    desktopContainerWidth,
    isMobile,
    isDisplaying,
    noTopBackgroundShadow,
    currentStorySize,
    isLarge,
    isUnfilledBackground,
    isAutoplayVideos,
    contentHeight,
    isMediaLoading,
    handleMediaLoading,
    handleGoToStory
  } = props;

  const [width] = useWindowSize();

  const desktopScale = useMemo(
    () => desktopContainerWidth / currentStorySize.width,
    [desktopContainerWidth, currentStorySize.width]
  );

  const [isVideoPlaying, setIsVideoPlaying] = React.useState(isAutoplayVideos ?? false);

  useEffect(() => {
    if (isAutoplayVideos) {
      setIsVideoPlaying(true);
    }
  }, [isAutoplayVideos]);

  const togglePlay = () => {
    setIsVideoPlaying((prev) => !prev);
  };

  return (
    <>
      <div
        className={b('background', { noTopShadow: noTopBackgroundShadow, onTop: isMobile })}
        style={{
          background: story.background.type ? renderBackgroundStyles(story.background) : '#05051D',
          height: contentHeight
        }}
      >
        {story.background.type === 'video' && isDisplaying && (
          <StoryVideoBackground
            autoplay={isAutoplayVideos}
            isFilled={!isUnfilledBackground}
            isLoading={isMediaLoading}
            isPlaying={isVideoPlaying && isDisplaying}
            setIsPlaying={setIsVideoPlaying}
            src={story.background.value}
            onLoadEnd={() => {
              handleMediaLoading(false);
            }}
            onLoadStart={() => {
              handleMediaLoading(true);
            }}
          />
        )}
      </div>

      <div
        className={b({ large: isLarge, noTopShadow })}
        style={{
          height: isMobile
            ? Math.round(currentStorySize.height * (width / currentStorySize.width))
            : `100%`
        }}
      >
        <div
          className={b('scope', { large: isLarge })}
          style={{
            transform: isMobile
              ? `scale(${width / currentStorySize.width})`
              : `scale(${desktopScale})`
          }}
        >
          {story.background.type === 'video' &&
            isDisplaying &&
            !isVideoPlaying &&
            !isAutoplayVideos && (
              <button className={b('playBtn')} onClick={togglePlay}>
                <IconPlay />
              </button>
            )}
          {story.storyData.map((widget: any) => (
            <div
              className={b('object')}
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
                isAutoplayVideos={isAutoplayVideos}
                isDisplaying={isDisplaying}
                jsConfetti={jsConfetti}
                storyId={story.id}
                widget={widget}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
