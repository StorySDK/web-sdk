import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StoryContext } from '@components';
import { block, getTextStyles } from '@utils';
import {
  QuizOpenAnswerWidgetElementsType,
  QuizOpenAnswerWidgetParamsType,
  WidgetComponent,
  WidgetsTypes
} from '@types';
import cn from 'classnames';
import { IconArrowSend } from '@components/icons';
import './QuizOpenAnswerWidget.scss';

const b = block('QuizOpenAnswerWidget');

const INIT_ELEMENT_STYLES = {
  title: {
    fontSize: 14,
    marginBottom: 16
  },
  input: {
    fontSize: 11
  },
  inputWrapper: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    paddingRight: 35
  },
  sendButton: {
    width: 25,
    height: 25,
    right: 4
  }
};

export const QuizOpenAnswerWidget: WidgetComponent<{
  id: string;
  params: QuizOpenAnswerWidgetParamsType;
  elementsSize?: QuizOpenAnswerWidgetElementsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string): any;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
  const { title, isTitleHidden, storyId } = props.params;
  const { id, params, elementsSize, isReadOnly, onAnswer, onGoToStory } = props;

  const storyContextVal = useContext(StoryContext);

  const sizes = elementsSize ?? INIT_ELEMENT_STYLES;

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [text, setText] = useState<string>(answerFromCache ?? '');
  const [isSent, setIsSent] = useState<boolean>(!!answerFromCache);

  const handleTextChange = useCallback(
    (e: any) => {
      setText(e.target.value);
      storyContextVal.playStatusChange?.('pause');
    },
    [storyContextVal]
  );

  const handleClickOutside = useCallback(
    (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        storyContextVal.playStatusChange?.('play');
      } else if (inputRef.current && inputRef.current.contains(event.target) && !isSent) {
        storyContextVal.playStatusChange?.('pause');
      }
    },
    [isSent, storyContextVal]
  );

  const handleSendClick = useCallback(() => {
    if (text.length) {
      onAnswer?.(text);

      const generalAnswerEvent = new CustomEvent('storysdk:widget:answer', {
        detail: {
          widget: WidgetsTypes.QUIZ_OPEN_ANSWER,
          userId: storyContextVal.uniqUserId,
          storyId: storyContextVal.currentStoryId,
          widgetId: props.id,
          data: {
            answer: text
          }
        }
      });

      storyContextVal.container?.dispatchEvent(generalAnswerEvent);

      if (storyId) {
        onGoToStory?.(storyId);
      }

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, text);
      }

      storyContextVal.playStatusChange?.('play');
      setIsSent(true);
    }
  }, [id, onAnswer, onGoToStory, storyContextVal, storyId, text]);

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

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const textStyles = getTextStyles(params.fontColor);

  return (
    <div className={b()}>
      {!isTitleHidden && (
        <div
          className={cn(b('title').toString(), 'StorySdk-widgetTitle')}
          style={{
            ...sizes.title,
            fontStyle: params.fontParams?.style,
            fontWeight: params.fontParams?.weight,
            fontFamily: params.fontFamily,
            ...textStyles
          }}
        >
          {title}
        </div>
      )}
      <div
        className={b('inputWrapper')}
        style={{
          paddingTop: sizes.inputWrapper.paddingVertical,
          paddingBottom: sizes.inputWrapper.paddingVertical,
          paddingLeft: sizes.inputWrapper.paddingHorizontal,
          borderRadius: sizes.inputWrapper.borderRadius,
          paddingRight: sizes.inputWrapper.paddingRight
        }}
      >
        <input
          className={b('input')}
          disabled={isSent || isReadOnly}
          placeholder="Enter the text..."
          style={sizes.input}
          type="text"
          value={text}
          onChange={!isReadOnly ? handleTextChange : undefined}
        />
        {text.length > 0 && (
          <div
            aria-disabled={isSent || isReadOnly}
            className={b('sendButton')}
            role="button"
            style={sizes.sendButton}
            tabIndex={isSent || isReadOnly ? -1 : 0}
            onClick={!isReadOnly && !isSent ? handleSendClick : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isReadOnly && !isSent) {
                handleSendClick();
              }
            }}
          >
            <IconArrowSend className={b('sendButtonIcon')} />
          </div>
        )}
      </div>
    </div>
  );
});
