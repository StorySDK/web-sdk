import React, { useState, useEffect } from 'react';

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
          const item = window?.localStorage?.getItem(key);
          if (item) {
            setStoredValue(JSON.parse(item));
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    checkEnvironment();

    // Handler for messages from React Native with storage data
    const handleStorageMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
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
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'storysdk:storage:set',
            data: {
              key,
              value: valueToStore
            }
          })
        );
      } else if (typeof window !== 'undefined' && window.localStorage) {
        // In a regular browser, use localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
