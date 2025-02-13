import React from 'react';

type PropsType = {
  className?: string;
  stroke?: string;
};

export const IconArrow = ({ className, stroke }: PropsType) => (
  <svg
    className={className}
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12H5"
      stroke={stroke ?? '#FAFAFA'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M12 19L5 12L12 4.99997"
      stroke={stroke ?? '#FAFAFA'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
