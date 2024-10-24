import React, { useCallback, useEffect } from 'react';
import block from 'bem-cn';
import classNames from 'classnames';
import { GroupType } from '../../types';
import './GroupItem.scss';

const b = block('GroupSdkItem');

interface Props {
  index: number;
  groupTitleSize?: number;
  groupImageWidth?: number;
  groupImageHeight?: number;
  groupClassName?: string;
  isChosen?: boolean;
  imageUrl: string;
  title: string;
  view: 'circle' | 'square' | 'bigSquare' | 'rectangle';
  type: GroupType;
  onClick?(index: number): void;
}

export const GroupItem: React.FunctionComponent<Props> = (props) => {
  const {
    imageUrl,
    title,
    view,
    index,
    type,
    groupClassName,
    groupTitleSize,
    groupImageWidth,
    groupImageHeight,
    isChosen,
    onClick
  } = props;

  const [titleHeight, setTitleHeight] = React.useState<string | number | undefined>(undefined);

  const titleRef = React.useRef<HTMLParagraphElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const BASE_CONTAINER_WIDTH_INDEX = 1.32;
  const BIG_SQUARE_CONTAINER_WIDTH_INDEX = 0.93;
  const RECTANGLE_CONTAINER_WIDTH_INDEX = 0.97;
  const BASE_IMAGE_WIDTH_INDEX = 0.88;
  const BIG_SQUARE_IMAGE_WIDTH_INDEX = 0.9;
  const RECTANGLE_IMAGE_WIDTH_INDEX = 0.9;
  const RECTANGLE_IMAGE_HEIGHT_INDEX = 1.26;

  useEffect(() => {
    if (
      titleRef.current &&
      btnRef.current &&
      titleRef.current.offsetHeight > btnRef.current.offsetHeight &&
      (view === 'rectangle' || view === 'bigSquare')
    ) {
      setTitleHeight('100%');
    }
  }, [view]);

  const getContainerSize = useCallback(
    (isHeight?: boolean) => {
      if (groupImageWidth) {
        switch (view) {
          case 'bigSquare':
            return groupImageWidth * BIG_SQUARE_CONTAINER_WIDTH_INDEX;
          case 'rectangle':
            return groupImageWidth * RECTANGLE_CONTAINER_WIDTH_INDEX;
          default:
            return isHeight ? undefined : groupImageWidth * BASE_CONTAINER_WIDTH_INDEX;
        }
      }

      return undefined;
    },
    [groupImageWidth, view]
  );

  const getImageSize = useCallback(
    (imageSize, isHeight = false) => {
      if (imageSize) {
        switch (view) {
          case 'bigSquare':
            return imageSize * BIG_SQUARE_IMAGE_WIDTH_INDEX;
          case 'rectangle':
            return isHeight
              ? imageSize * RECTANGLE_IMAGE_HEIGHT_INDEX
              : imageSize * RECTANGLE_IMAGE_WIDTH_INDEX;
          default:
            return imageSize * BASE_IMAGE_WIDTH_INDEX;
        }
      }

      return undefined;
    },
    [view]
  );

  return (
    <button
      className={classNames(b({ view, type, chosen: isChosen }).toString(), groupClassName || '')}
      ref={btnRef}
      style={{
        width: getContainerSize(),
        height:
          view === 'rectangle' && groupImageWidth
            ? groupImageWidth * RECTANGLE_IMAGE_HEIGHT_INDEX
            : getContainerSize(true)
      }}
      onClick={() => onClick && onClick(index)}
    >
      <div
        className={b('imgContainer', { view, type })}
        style={{ width: groupImageWidth, height: view !== 'rectangle' ? groupImageHeight : 'auto' }}
      >
        <img
          alt=""
          className={b('img', { view })}
          src={imageUrl}
          style={{
            width: getImageSize(groupImageWidth),
            height: getImageSize(groupImageHeight, true)
          }}
        />
      </div>
      <div className={b('titleContainer', { view })}>
        <p
          className={b('title', { view })}
          ref={titleRef}
          style={{
            fontSize: groupTitleSize || undefined,
            height: titleHeight
          }}
        >
          {title}
        </p>
      </div>
    </button>
  );
};
