import React from 'react';
import cn from 'classnames';

type PropsType = {
  className: string;
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const IconChevronCircleUp = ({
  className,
  color = '#fff',
  gradient,
  gradientId
}: PropsType) => (
  <svg
    className={cn(className, 'stroke-current')}
    fill="none"
    height={18}
    viewBox="0 0 18 18"
    width={18}
    xmlns="http://www.w3.org/2000/svg"
  >
    {gradient && <defs>{gradient}</defs>}
    <circle cx={9} cy={9} r={8.5} stroke={gradient ? `url(#${gradientId})` : color} />
    <path
      d="M12 10L9 7l-3 3"
      stroke={gradient ? `url(#${gradientId})` : color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
    />
  </svg>
);
