import React, { useState } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import { WidgetFactory } from '../../core';
import { StoryType } from '../../types';
import { StoryVideoBackground } from '../StoryVideoBackground/StoryVideoBackground';
import { renderBackgroundStyles, renderPosition } from '../../utils';
import './StoryContent.scss';

const b = block('StorySdkContent');

interface StoryContentProps {
  story: StoryType;
  jsConfetti?: any;
}

const STORY_SIZE = {
  width: 390,
  height: 694
};

const STORY_SIZE_DESKTOP = {
  width: 283,
  height: 512
};

const SCALE_INDEX = 10.53;

export const StoryContent: React.FC<StoryContentProps> = (props) => {
  const { story, jsConfetti } = props;
  const [isVideoLoading, setVideoLoading] = useState(false);

  const [width, height] = useWindowSize();

  return (
    <div
      className={b()}
      style={{
        height: width < 768 ? Math.round(STORY_SIZE.height * (width / STORY_SIZE.width)) : '100%'
      }}
    >
      <div
        className={b('scope')}
        style={{
          background: story.background.type ? renderBackgroundStyles(story.background) : '#05051D',
          transform:
            width < 768
              ? `scale(${width / SCALE_INDEX}%)`
              : `scale(${
                  Math.round((STORY_SIZE_DESKTOP.width / STORY_SIZE_DESKTOP.height) * height) /
                  SCALE_INDEX
                }%)`
        }}
      >
        {story.storyData.map((widget: any, index: number) => (
          <div
            className={b('object')}
            id={`story-${story.id}-widget-${widget.id}`}
            key={widget.id}
            style={renderPosition(widget.position, widget.positionLimits, index + 3)}
          >
            <WidgetFactory jsConfetti={jsConfetti} storyId={story.id} widget={widget} />
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
