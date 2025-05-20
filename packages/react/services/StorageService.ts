// Type for cached data
export interface CachedData<T> {
  data: T;
  lastModified?: string;
}

// Interface for storage adapter
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

// Check if we're running in a React Native WebView
const isInReactNativeWebView = typeof window !== 'undefined'
  && typeof window.ReactNativeWebView !== 'undefined';

// Storage request callbacks map
const storageCallbacks: Record<string, (value: string | null) => void> = {};
let callbackId = 0;

// Setup listener for storage responses if in React Native WebView
if (isInReactNativeWebView) {
  window.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'storysdk:storage:response' && message.callbackId) {
        const callback = storageCallbacks[message.callbackId];
        if (callback) {
          callback(message.data.value);
          delete storageCallbacks[message.callbackId];
        }
      }
    } catch (error) {
      console.error('StorySDK - Error processing storage response:', error);
    }
  });
}

// Default storage adapter using localStorage for browser
const webStorageAdapter: StorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('StorySDK - Error accessing localStorage:', error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('StorySDK - Error saving to localStorage:', error);
    }
  },
};

// React Native WebView storage adapter using postMessage
const reactNativeWebViewAdapter: StorageAdapter = {
  getItem: async (key: string): Promise<string | null> => new Promise((resolve) => {
    const id = String(callbackId);
    callbackId += 1;
    storageCallbacks[id] = resolve;

    try {
      window.ReactNativeWebView!.postMessage(JSON.stringify({
        type: 'storysdk:storage:get',
        callbackId: id,
        data: { key },
      }));
    } catch (error) {
      console.error('StorySDK - Error requesting storage value:', error);
      delete storageCallbacks[id];
      resolve(null);
    }
  }),

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      window.ReactNativeWebView!.postMessage(JSON.stringify({
        type: 'storysdk:storage:set',
        data: { key, value },
      }));
    } catch (error) {
      console.error('StorySDK - Error setting storage value:', error);
    }
  },
};

// Use the appropriate adapter based on environment
const storageAdapter: StorageAdapter = isInReactNativeWebView && typeof window.ReactNativeWebView !== 'undefined'
  ? reactNativeWebViewAdapter
  : webStorageAdapter;

// Storage service for both browser and React Native
export const StorageService = {
  /**
   * Get item from storage
   * @param key Storage key
   * @returns Stored value or null
   */
  async getItem<T>(key: string): Promise<T | null> {
    const value = await storageAdapter.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(`StorySDK - Error parsing JSON for key "${key}":`, error);
        return null;
      }
    }
    return null;
  },

  /**
   * Set item in storage
   * @param key Storage key
   * @param value Value to store
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await storageAdapter.setItem(key, stringValue);
    } catch (error) {
      console.error(`StorySDK - Error setting storage for key "${key}":`, error);
    }
  },

  /**
   * Get cached data with lastModified check
   * @param key Cache key
   * @param lastModified Last-Modified header value
   * @returns Cached data if valid, null if expired or not found
   */
  async getCachedData<T>(key: string, lastModified?: string): Promise<T | null> {
    const cachedData = await this.getItem<CachedData<T>>(key);

    if (cachedData && (!lastModified || cachedData.lastModified === lastModified)) {
      return cachedData.data;
    }

    return null;
  },

  /**
   * Store data with lastModified value
   * @param key Cache key
   * @param data Data to cache
   * @param lastModified Last-Modified header value
   */
  async setCachedData<T>(key: string, data: T, lastModified?: string): Promise<void> {
    const cacheData: CachedData<T> = {
      data,
      ...(lastModified && { lastModified }),
    };

    await this.setItem(key, cacheData);
  },
};

export default StorageService;
