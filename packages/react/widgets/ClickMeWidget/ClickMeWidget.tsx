import React, { useCallback, useContext, useState } from 'react';
import { block, renderBackgroundStyles, renderTextBackgroundStyles } from '@utils';
import { BackgroundColorType, ClickMeWidgetParamsType, WidgetComponent } from '@types';
import { MaterialIcon, StoryContext } from '@components';
import './ClickMeWidget.scss';

declare global {
  interface Window {
    cordova?: {
      InAppBrowser?: {
        open: (url: string, target: string) => void;
      };
    };
  }
}

const b = block('ClickMeWidget');

const DELAY_MS = 200;

export const ClickMeWidget: WidgetComponent<{
  id?: string;
  params: ClickMeWidgetParamsType;
  isReadOnly?: boolean;
  onClick?(): void;
  onGoToStory?(storyId: string): void;
  onCloseStory?(): void;
  handleMuteVideo?(isMuted: boolean): void;
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
    actionType,
    customFields
  } = props.params;

  const { isReadOnly, onClick, onGoToStory, onCloseStory } = props;

  const [isClicked, setIsClicked] = useState(false);

  const storyContextVal = useContext(StoryContext);

  const handleWidgetClick = useCallback(() => {
    setIsClicked(true);

    setTimeout(() => {
      setIsClicked(false);
    }, DELAY_MS);

    if (onClick) {
      onClick();
    }

    const generalClickEvent = new CustomEvent('storysdk:widget:click', {
      detail: {
        widget: 'button',
        actionType,
        userId: storyContextVal.uniqUserId,
        storyId: storyContextVal.currentStoryId,
        widgetId: props.id,
        data: {
          url,
          storyId,
          customFields
        }
      }
    });

    storyContextVal.container?.dispatchEvent(generalClickEvent);

    if (actionType === 'link' && url) {
      setTimeout(() => {
        if (window?.cordova) {
          window.cordova?.InAppBrowser?.open(url, '_system');
        } else {
          const tab = window?.open(url, '_blank');
          if (tab) {
            tab.focus();
          }
        }

        props.handleMuteVideo?.(true);
      }, DELAY_MS);
    } else if (actionType === 'story' && onGoToStory && storyId) {
      setTimeout(() => {
        onGoToStory(storyId);
      }, DELAY_MS);
    } else if (actionType === 'custom' && customFields?.web) {
      const container = document.querySelector('#storysdk') ?? storyContextVal.container;

      const clickEvent = new CustomEvent('storysdk_custom_click', {
        detail: {
          data: customFields?.web
        }
      });

      container?.dispatchEvent(clickEvent);
    } else if (actionType === 'close') {
      onCloseStory?.();
    }
  }, [actionType, customFields?.web, onClick, onGoToStory, props, storyId, url]);

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
