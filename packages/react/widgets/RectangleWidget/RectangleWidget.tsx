import React from 'react';
import { RectangleWidgetParamsType, WidgetComponent } from '@types';
import { block, renderBackgroundStyles } from '@utils';
import './RectangleWidget.scss';

const b = block('RectangleWidget');

export const RectangleWidget: WidgetComponent<{ params: RectangleWidgetParamsType }> = React.memo(
  (props) => {
    const { fillColor, fillBorderRadius, strokeThickness, strokeColor, widgetOpacity, hasBorder } =
      props.params;

    const styles = {
      borderStyle: 'solid',
      borderWidth: `${hasBorder ? strokeThickness : 0}px`,
      borderColor: renderBackgroundStyles(strokeColor),
      borderRadius: `${fillBorderRadius}px`,
      opacity: widgetOpacity / 100
    };

    const backgroundStyles = {
      background: renderBackgroundStyles(fillColor),
      borderRadius: `${fillBorderRadius - strokeThickness}px`
    };

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
