/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import block from 'bem-cn';
import './StoryVideoBackground.scss';
import { IconLoader } from '@components/icons';

const b = block('StorySdkVideoBackground');

type PropTypes = {
  src: string;
  isLoading?: boolean;
  autoplay?: boolean;
  isFilled?: boolean;
  isPlaying?: boolean;
  handleVideoBackgroundPlaying?: (isPlaying: boolean) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
};

export const StoryVideoBackground = ({
  src,
  autoplay = false,
  isLoading,
  isPlaying,
  handleVideoBackgroundPlaying,
  isFilled,
  onLoadStart,
  onLoadEnd
}: PropTypes) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    handleVideoBackgroundPlaying?.(true);
  };

  const handlePause = () => {
    handleVideoBackgroundPlaying?.(false);
  };

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <div className={b()} role="button" tabIndex={0}>
      <video
        autoPlay={autoplay}
        className={b('video', { loading: isLoading, cover: isFilled })}
        disablePictureInPicture
        loop
        muted={autoplay}
        playsInline={autoplay}
        preload="metadata"
        ref={videoRef}
        src={src}
        onLoadStart={onLoadStart}
        onLoadedData={onLoadEnd}
        onPause={handlePause}
        onPlay={handlePlay}
      />
      <div className={b('loader', { show: isLoading })}>
        <IconLoader className={b('loaderIcon').toString()} />
      </div>
    </div>
  );
};
