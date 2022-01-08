import React, { FC, useState, useEffect } from 'react';
import { Emoji } from 'emoji-mart';
import block from 'bem-cn';
import './SliderThumb.scss';

const b = block('SliderThumb');

interface Props {
  props: any;
  emoji: string;
  changeStatus: string;
  currentPosition: number;
  initSize?: number;
}

export const SliderThumb: FC<Props> = ({
  props,
  emoji,
  changeStatus,
  currentPosition,
  initSize = 34
}) => {
  const [bigSize, setBigSize] = useState(initSize);

  useEffect(() => {
    setBigSize(initSize + initSize * (currentPosition / 100));
  }, [currentPosition, initSize]);

  return (
    <div
      {...props}
      className={b({ staus: changeStatus })}
      id={props.key}
      role="button"
      tabIndex={0}
      onClick={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    >
      {changeStatus === 'moving' || changeStatus === 'moved' ? (
        <div
          className={b('up', { moved: changeStatus === 'moved' })}
          style={{ top: `-${bigSize + 5}px` }}
        >
          <Emoji emoji={emoji} set="apple" size={bigSize} />
        </div>
      ) : null}

      <Emoji emoji={emoji} set="apple" size={initSize} />
    </div>
  );
};
