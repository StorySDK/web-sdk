import React from 'react';
import { EllipseWidgetParamsType } from '@storysdk/types';
import { block, renderBackgroundStyles } from '@utils';
import './EllipseWidget.scss';

const b = block('EllipseWidget');

export const EllipseWidget: React.FunctionComponent<{ params: EllipseWidgetParamsType }> = React.memo(
  (props) => {
    const {
      fillColor, strokeThickness, strokeColor, widgetOpacity, hasBorder,
    } = props.params;

    const styles = {
      opacity: widgetOpacity / 100,
      borderStyle: 'solid',
      borderWidth: `${hasBorder ? strokeThickness : 0}px`,
      borderColor: renderBackgroundStyles(strokeColor),
    };

    const backgroundStyles = {
      background: renderBackgroundStyles(fillColor),
    };

    return (
      <div className={b()} style={styles}>
        <div className={b('background')} style={backgroundStyles} />
      </div>
    );
  },
);
