export const writeToDebug = (message: string) => {
  console.log('StorySDK - Debug message:', message);

  const debugContainer = document.querySelector('#storysdk-debug');

  if (debugContainer) {
    const debugElement = document.createElement('pre');
    debugElement.innerHTML = `Debug message: ${message}`;
    debugContainer.appendChild(debugElement);
  }

  const isInReactNativeWebView = typeof window !== 'undefined'
    && window.ReactNativeWebView !== undefined
    && typeof window.ReactNativeWebView?.postMessage === 'function';

  if (isInReactNativeWebView && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'storysdk:debug:info',
      data: {
        message: `Debug message: ${message}`,
        timestamp: new Date().toISOString(),
      },
    }));
  }
};
