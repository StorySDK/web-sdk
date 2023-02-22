import React, { useCallback } from 'react';
import { block, renderBackgroundStyles, renderTextBackgroundStyles } from '@utils';
import { ClickMeWidgetParamsType, WidgetComponent } from '@types';
import { MaterialIcon } from '@components';
import './ClickMeWidget.scss';

const b = block('ClickMeWidget');

export const ClickMeWidget: WidgetComponent<{
  params: ClickMeWidgetParamsType;
  isReadOnly?: boolean;
  onClick?(): void;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
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
    url,
    storyId,
    actionType
  } = props.params;

  const { isReadOnly, onClick, onGoToStory } = props;

  const handleWidgetClick = useCallback(() => {
    if (onClick) {
      onClick();
    }

    if (actionType === 'link' && url) {
      const tab = window.open(url, '_blank');
      if (tab) {
        tab.focus();
      }
    } else if (actionType === 'story' && onGoToStory && storyId) {
      onGoToStory(storyId);
    }
  }, [actionType, onClick, onGoToStory, storyId, url]);

  return (
    <div
      className={b({ disabled: isReadOnly })}
      role="button"
      style={{
        borderRadius,
        borderStyle: 'solid',
        borderWidth: `${hasBorder ? borderWidth : 0}px`,
        borderColor: renderBackgroundStyles(borderColor)
      }}
      tabIndex={0}
      onClick={!isReadOnly ? handleWidgetClick : undefined}
      onKeyDown={!isReadOnly ? handleWidgetClick : undefined}
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
});
