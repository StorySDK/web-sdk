import { Emoji } from 'emoji-mart';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  block,
  calculateElementSize,
  eventSubscribe,
  eventUnsubscribe,
  getTextStyles
} from '@utils';
import {
  QuizMultipleAnswerWidgetParamsType,
  WidgetComponent,
  WidgetPositionLimitsType,
  WidgetPositionType
} from '@types';

import './QuizMultipleAnswerWidget.scss';

const b = block('QuizMultipleAnswerWidget');

const INIT_ELEMENT_STYLES = {
  title: {
    fontSize: 14,
    marginBottom: 16
  },
  answers: {
    gap: 5
  },
  answer: {
    padding: 5,
    gap: 5,
    borderRadius: 20
  },
  emoji: {
    width: 11
  },
  answerTitle: {
    fontSize: 8
  },
  sendBtn: {
    fontSize: 8,
    borderRadius: 20,
    padding: 5,
    marginTop: 5,
    lineHeight: 11
  }
};

export const QuizMultipleAnswerWidget: WidgetComponent<{
  params: QuizMultipleAnswerWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string[]): any;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
  const { title, answers, isTitleHidden } = props.params;
  const { params, position, positionLimits, isReadOnly, onAnswer } = props;

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSent, setIsSent] = useState<boolean>(false);

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
      title: {
        fontSize: calculate(INIT_ELEMENT_STYLES.title.fontSize),
        marginBottom: calculate(INIT_ELEMENT_STYLES.title.marginBottom)
      },
      answers: {
        gap: calculate(INIT_ELEMENT_STYLES.answers.gap)
      },
      answer: {
        gap: calculate(INIT_ELEMENT_STYLES.answer.gap),
        borderRadius: calculate(INIT_ELEMENT_STYLES.answer.borderRadius),
        padding: calculate(INIT_ELEMENT_STYLES.answer.padding)
      },
      emoji: {
        width: calculate(INIT_ELEMENT_STYLES.emoji.width)
      },
      answerTitle: {
        fontSize: calculate(INIT_ELEMENT_STYLES.answerTitle.fontSize)
      },
      sendBtn: {
        fontSize: calculate(INIT_ELEMENT_STYLES.sendBtn.fontSize),
        borderRadius: calculate(INIT_ELEMENT_STYLES.sendBtn.borderRadius),
        padding: calculate(INIT_ELEMENT_STYLES.sendBtn.padding),
        marginTop: calculate(INIT_ELEMENT_STYLES.sendBtn.marginTop),
        lineHeight: calculate(INIT_ELEMENT_STYLES.sendBtn.lineHeight)
      }
    }),
    [calculate]
  );

  const handleAnswer = useCallback((id: string) => {
    setUserAnswers((prevState) =>
      prevState.includes(id) ? prevState.filter((answer) => answer !== id) : [...prevState, id]
    );
  }, []);

  const handleSendAnswer = useCallback(() => {
    if (!isReadOnly && userAnswers.length && !isSent) {
      onAnswer?.(userAnswers);
      setIsSent(true);
    }
  }, [onAnswer, userAnswers, isSent, isReadOnly]);

  useEffect(() => {
    eventSubscribe('nextStory', handleSendAnswer);
    eventSubscribe('prevStory', handleSendAnswer);

    return () => {
      eventUnsubscribe('nextStory', handleSendAnswer);
      eventUnsubscribe('prevStory', handleSendAnswer);
    };
  }, [handleSendAnswer]);

  const textStyles = getTextStyles(params.fontColor);

  return (
    <div className={b()}>
      {!isTitleHidden && (
        <div
          className={b('title', { gradient: params.fontColor?.type === 'gradient' })}
          style={{
            ...elementSizes.title,
            fontStyle: params.fontParams?.style,
            fontWeight: params.fontParams?.weight,
            fontFamily: params.fontFamily,
            ...textStyles
          }}
        >
          {title}
        </div>
      )}
      <div className={b('answers')} style={elementSizes.answers}>
        {answers.map((answer) => (
          <button
            className={b('answer', {
              noGap: !answer.title.length,
              selected: userAnswers.includes(answer.id)
            })}
            disabled={isSent || isReadOnly}
            key={answer.id}
            style={elementSizes.answer}
            onClick={() => !isReadOnly && handleAnswer(answer.id)}
          >
            {answer.emoji && (
              <Emoji emoji={answer.emoji?.name} set="apple" size={elementSizes.emoji.width} />
            )}
            <p
              className={b('answerTitle')}
              style={{
                ...elementSizes.answerTitle,
                lineHeight: `${elementSizes.sendBtn.lineHeight}px`
              }}
            >
              {answer.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
});
