import { StorageService } from '../services/StorageService';

// Known StorySDK storage keys
const STORYSDK_KEYS = [
  'storysdk_user_id',
];

/**
 * Clean up corrupted StorySDK data from storage
 */
export const cleanupCorruptedStorageData = async (): Promise<void> => {
  console.log('StorySDK - Starting storage cleanup...');

  const cleanupPromises = STORYSDK_KEYS.map(async (key) => {
    try {
      const rawValue = await StorageService.getRawItem(key);

      if (rawValue && !StorageService.isValidJSON(rawValue)) {
        console.warn(`StorySDK - Found corrupted data for key "${key}": "${rawValue}"`);
        await StorageService.clearCorruptedData(key);
      }
    } catch (error) {
      console.error(`StorySDK - Error checking key "${key}":`, error);
    }
  });

  await Promise.all(cleanupPromises);
  console.log('StorySDK - Storage cleanup completed');
};

/**
 * Check if there are any corrupted StorySDK data in storage
 */
export const hasCorruptedStorageData = async (): Promise<boolean> => {
  const checkPromises = STORYSDK_KEYS.map(async (key) => {
    try {
      const rawValue = await StorageService.getRawItem(key);
      return rawValue && !StorageService.isValidJSON(rawValue);
    } catch (error) {
      console.error(`StorySDK - Error checking key "${key}":`, error);
      return false;
    }
  });

  const results = await Promise.all(checkPromises);
  return results.some(Boolean);
};

/**
 * Get diagnostic information about storage
 */
export const getStorageDiagnostics = async (): Promise<{
  isStorageAvailable: boolean;
  corruptedKeys: string[];
  validKeys: string[];
}> => {
  const diagnostics = {
    isStorageAvailable: StorageService.isAvailable(),
    corruptedKeys: [] as string[],
    validKeys: [] as string[],
  };

  const diagnosticPromises = STORYSDK_KEYS.map(async (key) => {
    try {
      const rawValue = await StorageService.getRawItem(key);

      if (rawValue) {
        if (StorageService.isValidJSON(rawValue)) {
          return { key, status: 'valid' as const };
        }
        return { key, status: 'corrupted' as const };
      }
      return { key, status: 'empty' as const };
    } catch (error) {
      console.error(`StorySDK - Error checking key "${key}":`, error);
      return { key, status: 'error' as const };
    }
  });

  const results = await Promise.all(diagnosticPromises);

  results.forEach(({ key, status }) => {
    if (status === 'valid') {
      diagnostics.validKeys.push(key);
    } else if (status === 'corrupted' || status === 'error') {
      diagnostics.corruptedKeys.push(key);
    }
  });

  return diagnostics;
};
