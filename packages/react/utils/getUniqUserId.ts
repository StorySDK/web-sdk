import { nanoid } from 'nanoid';

// Safe check for localStorage availability
const isLocalStorageAvailable = () => {
  try {
    // Try to use localStorage by setting and getting a test item
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    // If any error occurs, localStorage is not available
    return false;
  }
};

// In-memory fallback when localStorage is not available
const memoryStorage: Record<string, string> = {};

// Safe get item function
const safeGetItem = (key: string): string | null => {
  if (isLocalStorageAvailable()) {
    return localStorage.getItem(key);
  }
  return memoryStorage[key] || null;
};

// Safe set item function
const safeSetItem = (key: string, value: string): void => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(key, value);
  } else {
    memoryStorage[key] = value;
  }
};

export const getUniqUserId = () => {
  // Check if we are in React Native WebView
  const isInReactNativeWebView =
    typeof window !== 'undefined' && typeof window.ReactNativeWebView !== 'undefined';

  if (isInReactNativeWebView) {
    // Create Promise to get value from React Native
    return new Promise((resolve) => {
      // Create handler for receiving user ID
      const handleStorageMessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          if (
            message.type === 'storysdk:storage:response' &&
            message.data &&
            message.data.key === 'StorySdkUserId'
          ) {
            window.removeEventListener('message', handleStorageMessage);

            if (message.data.value) {
              resolve(message.data.value);
            } else {
              // If ID doesn't exist, create a new one
              const id = nanoid();
              // Save ID through React Native
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'storysdk:storage:set',
                    data: {
                      key: 'StorySdkUserId',
                      value: id
                    }
                  })
                );
              }
              resolve(id);
            }
          }
        } catch (error) {
          console.log('Error parsing storage response:', error);
        }
      };

      // Add message handler
      window.addEventListener('message', handleStorageMessage);

      // Request user ID from React Native
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'storysdk:storage:get',
            data: { key: 'StorySdkUserId' }
          })
        );
      }

      // Set timeout to avoid waiting indefinitely
      setTimeout(() => {
        window.removeEventListener('message', handleStorageMessage);
        const id = nanoid();
        // Save ID through React Native
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'storysdk:storage:set',
              data: {
                key: 'StorySdkUserId',
                value: id
              }
            })
          );
        }
        resolve(id);
      }, 1000);
    });
  }

  // Use safe localStorage functions to handle Safari in private mode
  const existingId = safeGetItem('StorySdkUserId');
  if (existingId) {
    return existingId;
  }

  const id = nanoid();
  safeSetItem('StorySdkUserId', id);
  return id;
};
