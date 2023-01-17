import { useWindowSize } from '@react-hook/window-size';
import { useEffect, useState } from 'react';

const DEFAULT_WINDOW_HEIGHT = 696;

export const useAdaptiveValue = (initValue: number) => {
  const [, height] = useWindowSize();

  const index = initValue / DEFAULT_WINDOW_HEIGHT;

  const [cardSize, setCardSize] = useState(height);

  useEffect(() => {
    setCardSize(index * height);
  }, [height, index]);

  return cardSize;
};
