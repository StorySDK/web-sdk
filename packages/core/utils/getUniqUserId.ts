import { nanoid } from 'nanoid';

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
  // For regular browser use localStorage
  if (typeof localStorage !== 'undefined' && localStorage.getItem('StorySdkUserId')) {
    return localStorage.getItem('StorySdkUserId');
  }
  const id = nanoid();
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('StorySdkUserId', id);
  }
  return id;
};
