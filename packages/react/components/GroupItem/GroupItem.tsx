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
  activeGroupOutlineColor?: string;
  groupsOutlineColor?: string;
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
    activeGroupOutlineColor,
    groupsOutlineColor,
    groupTitleSize,
    groupImageWidth,
    groupImageHeight,
    isChosen,
    onClick
  } = props;

  const [titleHeight, setTitleHeight] = React.useState<string | number | undefined>(undefined);
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

  const titleRef = React.useRef<HTMLParagraphElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const BASE_CONTAINER_WIDTH_INDEX = 1.32;
  const BIG_SQUARE_CONTAINER_WIDTH_INDEX = 0.93;
  const RECTANGLE_CONTAINER_WIDTH_INDEX = 0.97;
  const BASE_IMAGE_WIDTH_INDEX = 0.88;
  const BIG_SQUARE_IMAGE_WIDTH_INDEX = 0.9;
  const RECTANGLE_IMAGE_WIDTH_INDEX = 0.9;
  const RECTANGLE_IMAGE_HEIGHT_INDEX = 1.26;
  const BIG_SQUARE_DEFAULT_HEIGHT = 84;

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
      switch (view) {
        case 'bigSquare':
          return groupImageWidth
            ? groupImageWidth * BIG_SQUARE_CONTAINER_WIDTH_INDEX
            : BIG_SQUARE_DEFAULT_HEIGHT;
        case 'rectangle':
          if (groupImageWidth && !isHeight) {
            return groupImageWidth * RECTANGLE_IMAGE_HEIGHT_INDEX;
          }

          if (isHeight && !groupImageHeight) {
            return BIG_SQUARE_DEFAULT_HEIGHT;
          }

          return groupImageWidth ? groupImageWidth * RECTANGLE_CONTAINER_WIDTH_INDEX : undefined;
        default:
          if (groupImageWidth && !isHeight) {
            return groupImageWidth * BASE_CONTAINER_WIDTH_INDEX;
          }

          return undefined;
      }
    },
    [groupImageWidth, view]
  );

  const getImageSize = useCallback(
    (imageSize, isHeight = false) => {
      switch (view) {
        case 'bigSquare':
          return imageSize ? imageSize * BIG_SQUARE_IMAGE_WIDTH_INDEX : undefined;
        case 'rectangle':
          if (imageSize) {
            return isHeight
              ? imageSize * RECTANGLE_IMAGE_HEIGHT_INDEX
              : imageSize * RECTANGLE_IMAGE_WIDTH_INDEX;
          }
          return undefined;

        default:
          return imageSize ? imageSize * BASE_IMAGE_WIDTH_INDEX : undefined;
      }
    },
    [view]
  );

  const getOulineColor = () => {
    if ((isChosen || isHovered) && activeGroupOutlineColor) {
      return activeGroupOutlineColor;
    }

    if (groupsOutlineColor && !isChosen && !isHovered) {
      return groupsOutlineColor;
    }

    return undefined;
  };

  return (
    <button
      className={classNames(b({ view, type, chosen: isChosen }).toString(), groupClassName || '')}
      ref={btnRef}
      style={{
        width: getContainerSize(),
        height: getContainerSize(true)
      }}
      onClick={() => onClick && onClick(index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={b('imgContainer', { view, type })}
        style={{
          width: groupImageWidth,
          height: view !== 'rectangle' ? groupImageHeight : BIG_SQUARE_DEFAULT_HEIGHT
        }}
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
        <div
          className={b('outline', {
            background: !activeGroupOutlineColor && !groupsOutlineColor,
            border: !!activeGroupOutlineColor || !!groupsOutlineColor,
            view
          })}
          style={{
            borderColor: getOulineColor()
          }}
        />
      </div>
      <div className={b('titleContainer', { view })}>
        <p
          className={b('title', { view })}
          ref={titleRef}
          style={{
            fontSize: groupTitleSize || undefined,
            height: titleHeight,
            color:
              (isChosen || isHovered) && view !== 'rectangle' && view !== 'bigSquare'
                ? getOulineColor()
                : undefined
          }}
        >
          {title}
        </p>
      </div>
    </button>
  );
};
