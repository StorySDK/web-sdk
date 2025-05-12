import React, { useEffect, useRef } from 'react';
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
  const [isImageVisible, setIsImageVisible] = React.useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    imageUrl, widgetOpacity, borderRadius,
  } = props.params;

  useEffect(() => {
    setIsImageLoading(true);
    setIsImageVisible(false);
  }, [imageUrl]);

  useEffect(() => {
    const isFullyRendered = !isImageLoading && isImageVisible;
    props.handleMediaLoading?.(!isFullyRendered);
  }, [isImageLoading, isImageVisible, props]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsImageVisible(true);

        if (imageRef.current && observerRef.current) {
          observerRef.current.unobserve(imageRef.current);
        }
      }
    });

    if (imageRef.current && observerRef.current) {
      observerRef.current.observe(imageRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageRef.current, imageUrl]);

  const styles = {
    borderRadius: `${borderRadius}px`,
    opacity: widgetOpacity / 100,
  };

  return (
    <img
      alt=""
      className={b('image')}
      ref={imageRef}
      src={imageUrl}
      style={styles}
      onLoad={() => {
        setIsImageLoading(false);
      }}
    />
  );
});
