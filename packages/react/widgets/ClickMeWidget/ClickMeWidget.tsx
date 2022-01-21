import React from 'react';
import block from 'bem-cn';
import { renderBackgroundStyles, renderTextBackgroundStyles } from '../../utils';
import { ClickMeWidgetParamsType, WidgetComponent } from '../../types';
import './ClickMeWidget.scss';
import { MaterialIcon } from '../../components/MaterialIcon';

const b = block('ClickMeSdkWidget');

export const ClickMeWidget: WidgetComponent<{
  params: ClickMeWidgetParamsType;
  onClick?(): void;
}> = (props) => {
  const {
    fontFamily,
    fontParams,
    opacity,
    fontSize,
    iconSize,
    color,
    text,
    icon,
    borderRadius,
    backgroundColor,
    borderWidth,
    borderColor,
    hasBorder,
    hasIcon,
    url
  } = props.params;

  // const border = hasBorder ? `${borderWidth}px solid ${borderColor}` : 'none';

  const handleWidgetClick = () => {
    if (props.onClick) {
      props.onClick();
    }

    const tab = window.open(url, '_blank');
    if (tab) {
      tab.focus();
    }
  };

  return (
    <div
      className={b()}
      role="button"
      style={{
        borderRadius,
        borderStyle: 'solid',
        borderWidth: `${hasBorder ? borderWidth : 0}px`,
        borderColor: renderBackgroundStyles(borderColor)
      }}
      tabIndex={0}
      onClick={handleWidgetClick}
      onKeyDown={handleWidgetClick}
    >
      <div
        className={b('container', { gradient: color.type === 'gradient' })}
        style={{
          fontStyle: fontParams.style,
          fontWeight: fontParams.weight,
          fontFamily,
          fontSize,
          ...renderTextBackgroundStyles({ color })
        }}
      >
        {hasIcon ? (
          <MaterialIcon
            background={color}
            className={b('icon').toString()}
            color={renderBackgroundStyles(color)}
            name={icon.name}
            size={iconSize}
          />
        ) : null}

        <span className={b('text')} style={{ opacity: opacity ? +opacity / 100 : 1 }}>
          {text}
        </span>
      </div>

      <div
        className={b('background')}
        style={{
          background: renderBackgroundStyles(backgroundColor)
        }}
      />
    </div>
  );
};
