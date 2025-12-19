import {
  useState, useEffect, RefObject, useCallback,
} from 'react';

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

  const updateSize = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      const { width, height } = element.getBoundingClientRect();
      if (width !== size.width || height !== size.height) {
        setSize({ width, height });
      }
    }
  }, [elementRef, size.width, size.height]);

  // Update size on resize and on mount
  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      // Get initial size
      const { width, height } = element.getBoundingClientRect();
      if (width !== size.width || height !== size.height) {
        setSize({ width, height });
      }

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: w, height: h } = entry.contentRect;
          setSize({ width: w, height: h });
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
