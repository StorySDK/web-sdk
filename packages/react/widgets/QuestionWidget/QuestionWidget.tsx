import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import cn from 'classnames';
import {
  QuestionWidgetParamsType,
  WidgetComponent,
  WidgetPositionType,
  WidgetPositionLimitsType
} from '@types';
import { block, calculateElementSize, getTextStyles } from '@utils';
import './QuestionWidget.scss';
import { StoryContext } from '@components';

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
  id: string;
  params: QuestionWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string): any;
}> = React.memo((props) => {
  const { id, params, position, positionLimits, isReadOnly, onAnswer } = props;
  const storyContextVal = useContext(StoryContext);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [answer, setAnswer] = useState<string | null>(answerFromCache?.answer || null);

  const [percents, setPercents] = useState(
    answerFromCache?.percents ?? {
      confirm: 0,
      decline: 0
    }
  );

  const calculate = useCallback(
    (size) => {
      if (position?.width && positionLimits?.minWidth) {
        return calculateElementSize(+position?.width, size, positionLimits?.minWidth);
      }

      return size;
    },
    [position?.width, positionLimits?.minWidth]
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

  const handleChange = useCallback(
    (option: string) => {
      if (!answer) {
        if (onAnswer) {
          onAnswer(option).then((res: any) => {
            if (res.data && !res.data.error) {
              setAnswer(option);
              setPercents((prevState: any) => ({ ...prevState, ...res.data.data }));

              if (storyContextVal.setAnswerCache && id) {
                storyContextVal.setAnswerCache(id, {
                  answer: option,
                  percents: res.data.data
                });
              }
            }
          });
        } else {
          setAnswer(option);
        }
      }
    },
    [answer, id, onAnswer, storyContextVal]
  );

  useEffect(() => {
    if (answer && !onAnswer) {
      const percentsFromApi = {
        confirm: answer === 'confirm' ? 100 : 0,
        decline: answer === 'decline' ? 100 : 0
      };

      setPercents(percentsFromApi);
    }
  }, [answer, onAnswer]);

  const calculateWidth = useCallback((percent: number) => {
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
  }, []);

  const textStyles = getTextStyles(params.fontColor);

  return (
    <div className={b()}>
      {!params.isTitleHidden && (
        <div
          className={cn(
            b('question', { gradient: params.fontColor?.type === 'gradient' }).toString(),
            'StorySdk-widgetTitle'
          )}
          style={{
            ...elementSizes.text,
            fontStyle: params.fontParams?.style,
            fontWeight: params.fontParams?.weight,
            fontFamily: params.fontFamily,
            ...textStyles
          }}
        >
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
          disabled={!!answer || isReadOnly}
          style={{
            width: answer ? `${calculateWidth(percents.confirm)}%` : '50%',
            height: elementSizes.button.height,
            fontSize: elementSizes.button.fontSize
          }}
          type="button"
          onClick={() => !isReadOnly && handleChange('confirm')}
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
          disabled={!!answer || isReadOnly}
          style={{
            width: answer ? `${calculateWidth(percents.decline)}%` : '50%',
            height: elementSizes.button.height,
            fontSize: elementSizes.button.fontSize
          }}
          type="button"
          onClick={() => !isReadOnly && handleChange('decline')}
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
});
