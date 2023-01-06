import React, { useState } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import { WidgetFactory } from '../../core';
import { StoryType } from '../../types';
import { StoryVideoBackground } from '../StoryVideoBackground/StoryVideoBackground';
import { renderBackgroundStyles, renderPosition } from '../../utils';
import { MOBILE_BREAKPOINT, PADDING_SIZE, STORY_SIZE } from '../StoryModal/StoryModal';
import './StoryContent.scss';

const b = block('StorySdkContent');

interface StoryContentProps {
  story: StoryType;
  noTopShadow?: boolean;
  jsConfetti?: any;
  handleGoToStory?: (storyId: string) => void;
}

export const StoryContent: React.FC<StoryContentProps> = (props) => {
  const { story, jsConfetti, noTopShadow, handleGoToStory } = props;
  const [isVideoLoading, setVideoLoading] = useState(false);

  const [width, height] = useWindowSize();

  return (
    <div
      className={b({ noTopShadow })}
      style={{
        height:
          width < MOBILE_BREAKPOINT
            ? Math.round(STORY_SIZE.height * (width / STORY_SIZE.width))
            : '100%'
      }}
    >
      <div
        className={b('scope')}
        style={{
          background: story.background.type ? renderBackgroundStyles(story.background) : '#05051D',
          transform:
            width < MOBILE_BREAKPOINT
              ? `scale(${width / STORY_SIZE.width})`
              : `scale(${(height - PADDING_SIZE) / STORY_SIZE.height})`
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
    </div>
  );
};
