import React, { FC, useState, useEffect, useRef } from 'react';
import { Emoji } from 'emoji-mart';
import block from 'bem-cn';
import { getClientPosition } from '../../../../utils';

import './SliderCustom.scss';

const b = block('SliderSdkCustom');

interface Props {
  emoji: string;
  changeStatus: string;
  value: number;
  initSize?: number;
  disabled?: boolean;
  onChange?: (valueChanged: number) => void;
  height: number;
  onAfterChange?: () => void;
  onBeforeChange?: () => void;
}

export const SliderCustom: FC<Props> = ({
  emoji,
  changeStatus,
  value,
  initSize = 34,
  disabled,
  height,
  onChange,
  onAfterChange,
  onBeforeChange
}) => {
  const containerRef = useRef(null);
  const thumbRef = useRef(null);

  const [bigSize, setBigSize] = useState(initSize);

  const containerPos = useRef({
    start: 0,
    end: 0
  });

  useEffect(() => {
    setBigSize(initSize + initSize * (value / 100));
  }, [value, initSize]);

  const getPos = (e: any): number => {
    const clientPos = getClientPosition(e);

    const left = Math.round(clientPos.x - containerPos.current.start);

    if (left < 0) {
      return 0;
    }

    if (left > Math.round(containerPos.current.end)) {
      return 100;
    }

    return Math.round((left / containerPos.current.end) * 100);
  };

  const handleDrag = (e: any) => {
    if (disabled) return;

    e.preventDefault();

    if (onChange) {
      onChange(getPos(e));
    }
  };

  const handleMouseDown = (e: any) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    // @ts-ignore
    const container = containerRef.current.getBoundingClientRect();

    containerPos.current.start = container.x;
    containerPos.current.end = container.width;

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);

    if (onBeforeChange) {
      onBeforeChange();
    }
  };

  const handleDragEnd = (e: any) => {
    if (disabled) return;

    e.preventDefault();
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);

    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('touchcancel', handleDragEnd);

    if (onAfterChange) {
      onAfterChange();
    }
  };

  return (
    <div className={b()} ref={containerRef} style={{ height }}>
      <div
        className={b('thumb', { status: changeStatus })}
        ref={thumbRef}
        role="button"
        style={{ left: `${Math.round(value)}%` }}
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onKeyUp={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
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

      <div className={b('track')} style={{ height }}>
        <span
          className={b('trackPart', { unselected: true })}
          style={{ width: `${Math.round(value)}%` }}
        />
        <span
          className={b('trackPart', { selected: true })}
          style={{ width: `${Math.round(100 - value)}%` }}
        />
      </div>
    </div>
  );
};
