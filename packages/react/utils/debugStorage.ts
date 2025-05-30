import { StorageService } from '../services/StorageService';
import { getStorageDiagnostics, cleanupCorruptedStorageData } from './storageCleanup';
import { diagnoseStorageIssues } from './getUniqUserId';

/**
 * Debug utility for StorySDK storage issues
 */
export const debugStorageIssues = async (): Promise<void> => {
  console.log('=== StorySDK Storage Debug ===');

  // Check storage availability
  console.log('Storage available:', StorageService.isAvailable());

  // Get diagnostics
  const diagnostics = await getStorageDiagnostics();
  console.log('Diagnostics:', diagnostics);

  // Check specific userId
  try {
    const rawUserId = await StorageService.getRawItem('storysdk_user_id');
    console.log('Raw userId value:', rawUserId);

    if (rawUserId) {
      console.log('Is valid JSON:', StorageService.isValidJSON(rawUserId));
    }

    const parsedUserId = await StorageService.getItem<string>('storysdk_user_id');
    console.log('Parsed userId:', parsedUserId);
  } catch (error) {
    console.error('Error checking userId:', error);
  }

  // Run diagnosis and cleanup if needed
  if (diagnostics.corruptedKeys.length > 0) {
    console.log('Found corrupted keys, running cleanup...');
    await cleanupCorruptedStorageData();
    await diagnoseStorageIssues();
  }

  console.log('=== Debug Complete ===');
};

/**
 * Force clear all StorySDK storage data (for testing)
 */
export const clearAllStorageData = async (): Promise<void> => {
  console.log('Clearing all StorySDK storage data...');

  const keys = ['storysdk_user_id'];

  const clearPromises = keys.map(async (key) => {
    try {
      await StorageService.setItem(key, null);
      console.log(`Cleared: ${key}`);
    } catch (error) {
      console.error(`Failed to clear ${key}:`, error);
    }
  });

  await Promise.all(clearPromises);
  console.log('Storage clear complete');
};

// Make debug functions available globally for console debugging
if (typeof window !== 'undefined') {
  (window as any).storySDKDebug = {
    debugStorage: debugStorageIssues,
    clearStorage: clearAllStorageData,
    getDiagnostics: getStorageDiagnostics,
    cleanupCorrupted: cleanupCorruptedStorageData,
  };
}
