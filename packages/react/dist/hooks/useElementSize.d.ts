import { RefObject } from 'react';
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
export declare const useElementSize: <T extends HTMLElement>(elementRef: RefObject<T | null>, dependencies?: any[]) => ElementSize;
export {};
