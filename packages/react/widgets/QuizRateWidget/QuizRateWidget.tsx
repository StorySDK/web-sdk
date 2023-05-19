/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useState } from 'react';
import { IconRateStar } from '@components/icons';
import { block, getTextStyles } from '@utils';
import { QuizRateWidgetElementsType, QuizRateWidgetParamsType, WidgetComponent } from '@types';
import cn from 'classnames';
import './QuizRateWidget.scss';

const b = block('QuizRateWidget');

const INIT_ELEMENT_STYLES = {
  title: {
    fontSize: 14,
    marginBottom: 16
  },
  stars: {
    gap: 10
  }
};

const RATE_MAX = 5;

export const QuizRateWidget: WidgetComponent<{
  params: QuizRateWidgetParamsType;
  elementsSize: QuizRateWidgetElementsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string): any;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
  const { title, isTitleHidden, storyId, storeLinks } = props.params;
  const { params, elementsSize, isReadOnly, onAnswer, onGoToStory } = props;

  const [isSent, setIsSent] = useState<boolean>(false);

  const sizes = elementsSize ?? INIT_ELEMENT_STYLES;

  const handleAnswer = useCallback(
    (rate: string) => {
      onAnswer?.(rate);

      if (storeLinks?.web) {
        const tab = window.open(storeLinks?.web, '_blank');
        if (tab) {
          tab.focus();
        }
      } else if (storyId) {
        onGoToStory?.(storyId);
      }

      setIsSent(true);
    },
    [onAnswer, onGoToStory, storeLinks?.web, storyId]
  );

  const textStyles = getTextStyles(params.fontColor);

  return (
    <div className={b()}>
      {!isTitleHidden && (
        <div
          className={cn(
            b('title', { gradient: params.fontColor?.type === 'gradient' }).toString(),
            'StorySdk-widgetTitle'
          )}
          style={{
            ...sizes.title,
            fontStyle: params.fontParams?.style,
            fontWeight: params.fontParams?.weight,
            fontFamily: params.fontFamily,
            ...textStyles
          }}
        >
          {title}
        </div>
      )}
      <div
        className={b('starsContainer', {
          disabled: isSent || isReadOnly
        })}
        style={{
          gap: sizes.stars.gap
        }}
      >
        {new Array(RATE_MAX).fill(0).map((_, index) => (
          <React.Fragment key={`rate-star-${index}`}>
            <input
              className={b('input')}
              disabled={isSent}
              id={`rate-star-${index}`}
              type="radio"
              value={RATE_MAX - index}
              onChange={(e) => {
                !isReadOnly && handleAnswer(e.target.value);
              }}
            />
            <label className={b('starItem')} htmlFor={`rate-star-${index}`}>
              <IconRateStar className={b('star')} />
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});
