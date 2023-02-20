/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useMemo, useState } from 'react';
import { IconRateStar } from '@components/icons';
import { block, calculateElementSize } from '@utils';
import {
  QuizRateWidgetParamsType,
  WidgetComponent,
  WidgetPositionLimitsType,
  WidgetPositionType
} from '@types';
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
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string): any;
  onGoToStory?(storyId: string): void;
}> = (props) => {
  const { title, isTitleHidden, storyId, storeLinks } = props.params;
  const { position, positionLimits, isReadOnly, onAnswer, onGoToStory } = props;

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
      stars: {
        gap: calculate(INIT_ELEMENT_STYLES.stars.gap)
      }
    }),
    [calculate]
  );

  const handleAnswer = (rate: string) => {
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
  };

  return (
    <div className={b()}>
      {!isTitleHidden && (
        <div className={b('title')} style={elementSizes.title}>
          {title}
        </div>
      )}
      <div
        className={b('starsContainer', {
          disabled: isSent || isReadOnly
        })}
        style={{
          gap: elementSizes.stars.gap
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
};
