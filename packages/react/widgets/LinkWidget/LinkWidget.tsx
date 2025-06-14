import React, { useCallback, useContext, useState } from 'react';
import { block, renderBackgroundStyles, renderTextBackgroundStyles } from '@utils';
import { LinkWidgetParamsType } from '@storysdk/types';
import { MaterialIcon, StoryContext } from '@components';
import './LinkWidget.scss';

const b = block('LinkWidget');

const DELAY_MS = 200;

export const LinkWidget: React.FunctionComponent<{
  id?: string;
  params: LinkWidgetParamsType;
  isReadOnly?: boolean;
  onClick?: () => void;
  handleMuteVideo?(isMuted: boolean): void;
}> = React.memo((props) => {
  const {
    fontFamily, fontParams, fontSize, text, color, opacity, backgroundColor, url,
  } = props.params;

  const { isReadOnly } = props;

  const [isClicked, setIsClicked] = useState(false);

  const storyContextVal = useContext(StoryContext);

  const handleWidgetClick = useCallback(() => {
    const generalClickEvent = new CustomEvent('storysdk:widget:click', {
      detail: {
        widget: 'link',
        userId: storyContextVal.uniqUserId,
        storyId: storyContextVal.currentStoryId,
        widgetId: props.id,
        data: {
          url,
        },
      },
    });

    storyContextVal.container?.dispatchEvent(generalClickEvent);

    if (url) {
      setIsClicked(true);
      props.onClick?.();

      setTimeout(() => {
        setIsClicked(false);
      }, DELAY_MS);

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
    }
  }, [props, url]);

  return (
    <div
      className={b({ disabled: isReadOnly, clicked: isClicked })}
      role="button"
      style={{
        borderRadius: 12,
      }}
      tabIndex={0}
      onClick={!isReadOnly ? handleWidgetClick : undefined}
      onKeyDown={!isReadOnly ? handleWidgetClick : undefined}
    >
      <div
        className={b('container')}
        style={{
          fontStyle: fontParams.style,
          fontWeight: fontParams.weight,
          lineHeight: `${fontSize}px`,
          fontFamily,
          fontSize,
          ...renderTextBackgroundStyles({ color }),
        }}
      >
        <MaterialIcon
          background={color}
          className={b('icon').toString()}
          color={renderBackgroundStyles(color)}
          name="LinkIcon"
          size={21}
        />
        <span className={b('text')} style={{ opacity: opacity ? +opacity / 100 : 1 }}>
          {text}
        </span>
      </div>

      <div
        className={b('background')}
        style={{
          background: renderBackgroundStyles(backgroundColor),
          display: 'block',
        }}
      />
    </div>
  );
});
