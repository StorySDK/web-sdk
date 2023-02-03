import React from 'react';

type PropsType = {
  className?: string;
};

export const IconConfirm = ({ className }: PropsType) => (
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
      d="M1.5 9.5C3.66667 11.6667 9 17 9 17L18.5 3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);
