import React from 'react';
import { RectangleWidgetParamsType, WidgetComponent } from '../../types';
import { renderBackgroundStyles } from '../../utils';
import './RectangleWidget.scss';

export const RectangleWidget: WidgetComponent<{ params: RectangleWidgetParamsType }> = (props: any) => {
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
    <div className="RectangleWidget" style={styles}>
      <div className="RectangleWidget__background" style={backgroundStyles} />
    </div>
  );
};
