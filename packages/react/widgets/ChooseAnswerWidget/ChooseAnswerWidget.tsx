import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ChooseAnswerWidgetParamsType,
  WidgetComponent,
  WidgetPositionType,
  WidgetPositionLimitsType
} from '@types';
import { IconConfirm, IconDecline } from '@components/icons';
import { block, calculateElementSize } from '@utils';

import './ChooseAnswerWidget.scss';

const b = block('ChooseAnswerWidget');

const INIT_ELEMENT_STYLES = {
  widget: {
    borderRadius: 10
  },
  header: {
    fontSize: 12,
    paddingTop: 13,
    paddingBottom: 13
  },
  answers: {
    padding: 12
  },
  answer: {
    padding: 8,
    marginBottom: 6
  },
  answerId: {
    width: 18,
    height: 18,
    marginRight: 8,
    fontSize: 10
  },
  answerTitle: {
    fontSize: 10
  }
};

export const ChooseAnswerWidget: WidgetComponent<{
  params: ChooseAnswerWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  jsConfetti?: any;
  isReadOnly?: boolean;
  onAnswer?(answerId: string): void;
}> = React.memo((props) => {
  const { params, position, positionLimits, isReadOnly, jsConfetti, onAnswer } = props;

  const [userAnswer, setUserAnswer] = useState<null | string>(null);

  const calculate = useCallback(
    (size) => {
      if (position?.width && positionLimits?.minWidth) {
        return calculateElementSize(+position.width, size, positionLimits.minWidth);
      }

      return size;
    },
    [position?.width, positionLimits?.minWidth]
  );

  const elementSizes = useMemo(
    () => ({
      widget: {
        borderRadius: calculate(INIT_ELEMENT_STYLES.widget.borderRadius)
      },
      header: {
        fontSize: calculate(INIT_ELEMENT_STYLES.header.fontSize),
        paddingTop: calculate(INIT_ELEMENT_STYLES.header.paddingTop),
        paddingBottom: calculate(INIT_ELEMENT_STYLES.header.paddingBottom)
      },
      answers: {
        padding: calculate(INIT_ELEMENT_STYLES.answers.padding)
      },
      answer: {
        padding: calculate(INIT_ELEMENT_STYLES.answer.padding),
        marginBottom: calculate(INIT_ELEMENT_STYLES.answer.marginBottom)
      },
      answerId: {
        width: calculate(INIT_ELEMENT_STYLES.answerId.width),
        height: calculate(INIT_ELEMENT_STYLES.answerId.height),
        marginRight: calculate(INIT_ELEMENT_STYLES.answerId.marginRight),
        fontSize: calculate(INIT_ELEMENT_STYLES.answerId.fontSize)
      },
      answerTitle: {
        fontSize: calculate(INIT_ELEMENT_STYLES.answerTitle.fontSize)
      }
    }),
    [calculate]
  );

  const handleMarkAnswer = useCallback(
    (answerId: string) => {
      if (onAnswer) {
        onAnswer(answerId);
      }

      setUserAnswer(answerId);
    },
    [onAnswer]
  );

  const renderAnswer = useCallback(
    (answer) => {
      if (userAnswer) {
        return (
          <div
            className={b('answer', {
              correct: answer.id === params.correct && params.markCorrectAnswer,
              incorrect: answer.id !== params.correct && params.markCorrectAnswer,
              choosen: userAnswer === answer.id && params.markCorrectAnswer,
              filled: userAnswer === answer.id && !params.markCorrectAnswer
            })}
            key={`answer-${answer.id}`}
            style={elementSizes.answer}
          >
            <div
              className={b('answerCircle', {
                correct: answer.id === params.correct && params.markCorrectAnswer,
                incorrect: answer.id !== params.correct && params.markCorrectAnswer,
                choosen: userAnswer === answer.id && params.markCorrectAnswer,
                filled: userAnswer === answer.id && !params.markCorrectAnswer
              })}
              style={elementSizes.answerId}
            >
              {params.markCorrectAnswer ? (
                <>
                  {answer.id === params.correct ? (
                    <IconConfirm
                      className={b('answerIcon', {
                        correct: answer.id === params.correct,
                        incorrect: answer.id !== params.correct,
                        choosen: userAnswer === answer.id
                      })}
                    />
                  ) : (
                    <IconDecline
                      className={b('answerIcon', {
                        correct: answer.id === params.correct,
                        incorrect: answer.id !== params.correct,
                        choosen: userAnswer === answer.id
                      })}
                    />
                  )}
                </>
              ) : (
                <>{`${answer.id}`}</>
              )}
            </div>

            <div
              className={b('answerTitle', {
                choosen: userAnswer === answer.id,
                correct: answer.id === params.correct && params.markCorrectAnswer,
                incorrect: answer.id !== params.correct && params.markCorrectAnswer
              })}
              style={elementSizes.answerTitle}
            >
              {answer.title}
            </div>
          </div>
        );
      }
      return (
        <div
          className={b('answer', { clickable: !userAnswer && !isReadOnly })}
          key={answer.id}
          role="button"
          style={elementSizes.answer}
          tabIndex={0}
          onClick={!userAnswer && !isReadOnly ? () => handleMarkAnswer(answer.id) : undefined}
          onKeyDown={!userAnswer && !isReadOnly ? () => handleMarkAnswer(answer.id) : undefined}
        >
          <div className={b('answerId')} style={elementSizes.answerId}>
            {`${answer.id}`}
          </div>
          <div className={b('answerTitle')} style={elementSizes.answerTitle}>
            {answer.title}
          </div>
        </div>
      );
    },
    [
      userAnswer,
      isReadOnly,
      params.markCorrectAnswer,
      params.correct,
      elementSizes.answer,
      elementSizes.answerId,
      elementSizes.answerTitle,
      handleMarkAnswer
    ]
  );

  useEffect(() => {
    if (userAnswer && userAnswer === params.correct && params.markCorrectAnswer) {
      jsConfetti.current.addConfetti();
    }
  }, [userAnswer, params.correct, jsConfetti, params.markCorrectAnswer]);

  return (
    <div
      className={b({
        color: params.color,
        shake: userAnswer && params.markCorrectAnswer && userAnswer !== params.correct,
        celebrate: userAnswer && params.markCorrectAnswer && userAnswer === params.correct
      })}
      style={elementSizes.widget}
    >
      {!params.isTitleHidden && (
        <div className={b('header')} style={elementSizes.header}>
          {params.text}
        </div>
      )}

      <div className={b('answers')} style={elementSizes.answers}>
        {params.answers.map((answer) => renderAnswer(answer))}
      </div>
    </div>
  );
});
