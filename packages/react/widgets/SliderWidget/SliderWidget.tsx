import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import {
  SliderWidgetParamsType,
  WidgetComponent,
  WidgetPositionType,
  WidgetPositionLimitsType
} from '@types';
import cn from 'classnames';
import { block, calculateElementSize, getTextStyles } from '@utils';
import { useInterval } from '@hooks';
import { StoryContext } from '@components';
import { SliderCustom } from './_components';
import './SliderWidget.scss';

const b = block('SliderWidget');

type ChangeStatus = 'init' | 'wait' | 'moving' | 'moved';

const INIT_ELEMENT_STYLES = {
  widget: {
    borderRadius: 10,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30
  },
  emoji: {
    width: 30,
    height: 30
  },
  text: {
    fontSize: 16,
    marginBottom: 15
  },
  slider: {
    height: 11,
    borderRadius: 6
  }
};

export const SliderWidget: WidgetComponent<{
  id: string;
  storyId: string;
  params: SliderWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(value: number): void;
}> = React.memo((props) => {
  const { id, params, storyId, position, positionLimits, isReadOnly, onAnswer } = props;
  const { color, text, emoji, value } = params;

  const storyContextVal = useContext(StoryContext);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : undefined;

  const defaultAnswer = answerFromCache || 0;

  const isReadMode = isReadOnly || answerFromCache !== undefined;

  const [sliderValue, setSliderValue] = useState<number>(isReadOnly ? value : defaultAnswer);
  const [changeStatus, setChangeStatus] = useState<ChangeStatus>(
    answerFromCache !== undefined ? 'moved' : 'wait'
  );

  const time = 500;
  const [delay, setDelay] = useState<number>(0);

  const calculate = useCallback(
    (size) => {
      if (position?.width && positionLimits?.minWidth) {
        return calculateElementSize(+position?.width, size, positionLimits?.minWidth);
      }

      return size;
    },
    [position?.width, positionLimits?.minWidth]
  );

  const elementSizes = useMemo(
    () => ({
      widget: {
        borderRadius: calculate(INIT_ELEMENT_STYLES.widget.borderRadius),
        paddingTop: calculate(INIT_ELEMENT_STYLES.widget.paddingTop),
        paddingRight: calculate(INIT_ELEMENT_STYLES.widget.paddingRight),
        paddingLeft: calculate(INIT_ELEMENT_STYLES.widget.paddingLeft),
        paddingBottom: calculate(INIT_ELEMENT_STYLES.widget.paddingBottom)
      },
      emoji: {
        width: calculate(INIT_ELEMENT_STYLES.emoji.width)
      },
      text: {
        fontSize: calculate(INIT_ELEMENT_STYLES.text.fontSize),
        marginBottom: calculate(INIT_ELEMENT_STYLES.text.marginBottom)
      },
      slider: {
        height: calculate(INIT_ELEMENT_STYLES.slider.height),
        borderRadius: calculate(INIT_ELEMENT_STYLES.slider.borderRadius)
      }
    }),
    [calculate]
  );

  useInterval(() => {
    if (sliderValue < value - 1 && changeStatus === 'init') {
      setSliderValue(sliderValue + 1);
    } else {
      setDelay(0);
    }
  }, delay);

  useEffect(() => {
    if (changeStatus === 'moved') {
      onAnswer?.(sliderValue);

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, sliderValue);
      }
    }
  }, [changeStatus, onAnswer]);

  const handleChange = useCallback((valueChanged: number) => {
    setSliderValue(valueChanged);
  }, []);

  const handleBeforeChange = useCallback(() => {
    setChangeStatus('moving');
  }, []);

  const handleAfterChange = useCallback(() => {
    setChangeStatus('moved');
  }, []);

  useEffect(() => {
    if (storyContextVal.currentStoryId === storyId && changeStatus === 'wait') {
      setDelay(Math.round(time / value));
      setChangeStatus('init');
    }
  }, [storyContextVal, storyId, changeStatus, value, time]);

  const textStyles = getTextStyles(params.fontColor);

  return (
    <div className={b({ color })} style={elementSizes.widget}>
      <div
        className={cn(
          b('text', { gradient: params.fontColor?.type === 'gradient' }).toString(),
          'StorySdk-widgetTitle'
        )}
        style={{
          ...elementSizes.text,
          fontStyle: params.fontParams?.style,
          fontWeight: params.fontParams?.weight,
          fontFamily: params.fontFamily,
          ...textStyles
        }}
      >
        {text}
      </div>

      <div
        className={b('sliderWrapper')}
        style={{
          height: elementSizes.slider.height
        }}
      >
        <SliderCustom
          borderRadius={elementSizes.slider.borderRadius}
          changeStatus={changeStatus}
          disabled={changeStatus === 'moved' || isReadMode}
          emoji={emoji.name}
          height={elementSizes.slider.height}
          initSize={elementSizes.emoji.width}
          value={sliderValue}
          onAfterChange={handleAfterChange}
          onBeforeChange={handleBeforeChange}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});
