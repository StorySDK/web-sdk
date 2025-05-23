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

// In-memory fallback storage when localStorage is not available
const memoryStorage: Record<string, string> = {};

// Safe check for localStorage availability
const isLocalStorageAvailable = (): boolean => {
  try {
    // Try to use localStorage by setting and getting a test item
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    // If any error occurs, localStorage is not available
    console.warn('StorySDK - localStorage is not available, using in-memory storage');
    return false;
  }
};

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
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    } catch (error) {
      console.error('StorySDK - Error accessing localStorage:', error);
      // Fallback to memory storage
      return memoryStorage[key] || null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    } catch (error) {
      console.error('StorySDK - Error saving to localStorage:', error);
      // Fallback to memory storage
      memoryStorage[key] = value;
    }
  },
};

// React Native WebView storage adapter using postMessage
const reactNativeWebViewAdapter: StorageAdapter = {
  getItem: async (key: string): Promise<string | null> => new Promise((resolve) => {
    // If ReactNativeWebView is not available anymore, fallback to memory storage
    if (typeof window === 'undefined' || typeof window.ReactNativeWebView === 'undefined') {
      console.warn('StorySDK - ReactNativeWebView is not available, using in-memory storage');
      resolve(memoryStorage[key] || null);
      return;
    }

    const id = String(callbackId);
    callbackId += 1;
    storageCallbacks[id] = resolve;

    try {
      window.ReactNativeWebView!.postMessage(JSON.stringify({
        type: 'storysdk:storage:get',
        callbackId: id,
        data: { key },
      }));

      // Set timeout to avoid waiting indefinitely
      setTimeout(() => {
        if (storageCallbacks[id]) {
          console.warn('StorySDK - Storage request timed out, using in-memory storage');
          delete storageCallbacks[id];
          resolve(memoryStorage[key] || null);
        }
      }, 2000);
    } catch (error) {
      console.error('StorySDK - Error requesting storage value:', error);
      delete storageCallbacks[id];
      // Fallback to memory storage
      resolve(memoryStorage[key] || null);
    }
  }),

  setItem: async (key: string, value: string): Promise<void> => {
    // Store in memory as a backup
    memoryStorage[key] = value;

    // If ReactNativeWebView is not available anymore, use only memory storage
    if (typeof window === 'undefined' || typeof window.ReactNativeWebView === 'undefined') {
      console.warn('StorySDK - ReactNativeWebView is not available, using in-memory storage only');
      return;
    }

    try {
      window.ReactNativeWebView!.postMessage(JSON.stringify({
        type: 'storysdk:storage:set',
        data: { key, value },
      }));
    } catch (error) {
      console.error('StorySDK - Error setting storage value:', error);
      // Already stored in memory storage as backup
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
        const parsedValue = JSON.parse(value);

        // Debug logging
        const isInWebView = typeof window !== 'undefined' && typeof window.ReactNativeWebView !== 'undefined';
        if (isInWebView) {
          console.log(`StorySDK - Storage cache hit for key "${key}"`);
          // For debugging we send information through webview
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'storysdk:debug:info',
            data: {
              message: `Storage cache hit for key "${key}"`,
              timestamp: new Date().toISOString(),
            },
          }));
        }

        return parsedValue;
      } catch (error) {
        console.error(`StorySDK - Error parsing JSON for key "${key}":`, error);
        return null;
      }
    }

    // Debug logging for cache miss
    const isInWebView = typeof window !== 'undefined' && typeof window.ReactNativeWebView !== 'undefined';
    if (isInWebView) {
      console.log(`StorySDK - Storage cache miss for key "${key}"`);
      // For debugging we send information through webview
      window.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'storysdk:debug:info',
        data: {
          message: `Storage cache miss for key "${key}"`,
          timestamp: new Date().toISOString(),
        },
      }));
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

  /**
   * Check if storage is available
   * @returns True if storage is available, false otherwise
   */
  isAvailable(): boolean {
    if (isInReactNativeWebView) {
      return typeof window !== 'undefined' && typeof window.ReactNativeWebView !== 'undefined';
    }
    return isLocalStorageAvailable();
  },
};

export default StorageService;
