import React from 'react';
import block from 'bem-cn';
import './StoryVideoBackground.scss';

const b = block('StorySdkVideoBackground');

type PropTypes = {
  src: string;
  isLoading?: boolean;
  autoplay?: boolean;
  isFilled?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
};

export const StoryVideoBackground = ({
  src,
  autoplay = false,
  isLoading,
  isFilled,
  onLoadStart,
  onLoadEnd
}: PropTypes) => (
  <div className={b()}>
    <video
      autoPlay={autoplay}
      className={b('video', { loading: isLoading, cover: isFilled })}
      disablePictureInPicture
      loop
      muted
      playsInline
      preload="metadata"
      src={src}
      onLoadStart={onLoadStart}
      onLoadedData={onLoadEnd}
    />
    <p className={b('loadText', { show: isLoading })}>Background is loading...</p>
  </div>
);
