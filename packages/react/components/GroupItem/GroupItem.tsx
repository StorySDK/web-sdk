import React from 'react';
import block from 'bem-cn';
import './GroupItem.scss';

const b = block('GroupSdkItem');

interface Props {
  index: number;
  imageUrl: string;
  title: string;
  type: 'circle' | 'square' | 'bigSquare' | 'rectangle';
  onClick?(index: number): void;
}

export const GroupItem: React.FunctionComponent<Props> = (props) => {
  const { imageUrl, title, type, index, onClick } = props;

  return (
    <button className={b({ type })} onClick={() => onClick && onClick(index)}>
      <div className={b('imgContainer', { type })}>
        <img alt="" className={b('img', { type })} src={imageUrl} />
      </div>
      <div className={b('titleContainer', { type })}>
        <p className={b('title', { type })}>{title}</p>
      </div>
    </button>
  );
};
