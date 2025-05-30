import { nanoid } from 'nanoid';
import { StorageService } from '../services/StorageService';

const USER_ID_KEY = 'storysdk_user_id';

// Cache promise and result to prevent repeated calls
let userIdPromise: Promise<string> | null = null;
let cachedUserId: string | null = null;

/**
 * Diagnose and fix corrupted userId in storage
 */
const diagnoseAndFixUserId = async (): Promise<void> => {
  try {
    const rawValue = await StorageService.getRawItem(USER_ID_KEY);
    if (rawValue && !StorageService.isValidJSON(rawValue)) {
      console.warn(`StorySDK - Found corrupted userId in storage: "${rawValue}"`);
      await StorageService.clearCorruptedData(USER_ID_KEY);
    }
  } catch (error) {
    console.error('StorySDK - Error diagnosing userId storage:', error);
  }
};

/**
 * Gets or creates a unique user ID for tracking across sessions
 * Using StorageService which handles storage for both browser and React Native
 */
export const getUniqUserId = (): Promise<string> => {
  // Debug logging
  const isInWebView = typeof window !== 'undefined' && typeof window.ReactNativeWebView !== 'undefined';

  if (isInWebView) {
    console.log(`StorySDK - getUniqUserId called, cachedUserId: ${cachedUserId}, hasPromise: ${!!userIdPromise}`);
  }

  // If we already have a cached result, return it
  if (cachedUserId) {
    if (isInWebView) {
      console.log(`StorySDK - Returning cached userId: ${cachedUserId}`);
    }
    return Promise.resolve(cachedUserId);
  }

  // If we already have a promise for getting userId, return it
  if (userIdPromise) {
    if (isInWebView) {
      console.log('StorySDK - Returning existing promise for userId');
    }
    return userIdPromise;
  }

  if (isInWebView) {
    console.log('StorySDK - Creating new userId promise, fetching from storage');
  }

  // First, diagnose and fix any corrupted data
  diagnoseAndFixUserId().catch(() => {
    // Ignore errors in diagnosis, continue with normal flow
  });

  // Create new promise and cache it
  userIdPromise = StorageService.getItem<string>(USER_ID_KEY)
    .then((existingId) => {
      if (isInWebView) {
        console.log(`StorySDK - Storage returned existingId: ${existingId}`);
      }

      // Validate that existingId is a valid string and not corrupted data
      if (existingId && typeof existingId === 'string' && existingId.length > 0 && existingId !== 'null' && existingId !== 'undefined') {
        cachedUserId = existingId;
        if (isInWebView) {
          console.log(`StorySDK - Using existing userId from storage: ${existingId}`);
        }
        return existingId;
      }

      // If existingId is invalid, log it and create a new one
      if (existingId) {
        console.warn(`StorySDK - Invalid userId found in storage: ${existingId}, creating new one`);
      }

      const id = nanoid();
      if (isInWebView) {
        console.log(`StorySDK - No existing userId, creating new: ${id}`);
      }

      return StorageService.setItem(USER_ID_KEY, id)
        .then(() => {
          cachedUserId = id;
          if (isInWebView) {
            console.log(`StorySDK - Saved new userId to storage: ${id}`);
          }
          return id;
        });
    })
    .catch((error) => {
      // In case of error, reset cache and create fallback ID
      console.error('StorySDK - Error getting user ID:', error);
      userIdPromise = null;

      const fallbackId = nanoid();
      cachedUserId = fallbackId;

      if (isInWebView) {
        console.log(`StorySDK - Error occurred, using fallback userId: ${fallbackId}`);
      }

      // Try to save fallback ID
      StorageService.setItem(USER_ID_KEY, fallbackId).catch(() => {
        // If we can't save, no big deal - use in-memory
      });

      return fallbackId;
    });

  return userIdPromise;
};

/**
 * Export diagnosis function for external use
 */
export const diagnoseStorageIssues = diagnoseAndFixUserId;
