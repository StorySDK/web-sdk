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

    const handleReadyStateChange = () => {
      if (
        props.isVideoPlaying &&
        props.isDisplaying &&
        videoElement?.readyState &&
        videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        videoElement.play().catch((error) => {
          console.warn('StorySDK: Error attempting to play media:', error);
        });
      } else {
        videoElement?.pause();
      }
    };

    if (props.isVideoPlaying && props.isDisplaying) {
      videoElement?.play().catch((error) => {
        console.warn('StorySDK: Error attempting to play media:', error);
      });
    } else {
      videoElement?.pause();
    }

    videoElement?.addEventListener('loadeddata', handleReadyStateChange);

    return () => {
      videoElement?.removeEventListener('loadeddata', handleReadyStateChange);
      videoElement?.pause();
    };
  }, [props.isVideoPlaying, props.isDisplaying]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleError = (e: Event) => {
      console.error('Video error:', e);
    };

    const handleLoadStart = () => {
      setIsVideoLoading(true);
    };

    const handleCanPlay = () => {
      setIsVideoLoading(false);
    };

    if (videoElement?.readyState === HTMLMediaElement.HAVE_NOTHING) {
      videoElement.load();
    }

    videoElement?.addEventListener('error', handleError);
    videoElement?.addEventListener('loadstart', handleLoadStart);
    videoElement?.addEventListener('canplay', handleCanPlay);

    return () => {
      videoElement?.removeEventListener('loadstart', handleLoadStart);
      videoElement?.removeEventListener('canplay', handleCanPlay);
      videoElement?.removeEventListener('error', handleError);
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
        preload="auto"
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
