import React from 'react';
import { ImageWidgetParamsType, WidgetComponent } from '@types';
import { block } from '@utils';
import './ImageWidget.scss';

const b = block('ImageWidget');

export const ImageWidget: WidgetComponent<{ params: ImageWidgetParamsType }> = React.memo(
  (props) => {
    const { imageUrl, widgetOpacity, borderRadius } = props.params;

    const styles = {
      borderRadius: `${borderRadius}px`,
      opacity: widgetOpacity / 100
    };

    return <img alt="" className={b('image')} src={imageUrl} style={styles} />;
  }
);
