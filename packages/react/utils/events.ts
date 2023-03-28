export const eventSubscribe = (eventName: string, listener: (params?: any) => void) => {
  document.addEventListener(eventName, listener);
};

export const eventUnsubscribe = (eventName: string, listener: (params?: any) => void) => {
  document.removeEventListener(eventName, listener);
};

export const eventPublish = (eventName: string, data?: any) => {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
};
