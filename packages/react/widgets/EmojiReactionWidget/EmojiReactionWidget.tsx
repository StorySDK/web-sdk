import React, { useState, useCallback, useMemo } from 'react';
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
  params: EmojiReactionWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  isReadOnly?: boolean;
  onAnswer?(emoji: string): void;
}> = (props) => {
  const { params, position, positionLimits, isReadOnly, onAnswer } = props;

  const calculate = useCallback(
    (size) => {
      if (position && positionLimits) {
        return calculateElementSizeByHeight(position, positionLimits, size);
      }

      return size;
    },
    [position, positionLimits]
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

  const initEmojiSize = useMemo(() => elementSizes.emoji.width, [elementSizes]);

  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
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

  const handleReactionClick = (index: number, emoji: string) => {
    onAnswer?.(emoji);
    setIsToched(true);
    setClickedIndex(index);
    setBigSize(initEmojiSize);
    setDelay(50);
  };

  return (
    <div className={b({ color: params.color })} style={elementSizes.widget}>
      {params.emoji.map((emojiItem, index) => (
        <button
          className={b('item', { disabled: isReadOnly || isToched })}
          key={`${emojiItem.unicode}-${index}`}
          style={elementSizes.item}
          onClick={(e) => {
            e.preventDefault();

            if (!isToched && !isReadOnly) {
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
};
