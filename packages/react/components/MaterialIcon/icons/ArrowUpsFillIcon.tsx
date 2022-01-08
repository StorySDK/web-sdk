import React from 'react';

type PropsType = {
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const ArrowUpsFillIcon = ({ color = '#fff', gradient, gradientId }: PropsType) => (
  <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    {gradient && <defs>{gradient}</defs>}
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 8l6 6H6z" fill={gradient ? `url(#${gradientId})` : color} />
  </svg>
);
