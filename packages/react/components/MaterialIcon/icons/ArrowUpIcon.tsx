import React from 'react';

type PropsType = {
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const ArrowUpIcon = ({ color = '#fff', gradient, gradientId }: PropsType) => (
  <svg
    className="feather feather-arrow-up"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {gradient && <defs>{gradient}</defs>}
    <line stroke={gradient ? `url(#${gradientId})` : color} x1="12" x2="12" y1="19" y2="5" />
    <polyline points="5 12 12 5 19 12" stroke={gradient ? `url(#${gradientId})` : color} />
  </svg>
);
