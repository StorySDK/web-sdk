import React, { useMemo } from 'react';
import { RectangleWidgetParamsType } from '@storysdk/types';
import { block, renderBackgroundStyles } from '@utils';
import './RectangleWidget.scss';

const b = block('RectangleWidget');

export const RectangleWidget: React.FunctionComponent<{ params: RectangleWidgetParamsType }> = React.memo(
  (props) => {
    const {
      fillColor, fillBorderRadius, strokeThickness, strokeColor, widgetOpacity, hasBorder,
    } = props.params;

    const styles = useMemo(
      () => ({
        borderStyle: 'solid',
        borderWidth: `${hasBorder ? strokeThickness : 0}px`,
        borderColor: renderBackgroundStyles(strokeColor),
        borderRadius: `${+fillBorderRadius}px`,
        opacity: widgetOpacity / 100,
      }),
      [fillBorderRadius, hasBorder, strokeColor, strokeThickness, widgetOpacity],
    );

    const backgroundStyles = useMemo(
      () => ({
        background: renderBackgroundStyles(fillColor),
        borderRadius:
          +fillBorderRadius - +strokeThickness > 0 ? `${+fillBorderRadius - +strokeThickness}px` : 0,
      }),
      [fillColor, fillBorderRadius, strokeThickness],
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
              webkit-playsinline="true"
            />
          )}
        </div>
      </div>
    );
  },
);
