import React, { useCallback, useContext, useState } from 'react';
import {
  BackgroundColorType,
  SwipeUpWidgetParamsType,
  WidgetsTypes,
} from '@storysdk/types';
import { block, renderBackgroundStyles, renderTextBackgroundStyles } from '@utils';
import { MaterialIcon, StoryContext } from '@components';
import './SwipeUpWidget.scss';

const b = block('SwipeUpWidget');

export const SwipeUpWidget: React.FunctionComponent<{
  id?: string;
  params: SwipeUpWidgetParamsType;
  isReadOnly?: boolean;
  onSwipe?(): void;
  handleMuteVideo?(isMuted: boolean): void;
}> = React.memo((props) => {
  const {
    color, fontFamily, fontParams, fontSize, iconSize, icon, text, url,
  } = props.params;
  const { isReadOnly, onSwipe, handleMuteVideo } = props;

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const storyContextVal = useContext(StoryContext);

  const handleTouchStart = useCallback((e: any) => {
    setTouchStart(e.targetTouches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: any) => {
    setTouchEnd(e.targetTouches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 200) {
      const generalAnswerEvent = new CustomEvent('storysdk:widget:click', {
        detail: {
          widget: WidgetsTypes.SWIPE_UP,
          userId: storyContextVal.uniqUserId,
          storyId: storyContextVal.currentStoryId,
          widgetId: props.id,
          data: {
            url,
          },
        },
      });

      storyContextVal.container?.dispatchEvent(generalAnswerEvent);

      if (onSwipe) {
        onSwipe();
      }

      if (window?.cordova) {
        window.cordova?.InAppBrowser?.open(url, '_system');
      } else {
        const tab = window?.open(url, '_blank');
        if (tab) {
          tab.focus();
        }
      }

      handleMuteVideo?.(true);
      setTouchStart(0);
      setTouchEnd(0);
    }
  }, [onSwipe, handleMuteVideo, touchEnd, touchStart, url]);

  const handleClick = useCallback(() => {
    if (onSwipe) {
      onSwipe();
    }

    if (window?.cordova) {
      window.cordova?.InAppBrowser?.open(url, '_system');
    } else {
      const tab = window?.open(url, '_blank');
      if (tab) {
        tab.focus();
      }
    }

    handleMuteVideo?.(true);
  }, [handleMuteVideo, onSwipe, url]);

  return (
    <div
      className={b({ gradient: color.type === BackgroundColorType.GRADIENT })}
      role="button"
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        fontStyle: fontParams.style,
        fontWeight: fontParams.weight,
        ...renderTextBackgroundStyles({ color }),
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
});
