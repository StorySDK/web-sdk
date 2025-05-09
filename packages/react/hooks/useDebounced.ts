import { useState, useEffect } from 'react';

/**
 * Hook for getting a debounced version of a value
 * @param value - initial value
 * @param delay - delay in milliseconds
 * @returns debounced value
 */
export function useDebounced<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
