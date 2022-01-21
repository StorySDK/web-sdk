import React, { useState } from 'react';
import block from 'bem-cn';
import { useWindowWidth } from '@react-hook/window-size';
import { WidgetFactory } from '../../core';
import { StoryType } from '../../types';
import { StoryVideoBackground } from '../StoryVideoBackground/StoryVideoBackground';
import { renderBackgroundStyles, renderPosition } from '../../utils';
import './StoryContent.scss';

const b = block('StorySdkContent');

interface StoryContentProps {
  story: StoryType;
}

export const StoryContent: React.FC<StoryContentProps> = (props) => {
  const { story } = props;
  const [isVideoLoading, setVideoLoading] = useState(false);

  const width = useWindowWidth();
  // const canvasRef = useRef(null);

  return (
    <div className={b()} style={{ height: width < 768 ? Math.round(694 * (width / 390)) : '100%' }}>
      <div
        className={b('scope')}
        style={{
          background: story.background.type ? renderBackgroundStyles(story.background) : '#05051D',
          transform: width < 768 ? `scale(${width / 3.9}%)` : `scale(${288 / 3.9}%)`
        }}
      >
        {story.storyData.map((widget: any, index: number) => (
          <div
            className={b('object')}
            id={`story-${story.id}-widget-${widget.id}`}
            key={widget.id}
            style={renderPosition(widget.position, widget.positionLimits, index + 3)}
          >
            <WidgetFactory storyId={story.id} widget={widget} />
          </div>
        ))}
      </div>

      {/* <canvas className={b('canvas')} ref={canvasRef} /> */}

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
  );
};
