import {
  QuizOneAnswerWidgetParamsType,
  WidgetComponent,
  WidgetPositionLimitsType,
  WidgetPositionType
} from '@types';
import { block, calculateElementSize } from '@utils';
import { Emoji } from 'emoji-mart';
import React, { useCallback, useMemo, useState } from 'react';

import './QuizOneAnswerWidget.scss';

const b = block('QuizOneAnswerWidget');

const INIT_ELEMENT_STYLES = {
  title: {
    fontSize: 14,
    marginBottom: 16
  },
  answers: {
    gap: 10
  },
  answer: {
    padding: 10,
    gap: 10,
    borderRadius: 20
  },
  emoji: {
    width: 17
  },
  answerTitle: {
    fontSize: 11
  }
};

export const QuizOneAnswerWidget: WidgetComponent<{
  params: QuizOneAnswerWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(id: string): any;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
  const { title, answers, storyId, isTitleHidden } = props.params;
  const { position, positionLimits, isReadOnly, onAnswer, onGoToStory } = props;

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
      }
    }),
    [calculate]
  );

  const handleAnswer = useCallback(
    (id: string) => {
      setUserAnswer(id);
      onAnswer?.(id);

      if (storyId) {
        onGoToStory?.(storyId);
      }
    },
    [onAnswer, onGoToStory, storyId]
  );

  return (
    <div className={b()}>
      {!isTitleHidden && (
        <div className={b('title')} style={elementSizes.title}>
          {title}
        </div>
      )}
      <div className={b('answers')} style={elementSizes.answers}>
        {answers.map((answer) => (
          <button
            className={b('answer', {
              selected: userAnswer === answer.id
            })}
            disabled={userAnswer !== null || isReadOnly}
            key={answer.id}
            style={elementSizes.answer}
            onClick={() => !userAnswer && !isReadOnly && handleAnswer(answer.id)}
          >
            {answer.emoji && (
              <Emoji emoji={answer.emoji?.name} set="apple" size={elementSizes.emoji.width} />
            )}
            <p className={b('answerTitle')} style={elementSizes.answerTitle}>
              {answer.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
});
