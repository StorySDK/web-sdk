/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useMemo, useRef } from 'react';
import block from 'bem-cn';
import { IconLoader } from '@components/icons';
import Hls from 'hls.js';
import './StoryVideoBackground.scss';

const b = block('StorySdkVideoBackground');

type PropTypes = {
  src: string;
  isLoading?: boolean;
  isMuted?: boolean;
  isFilled?: boolean;
  isPlaying?: boolean;
  isDisplaying?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
};

export const StoryVideoBackground = ({
  src,
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

  const [isReadyToPlay, setIsReadyToPlay] = React.useState(false);

  const hls = useRef<Hls | null>(null);
  const streamSource = useMemo(() => `${src}/ik-master.m3u8?tr=sr-720_1080`, [src]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return () => { };
    }

    const isNativeHlsSupport = videoElement?.canPlayType('application/vnd.apple.mpegurl');

    const handleError = (e: Event) => {
      console.error('StorySDK - Error attempting to play media:', e);
    };

    const handleLoadStart = () => {
      setIsReadyToPlay(false);
      onLoadStart?.();
    };

    const handleCanPlay = () => {
      setIsReadyToPlay(true);
    };

    if (!isNativeHlsSupport && Hls.isSupported()) {
      hls.current = new Hls();

      hls.current.loadSource(streamSource);
      hls.current.attachMedia(videoElement);
      handleLoadStart();

      hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
        handleCanPlay();
      });

      hls.current.on(Hls.Events.ERROR, (event: any, data: any) => {
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          videoElement.currentTime += 0.5;
        } else {
          hls.current?.destroy();
          handleLoadStart();

          videoElement.src = src;
          if (videoElement?.readyState === HTMLMediaElement.HAVE_NOTHING) {
            videoElement.load();
          }
          videoElement?.addEventListener('canplay', handleCanPlay);
          videoElement?.addEventListener('error', handleError);
        }
      });

      return () => {
        hls.current?.destroy();
        videoElement?.removeEventListener('canplay', handleCanPlay);
        videoElement?.removeEventListener('error', handleError);
      };
    }

    videoElement.src = isNativeHlsSupport ? streamSource : src;

    if (videoElement?.readyState === HTMLMediaElement.HAVE_NOTHING) {
      handleLoadStart();
      videoElement.load();
    }

    videoElement.addEventListener('canplay', () => {
      handleCanPlay();
    });

    return () => {
      videoElement?.removeEventListener('canplay', () => {
        handleCanPlay();
      });
    };
  }, [streamSource, src]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && isReadyToPlay) {
      onLoadEnd?.();

      if (isPlaying && isDisplaying) {
        videoElement?.play().catch((error) => {
          console.warn('StorySDK - Error attempting to play media:', error);
        });
      } else {
        videoElement?.pause();
      }
    }
  }, [isPlaying, isDisplaying, isReadyToPlay]);

  return (
    <div className={b()} role="button" tabIndex={0}>
      <video
        className={b('video', { loading: isLoading, cover: isFilled })}
        disablePictureInPicture
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        ref={videoRef}
        // eslint-disable-next-line react/no-unknown-property
        webkit-playsinline="true"
      />
      <div className={b('loader', { show: isLoading })}>
        <IconLoader className={b('loaderIcon').toString()} />
      </div>
    </div>
  );
};
