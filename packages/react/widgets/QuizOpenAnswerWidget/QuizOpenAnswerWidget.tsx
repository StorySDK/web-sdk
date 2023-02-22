import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StoryContext } from '@components';
import { block, calculateElementSize } from '@utils';
import {
  QuizOpenAnswerWidgetParamsType,
  WidgetComponent,
  WidgetPositionLimitsType,
  WidgetPositionType
} from '@types';
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
  params: QuizOpenAnswerWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(answer: string): any;
  onGoToStory?(storyId: string): void;
}> = React.memo((props) => {
  const { title, isTitleHidden, storyId } = props.params;
  const { position, positionLimits, isReadOnly, onAnswer, onGoToStory } = props;

  const storyContextVal = useContext(StoryContext);

  const [text, setText] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleTextChange = useCallback(
    (e: any) => {
      setText(e.target.value);
      storyContextVal.playStatusChange('pause');
    },
    [storyContextVal]
  );

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

  const handleSendClick = useCallback(() => {
    if (text.length) {
      onAnswer?.(text);

      if (storyId) {
        onGoToStory?.(storyId);
      }

      storyContextVal.playStatusChange('play');
      setIsSent(true);
    }
  }, [onAnswer, onGoToStory, storyContextVal, storyId, text]);

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

  const calculate = useCallback(
    (size) => {
      if (position?.width && positionLimits?.minWidth) {
        return calculateElementSize(+position?.width, size, positionLimits?.minWidth);
      }

      return size;
    },
    [position?.width, positionLimits?.minWidth]
  );

  const elementSizes = useMemo(
    () => ({
      title: {
        fontSize: calculate(INIT_ELEMENT_STYLES.title.fontSize),
        marginBottom: calculate(INIT_ELEMENT_STYLES.title.marginBottom)
      },
      input: {
        fontSize: calculate(INIT_ELEMENT_STYLES.input.fontSize)
      },
      inputWrapper: {
        paddingVertical: calculate(INIT_ELEMENT_STYLES.inputWrapper.paddingVertical),
        paddingHorizontal: calculate(INIT_ELEMENT_STYLES.inputWrapper.paddingHorizontal),
        borderRadius: calculate(INIT_ELEMENT_STYLES.inputWrapper.borderRadius),
        paddingRight: calculate(INIT_ELEMENT_STYLES.inputWrapper.paddingRight)
      },
      sendButton: {
        right: calculate(INIT_ELEMENT_STYLES.sendButton.right),
        width: calculate(INIT_ELEMENT_STYLES.sendButton.width),
        height: calculate(INIT_ELEMENT_STYLES.sendButton.height)
      }
    }),
    [calculate]
  );

  return (
    <div className={b()}>
      {!isTitleHidden && (
        <div className={b('title')} style={elementSizes.title}>
          {title}
        </div>
      )}
      <div
        className={b('inputWrapper')}
        style={{
          paddingTop: elementSizes.inputWrapper.paddingVertical,
          paddingBottom: elementSizes.inputWrapper.paddingVertical,
          paddingLeft: elementSizes.inputWrapper.paddingHorizontal,
          borderRadius: elementSizes.inputWrapper.borderRadius,
          paddingRight: elementSizes.inputWrapper.paddingRight
        }}
      >
        <input
          className={b('input')}
          disabled={isSent || isReadOnly}
          placeholder="Enter the text..."
          style={elementSizes.input}
          type="text"
          value={text}
          onChange={!isReadOnly ? handleTextChange : undefined}
        />
        {text.length > 0 && (
          <button
            className={b('sendButton')}
            disabled={isSent || isReadOnly}
            style={elementSizes.sendButton}
            onClick={!isReadOnly ? handleSendClick : undefined}
          >
            <IconArrowSend className={b('sendButtonIcon')} />
          </button>
        )}
      </div>
    </div>
  );
});
