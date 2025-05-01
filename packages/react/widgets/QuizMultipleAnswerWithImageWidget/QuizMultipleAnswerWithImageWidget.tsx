import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  QuizMultipleAnswerWithImageWidgetParamsType,
  WidgetComponent,
  ScoreType,
  QuizMultipleAnswerWidgetWithImageElementsType,
  BackgroundColorType,
  WidgetsTypes
} from '@types';
import { block, eventSubscribe, eventUnsubscribe, getTextStyles } from '@utils';
import cn from 'classnames';
import { StoryContext } from '@components';
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
  id: string;
  params: QuizMultipleAnswerWithImageWidgetParamsType;
  elementsSize?: QuizMultipleAnswerWidgetWithImageElementsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string): any;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
  const { title, answers, isTitleHidden } = props.params;
  const { id, params, elementsSize, isReadOnly, onAnswer } = props;

  const sizes = elementsSize ?? INIT_ELEMENT_STYLES;

  const storyContextVal = useContext(StoryContext);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [userAnswers, setUserAnswers] = useState<string[]>(answerFromCache || []);
  const [isSent, setIsSent] = useState<boolean>(!!answerFromCache);

  const handleSendScore = useCallback(
    (currentAnswers: string[], type: 'add' | 'remove') => {
      if (!storyContextVal.quizMode) {
        return;
      }

      const answerScore = currentAnswers.length
        ? params.answers
          .filter((answer) => currentAnswers.includes(answer.id))
          .reduce(
            (acc, answer) => {
              if (storyContextVal.quizMode === ScoreType.LETTERS) {
                return acc + answer.score.letter;
              }
              if (storyContextVal.quizMode === ScoreType.NUMBERS) {
                return +acc + +answer.score.points;
              }
              return acc;
            },
            storyContextVal.quizMode === ScoreType.LETTERS ? '' : 0
          )
        : undefined;

      if (
        answerScore !== undefined &&
        storyContextVal.quizMode &&
        storyContextVal.handleQuizAnswer
      ) {
        storyContextVal.handleQuizAnswer({ type, answer: answerScore });
      }
    },
    [params.answers, storyContextVal]
  );

  const handleAnswer = useCallback(
    (answerId: string) => {
      if (userAnswers.includes(answerId)) {
        handleSendScore([answerId], 'remove');
        setUserAnswers((prevState) => prevState.filter((answer) => answer !== answerId));
      } else {
        handleSendScore([answerId], 'add');
        setUserAnswers((prevState) => [...prevState, answerId]);
      }
    },
    [handleSendScore, userAnswers]
  );

  const handleSendAnswer = useCallback(() => {
    if (!isReadOnly && userAnswers.length && !isSent) {
      const generalAnswerEvent = new CustomEvent('storysdk:widget:answer', {
        detail: {
          widget: WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE,
          userId: storyContextVal.uniqUserId,
          storyId: storyContextVal.currentStoryId,
          widgetId: props.id,
          data: {
            answer: userAnswers
          }
        }
      });

      storyContextVal.container?.dispatchEvent(generalAnswerEvent);

      userAnswers.forEach((answer: string) => {
        onAnswer?.(answer);
      });

      setIsSent(true);

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, userAnswers);
      }
    }
  }, [id, isReadOnly, isSent, onAnswer, storyContextVal, userAnswers]);

  useEffect(() => {
    eventSubscribe('nextStory', handleSendAnswer);
    eventSubscribe('prevStory', handleSendAnswer);

    return () => {
      eventUnsubscribe('nextStory', handleSendAnswer);
      eventUnsubscribe('prevStory', handleSendAnswer);
    };
  }, [handleSendAnswer]);

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
          <div
            className={b('answer', {
              selected: userAnswers.includes(answer.id),
              disabled: isSent || isReadOnly
            })}
            key={answer.id}
            role="button"
            style={sizes.answer}
            tabIndex={0}
            onClick={() => !isReadOnly && handleAnswer(answer.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                !isReadOnly && handleAnswer(answer.id);
              }
            }}
          >
            <div
              className={b('answerImgContainer')}
              style={{
                backgroundImage: answer.image ? `url(${answer.image.url})` : ''
              }}
            />
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
          </div>
        ))}
      </div>
    </div>
  );
});
