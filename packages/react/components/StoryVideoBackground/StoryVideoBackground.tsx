/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import block from 'bem-cn';
import { IconLoader } from '@components/icons';
import './StoryVideoBackground.scss';

const b = block('StorySdkVideoBackground');

type PropTypes = {
  src: string;
  isLoading?: boolean;
  isMuted?: boolean;
  autoplay?: boolean;
  isFilled?: boolean;
  isPlaying?: boolean;
  isDisplaying?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
};

export const StoryVideoBackground = ({
  src,
  autoplay = false,
  isLoading,
  isPlaying,
  isDisplaying,
  isMuted,
  isFilled,
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

    if (isPlaying && isDisplaying) {
      videoElement?.play().catch((error) => {
        console.error('StorySDK: Error attempting to play media:', error);
      });
    } else {
      videoElement?.pause();
    }

    return () => {
      videoElement?.pause();
    };
  }, [isPlaying, isDisplaying]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleError = (e: Event) => {
      console.error('Video error:', e);
    };

    const handleLoadStart = () => {
      onLoadStart?.();
    };

    const handleCanPlay = () => {
      onLoadEnd?.();
    };

    videoElement?.load();

    videoElement?.addEventListener('loadstart', handleLoadStart);
    videoElement?.addEventListener('canplay', handleCanPlay);
    videoElement?.addEventListener('error', handleError);

    return () => {
      videoElement?.removeEventListener('loadstart', handleLoadStart);
      videoElement?.removeEventListener('canplay', handleCanPlay);
      videoElement?.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className={b()} role="button" tabIndex={0}>
      <video
        className={b('video', { loading: isLoading, cover: isFilled })}
        disablePictureInPicture
        loop
        muted={isMuted ?? autoplay}
        playsInline
        preload="auto"
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
