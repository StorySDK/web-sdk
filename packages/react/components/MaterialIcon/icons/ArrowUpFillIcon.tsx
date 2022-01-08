import React from 'react';

type PropsType = {
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const ArrowUpFillIcon = ({ color = '#fff', gradient, gradientId }: PropsType) => (
  <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    {gradient && <defs>{gradient}</defs>}
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M13 12v8h-2v-8H4l8-8 8 8z" fill={gradient ? `url(#${gradientId})` : color} />
  </svg>
);
