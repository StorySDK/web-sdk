import React, { useMemo, useRef } from 'react';
import block from 'bem-cn';
import { StoryType } from '@storysdk/types';
import { WidgetFactory } from '../../core';
import { StoryVideoBackground } from '../StoryVideoBackground/StoryVideoBackground';
import { renderBackgroundStyles, renderPosition } from '../../utils';
import './StoryPreview.scss';

const b = block('StorySdkPreview');

export interface StoryPreviewProps {
  story: StoryType;
  width: number | string;
  height: number | string;
  borderRadius?: number;
  className?: string;
  isVideoMuted?: boolean;
  disableInteraction?: boolean;
  storyWidth?: number;
  storyHeight?: number;
  autoplayVideos?: boolean;
}

export const StoryPreview: React.FC<StoryPreviewProps> = (props) => {
  const {
    story,
    width,
    height,
    borderRadius,
    className,
    isVideoMuted = true,
    disableInteraction = true,
    storyWidth = 360,
    storyHeight = 640,
    autoplayVideos = false,
  } = props;

  const backgroundRef = useRef<HTMLDivElement>(null);
  const imageBackgroundRef = useRef<HTMLImageElement>(null);

  // Calculate scale to fit content in container
  const contentScale = useMemo(() => {
    const containerWidth = typeof width === 'number' ? width : parseInt(width as string, 10);
    const containerHeight = typeof height === 'number' ? height : parseInt(height as string, 10);

    const scaleX = containerWidth / storyWidth;
    const scaleY = containerHeight / storyHeight;

    return Math.min(scaleX, scaleY);
  }, [width, height, storyWidth, storyHeight]);

  return (
    <div
      className={b({ className })}
      style={{
        width,
        height,
        borderRadius,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background */}
      <div
        className={b('background')}
        ref={backgroundRef}
        style={{
          background: story.background.type ? renderBackgroundStyles(story.background) : '#05051D',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Background image */}
        {story.background.type === 'image' && (
          <img
            alt=""
            className={b('imageBackground')}
            ref={imageBackgroundRef}
            src={story.background.value}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        )}

        {/* Background video */}
        {story.background.type === 'video' && (
          <StoryVideoBackground
            isDisplaying
            isFilled
            isLoading={false}
            isMuted={isVideoMuted}
            isPlaying={autoplayVideos}
            src={story.background.value}
          />
        )}
      </div>

      {/* Content */}
      <div
        className={b('content')}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${contentScale})`,
          width: storyWidth,
          height: storyHeight,
          pointerEvents: disableInteraction ? 'none' : 'auto',
        }}
      >
        {story.storyData.map((widget: any) => (
          <div
            className={b('widget')}
            key={widget.id}
            style={renderPosition(
              widget.positionByResolutions[`${storyWidth}x${storyHeight}`] || widget.positionByResolutions[Object.keys(widget.positionByResolutions)[0]],
              widget.positionLimits,
            )}
          >
            <WidgetFactory
              currentStorySize={{ width: storyWidth, height: storyHeight }}
              handleCloseStory={() => { }} // No-op for preview
              handleGoToStory={() => { }} // No-op for preview
              handleMediaLoading={() => { }} // No-op for preview
              handleMuteVideo={() => { }} // No-op for preview
              handleVideoPlaying={() => { }} // No-op for preview
              isAutoplayVideos={autoplayVideos}
              isDisplaying
              isVideoMuted={isVideoMuted}
              isVideoPlaying={autoplayVideos}
              storyId={story.id}
              widget={widget}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
