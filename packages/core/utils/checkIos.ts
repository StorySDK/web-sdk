export const checkIos = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};
