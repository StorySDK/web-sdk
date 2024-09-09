import React, { useMemo } from 'react';
import { RectangleWidgetParamsType, WidgetComponent } from '@types';
import { block, renderBackgroundStyles } from '@utils';
import './RectangleWidget.scss';

const b = block('RectangleWidget');

export const RectangleWidget: WidgetComponent<{ params: RectangleWidgetParamsType }> = React.memo(
  (props) => {
    const { fillColor, fillBorderRadius, strokeThickness, strokeColor, widgetOpacity, hasBorder } =
      props.params;

    const styles = useMemo(
      () => ({
        borderStyle: 'solid',
        borderWidth: `${hasBorder ? strokeThickness : 0}px`,
        borderColor: renderBackgroundStyles(strokeColor),
        borderRadius: `${+fillBorderRadius}px`,
        opacity: widgetOpacity / 100
      }),
      [fillBorderRadius, hasBorder, strokeColor, strokeThickness, widgetOpacity]
    );

    const backgroundStyles = useMemo(
      () => ({
        background: renderBackgroundStyles(fillColor),
        borderRadius: `${+fillBorderRadius - +strokeThickness}px`
      }),
      [fillColor, fillBorderRadius, strokeThickness]
    );

    return (
      <div className={b()} style={styles}>
        <div className={b('background')} style={backgroundStyles}>
          {fillColor.type === 'video' && (
            <video
              autoPlay={!fillColor.stopAutoplay}
              className={b('video')}
              disablePictureInPicture
              loop
              muted
              playsInline
              preload="metadata"
              src={fillColor.value}
            />
          )}
        </div>
      </div>
    );
  }
);
