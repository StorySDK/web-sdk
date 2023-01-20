import React from 'react';

type PropTypes = {
  className?: string;
};

export const IconIphoneBattery = ({ className }: PropTypes) => (
  <svg
    className={className}
    fill="none"
    height="12"
    viewBox="0 0 25 12"
    width="25"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      height="10.3333"
      opacity="0.35"
      rx="2.16667"
      stroke="white"
      width="21"
      x="0.833008"
      y="0.50293"
    />
    <path
      d="M23.333 3.66943V7.66943C24.1377 7.33066 24.661 6.54257 24.661 5.66943C24.661 4.7963 24.1377 4.00821 23.333 3.66943Z"
      fill="white"
      opacity="0.4"
    />
    <rect fill="white" height="7.33333" rx="1.33333" width="18" x="2.33301" y="2.00293" />
  </svg>
);
