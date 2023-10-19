import React, { useCallback, useContext, useState } from 'react';
import { StoryContext } from '@components';
import {
  BackgroundColorType,
  QuizOneAnswerWidgetElementsType,
  QuizOneAnswerWidgetParamsType,
  ScoreType,
  WidgetComponent
} from '@types';
import { block, getTextStyles } from '@utils';
import { Emoji } from 'emoji-mart';
import cn from 'classnames';
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
  id: string;
  params: QuizOneAnswerWidgetParamsType;
  elementsSize?: QuizOneAnswerWidgetElementsType;
  isReadOnly?: boolean;
  onAnswer?(id: string): any;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
  const { title, answers, storyId, isTitleHidden } = props.params;
  const { id, params, elementsSize, isReadOnly, onAnswer, onGoToStory } = props;

  const sizes = elementsSize ?? INIT_ELEMENT_STYLES;

  const storyContextVal = useContext(StoryContext);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [userAnswer, setUserAnswer] = useState<null | string>(answerFromCache || null);

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

  const handleAnswer = useCallback(
    (answerId: string) => {
      setUserAnswer(answerId);
      onAnswer?.(answerId);
      handleSendScore(answerId);

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, answerId);
      }

      if (storyId) {
        onGoToStory?.(storyId);
      }
    },
    [onAnswer, handleSendScore, storyContextVal, id, storyId, onGoToStory]
  );

  const titleTextStyles = getTextStyles(params.titleFont?.fontColor);
  const answerTextStyles = getTextStyles(params.answersFont?.fontColor);

  return (
    <div className={b()}>
      {!isTitleHidden && (
        <div
          className={cn(
            b('title', {
              gradient: params.titleFont?.fontColor?.type === BackgroundColorType.GRADIENT
            }).toString(),
            'StorySdk-widgetTitle'
          )}
          style={{
            ...sizes.title,
            fontStyle: params.titleFont?.fontParams?.style,
            fontWeight: params.titleFont?.fontParams?.weight,
            fontFamily: params.titleFont?.fontFamily,
            ...titleTextStyles
          }}
        >
          {title}
        </div>
      )}
      <div className={b('answers')} style={sizes.answers}>
        {answers.map((answer) => (
          <button
            className={b('answer', {
              selected: userAnswer === answer.id
            })}
            disabled={userAnswer !== null || isReadOnly}
            key={answer.id}
            style={sizes.answer}
            onClick={() => !userAnswer && !isReadOnly && handleAnswer(answer.id)}
          >
            {answer.emoji && (
              <Emoji emoji={answer.emoji?.name} set="apple" size={sizes.emoji.width} />
            )}
            <p
              className={cn(
                b('answerTitle', {
                  gradient: params.answersFont?.fontColor?.type === BackgroundColorType.GRADIENT
                }).toString(),
                'StorySdk-widgetAnswerTitle'
              )}
              data-id={answer.id}
              style={{
                ...sizes.answerTitle,
                fontStyle: params.answersFont?.fontParams?.style,
                fontWeight: params.answersFont?.fontParams?.weight,
                fontFamily: params.answersFont?.fontFamily,
                ...answerTextStyles
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
