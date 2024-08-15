import React, { useCallback, useState } from 'react';
import { block, renderBackgroundStyles, renderTextBackgroundStyles } from '@utils';
import { BackgroundColorType, LinkWidgetParamsType, WidgetComponent } from '@types';
import { MaterialIcon } from '@components';
import './LinkWidget.scss';

const b = block('LinkWidget');

const DELAY_MS = 200;

export const LinkWidget: WidgetComponent<{
  params: LinkWidgetParamsType;
  isReadOnly?: boolean;
  onClick?(): void;
}> = React.memo((props) => {
  const { fontFamily, fontParams, fontSize, text, color, opacity, backgroundColor, url } =
    props.params;

  const { isReadOnly, onClick } = props;

  const [isClicked, setIsClicked] = useState(false);

  const handleWidgetClick = useCallback(() => {
    setIsClicked(true);

    setTimeout(() => {
      setIsClicked(false);
    }, DELAY_MS);

    if (onClick) {
      onClick();
    }

    if (url) {
      setTimeout(() => {
        const tab = window?.open(url, '_blank');
        if (tab) {
          tab.focus();
        }
      }, DELAY_MS);
    }
  }, [onClick, url]);

  return (
    <div
      className={b({ disabled: isReadOnly, clicked: isClicked })}
      role="button"
      style={{
        borderRadius: 12
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
          background: renderBackgroundStyles(backgroundColor)
        }}
      />
    </div>
  );
});
