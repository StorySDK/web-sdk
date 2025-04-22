import { useState, useEffect } from 'react';

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

export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isNativeEnvironment, setIsNativeEnvironment] = useState(false);

  // Check if we are in React Native environment
  useEffect(() => {
    const checkEnvironment = () => {
      const isInReactNativeWebView =
        typeof window !== 'undefined' && typeof window.ReactNativeWebView !== 'undefined';
      setIsNativeEnvironment(isInReactNativeWebView);

      // If we are in React Native, request the initial value
      if (isInReactNativeWebView && window.ReactNativeWebView) {
        try {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'storysdk:storage:get',
              data: { key }
            })
          );
        } catch (error) {
          console.log('Error requesting storage value:', error);
        }
      } else {
        // If we are in a regular browser, get the value from localStorage
        try {
          const item = safeGetItem(key);
          if (item && item.trim()) {
            try {
              setStoredValue(JSON.parse(item));
            } catch (parseError) {
              console.error(`Error parsing stored JSON for key "${key}":`, parseError);
              setStoredValue(initialValue);
            }
          }
        } catch (error) {
          console.log('Error accessing localStorage:', error);
        }
      }
    };

    checkEnvironment();

    // Handler for messages from React Native with storage data
    const handleStorageMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string' && !event.data.trim()) {
          return;
        }

        const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (
          message.type === 'storysdk:storage:response' &&
          message.data &&
          message.data.key === key
        ) {
          if (message.data.value !== null && message.data.value !== undefined) {
            setStoredValue(message.data.value);
          }
        }
      } catch (error) {
        console.log('Error parsing storage response:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleStorageMessage);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleStorageMessage);
      }
    };
  }, [key]);

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (
        isNativeEnvironment &&
        typeof window !== 'undefined' &&
        typeof window.ReactNativeWebView !== 'undefined' &&
        window.ReactNativeWebView
      ) {
        // If we are in React Native, send the value through the bridge
        try {
          const jsonData = JSON.stringify({
            type: 'storysdk:storage:set',
            data: {
              key,
              value: valueToStore
            }
          });
          window.ReactNativeWebView.postMessage(jsonData);
        } catch (jsonError) {
          console.error('Error stringifying data for React Native:', jsonError);
        }
      } else if (typeof window !== 'undefined') {
        // In a regular browser, use localStorage safely
        try {
          const jsonValue = JSON.stringify(valueToStore);
          safeSetItem(key, jsonValue);
        } catch (jsonError) {
          console.error('Error stringifying value for localStorage:', jsonError);
        }
      }
    } catch (error) {
      console.error('Error in setValue function:', error);
    }
  };

  return [storedValue, setValue];
};
