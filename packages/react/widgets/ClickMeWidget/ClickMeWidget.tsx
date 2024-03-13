import React, { useCallback, useState } from 'react';
import { block, renderBackgroundStyles, renderTextBackgroundStyles } from '@utils';
import { BackgroundColorType, ClickMeWidgetParamsType, WidgetComponent } from '@types';
import { MaterialIcon } from '@components';
import './ClickMeWidget.scss';

const b = block('ClickMeWidget');

const DELAY_MS = 200;

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

  const [isClicked, setIsClicked] = useState(false);

  const handleWidgetClick = useCallback(() => {
    setIsClicked(true);

    setTimeout(() => {
      setIsClicked(false);
    }, DELAY_MS);

    if (onClick) {
      onClick();
    }

    if (actionType === 'link' && url) {
      setTimeout(() => {
        const tab = window?.open(url, '_blank');
        if (tab) {
          tab.focus();
        }
      }, DELAY_MS);
    } else if (actionType === 'story' && onGoToStory && storyId) {
      setTimeout(() => {
        onGoToStory(storyId);
      }, DELAY_MS);
    }
  }, [actionType, onClick, onGoToStory, storyId, url]);

  return (
    <div
      className={b({ disabled: isReadOnly, clicked: isClicked })}
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
        className={b('container', { gradient: color.type === BackgroundColorType.GRADIENT })}
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
