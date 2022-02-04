import React from 'react';
import block from 'bem-cn';
import './GroupItem.scss';

const b = block('GroupSdkItem');

interface Props {
  index: number;
  imageUrl: string;
  title: string;
  theme: 'light' | 'dark';
  size: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  onClick?(index: number): void;
}

export const GroupItem: React.FunctionComponent<Props> = (props) => {
  const { imageUrl, size, title, theme, rounded, index, onClick } = props;

  return (
    <button className={b()} onClick={() => onClick && onClick(index)}>
      <div className={b('imgWrapper')}>
        <img alt="group" className={b('img', { size, rounded })} src={imageUrl} />
      </div>
      <div className={b('title', { theme })}>{title}</div>
    </button>
  );
};
