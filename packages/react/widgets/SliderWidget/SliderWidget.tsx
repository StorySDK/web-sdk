import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  BackgroundColorType,
  SliderWidgetElementsType,
  SliderWidgetParamsType,
  WidgetComponent
} from '@types';
import cn from 'classnames';
import { block, getTextStyles } from '@utils';
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
  elementsSize?: SliderWidgetElementsType;
  isReadOnly?: boolean;
  onAnswer?(value: number): void;
}> = React.memo((props) => {
  const { id, params, storyId, elementsSize, isReadOnly, onAnswer } = props;
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

  const sizes = elementsSize ?? INIT_ELEMENT_STYLES;

  return (
    <div className={b({ color })} style={sizes.widget}>
      <div
        className={cn(
          b('text', {
            gradient: params.fontColor?.type === BackgroundColorType.GRADIENT
          }).toString(),
          'StorySdk-widgetTitle'
        )}
        style={{
          ...sizes.text,
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
          height: sizes.slider.height
        }}
      >
        <SliderCustom
          borderRadius={sizes.slider.borderRadius}
          changeStatus={changeStatus}
          disabled={changeStatus === 'moved' || isReadMode}
          emoji={emoji.name}
          height={sizes.slider.height}
          initSize={sizes.emoji.width}
          value={sliderValue}
          onAfterChange={handleAfterChange}
          onBeforeChange={handleBeforeChange}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});
