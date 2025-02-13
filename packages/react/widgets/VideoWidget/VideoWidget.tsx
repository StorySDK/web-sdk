/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useRef } from 'react';
import { VideoWidgetParamsType, WidgetComponent } from '@types';
import { block } from '@utils';
import { IconPlay } from '@components/icons';
import './VideoWidget.scss';
import Hls from 'hls.js';

const b = block('VideoWidget');

export const VideoWidget: WidgetComponent<{
  params: VideoWidgetParamsType;
  isVideoPlaying?: boolean;
  isMuted?: boolean;
  isAutoplay?: boolean;
  isDisplaying?: boolean;
  handleMediaPlaying?: (isPlaying: boolean) => void;
  handleMediaLoading?: (isLoading: boolean) => void;
}> = React.memo((props) => {
  const { videoUrl, videoPreviewUrl, widgetOpacity, borderRadius } = props.params;

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const styles = {
    opacity: widgetOpacity / 100,
    borderRadius: `${borderRadius}px`
  };

  const [isReadyToPlay, setIsReadyToPlay] = React.useState(false);

  useEffect(() => {
    props.handleMediaLoading?.(!isReadyToPlay);
  }, [isReadyToPlay]);

  const togglePlay = () => {
    props.handleMediaPlaying?.(!props.isVideoPlaying);
  };

  const hls = useRef<Hls | null>(null);
  const streamSource = useMemo(() => `${videoUrl}/ik-master.m3u8?tr=sr-720_1080`, [videoUrl]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return () => {};
    }

    const handleError = (e: Event) => {
      console.error('StorySDK - Error attempting to play media:', e);
    };

    const handleLoadStart = () => {
      setIsReadyToPlay(false);
    };

    const handleCanPlay = () => {
      setIsReadyToPlay(true);
    };

    if (Hls.isSupported()) {
      hls.current = new Hls();
      hls.current.loadSource(streamSource);
      hls.current.attachMedia(videoElement);

      handleLoadStart();

      hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
        handleCanPlay();
      });

      hls.current.on(Hls.Events.ERROR, () => {
        videoElement.src = videoUrl;
        if (videoElement?.readyState === HTMLMediaElement.HAVE_NOTHING) {
          videoElement.load();
        }
        videoElement?.addEventListener('loadstart', handleLoadStart);
        videoElement?.addEventListener('canplay', handleCanPlay);
        videoElement?.addEventListener('error', handleError);
      });

      return () => {
        hls.current?.destroy();
      };
    }

    const isCanPlayStream = videoElement?.canPlayType('application/vnd.apple.mpegurl');

    videoElement.src = isCanPlayStream ? streamSource : videoUrl;

    if (videoElement?.readyState === HTMLMediaElement.HAVE_NOTHING && !isCanPlayStream) {
      videoElement.load();
    }

    videoElement?.removeEventListener('loadstart', handleLoadStart);

    videoElement.addEventListener('loadeddata', () => {
      handleCanPlay();
    });

    return () => {};
  }, [streamSource, videoUrl]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && isReadyToPlay) {
      setIsReadyToPlay(true);

      if (props.isVideoPlaying && props.isDisplaying) {
        videoElement?.play().catch((error) => {
          console.warn('StorySDK - Error attempting to play media:', error);
        });
      } else {
        videoElement?.pause();
      }
    }
  }, [props.isVideoPlaying, props.isDisplaying, isReadyToPlay]);

  return (
    <div
      className={b()}
      role="button"
      tabIndex={0}
      onClick={!props.isAutoplay ? togglePlay : undefined}
    >
      <video
        className={b('video')}
        disablePictureInPicture
        loop
        muted={props.isMuted ?? props.isAutoplay}
        playsInline
        preload="auto"
        ref={videoRef}
        src={videoPreviewUrl ?? videoUrl}
        style={styles}
        webkit-playsinline="true"
      />
      {!props.isVideoPlaying && !props.isAutoplay && isReadyToPlay && (
        <button className={b('playBtn')}>
          <IconPlay />
        </button>
      )}
    </div>
  );
});
