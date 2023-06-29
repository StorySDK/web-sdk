import React from 'react';

type PropsType = {
  className?: string;
};

export const IconLoader = ({ className }: PropsType) => (
  <svg
    className={className}
    fill="none"
    height="69"
    viewBox="0 0 68 69"
    width="68"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_3254_16668)" opacity="0.8">
      <path
        d="M17.9999 61.7127C2.71925 52.8904 -2.53519 33.2806 6.28711 17.9999C6.80672 17.0999 7.95793 16.791 8.85845 17.3109C9.75897 17.8308 10.067 18.9823 9.54744 19.8823C1.76313 33.3651 6.39892 50.6678 19.8823 58.4524C33.3656 66.237 50.6681 61.6004 58.4524 48.1176C66.2367 34.6347 61.6009 17.3321 48.1176 9.54744C43.1491 6.67887 37.5114 5.39943 31.8147 5.84619C30.7781 5.92837 29.8731 5.15261 29.7909 4.11739C29.7092 3.08112 30.484 2.17421 31.5205 2.0934C37.9797 1.58589 44.3697 3.0365 49.9999 6.28711C65.2806 15.1094 70.535 34.7192 61.7127 49.9999C52.8904 65.2806 33.2806 70.535 17.9999 61.7127Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="67.9991"
        id="filter0_d_3254_16668"
        width="67.9872"
        x="0.00634766"
        y="0.994385"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="1" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
        <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3254_16668" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_3254_16668"
          mode="normal"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
