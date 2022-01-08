import React from 'react';
import { EllipseWidgetParamsType, WidgetComponent } from '../../types';
import { renderBackgroundStyles } from '../../utils';
import './EllipseWidget.scss';

export const EllipseWidget: WidgetComponent<{ params: EllipseWidgetParamsType }> = (props) => {
  const { fillColor, strokeThickness, strokeColor, widgetOpacity, hasBorder } = props.params;

  const styles = {
    opacity: widgetOpacity / 100,
    borderStyle: 'solid',
    borderWidth: `${hasBorder ? strokeThickness : 0}px`,
    borderColor: renderBackgroundStyles(strokeColor)
  };

  const backgroundStyles = {
    background: renderBackgroundStyles(fillColor)
  };

  return (
    <div className="EllipseWidget" style={styles}>
      <div className="EllipseWidget__background" style={backgroundStyles} />
    </div>
  );
};
