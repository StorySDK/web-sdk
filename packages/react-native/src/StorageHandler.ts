import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface for storage messages
 */
interface StorageMessage {
  type: string;
  data: {
    key: string;
    value?: any;
  };
}

// In-memory fallback storage when AsyncStorage is not available
const memoryStorage: Record<string, string> = {};

// Safe AsyncStorage wrapper
const SafeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (!AsyncStorage) {
        return memoryStorage[key] || null;
      }

      if (typeof AsyncStorage.getItem !== 'function') {
        return memoryStorage[key] || null;
      }

      return await AsyncStorage.getItem(key);
    } catch (error) {
      return memoryStorage[key] || null;
    }
  },

  async setItem(key: string, value: string): Promise<boolean> {
    try {
      if (!AsyncStorage) {
        memoryStorage[key] = value;
        return true;
      }

      if (typeof AsyncStorage.setItem !== 'function') {
        memoryStorage[key] = value;
        return true;
      }

      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      memoryStorage[key] = value;
      return false;
    }
  }
};

/**
 * Class for handling storage messages between WebView and React Native
 */
export class StorageHandler {
  /**
   * Safe get item - uses AsyncStorage if available, falls back to memory storage
   */
  private static async safeGetItem(key: string): Promise<string | null> {
    // Replace [object Promise] with a valid key if it occurs
    const safeKey = key.includes('[object Promise]')
      ? key.replace('[object Promise]', 'UnresolvedPromise')
      : key;

    try {
      return await SafeStorage.getItem(safeKey);
    } catch (error) {
      return memoryStorage[safeKey] || null;
    }
  }

  /**
   * Safe set item - uses AsyncStorage if available, falls back to memory storage
   */
  private static async safeSetItem(key: string, value: string): Promise<boolean> {
    // Replace [object Promise] with a valid key if it occurs
    const safeKey = key.includes('[object Promise]')
      ? key.replace('[object Promise]', 'UnresolvedPromise')
      : key;

    try {
      return await SafeStorage.setItem(safeKey, value);
    } catch (error) {
      // Try to fall back to memory storage
      try {
        memoryStorage[safeKey] = value;
      } catch (memoryError) {
        return false;
      }
      return false;
    }
  }

  /**
   * Handles incoming messages from WebView related to storage
   * @param message Message from WebView
   * @param sendResponse Function to send a response back to WebView
   * @returns true if the message was handled, false otherwise
   */
  static async handleMessage(message: any, sendResponse: (message: string) => void): Promise<boolean> {
    try {
      const parsedMessage: StorageMessage = typeof message === 'string' ? JSON.parse(message) : message;

      // Processing requests to get data from storage
      if (parsedMessage.type === 'storysdk:storage:get') {
        const { key } = parsedMessage.data;
        if (!key) {
          return false;
        }

        try {
          const value = await this.safeGetItem(key);
          let parsedValue = null;

          if (value !== null) {
            try {
              parsedValue = JSON.parse(value);
            } catch {
              // If failed to parse JSON, use the value as is
              parsedValue = value;
            }
          }

          sendResponse(JSON.stringify({
            type: 'storysdk:storage:response',
            data: {
              key,
              value: parsedValue
            }
          }));

          return true;
        } catch (error) {
          sendResponse(JSON.stringify({
            type: 'storysdk:storage:response',
            data: {
              key,
              value: null,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }));

          return true;
        }
      }

      // Processing requests to save data to storage
      if (parsedMessage.type === 'storysdk:storage:set') {
        const { key, value } = parsedMessage.data;
        if (!key) {
          return false;
        }

        try {
          // Convert value to JSON string if it's not a string
          const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
          const success = await this.safeSetItem(key, stringValue);

          sendResponse(JSON.stringify({
            type: 'storysdk:storage:response',
            data: {
              key,
              success
            }
          }));

          return true;
        } catch (error) {
          sendResponse(JSON.stringify({
            type: 'storysdk:storage:response',
            data: {
              key,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }));

          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }
} 