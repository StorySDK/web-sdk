import React from 'react';
import * as ReactDOM from 'react-dom';
// import { createRoot } from 'react-dom/client'; // Direct import as fallback for ES modules environment

// WeakSet to track roots that are currently unmounting
const unmountingRoots = new WeakSet();

// WeakMap to store roots for containers to avoid creating multiple roots for the same container
const containerRoots = new WeakMap<Element, any>();

let ReactDomClient: any = null;
let isReact18PlusDetected: boolean = false;

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
    const hasReact18Api = await isReactDomClientAvailable();

    if (hasReact18Api) {
      isReact18PlusDetected = true;
      let root = containerRoots.get(container);

      // Check if root exists and is not being unmounted
      if (root && unmountingRoots.has(root)) {
        // Root is being unmounted, remove it and create a new one
        containerRoots.delete(container);
        root = null;
      }

      if (!root) {
        // Check if container already has a React root mounted by another instance
        const hasExistingReactRoot = container.hasAttribute('data-reactroot')
          || container.querySelector('[data-reactroot]');

        if (hasExistingReactRoot) {
          console.warn('StorySDK: Container already has a React root from another instance, skipping createRoot');
          return null;
        }

        // Ensure we have ReactDomClient available
        if (!ReactDomClient) {
          if (typeof window !== 'undefined' && (window as any).ReactDOM && (window as any).ReactDOM.createRoot) {
            ReactDomClient = (window as any).ReactDOM;
          } else {
            ReactDomClient = await importReactDomClient();
          }
        }

        if (ReactDomClient && typeof ReactDomClient.createRoot === 'function') {
          try {
            root = ReactDomClient.createRoot(container);

            // Validate that the created root has the expected methods
            if (root && typeof root.render === 'function' && typeof root.unmount === 'function') {
              containerRoots.set(container, root);
            } else {
              console.error('StorySDK: Created root is missing required methods:', {
                hasRender: typeof root.render === 'function',
                hasUnmount: typeof root.unmount === 'function',
                rootType: typeof root,
              });
              return null;
            }
          } catch (createRootError) {
            console.error('StorySDK: Error creating root:', createRootError);
            return null;
          }
        } else {
          console.error('StorySDK: ReactDomClient.createRoot is not available');
          return null;
        }
      }

      if (root && typeof root.render === 'function') {
        root.render(element);
        return root;
      }
      console.error('StorySDK: Invalid root object created');
      return null;
    }

    // React 17 fallback - use legacy render if available
    if (typeof (ReactDOM as any).render === 'function') {
      // Clear container first for React 17 to prevent conflicts
      // container.innerHTML = '';

      // eslint-disable-next-line react/no-deprecated
      (ReactDOM as any).render(element, container);
      return { isLegacyRoot: true, container }; // Return special object for React 17
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

// Helper function to check if React 18+ is being used
export const isReact18Plus = (): boolean => isReact18PlusDetected;

// Universal helper function for safe unmounting in React 18+ and React 17
export const unmountComponent = async (container?: Element | null, root?: any): Promise<void> => {
  // Prevent duplicate unmounting
  if (root && unmountingRoots.has(root)) {
    return;
  }

  if (root) {
    unmountingRoots.add(root);
  }

  let unmountSuccessful = false;

  try {
    // Check if React 18+ createRoot API is available first
    const hasReact18Api = await isReactDomClientAvailable();

    // Handle React 17 legacy root object
    if (root && root.isLegacyRoot && root.container) {
      if (!hasReact18Api && typeof (ReactDOM as any).unmountComponentAtNode === 'function') {
        try {
          // eslint-disable-next-line react/no-deprecated
          const result = (ReactDOM as any).unmountComponentAtNode(root.container);
          if (root) {
            unmountingRoots.delete(root);
          }
          if (result) {
            unmountSuccessful = true;
            return;
          }
        } catch (legacyError) {
          console.warn('StorySDK: React 17 unmount failed:', legacyError);
        }
      }
    }

    // Try React 18+ unmount first if we have a proper root with unmount method
    if (hasReact18Api && root && typeof root.unmount === 'function') {
      try {
        root.unmount();
        unmountingRoots.delete(root);

        // Remove the root from our container mapping when unmounting
        if (container) {
          containerRoots.delete(container);
        }
        unmountSuccessful = true;
        return;
      } catch (unmountError) {
        console.warn('StorySDK: Error during React 18+ unmount:', unmountError);
        // Continue to other unmount methods
      }
    }

    // Try to find and unmount existing root from container mapping if we have container
    if (hasReact18Api && container) {
      const existingRoot = containerRoots.get(container);
      if (existingRoot && typeof existingRoot.unmount === 'function') {
        try {
          existingRoot.unmount();
          containerRoots.delete(container);
          if (root) {
            unmountingRoots.delete(root);
          }
          unmountSuccessful = true;
          return;
        } catch (unmountError) {
          console.warn('StorySDK: Error during container root unmount:', unmountError);
          // Continue to other unmount methods
        }
      }
    }

    // If we have React 18 but no container and root without unmount method, try to force unmount
    if (hasReact18Api && !container && root && typeof root.unmount !== 'function') {
      // This case happens when root object is corrupted or not a proper React 18 root
      // We can't do much without container, just clean up tracking
      console.warn('StorySDK: Invalid root object without unmount method, cleaning up tracking', {
        rootType: typeof root,
        rootConstructor: root?.constructor?.name,
        rootKeys: root ? Object.keys(root) : [],
        hasRender: typeof root.render === 'function',
      });
      unmountingRoots.delete(root);
      unmountSuccessful = true; // Mark as successful to avoid further warnings
      return;
    }

    // Fallback: Try React 17 unmount if available and we have container
    if (container && typeof (ReactDOM as any).unmountComponentAtNode === 'function') {
      try {
        // eslint-disable-next-line react/no-deprecated
        const result = (ReactDOM as any).unmountComponentAtNode(container);

        if (root) {
          unmountingRoots.delete(root);
        }

        // Remove from container mapping
        containerRoots.delete(container);

        // unmountComponentAtNode returns true if a component was unmounted
        if (result) {
          unmountSuccessful = true;
          return;
        }
      } catch (legacyError) {
        console.warn('StorySDK: React 17 fallback unmount failed:', legacyError);
      }
    }

    // Last resort: try to clean container content if nothing else worked
    if (!unmountSuccessful && container) {
      try {
        container.innerHTML = '';
        containerRoots.delete(container);
        if (root) {
          unmountingRoots.delete(root);
        }
        unmountSuccessful = true;
        console.warn('StorySDK: Used innerHTML cleanup as fallback');
        return;
      } catch (cleanupError) {
        console.warn('StorySDK: Fallback cleanup failed:', cleanupError);
      }
    }

    // If we reach here and haven't successfully unmounted, log a warning
    if (!unmountSuccessful) {
      console.warn('StorySDK: No valid unmount method found', {
        hasContainer: !!container,
        hasRoot: !!root,
        rootType: root ? typeof root : 'none',
        hasUnmountMethod: root ? typeof root.unmount : 'none',
        hasReact18Api,
        isLegacyRoot: root ? !!root.isLegacyRoot : false,
        rootHasOwnUnmount: root && Object.prototype.hasOwnProperty.call(root, 'unmount'),
        rootPrototype: root ? Object.getPrototypeOf(root)?.constructor?.name : 'none',
      });
    }
  } catch (error) {
    // Handle unmount errors gracefully
    console.warn('StorySDK: Error during unmount:', error);
  } finally {
    // Clean up tracking in all cases
    if (root) {
      unmountingRoots.delete(root);
    }

    // Clean up the container mapping in case of error
    if (container) {
      containerRoots.delete(container);
    }
  }
};
