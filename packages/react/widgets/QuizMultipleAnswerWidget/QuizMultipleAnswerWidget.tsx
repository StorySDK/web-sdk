import { Emoji } from 'emoji-mart';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  block,
  calculateElementSize,
  eventSubscribe,
  eventUnsubscribe,
  getTextStyles
} from '@utils';
import cn from 'classnames';
import {
  QuizMultipleAnswerWidgetParamsType,
  ScoreType,
  WidgetComponent,
  WidgetPositionLimitsType,
  WidgetPositionType
} from '@types';
import { StoryContext } from '@components';
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
  id: string;
  params: QuizMultipleAnswerWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string): any;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
  const { title, answers, isTitleHidden } = props.params;
  const { id, params, position, positionLimits, isReadOnly, onAnswer } = props;

  const storyContextVal = useContext(StoryContext);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [userAnswers, setUserAnswers] = useState<string[]>(answerFromCache || []);
  const [isSent, setIsSent] = useState<boolean>(!!answerFromCache);

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
      if (userAnswers.includes(id)) {
        handleSendScore([answerId], 'remove');
        setUserAnswers((prevState) => prevState.filter((answer) => answer !== answerId));
      } else {
        handleSendScore([answerId], 'add');
        setUserAnswers((prevState) => [...prevState, answerId]);
      }
    },
    [handleSendScore, id, userAnswers]
  );

  const handleSendAnswer = useCallback(() => {
    if (!isReadOnly && userAnswers.length && !isSent) {
      userAnswers.forEach((answer: string) => {
        onAnswer?.(answer);
      });

      setIsSent(true);

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, userAnswers);
      }
    }
  }, [isReadOnly, userAnswers, isSent, onAnswer, storyContextVal, id]);

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
            b('title', { gradient: params.titleFont?.fontColor?.type === 'gradient' }).toString(),
            'StorySdk-widgetTitle'
          )}
          style={{
            ...elementSizes.title,
            fontStyle: params.titleFont?.fontParams?.style,
            fontWeight: params.titleFont?.fontParams?.weight,
            fontFamily: params.titleFont?.fontFamily,
            ...titleTextStyles
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
              className={cn(
                b('answerTitle', {
                  gradient: params.answersFont?.fontColor?.type === 'gradient'
                }).toString(),
                'StorySdk-widgetAnswerTitle'
              )}
              data-id={answer.id}
              style={{
                ...elementSizes.answerTitle,
                lineHeight: `${elementSizes.sendBtn.lineHeight}px`,
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
