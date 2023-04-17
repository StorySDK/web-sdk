import React, { useState, useCallback, useMemo, useContext } from 'react';
import { Emoji } from 'emoji-mart';
import { block, calculateElementSizeByHeight, getScalableValue } from '@utils';
import {
  EmojiReactionWidgetParamsType,
  WidgetComponent,
  WidgetPositionType,
  WidgetPositionLimitsType
} from '@types';
import { useInterval } from '@hooks';
import './EmojiReactionWidget.scss';
import { StoryContext } from '@components';

const b = block('EmojiReactionWidget');

const INIT_ELEMENT_STYLES = {
  widget: {
    borderRadius: 50,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 11,
    paddingLeft: 11
  },
  emoji: {
    width: 34
  },
  item: {
    marginRight: 11,
    marginLeft: 11
  }
};

export const EmojiReactionWidget: WidgetComponent<{
  id: string;
  params: EmojiReactionWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(emoji: string): void;
}> = React.memo((props) => {
  const { id, params, position, positionLimits, isReadOnly, onAnswer } = props;

  const calculate = useCallback(
    (size) => {
      if (position?.height && positionLimits?.minHeight) {
        return calculateElementSizeByHeight(position.height, size, positionLimits.minHeight);
      }

      return size;
    },
    [position?.height, positionLimits?.minHeight]
  );

  const elementSizes = useMemo(
    () => ({
      widget: {
        borderRadius: calculate(INIT_ELEMENT_STYLES.widget.borderRadius),
        paddingTop: calculate(INIT_ELEMENT_STYLES.widget.paddingTop),
        paddingBottom: calculate(INIT_ELEMENT_STYLES.widget.paddingBottom),
        paddingRight: calculate(INIT_ELEMENT_STYLES.widget.paddingRight),
        paddingLeft: calculate(INIT_ELEMENT_STYLES.widget.paddingLeft)
      },
      emoji: {
        width: calculate(INIT_ELEMENT_STYLES.emoji.width)
      },
      item: {
        marginRight: calculate(INIT_ELEMENT_STYLES.item.marginRight),
        marginLeft: calculate(INIT_ELEMENT_STYLES.item.marginLeft)
      }
    }),
    [calculate]
  );

  const storyContextVal = useContext(StoryContext);

  const initEmojiSize = useMemo(() => elementSizes.emoji.width, [elementSizes]);

  const answerFromCache = storyContextVal.getAnswerCache
    ? storyContextVal.getAnswerCache(id)
    : null;

  const [clickedIndex, setClickedIndex] = useState<number | null>(answerFromCache);
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
      onAnswer?.(emoji);

      if (storyContextVal.setAnswerCache && id) {
        storyContextVal.setAnswerCache(id, index);
      }

      setIsToched(true);
      setClickedIndex(index);
      setBigSize(initEmojiSize);
      setDelay(50);
    },
    [id, initEmojiSize, onAnswer, storyContextVal]
  );

  return (
    <div className={b({ color: params.color })} style={elementSizes.widget}>
      {params.emoji.map((emojiItem, index) => (
        <button
          className={b('item', { disabled: isReadOnly || isToched || clickedIndex !== null })}
          key={`${emojiItem.unicode}-${index}`}
          style={elementSizes.item}
          onClick={(e) => {
            e.preventDefault();

            if (!isToched && !isReadOnly && clickedIndex === null) {
              handleReactionClick(index, emojiItem.unicode);
            }
          }}
        >
          <div className={b('subItem', { clicked: index === clickedIndex })}>
            <Emoji emoji={emojiItem.name} set="apple" size={bigSize} />
          </div>
          <Emoji emoji={emojiItem.name} set="apple" size={elementSizes.emoji.width} />
        </button>
      ))}
    </div>
  );
});
