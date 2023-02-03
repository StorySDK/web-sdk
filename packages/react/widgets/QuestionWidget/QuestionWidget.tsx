import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cn from 'classnames';
import {
  QuestionWidgetParamsType,
  WidgetComponent,
  WidgetPositionType,
  WidgetPositionLimitsType
} from '@types';
import { block, calculateElementSize } from '@utils';
import './QuestionWidget.scss';

const b = block('QuestionWidget');

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
  onAnswer?(answer: string): any;
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

  const [percents, setPercents] = useState({
    confirm: 0,
    decline: 0
  });

  const handleChange = (option: string) => {
    if (!answer) {
      if (props.onAnswer) {
        props.onAnswer(option).then((res: any) => {
          if (res.data && !res.data.error) {
            setAnswer(option);
            setPercents((prevState) => ({ ...prevState, ...res.data.data }));
          }
        });
      } else {
        setAnswer(option);
      }
    }
  };

  useEffect(() => {
    if (answer && !props.onAnswer) {
      const percentsFromApi = {
        confirm: answer === 'confirm' ? 100 : 0,
        decline: answer === 'decline' ? 100 : 0
      };

      setPercents(percentsFromApi);
    }
  }, [answer, props.onAnswer]);

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
      {!params.isTitleHidden && (
        <div className={b('question')} style={elementSizes.text}>
          {params.question}
        </div>
      )}

      <div className={b('buttons')} style={{ borderRadius: elementSizes.button.borderRadius }}>
        <button
          className={b('item', {
            answered: answer === 'confirm',
            confirm: true,
            answerConfirm: answer && percents.confirm !== 100,
            zero: answer && percents.confirm === 0,
            full: answer && percents.confirm === 100
          })}
          disabled={!!answer}
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
          disabled={!!answer}
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
