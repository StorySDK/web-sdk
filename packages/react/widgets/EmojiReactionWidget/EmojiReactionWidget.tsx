import React, {
  useState, useCallback, useMemo, useContext,
} from 'react';
import { block, getScalableValue } from '@utils';
import {
  EmojiReactionWidgetParamsType,
  EmojiReactionWidgetElemetsType,
  WidgetsTypes,
} from '@storysdk/types';
import { useInterval } from '@hooks';
import './EmojiReactionWidget.scss';
import { StoryContext, Emoji } from '@components';

const b = block('EmojiReactionWidget');

const INIT_ELEMENT_STYLES = {
  widget: {
    borderRadius: 50,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 11,
    paddingLeft: 11,
  },
  emoji: {
    width: 34,
  },
  item: {
    marginRight: 11,
    marginLeft: 11,
  },
};

export const EmojiReactionWidget: React.FunctionComponent<{
  id: string;
  params: EmojiReactionWidgetParamsType;
  elementsSize?: EmojiReactionWidgetElemetsType;
  isReadOnly?: boolean;
  onAnswer?(emoji: string): void;
}> = React.memo((props) => {
  const {
    id, params, elementsSize, isReadOnly, onAnswer,
  } = props;

  const sizes = elementsSize ?? INIT_ELEMENT_STYLES;

  const storyContextVal = useContext(StoryContext);

  const initEmojiSize = useMemo(() => sizes.emoji.width, [sizes]);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [clickedIndex, setClickedIndex] = useState<number | null>(answerFromCache ?? null);
  const [bigSize, setBigSize] = useState(initEmojiSize);
  const [delay, setDelay] = useState(0);
  const [isToched, setIsToched] = useState<boolean>(false);

  useInterval(() => {
    setBigSize(bigSize + 2);

    if (bigSize > getScalableValue(100)) {
      setDelay(0);
      setBigSize(initEmojiSize);
      setClickedIndex(null);
    }
  }, delay);

  const handleReactionClick = useCallback(
    (index: number, emoji: string) => {
      const generalAnswerEvent = new CustomEvent('storysdk:widget:answer', {
        detail: {
          widget: WidgetsTypes.EMOJI_REACTION,
          userId: storyContextVal.uniqUserId,
          storyId: storyContextVal.currentStoryId,
          widgetId: props.id,
          data: {
            answer: emoji,
          },
        },
      });

      storyContextVal.container?.dispatchEvent(generalAnswerEvent);

      onAnswer?.(emoji);

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, index);
      }

      setIsToched(true);
      setClickedIndex(index);
      setBigSize(initEmojiSize);
      setDelay(50);
    },
    [id, initEmojiSize, onAnswer, storyContextVal],
  );

  return (
    <div className={b({ color: params.color })} style={sizes.widget}>
      {params.emoji.map((emojiItem, index) => (
        <div
          className={b('item', { disabled: isReadOnly || isToched || clickedIndex !== null })}
          key={`${emojiItem.unicode}-${index}`}
          role="button"
          style={sizes.item}
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();

            if (!isToched && !isReadOnly && clickedIndex === null) {
              handleReactionClick(index, emojiItem.unicode);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isToched && !isReadOnly && clickedIndex === null) {
              handleReactionClick(index, emojiItem.unicode);
            }
          }}
        >
          <div className={b('subItem', { clicked: index === clickedIndex })}>
            <Emoji emoji={emojiItem.name} size={bigSize} />
          </div>
          <Emoji emoji={emojiItem.name} size={sizes.emoji.width} />
        </div>
      ))}
    </div>
  );
});
