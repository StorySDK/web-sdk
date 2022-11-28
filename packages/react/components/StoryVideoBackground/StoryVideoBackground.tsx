import React from 'react';
import block from 'bem-cn';
import './StoryVideoBackground.scss';

const b = block('StorySdkVideoBackground');

type PropTypes = {
  src: string;
  isLoading?: boolean;
  autoplay?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
};

export const StoryVideoBackground = ({
  src,
  autoplay = false,
  isLoading,
  onLoadStart,
  onLoadEnd
}: PropTypes) => (
  <div className={b()}>
    <video
      autoPlay={autoplay}
      className={b('video', { loading: isLoading })}
      loop
      muted
      preload="metadata"
      onLoadStart={onLoadStart}
      onLoadedData={onLoadEnd}
    >
      <source src={src} />
    </video>

    <p className={b('loadText', { show: isLoading })}>Background is loading...</p>
  </div>
);
