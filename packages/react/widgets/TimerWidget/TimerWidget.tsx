import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import {
  TimerWidgetParamsType,
  WidgetPositionType,
  WidgetPositionLimitsType,
} from '@storysdk/types';
import cn from 'classnames';
import { block, calculateElementSize } from '@utils';
import './TimerWidget.scss';
import { ONE_MINUTE_IN_SECONDS, ONE_SECOND_IN_MILLISECONDS } from '@constants';

const b = block('TimerWidget');

const calculateTime = (time: number) => {
  const days = Math.floor(time / (ONE_SECOND_IN_MILLISECONDS * ONE_MINUTE_IN_SECONDS * 60 * 24));
  const hours = Math.floor((time / (ONE_SECOND_IN_MILLISECONDS * ONE_MINUTE_IN_SECONDS * 60)) % 24);
  const minutes = Math.floor((time / ONE_SECOND_IN_MILLISECONDS / ONE_MINUTE_IN_SECONDS) % 60);

  return {
    days: days < 10 ? `0${days > 0 ? days : 0}` : `${days}`,
    hours: hours < 10 ? `0${hours > 0 ? hours : 0}` : `${hours}`,
    minutes: minutes < 10 ? `0${minutes > 0 ? minutes : 0}` : `${minutes}`,
  };
};

const INIT_ELEMENT_STYLES = {
  widget: {
    borderRadius: 10,
    padding: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  digit: {
    width: 22,
    height: 36,
    fontSize: 16,
    borderRadius: 4,
  },
  caption: {
    marginTop: 2,
    fontSize: 6,
  },
};

export const TimerWidget: React.FunctionComponent<{
  params: TimerWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
}> = React.memo((props) => {
  const { params, position, positionLimits } = props;

  const [time, setTime] = useState(calculateTime(params.time + 60000 - new Date().getTime()));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTime(calculateTime(params.time - new Date().getTime()));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [params.time]);

  const calculate = useCallback(
    (size) => {
      if (position?.width && positionLimits?.minWidth) {
        return calculateElementSize(+position?.width, size, positionLimits?.minWidth);
      }

      return size;
    },
    [position?.width, positionLimits?.minWidth],
  );

  const elementSizes = useMemo(
    () => ({
      text: {
        fontSize: calculate(INIT_ELEMENT_STYLES.text.fontSize),
        marginBottom: calculate(INIT_ELEMENT_STYLES.text.marginBottom),
      },
      widget: {
        borderRadius: calculate(INIT_ELEMENT_STYLES.widget.borderRadius),
        padding: calculate(INIT_ELEMENT_STYLES.widget.padding),
      },
      digit: {
        width: calculate(INIT_ELEMENT_STYLES.digit.width),
        height: calculate(INIT_ELEMENT_STYLES.digit.height),
        fontSize: calculate(INIT_ELEMENT_STYLES.digit.fontSize),
        borderRadius: calculate(INIT_ELEMENT_STYLES.digit.borderRadius),
      },
      caption: {
        marginTop: calculate(INIT_ELEMENT_STYLES.caption.marginTop),
        fontSize: calculate(INIT_ELEMENT_STYLES.caption.fontSize),
      },
    }),
    [calculate],
  );

  return (
    <div className={b({ color: params.color })} style={elementSizes.widget}>
      <div className={cn(b('text'), 'StorySdk-widgetTitle')} style={elementSizes.text}>
        {params.text}
      </div>
      <ul className={b('dial')}>
        <li className={b('col')}>
          <div className={b('digitRow')}>
            <div className={b('digit')} style={elementSizes.digit}>
              {time.days[0]}
            </div>
            <div className={b('digit')} style={elementSizes.digit}>
              {time.days[1]}
            </div>
          </div>
          <div className={b('caption')} style={elementSizes.caption}>
            Day
          </div>
        </li>
        <span className={b('divider')}>:</span>
        <li className={b('col')}>
          <div className={b('digitRow')}>
            <div className={b('digit')} style={elementSizes.digit}>
              {time.hours[0]}
            </div>
            <div className={b('digit')} style={elementSizes.digit}>
              {time.hours[1]}
            </div>
          </div>
          <div className={b('caption')} style={elementSizes.caption}>
            Hours
          </div>
        </li>
        <span className={b('divider')}>:</span>
        <li className={b('col')}>
          <div className={b('digitRow')}>
            <div className={b('digit')} style={elementSizes.digit}>
              {time.minutes[0]}
            </div>
            <div className={b('digit')} style={elementSizes.digit}>
              {time.minutes[1]}
            </div>
          </div>
          <div className={b('caption')} style={elementSizes.caption}>
            Minutes
          </div>
        </li>
      </ul>
    </div>
  );
});
