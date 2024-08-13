import React from 'react';
import { VideoWidgetParamsType, WidgetComponent } from '@types';
import { block } from '@utils';
import './VideoWidget.scss';

const b = block('VideoWidget');

export const VideoWidget: WidgetComponent<{ params: VideoWidgetParamsType }> = React.memo(
  (props) => {
    const { videoUrl, videoPreviewUrl, stopAutoplay, widgetOpacity, borderRadius } = props.params;

    const styles = {
      opacity: widgetOpacity / 100,
      borderRadius: `${borderRadius}px`
    };

    return (
      <video
        autoPlay={!stopAutoplay}
        className={b('video')}
        disablePictureInPicture
        loop
        muted
        playsInline
        preload="metadata"
        src={videoPreviewUrl ?? videoUrl}
        style={styles}
      />
    );
  }
);
