import React from 'react';

type PropsType = {
  className?: string;
};

export const IconStoryPause = ({ className }: PropsType) => (
  <svg
    className={className}
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.52011 3H7.47295C6.67406 3 6 3.6491 6 4.47295V19.527C6 20.3259 6.67406 21 7.47295 21H9.52011C10.319 21 10.9931 20.3259 10.9931 19.527V4.47295C10.9681 3.6491 10.319 3 9.52011 3Z"
      fill="white"
    />
    <path
      d="M17.2594 3H15.2122C14.4133 3 13.7393 3.6491 13.7393 4.47295V19.527C13.7393 20.3259 14.4133 21 15.2122 21H17.2594C18.0583 21 18.7323 20.3509 18.7323 19.527V4.47295C18.7323 3.6491 18.0832 3 17.2594 3Z"
      fill="white"
    />
  </svg>
);
