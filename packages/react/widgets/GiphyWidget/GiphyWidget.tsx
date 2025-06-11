import React from 'react';
import { GiphyWidgetParamsType } from '@storysdk/types';
import './GiphyWidget.scss';
import { block } from '@utils';

const b = block('GiphyWidget');

export const GiphyWidget: React.FunctionComponent<{ params: GiphyWidgetParamsType }> = React.memo(
  (props) => {
    const { params } = props;

    return (
      <div
        className={b()}
        style={{ opacity: params.widgetOpacity / 100, borderRadius: params.borderRadius }}
      >
        <img alt="" className={b('img')} src={params.gif} />
      </div>
    );
  },
);
