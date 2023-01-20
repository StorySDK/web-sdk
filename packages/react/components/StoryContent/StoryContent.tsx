import React, { useState } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import { WidgetFactory } from '../../core';
import { StoryType } from '../../types';
import { StoryVideoBackground } from '../StoryVideoBackground/StoryVideoBackground';
import { renderBackgroundStyles, renderPosition } from '../../utils';
import { MOBILE_BREAKPOINT, StoryCurrentSize } from '../StoryModal/StoryModal';
import './StoryContent.scss';

const b = block('StorySdkContent');

interface StoryContentProps {
  story: StoryType;
  storyCurrentSize: StoryCurrentSize;
  currentPaddingSize: number;
  innerHeightGap: number;
  noTopShadow?: boolean;
  jsConfetti?: any;
  isLarge?: boolean;
  isLargeBackground?: boolean;
  handleGoToStory?: (storyId: string) => void;
}

export const StoryContent: React.FC<StoryContentProps> = (props) => {
  const {
    story,
    jsConfetti,
    noTopShadow,
    storyCurrentSize,
    currentPaddingSize,
    isLarge,
    isLargeBackground,
    innerHeightGap,
    handleGoToStory
  } = props;
  const [isVideoLoading, setVideoLoading] = useState(false);

  const [width, height] = useWindowSize();

  const isMobile = width < MOBILE_BREAKPOINT;

  return (
    <>
      <div
        className={b('background', { noTopShadow })}
        style={{
          background: story.background.type ? renderBackgroundStyles(story.background) : '#05051D',
          height: isMobile
            ? Math.round(storyCurrentSize.height * (width / storyCurrentSize.width))
            : undefined
        }}
      >
        {story.background.type === 'video' && (
          <StoryVideoBackground
            autoplay
            isLoading={isVideoLoading}
            src={story.background.value}
            onLoadEnd={() => {
              setVideoLoading(false);
            }}
          />
        )}
      </div>

      <div
        className={b({ large: isLarge, center: isLargeBackground })}
        style={{
          height: isMobile
            ? Math.round(storyCurrentSize.height * (width / storyCurrentSize.width))
            : `calc(100% - ${innerHeightGap}px)`
        }}
      >
        <div
          className={b('scope', { large: isLarge })}
          style={{
            transform: isMobile
              ? `scale(${width / storyCurrentSize.width})`
              : `scale(${(height - currentPaddingSize) / storyCurrentSize.height})`
          }}
        >
          {story.storyData.map((widget: any) => (
            <div
              className={b('object')}
              id={`story-${story.id}-widget-${widget.id}`}
              key={widget.id}
              style={renderPosition(widget.position, widget.positionLimits)}
            >
              <WidgetFactory
                handleGoToStory={handleGoToStory}
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
