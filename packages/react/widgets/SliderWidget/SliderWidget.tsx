import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import block from 'bem-cn';
import ReactSlider from 'react-slider';
import {
  SliderWidgetParamsType,
  WidgetComponent,
  WidgetPositionType,
  WidgetPositionLimitsType
} from '../../types';
import { calculateElementSize } from '../../utils';
import './SliderWidget.scss';
import { useInterval } from '../../hooks';
import { CurrentStoryContext } from '../../components';
import { SliderThumb, SliderTrack } from './_components';

const b = block('SliderWidget');

type ChangeStatus = 'init' | 'moving' | 'moved';

const INIT_ELEMENT_STYLES = {
  widget: {
    borderRadius: 10
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
  storyId: string;
  params: SliderWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  onSlide?(value: number): void;
}> = (props) => {
  const { params, storyId, position, positionLimits } = props;
  const { color, text, emoji, value } = params;
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [changeStatus, setChangeStatus] = useState<ChangeStatus>('init');

  const time = 500;
  const [delay, setDelay] = useState<number>(0);

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
      widget: {
        borderRadius: calculate(INIT_ELEMENT_STYLES.widget.borderRadius)
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
    if (changeStatus === 'moved' && props.onSlide) {
      props.onSlide(sliderValue);
    }

    // eslint-disable-next-line
  }, [changeStatus, sliderValue]);

  const handleChange = (valueChanged: any) => {
    setSliderValue(valueChanged);
  };

  const handleBeforeChange = () => {
    setChangeStatus('moving');
  };

  const handleAfterChange = () => {
    setChangeStatus('moved');
  };

  const currentStoryId = useContext(CurrentStoryContext);

  useEffect(() => {
    if (currentStoryId === storyId) {
      setDelay(Math.round(time / value));
    }
  }, [currentStoryId, storyId, value, time]);

  return (
    <div className={b({ color })} style={elementSizes.widget}>
      <div className={b('text')} style={elementSizes.text}>
        {text}
      </div>

      <ReactSlider
        disabled={changeStatus === 'moved'}
        max={100}
        min={0}
        renderThumb={(sliderProps: any) => (
          <SliderThumb
            changeStatus={changeStatus}
            currentPosition={sliderValue}
            emoji={emoji.name}
            initSize={elementSizes.emoji.width}
            props={sliderProps}
          />
        )}
        renderTrack={(propsTrack: any, state: any) => (
          <SliderTrack propsTrack={propsTrack} size={elementSizes.slider} state={state} />
        )}
        value={[sliderValue]}
        onAfterChange={handleAfterChange}
        onBeforeChange={handleBeforeChange}
        onChange={handleChange}
      />
    </div>
  );
};
