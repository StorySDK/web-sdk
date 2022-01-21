import React, { useState, useEffect, useCallback, useMemo } from 'react';
import block from 'bem-cn';
import cn from 'classnames';
import {
  QuestionWidgetParamsType,
  WidgetComponent,
  WidgetPositionType,
  WidgetPositionLimitsType
} from '../../types';
import { calculateElementSize } from '../../utils';
import './QuestionWidget.scss';

const b = block('QuestionSdkWidget');

const INIT_ELEMENT_STYLES = {
  text: {
    fontSize: 14,
    marginBottom: 10
  },
  button: {
    height: 50,
    fontSize: 24,
    borderRadius: 10
  }
};

export const QuestionWidget: WidgetComponent<{
  params: QuestionWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  onAnswer?(answer: string): void;
}> = (props) => {
  const { params, position, positionLimits } = props;
  const [answer, setAnswer] = useState<string | null>(null);

  const calculate = useCallback(
    (size) => {
      if (position && positionLimits) {
        return calculateElementSize(position, positionLimits, size);
      }

      return size;
    },
    [position, positionLimits]
  );

  const elementSizes = useMemo(
    () => ({
      text: {
        fontSize: calculate(INIT_ELEMENT_STYLES.text.fontSize),
        marginBottom: calculate(INIT_ELEMENT_STYLES.text.marginBottom)
      },
      button: {
        height: calculate(INIT_ELEMENT_STYLES.button.height),
        fontSize: calculate(INIT_ELEMENT_STYLES.button.fontSize),
        borderRadius: calculate(INIT_ELEMENT_STYLES.button.borderRadius)
      }
    }),
    [calculate]
  );

  const handleChange = (option: string) => {
    if (props.onAnswer) {
      props.onAnswer(option);
    }

    setAnswer(option);
  };

  const [percents, setPercents] = useState({
    confirm: 0,
    decline: 0
  });

  useEffect(() => {
    if (answer) {
      const percentsFromApi = {
        confirm: answer === 'confirm' ? 100 : 0,
        decline: answer === 'decline' ? 100 : 0
      };

      setPercents(percentsFromApi);
    }
  }, [answer]);

  const calculateWidth = (percent: number) => {
    if (percent === 0) {
      return 0;
    }
    if (percent === 100) {
      return 100;
    }
    if (percent < 25) {
      return 25;
    }
    if (percent > 75) {
      return 75;
    }

    return percent;
  };

  return (
    <div className={b()}>
      <div className={b('question')} style={elementSizes.text}>
        {params.question}
      </div>
      <div className={b('buttons')} style={{ borderRadius: elementSizes.button.borderRadius }}>
        <button
          className={b('item', {
            answered: answer === 'confirm',
            confirm: true,
            answerConfirm: answer && percents.confirm !== 100,
            zero: answer && percents.confirm === 0,
            full: answer && percents.confirm === 100
          })}
          style={{
            width: answer ? `${calculateWidth(percents.confirm)}%` : '50%',
            height: elementSizes.button.height,
            fontSize: elementSizes.button.fontSize
          }}
          type="button"
          onClick={() => handleChange('confirm')}
        >
          <div className={b('itemTextContainer')}>
            <span
              className={cn(
                b('itemTextConfirm').toString(),
                b('itemText', { answered: answer !== null }).toString()
              )}
            >
              {params.confirm}
            </span>
            {answer && <span className={b('itemTextPercent')}>{percents.confirm}%</span>}
          </div>
        </button>
        <button
          className={b('item', {
            answered: answer === 'decline',
            decline: true,
            answerDecline: answer && percents.decline !== 100,
            zero: answer && percents.decline === 0,
            full: answer && percents.decline === 100
          })}
          style={{
            width: answer ? `${calculateWidth(percents.decline)}%` : '50%',
            height: elementSizes.button.height,
            fontSize: elementSizes.button.fontSize
          }}
          type="button"
          onClick={() => handleChange('decline')}
        >
          <div className={b('itemTextContainer')}>
            <span
              className={cn(
                b('itemTextDecline').toString(),
                b('itemText', { answered: answer !== null }).toString()
              )}
            >
              {params.decline}
            </span>
            {answer && <span className={b('itemTextPercent')}>{percents.decline}%</span>}
          </div>
        </button>
      </div>
    </div>
  );
};
