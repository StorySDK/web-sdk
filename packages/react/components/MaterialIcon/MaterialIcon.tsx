import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import { nanoid } from 'nanoid';
import { BackgroundType } from '../../types';
import { MATERIAL_ICONS } from './_constants';
import './MaterialIcon.scss';

const CLASS_NAME = 'MaterialIcon';

type PropsType = {
  name: string;
  className?: string;
  size?: number | string;
  color?: string;
  background?: BackgroundType;
};

export const MaterialIcon = memo(
  ({
    name = 'ArrowCircleUpOutlineIcon',
    className,
    color,
    background,
    size = 'auto'
  }: PropsType) => {
    const Icon = useMemo(() => MATERIAL_ICONS[name], [name]);

    let gradient;
    const gradientId = useMemo(() => nanoid(), []);

    if (background?.type === 'gradient') {
      gradient = (
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={background.value[0]} />
          <stop offset="100%" stopColor={background.value[1]} />
        </linearGradient>
      );
    }

    if (Icon) {
      return (
        <span className={cn(`${CLASS_NAME}`, className)} style={{ width: size, height: size }}>
          <Icon color={color} gradient={gradient} gradientId={gradientId} />
        </span>
      );
    }

    return null;
  }
);
