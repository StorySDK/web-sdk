import React from 'react';
import { VideoWidgetParamsType, WidgetComponent } from '@types';
import { block } from '@utils';
import './VideoWidget.scss';

const b = block('VideoWidget');

export const VideoWidget: WidgetComponent<{ params: VideoWidgetParamsType }> = React.memo(
  (props) => {
    const { videoUrl, stopAutoplay, widgetOpacity } = props.params;

    const styles = {
      opacity: widgetOpacity / 100
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
        src={videoUrl}
        style={styles}
      />
    );
  }
);
