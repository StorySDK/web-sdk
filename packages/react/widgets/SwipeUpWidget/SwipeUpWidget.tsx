import React, { useState } from 'react';
import { SwipeUpWidgetParamsType, WidgetComponent } from '@types';
import { block, renderBackgroundStyles, renderTextBackgroundStyles } from '@utils';
import { MaterialIcon } from '@components';
import './SwipeUpWidget.scss';

const b = block('SwipeUpWidget');

export const SwipeUpWidget: WidgetComponent<{
  params: SwipeUpWidgetParamsType;
  isReadOnly?: boolean;
  onSwipe?(): void;
}> = (props) => {
  const { color, fontFamily, fontParams, fontSize, iconSize, icon, text, url } = props.params;
  const { isReadOnly, onSwipe } = props;

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: any) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 200) {
      if (onSwipe) {
        onSwipe();
      }

      const tab = window.open(url, '_blank');
      if (tab) {
        tab.focus();
        setTouchStart(0);
        setTouchEnd(0);
      }
    }
  };

  const handleClick = () => {
    if (onSwipe) {
      onSwipe();
    }

    const tab = window.open(url, '_blank');
    if (tab) {
      tab.focus();
    }
  };

  return (
    <div
      className={b({ gradient: color.type === 'gradient' })}
      role="button"
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        fontStyle: fontParams.style,
        fontWeight: fontParams.weight,
        ...renderTextBackgroundStyles({ color })
      }}
      tabIndex={0}
      onClick={!isReadOnly ? handleClick : undefined}
      onKeyDown={!isReadOnly ? handleClick : undefined}
      onTouchEnd={!isReadOnly ? handleTouchEnd : undefined}
      onTouchMove={!isReadOnly ? handleTouchMove : undefined}
      onTouchStart={!isReadOnly ? handleTouchStart : undefined}
    >
      <div className={b('icon')}>
        <MaterialIcon
          background={color}
          color={renderBackgroundStyles(color)}
          name={icon.name}
          size={iconSize}
        />
      </div>
      <span className={b('text')}>{text}</span>
    </div>
  );
};
