export const writeToDebug = (message: string) => {
  console.log('StorySDK - Debug message:', message);

  const debugContainer = document.querySelector('#storysdk-debug');

  if (debugContainer) {
    const debugElement = document.createElement('pre');
    debugElement.innerHTML = `Debug message: ${message}`;
    debugContainer.appendChild(debugElement);
  }
};
