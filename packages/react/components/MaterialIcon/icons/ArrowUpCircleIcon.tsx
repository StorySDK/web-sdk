import React from 'react';

type PropsType = {
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const ArrowUpCircleIcon = ({ color = '#fff', gradient, gradientId }: PropsType) => (
  <svg
    className="feather feather-arrow-up-circle"
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
    <circle cx="12" cy="12" r="10" stroke={gradient ? `url(#${gradientId})` : color} />
    <polyline points="16 12 12 8 8 12" stroke={gradient ? `url(#${gradientId})` : color} />
    <line stroke={gradient ? `url(#${gradientId})` : color} x1="12" x2="12" y1="16" y2="8" />
  </svg>
);
