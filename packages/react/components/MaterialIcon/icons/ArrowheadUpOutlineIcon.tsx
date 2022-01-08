import React from 'react';

type PropsType = {
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const ArrowheadUpOutlineIcon = ({ color = '#fff', gradient, gradientId }: PropsType) => (
  <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    {gradient && <defs>{gradient}</defs>}
    <g data-name="Layer 2">
      <g data-name="arrowhead-up">
        <rect height="24" opacity="0" transform="rotate(180 12 12)" width="24" />
        <path
          d="M6.63 11.61L12 7.29l5.37 4.48A1 1 0 0 0 18 12a1 1 0 0 0 .77-.36 1 1 0 0 0-.13-1.41l-6-5a1 1 0 0 0-1.27 0l-6 4.83a1 1 0 0 0-.15 1.41 1 1 0 0 0 1.41.14z"
          fill={gradient ? `url(#${gradientId})` : color}
        />
        <path
          d="M12.64 12.23a1 1 0 0 0-1.27 0l-6 4.83a1 1 0 0 0-.15 1.41 1 1 0 0 0 1.41.15L12 14.29l5.37 4.48A1 1 0 0 0 18 19a1 1 0 0 0 .77-.36 1 1 0 0 0-.13-1.41z"
          fill={gradient ? `url(#${gradientId})` : color}
        />
      </g>
    </g>
  </svg>
);
