import React from 'react';
import * as ReactDOM from 'react-dom';
// import { createRoot } from 'react-dom/client'; // Direct import as fallback for ES modules environment

// WeakSet to track roots that are currently unmounting
const unmountingRoots = new WeakSet();

// WeakMap to store roots for containers to avoid creating multiple roots for the same container
const containerRoots = new WeakMap<Element, any>();

let ReactDomClient: any = null;
let isReact18Plus: boolean = false;

const importReactDomClient = async () => {
  ReactDomClient = await import('react-dom/client');

  if (ReactDomClient && typeof ReactDomClient.createRoot === 'function') {
    return ReactDomClient;
  }

  return null;
};

// Safe require helper without eval
const safeRequire = (moduleName: string) => {
  try {
    // Use indirect require call to avoid bundler issues
    const req = typeof require !== 'undefined' ? require : null;
    return req ? req(moduleName) : null;
  } catch {
    return null;
  }
};

// Function to check if React 18+ createRoot API is supported
export const isReactDomClientAvailable = async (): Promise<boolean> => {
  // Fallback: check global ReactDOM for browser/CDN environment
  if (typeof window !== 'undefined' && (window as any).ReactDOM) {
    return typeof (window as any).ReactDOM.createRoot === 'function';
  }

  ReactDomClient = safeRequire('react-dom/client');

  if (ReactDomClient && typeof ReactDomClient.createRoot === 'function') {
    return true;
  }

  await importReactDomClient();

  if (ReactDomClient && typeof ReactDomClient.createRoot === 'function') {
    return true;
  }

  return false;
};

// Helper function for rendering in React 18+ and React 17
export const renderElement = async (element: React.ReactElement, container: Element): Promise<any> => {
  try {
    if (await isReactDomClientAvailable()) {
      isReact18Plus = true;
      let root = containerRoots.get(container);

      // Check if root exists and is not being unmounted
      if (root && unmountingRoots.has(root)) {
        // Root is being unmounted, remove it and create a new one
        containerRoots.delete(container);
        root = null;
      }

      if (!root) {
        if (!ReactDomClient && typeof window !== 'undefined' && (window as any).ReactDOM && (window as any).ReactDOM.createRoot) {
          ReactDomClient = (window as any).ReactDOM;
        }

        root = ReactDomClient.createRoot(container);
        containerRoots.set(container, root);
      }

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

  try {
    if (isReact18Plus && root && typeof root.unmount === 'function') {
      // React 18+ flow
      root.unmount();
      unmountingRoots.delete(root);

      // Remove the root from our container mapping when unmounting
      if (container) {
        containerRoots.delete(container);
      }
    }

    if (!isReact18Plus && container && typeof (ReactDOM as any).unmountComponentAtNode === 'function') {
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
