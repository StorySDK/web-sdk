import React from 'react';

type PropsType = {
  color?: string;
  gradient?: any;
  gradientId?: string;
};

export const UploadOutlineIcon = ({ color = '#fff', gradient, gradientId }: PropsType) => (
  <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    {gradient && <defs>{gradient}</defs>}
    <g data-name="Layer 2">
      <g data-name="upload">
        <rect
          fill={gradient ? `url(#${gradientId})` : color}
          height="24"
          opacity="0"
          transform="rotate(180 12 12)"
          width="24"
        />
        <rect
          fill={gradient ? `url(#${gradientId})` : color}
          height="2"
          rx="1"
          ry="1"
          transform="rotate(180 12 5)"
          width="16"
          x="4"
          y="4"
        />
        <rect
          fill={gradient ? `url(#${gradientId})` : color}
          height="2"
          rx="1"
          ry="1"
          transform="rotate(90 19 6)"
          width="4"
          x="17"
          y="5"
        />
        <rect
          fill={gradient ? `url(#${gradientId})` : color}
          height="2"
          rx="1"
          ry="1"
          transform="rotate(90 5 6)"
          width="4"
          x="3"
          y="5"
        />
        <path
          d="M8 14a1 1 0 0 1-.8-.4 1 1 0 0 1 .2-1.4l4-3a1 1 0 0 1 1.18 0l4 2.82a1 1 0 0 1 .24 1.39 1 1 0 0 1-1.4.24L12 11.24 8.6 13.8a1 1 0 0 1-.6.2z"
          fill={gradient ? `url(#${gradientId})` : color}
        />
        <path
          d="M12 21a1 1 0 0 1-1-1v-8a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"
          fill={gradient ? `url(#${gradientId})` : color}
        />
      </g>
    </g>
  </svg>
);
