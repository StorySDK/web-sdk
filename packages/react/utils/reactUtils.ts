import React from 'react';
import ReactDOMClient from 'react-dom/client';
import * as ReactDOM from 'react-dom';

// WeakSet to track roots that are currently unmounting
const unmountingRoots = new WeakSet();

// WeakMap to store roots for containers to avoid creating multiple roots for the same container
const containerRoots = new WeakMap<Element, any>();

// Function to check if React 18+ createRoot API is supported
export const isReact18Plus = (): boolean => !!(typeof ReactDOMClient === 'object'
  && typeof ReactDOMClient.createRoot === 'function');

// Helper function for rendering in React 18+ and React 17
export const renderElement = (element: React.ReactElement, container: Element): any => {
  try {
    if (isReact18Plus()) {
      // React 18+ flow
      let root = containerRoots.get(container);

      // Check if root exists and is not being unmounted
      if (root && unmountingRoots.has(root)) {
        // Root is being unmounted, remove it and create a new one
        containerRoots.delete(container);
        root = null;
      }

      if (!root) {
        // Create new root only if one doesn't exist for this container
        root = ReactDOMClient.createRoot(container);
        containerRoots.set(container, root);
      }

      // Render the element using existing or new root
      root.render(element);
      return root;
    }

    // React 17 fallback - use legacy render if available
    if (typeof (ReactDOM as any).render === 'function') {
      // Clear container first for React 17 to prevent conflicts
      // container.innerHTML = '';

      // eslint-disable-next-line react/no-deprecated
      (ReactDOM as any).render(element, container);
      return container; // Return container as "root" for React 17
    }

    console.error('StorySDK: No suitable render method found');
    return null;
  } catch (error) {
    console.error('StorySDK: Error during render:', error);

    // Try to clean up on error
    try {
      if (container) {
        containerRoots.delete(container);
      }
    } catch (cleanupError) {
      console.warn('StorySDK: Error during cleanup:', cleanupError);
    }

    return null;
  }
};

// Universal helper function for safe unmounting in React 18+ and React 17
export const unmountComponent = (container?: Element | null, root?: any): void => {
  // Prevent duplicate unmounting
  if (root && unmountingRoots.has(root)) {
    return;
  }

  if (root) {
    unmountingRoots.add(root);
  }

  // Immediate synchronous unmounting for better reliability
  try {
    if (isReact18Plus() && root && typeof root.unmount === 'function') {
      // React 18+ flow
      root.unmount();
      unmountingRoots.delete(root);

      // Remove the root from our container mapping when unmounting
      if (container) {
        containerRoots.delete(container);
      }
      return;
    }

    if (!isReact18Plus() && container && typeof (ReactDOM as any).unmountComponentAtNode === 'function') {
      // React 17 fallback
      // eslint-disable-next-line react/no-deprecated
      (ReactDOM as any).unmountComponentAtNode(container);
      if (root) {
        unmountingRoots.delete(root);
      }
      return;
    }

    console.warn('StorySDK: No valid unmount method found');
  } catch (error) {
    // Handle unmount errors gracefully
    console.warn('StorySDK: Error during unmount:', error);

    // Clean up tracking even on error
    if (root) {
      unmountingRoots.delete(root);
    }

    // Still clean up the container mapping in case of error
    if (container) {
      containerRoots.delete(container);
    }
  }
};
