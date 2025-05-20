import { useCallback, useEffect, useState } from 'react';
import StorageService from '../services/StorageService';

// Type for storage operation result
export type Result<T> = [T, (value: T) => void];

export function useLocalStorage<T>(key: string, initialValue: T): Result<T> {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initial setup - retrieve value from storage
  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        // Get value from StorageService
        const value = await StorageService.getItem<T>(key);

        if (value !== null) {
          setStoredValue(value);
        }
      } catch (error) {
        console.error('StorageSDK - Error loading from storage:', error);
      }
    };

    loadInitialValue();
  }, [key]);

  // Update stored value
  const setValue = useCallback((value: T) => {
    // Update state
    setStoredValue(value);

    // Update storage
    StorageService.setItem(key, value).catch((error) => {
      console.error('StorageSDK - Error saving to storage:', error);
    });
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
