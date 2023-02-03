import React from 'react';

type PropsType = {
  className?: string;
};

export const IconArrowSend = ({ className }: PropsType) => (
  <svg
    className={className}
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g strokeWidth="2">
      <circle cx="16" cy="16" r="15" />
      <g strokeLinecap="round">
        <path d="m23 16-5.5-5.5" />
        <path d="m23 16-5.5 5.5" />
        <path d="m23 16h-14" />
      </g>
    </g>
  </svg>
);
