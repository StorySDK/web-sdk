/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect } from 'react';
import { VideoWidgetParamsType, WidgetComponent } from '@types';
import { block } from '@utils';
import { IconPlay } from '@components/icons';
import './VideoWidget.scss';

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

  const [isVideoLoading, setIsVideoLoading] = React.useState(true);

  useEffect(() => {
    props.handleMediaLoading?.(isVideoLoading);
  }, [isVideoLoading]);

  const togglePlay = () => {
    props.handleMediaPlaying?.(!props.isVideoPlaying);
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (props.isVideoPlaying && props.isDisplaying) {
      videoElement?.play().catch((error) => {
        console.error('StorySDK: Error attempting to play media:', error);
      });
    } else {
      videoElement?.pause();
    }

    return () => {
      videoElement?.pause();
    };
  }, [props.isVideoPlaying, props.isDisplaying]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadStart = () => {
      setIsVideoLoading(true);
    };

    const handleCanPlay = () => {
      setIsVideoLoading(false);
    };

    const handlePause = () => {
      props.handleMediaPlaying?.(false);
    };

    const handlePlay = () => {
      props.handleMediaPlaying?.(true);
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
        preload="metadata"
        ref={videoRef}
        src={videoPreviewUrl ?? videoUrl}
        style={styles}
        webkit-playsinline="true"
      />
      {!props.isVideoPlaying && !props.isAutoplay && !isVideoLoading && (
        <button className={b('playBtn')}>
          <IconPlay />
        </button>
      )}
    </div>
  );
});
