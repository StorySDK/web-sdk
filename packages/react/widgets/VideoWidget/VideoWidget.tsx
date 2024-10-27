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
  const { videoUrl, videoPreviewUrl, stopAutoplay, widgetOpacity, borderRadius } = props.params;

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const styles = {
    opacity: widgetOpacity / 100,
    borderRadius: `${borderRadius}px`
  };

  const [isVideoLoading, setIsVideoLoading] = React.useState(true);

  useEffect(() => {
    props.handleMediaLoading?.(isVideoLoading);
  }, [isVideoLoading, props]);

  const togglePlay = () => {
    props.handleMediaPlaying?.(!props.isVideoPlaying);
  };

  const handlePlay = () => {
    props.handleMediaPlaying?.(true);
  };

  const handlePause = () => {
    props.handleMediaPlaying?.(false);
  };

  useEffect(() => {
    if (props.isVideoPlaying && props.isDisplaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [props.isVideoPlaying, props.isDisplaying]);

  return (
    <div
      className={b()}
      role="button"
      tabIndex={0}
      onClick={!props.isAutoplay ? togglePlay : undefined}
    >
      <video
        autoPlay={!stopAutoplay && props.isAutoplay}
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
        onLoadStart={() => {
          setIsVideoLoading(true);
        }}
        onLoadedData={() => {
          setIsVideoLoading(false);
        }}
        onPause={handlePause}
        onPlay={handlePlay}
      />
      {!props.isVideoPlaying && !props.isAutoplay && !isVideoLoading && (
        <button className={b('playBtn')}>
          <IconPlay />
        </button>
      )}
    </div>
  );
});
