import { useState, useEffect, RefObject } from 'react';

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Hook for tracking DOM element dimensions
 * @param elementRef Reference to the DOM element being tracked
 * @param dependencies Array of dependencies for recreating the ResizeObserver
 * @returns Object with current element dimensions { width, height }
 */
export const useElementSize = <T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  dependencies: any[] = [],
): ElementSize => {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.unobserve(element);
      };
    }

    return undefined;
  }, [elementRef, ...dependencies]);

  return size;
};
