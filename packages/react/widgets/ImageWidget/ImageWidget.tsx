import React, { useEffect } from 'react';
import { ImageWidgetParamsType, WidgetComponent } from '@types';
import { block } from '@utils';
import './ImageWidget.scss';

const b = block('ImageWidget');

export const ImageWidget: WidgetComponent<{
  params: ImageWidgetParamsType;
  handleMediaLoading?: (isLoading: boolean) => void;
  width?: number;
  height?: number;
}> = React.memo((props) => {
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const {
    imageUrl, widgetOpacity, borderRadius,
  } = props.params;

  useEffect(() => {
    setIsImageLoading(true);
  }, [imageUrl]);

  useEffect(() => {
    props.handleMediaLoading?.(isImageLoading);
  }, [isImageLoading, props]);

  const styles = {
    borderRadius: `${borderRadius}px`,
    opacity: widgetOpacity / 100,
  };

  return (
    <img
      alt=""
      className={b('image')}
      src={imageUrl}
      style={styles}
      onLoad={() => {
        setIsImageLoading(false);
      }}
    />
  );
});
