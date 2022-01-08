import React from 'react';

type PropsType = {
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const ArrowUpOutlineIcon = ({ color = '#fff', gradient, gradientId }: PropsType) => (
  <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    {gradient && <defs>{gradient}</defs>}
    <g data-name="Layer 2">
      <g data-name="arrow-up">
        <rect height="24" opacity="0" transform="rotate(90 12 12)" width="24" />
        <path
          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1 2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1zM8 14h7.9L12 9.18z"
          fill={gradient ? `url(#${gradientId})` : color}
        />
      </g>
    </g>
  </svg>
);
