import React, { useCallback, useMemo, useState } from 'react';
import {
  WidgetPositionLimitsType,
  WidgetPositionType,
  QuizMultipleAnswerWithImageParamsType,
  WidgetComponent
} from '@types';
import { block, calculateElementSize } from '@utils';
import './QuizMultipleAnswerWithImageWidget.scss';

const b = block('QuizMultipleAnswerWithImageWidget');

const INIT_ELEMENT_STYLES = {
  title: {
    fontSize: 14,
    marginBottom: 16
  },
  answers: {
    gap: 5
  },
  answer: {
    padding: 4,
    gap: 5,
    borderRadius: 5
  },
  emoji: {
    width: 11
  },
  answerTitle: {
    fontSize: 11
  },
  sendBtn: {
    fontSize: 11,
    borderRadius: 5,
    padding: 10,
    marginTop: 5
  }
};

export const QuizMultipleAnswerWithImageWidget: WidgetComponent<{
  params: QuizMultipleAnswerWithImageParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string[]): any;
  onGoToStory?(storyId: string): void;
}> = (props) => {
  const { title, answers, isTitleHidden, storyId } = props.params;
  const { position, positionLimits, isReadOnly, onAnswer, onGoToStory } = props;

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSent, setIsSent] = useState<boolean>(false);

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
      answerTitle: {
        fontSize: calculate(INIT_ELEMENT_STYLES.answerTitle.fontSize)
      },
      sendBtn: {
        fontSize: calculate(INIT_ELEMENT_STYLES.sendBtn.fontSize),
        borderRadius: calculate(INIT_ELEMENT_STYLES.sendBtn.borderRadius),
        padding: calculate(INIT_ELEMENT_STYLES.sendBtn.padding),
        marginTop: calculate(INIT_ELEMENT_STYLES.sendBtn.marginTop)
      }
    }),
    [calculate]
  );

  const handleAnswer = (id: string) => {
    setUserAnswers((prevState) =>
      prevState.includes(id) ? prevState.filter((answer) => answer !== id) : [...prevState, id]
    );
  };

  const handleSendAnswer = () => {
    onAnswer?.(userAnswers);
    setIsSent(true);

    if (storyId) {
      onGoToStory?.(storyId);
    }
  };

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
              selected: userAnswers.includes(answer.id)
            })}
            disabled={isSent || isReadOnly}
            key={answer.id}
            style={elementSizes.answer}
            onClick={() => isReadOnly && handleAnswer(answer.id)}
          >
            <div
              className={b('answerImgContainer')}
              style={{
                backgroundImage: answer.image ? `url(${answer.image.url})` : ''
              }}
            />
            <p className={b('answerTitle')} style={elementSizes.answerTitle}>
              {answer.title}
            </p>
          </button>
        ))}
      </div>
      {userAnswers.length > 0 && (
        <button
          className={b('sendBtn', { sent: isSent || isReadOnly })}
          disabled={isSent || isReadOnly}
          style={elementSizes.sendBtn}
          onClick={handleSendAnswer}
        >
          {isSent ? 'Sent!' : 'Send'}
        </button>
      )}
    </div>
  );
};
