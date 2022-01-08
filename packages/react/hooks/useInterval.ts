import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let id: any;

    if (delay) {
      id = setInterval(() => savedCallback.current(), delay);
    }

    return () => clearInterval(id);
  }, [delay]);
}
