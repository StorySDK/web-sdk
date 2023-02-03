import React from 'react';

type PropsType = {
  className?: string;
};

export const IconDecline = ({ className }: PropsType) => (
  <svg
    className={className}
    fill="none"
    height="20"
    stroke="black"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 3L10 10M3 17L10 10M10 10L3 3M10 10L17 17"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);
