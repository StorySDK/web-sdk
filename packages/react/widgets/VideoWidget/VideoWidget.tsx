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
  autoplay?: boolean;
  isDisplaying?: boolean;
  handleMediaPlaying?: (isPlaying: boolean) => void;
  handleMediaLoading?: (isLoading: boolean) => void;
}> = React.memo((props) => {
  const { videoUrl, videoPreviewUrl, stopAutoplay, widgetOpacity, borderRadius } = props.params;
  const isAutoplay = props.autoplay ?? true;

  // console.log('isAutoplay', props.autoplay);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const styles = {
    opacity: widgetOpacity / 100,
    borderRadius: `${borderRadius}px`
  };

  const [isPlaying, setIsPlaying] = React.useState(isAutoplay);
  const [isVideoLoading, setIsVideoLoading] = React.useState(true);

  useEffect(() => {
    props.handleMediaPlaying?.(isPlaying);
  }, [isPlaying, props]);

  useEffect(() => {
    props.handleMediaLoading?.(isVideoLoading);
  }, [isVideoLoading, props]);

  useEffect(() => {
    setIsPlaying(isAutoplay);
  }, [isAutoplay]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && props.isDisplaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying, props.isDisplaying]);

  return (
    <div className={b()} role="button" tabIndex={0} onClick={!isAutoplay ? togglePlay : undefined}>
      <video
        autoPlay={!stopAutoplay && isAutoplay}
        className={b('video')}
        disablePictureInPicture
        loop
        muted={isAutoplay}
        playsInline={isAutoplay}
        preload="metadata"
        ref={videoRef}
        src={videoPreviewUrl ?? videoUrl}
        style={styles}
        onLoadStart={() => {
          setIsVideoLoading(true);
        }}
        onLoadedData={() => {
          setIsVideoLoading(false);
        }}
        onPause={handlePause}
        onPlay={handlePlay}
      />
      {!isPlaying && !isAutoplay && !isVideoLoading && (
        <button className={b('playBtn')}>
          <IconPlay />
        </button>
      )}
    </div>
  );
});
