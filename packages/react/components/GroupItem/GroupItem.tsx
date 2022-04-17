import React, { useCallback } from 'react';
import block from 'bem-cn';
import classNames from 'classnames';
import './GroupItem.scss';

const b = block('GroupSdkItem');

interface Props {
  index: number;
  groupTitleSize?: number;
  groupImageWidth?: number;
  groupImageHeight?: number;
  groupClassName?: string;
  imageUrl: string;
  title: string;
  type: 'circle' | 'square' | 'bigSquare' | 'rectangle';
  onClick?(index: number): void;
}

export const GroupItem: React.FunctionComponent<Props> = (props) => {
  const {
    imageUrl,
    title,
    type,
    index,
    groupClassName,
    groupTitleSize,
    groupImageWidth,
    groupImageHeight,
    onClick
  } = props;

  const BASE_CONTAINER_WIDTH_INDEX = 1.32;
  const BIG_SQUARE_CONTAINER_WIDTH_INDEX = 0.93;
  const RECTANGLE_CONTAINER_WIDTH_INDEX = 0.97;

  const BASE_IMAGE_WIDTH_INDEX = 0.88;
  const BIG_SQUARE_IMAGE_WIDTH_INDEX = 0.9;
  const RECTANGLE_IMAGE_WIDTH_INDEX = 0.9;

  const RECTANGLE_IMAGE_HEIGHT_INDEX = 1.26;

  const getContainerSize = useCallback(() => {
    if (groupImageWidth) {
      switch (type) {
        case 'bigSquare':
          return groupImageWidth * BIG_SQUARE_CONTAINER_WIDTH_INDEX;
        case 'rectangle':
          return groupImageWidth * RECTANGLE_CONTAINER_WIDTH_INDEX;
        default:
          return groupImageWidth * BASE_CONTAINER_WIDTH_INDEX;
      }
    }

    return undefined;
  }, [groupImageWidth, type]);

  const getImageSize = useCallback(
    (imageSize, isHeight = false) => {
      if (imageSize) {
        switch (type) {
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
    [type]
  );

  return (
    <button
      className={classNames(b({ type }).toString(), groupClassName || '')}
      style={{
        width: getContainerSize(),
        minHeight:
          type === 'rectangle' && groupImageWidth
            ? groupImageWidth * RECTANGLE_IMAGE_HEIGHT_INDEX
            : undefined
      }}
      onClick={() => onClick && onClick(index)}
    >
      <div
        className={b('imgContainer', { type })}
        style={{ width: groupImageWidth, height: type !== 'rectangle' ? groupImageHeight : 'auto' }}
      >
        <img
          alt=""
          className={b('img', { type })}
          src={imageUrl}
          style={{
            width: getImageSize(groupImageWidth),
            height: getImageSize(groupImageHeight, true)
          }}
        />
      </div>
      <div className={b('titleContainer', { type })}>
        <p
          className={b('title', { type })}
          style={{
            fontSize: groupTitleSize || undefined
          }}
        >
          {title}
        </p>
      </div>
    </button>
  );
};
