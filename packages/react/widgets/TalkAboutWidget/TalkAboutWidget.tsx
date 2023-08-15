import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import {
  TalkAboutWidgetParamsType,
  WidgetComponent,
  TalkAboutElementsType,
  BackgroundColorType
} from '@types';
import cn from 'classnames';
import { StoryContext } from '@components';
import { IconLogoCircle } from '@components/icons';
import { block, getTextStyles } from '@utils';
import './TalkAboutWidget.scss';

const b = block('TalkAboutWidget');

const INIT_ELEMENT_STYLES = {
  widget: {
    borderRadius: 10
  },
  content: {
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 12,
    paddingTop: 30
  },
  text: {
    fontSize: 14,
    marginBottom: 15
  },
  input: {
    fontSize: 10,
    padding: 11,
    borderRadius: 8
  },
  empty: {
    height: 18
  },
  imageWrapper: {
    width: 36,
    height: 36
  },
  send: {
    height: 50
  },
  sendText: {
    fontSize: 14
  }
};

export const TalkAboutWidget: WidgetComponent<{
  id: string;
  params: TalkAboutWidgetParamsType;
  elementsSize?: TalkAboutElementsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string): void;
}> = React.memo((props) => {
  const { id, params, elementsSize, isReadOnly } = props;

  const sizes = elementsSize ?? INIT_ELEMENT_STYLES;

  const storyContextVal = useContext(StoryContext);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [text, setText] = useState<string>(answerFromCache || '');
  const [isSent, setIsSent] = useState<boolean>(!!answerFromCache);

  const handleTextChange = useCallback(
    (e: any) => {
      setText(e.target.value);
      storyContextVal.playStatusChange('pause');
    },
    [storyContextVal]
  );

  const handleSendClick = useCallback(() => {
    if (text.length) {
      props.onAnswer?.(text);

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, text);
      }

      storyContextVal.playStatusChange('play');
      setIsSent(true);
    }
  }, [id, props, storyContextVal, text]);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = useCallback(
    (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        storyContextVal.playStatusChange('play');
      } else if (inputRef.current && inputRef.current.contains(event.target) && !isSent) {
        storyContextVal.playStatusChange('pause');
      }
    },
    [isSent, storyContextVal]
  );

  useEffect(() => {
    if (!isSent) {
      document.addEventListener('click', handleClickOutside, true);
    } else {
      document.removeEventListener('click', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [handleClickOutside, isSent]);

  const textStyles = getTextStyles(params.fontColor);

  return (
    <>
      <div className={b('container')} ref={ref}>
        <picture className={b('imageWrapper')} style={sizes.imageWrapper}>
          {params.image ? (
            <img alt="" className={b('image')} src={params.image} />
          ) : (
            <IconLogoCircle className={b('image').toString()} />
          )}
        </picture>

        <div className={b('empty')} style={sizes.empty} />

        <div className={b({ color: params.color })} style={sizes.widget}>
          <div
            className={b('contentContainer', { sendOpen: text.length > 0 })}
            style={sizes.content}
          >
            {!params.isTitleHidden && (
              <div
                className={
                  (cn(
                    b('text', {
                      gradient: params.fontColor?.type === BackgroundColorType.GRADIENT
                    }).toString()
                  ),
                  'StorySdk-widgetTitle')
                }
                style={{
                  ...sizes.text,
                  fontStyle: params.fontParams?.style,
                  fontWeight: params.fontParams?.weight,
                  fontFamily: params.fontFamily,
                  ...textStyles
                }}
              >
                {params.text}
              </div>
            )}

            <input
              className={b('input')}
              disabled={isSent || isReadOnly}
              placeholder="Type something..."
              ref={inputRef}
              style={sizes.input}
              type="text"
              value={text}
              onChange={!isReadOnly ? handleTextChange : undefined}
            />
          </div>

          {text && (
            <button
              className={b('send', { disabled: isSent || isReadOnly })}
              style={sizes.send}
              onClick={!isSent && !isReadOnly ? handleSendClick : undefined}
            >
              <span className={b('sendText', { green: isSent })} style={sizes.sendText}>
                {isSent ? 'Sent!' : 'Send'}
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
});
