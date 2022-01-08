import React, { FC } from 'react';
import block from 'bem-cn';
import './SliderTrack.scss';

const b = block('SliderTrack');

type PropType = {
  propsTrack: any;
  state: any;
  size: {
    height: number;
    borderRadius: number;
  };
};

export const SliderTrack: FC<PropType> = ({ propsTrack, state, size }) => (
  <div
    {...propsTrack}
    className={b({ selected: state.index === 1 })}
    style={{ ...size, ...propsTrack.style }}
  />
);
