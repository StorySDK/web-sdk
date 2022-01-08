import React from 'react';
import block from 'bem-cn';
import { GiphyWidgetParamsType, WidgetComponent } from '../../types';
import './GiphyWidget.scss';

const b = block('GiphyWidget');

export const GiphyWidget: WidgetComponent<{ params: GiphyWidgetParamsType }> = (props) => {
  const { params } = props;

  return (
    <div
      className={b()}
      style={{ opacity: params.widgetOpacity / 100, borderRadius: params.borderRadius }}
    >
      <img alt="" className={b('img')} src={params.gif} />
    </div>
  );
};
