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
  isMuted?: boolean;
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
  isMuted,
  isFilled,
  handleVideoBackgroundPlaying,
  onLoadStart,
  onLoadEnd
}: PropTypes) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !!isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (isPlaying) {
      videoElement?.play().catch((error) => {
        console.error('StorySDK: Error attempting to play media:', error);
      });
    } else {
      videoElement?.pause();
    }

    return () => {
      videoElement?.pause();
    };
  }, [isPlaying]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadStart = () => {
      onLoadStart?.();
    };

    const handleCanPlay = () => {
      onLoadEnd?.();
    };

    const handlePause = () => {
      handleVideoBackgroundPlaying?.(false);
    };

    const handlePlay = () => {
      handleVideoBackgroundPlaying?.(true);
    };

    videoElement?.addEventListener('loadstart', handleLoadStart);
    videoElement?.addEventListener('canplay', handleCanPlay);
    videoElement?.addEventListener('pause', handlePause);
    videoElement?.addEventListener('play', handlePlay);

    return () => {
      videoElement?.removeEventListener('loadstart', handleLoadStart);
      videoElement?.removeEventListener('canplay', handleCanPlay);
      videoElement?.removeEventListener('pause', handlePause);
      videoElement?.removeEventListener('play', handlePlay);
    };
  }, []);

  return (
    <div className={b()} role="button" tabIndex={0}>
      <video
        autoPlay={autoplay}
        className={b('video', { loading: isLoading, cover: isFilled })}
        disablePictureInPicture
        loop
        muted={isMuted ?? autoplay}
        playsInline
        preload="metadata"
        ref={videoRef}
        src={src}
        webkit-playsinline="true"
      />
      <div className={b('loader', { show: isLoading })}>
        <IconLoader className={b('loaderIcon').toString()} />
      </div>
    </div>
  );
};
