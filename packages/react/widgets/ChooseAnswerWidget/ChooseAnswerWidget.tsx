import React, { useState, useCallback, useEffect, useContext } from 'react';
import { StoryContext } from '@components';
import {
  ChooseAnswerWidgetParamsType,
  WidgetComponent,
  ScoreType,
  ChooseAnswerWidgetElemetsType
} from '@types';
import { IconConfirm, IconDecline } from '@components/icons';
import { block } from '@utils';

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
  id: string;
  params: ChooseAnswerWidgetParamsType;
  elementsSize?: ChooseAnswerWidgetElemetsType;
  jsConfetti?: any;
  isReadOnly?: boolean;
  onAnswer?(answerId: string): void;
}> = React.memo((props) => {
  const { id, params, isReadOnly, jsConfetti, elementsSize, onAnswer } = props;

  const sizes = elementsSize ?? INIT_ELEMENT_STYLES;

  const storyContextVal = useContext(StoryContext);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [userAnswer, setUserAnswer] = useState<string | null>(answerFromCache);

  const handleSendScore = useCallback(
    (currentAnswer: string) => {
      const answerScore = currentAnswer
        ? params.answers.find((answer) => answer.id === currentAnswer)?.score
        : undefined;

      if (answerScore && storyContextVal.quizMode && storyContextVal.handleQuizAnswer) {
        storyContextVal.handleQuizAnswer({
          type: 'add',
          answer:
            storyContextVal.quizMode === ScoreType.LETTERS ? answerScore.letter : answerScore.points
        });
      }
    },
    [params.answers, storyContextVal]
  );

  const handleMarkAnswer = useCallback(
    (answerId: string) => {
      if (onAnswer) {
        onAnswer(answerId);
      }

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, answerId);
      }

      setUserAnswer(answerId);
      handleSendScore(answerId);
    },
    [onAnswer, storyContextVal, id, handleSendScore]
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
            style={sizes.answer}
          >
            <div
              className={b('answerCircle', {
                correct: answer.id === params.correct && params.markCorrectAnswer,
                incorrect: answer.id !== params.correct && params.markCorrectAnswer,
                choosen: userAnswer === answer.id && params.markCorrectAnswer,
                filled: userAnswer === answer.id && !params.markCorrectAnswer
              })}
              style={sizes.answerId}
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
              style={sizes.answerTitle}
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
          style={sizes.answer}
          tabIndex={0}
          onClick={!userAnswer && !isReadOnly ? () => handleMarkAnswer(answer.id) : undefined}
          onKeyDown={!userAnswer && !isReadOnly ? () => handleMarkAnswer(answer.id) : undefined}
        >
          <div className={b('answerId')} style={sizes.answerId}>
            {`${answer.id}`}
          </div>
          <div className={b('answerTitle')} style={sizes.answerTitle}>
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
      sizes.answer,
      sizes.answerId,
      sizes.answerTitle,
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
      style={sizes.widget}
    >
      {!params.isTitleHidden && (
        <div className={b('header')} style={sizes.header}>
          {params.text}
        </div>
      )}

      <div className={b('answers')} style={sizes.answers}>
        {params.answers.map((answer) => renderAnswer(answer))}
      </div>
    </div>
  );
});
