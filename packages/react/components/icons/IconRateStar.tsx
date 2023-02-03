import React from 'react';

type PropsType = {
  className?: string;
};

export const IconRateStar = ({ className }: PropsType) => (
  <svg className={className} viewBox="0 0 52 50" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M26 1L33.725 16.7981L51 19.347L38.5 31.6372L41.45 49L26 40.7981L10.55 49L13.5 31.6372L1 19.347L18.275 16.7981L26 1Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
