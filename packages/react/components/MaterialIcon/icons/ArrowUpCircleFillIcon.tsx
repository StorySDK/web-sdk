import React from 'react';

type PropsType = {
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const ArrowUpCircleFillIcon = ({ color = '#fff', gradient, gradientId }: PropsType) => (
  <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    {gradient && <defs>{gradient}</defs>}
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm1 10h3l-4-4-4 4h3v4h2v-4z"
      fill={gradient ? `url(#${gradientId})` : color}
    />
  </svg>
);
