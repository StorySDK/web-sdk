/**
 * Cache key generation utilities for StorySdk
 */

export interface CacheKeyOptions {
  token?: string;
  language?: string;
  userId?: string;
  includeStories?: boolean;
  customSuffix?: string;
}

/**
 * Generates a standardized cache key for StorySdk data
 * @param type - The type of cached data (e.g., 'groups', 'adapted', 'stories', 'app')
 * @param options - Configuration options for the cache key
 * @returns A standardized cache key string or null if token/userId are invalid
 */
export const generateCacheKey = (
  type: string,
  options: CacheKeyOptions = {},
): string | null => {
  const {
    token = 'no-token',
    language = 'en',
    userId = 'anonymous',
    includeStories = false,
    customSuffix,
  } = options;

  // SECURITY CHECK: Don't generate cache keys for invalid tokens or userIds
  const isValidToken = token && token !== 'no-token' && token.length >= 5;
  const isValidUserId = userId && userId !== 'anonymous' && userId !== 'promise-user-id';

  if (!isValidToken || !isValidUserId) {
    return null; // Return null for invalid auth data
  }

  // Base key structure: storysdk_{type}_{token}_{language}_{userId}
  let baseKey = `storysdk_${type}_${token}_${language}_${userId}`;

  // Add stories suffix if needed
  if (includeStories) {
    baseKey += '_with_stories';
  } else if (type === 'adapted') {
    // For adapted data, explicitly mark as groups-only when stories are not included
    baseKey += '_groups_only';
  }

  // Add custom suffix if provided
  if (customSuffix) {
    baseKey += `_${customSuffix}`;
  }

  return baseKey;
};

/**
 * Generates cache key specifically for adapted group data
 * @param options - Configuration options
 * @returns Cache key for adapted data or null if invalid
 */
export const generateAdaptedDataCacheKey = (options: CacheKeyOptions): string | null => generateCacheKey('adapted', options);

/**
 * Generates cache key specifically for raw groups data
 * @param options - Configuration options
 * @returns Cache key for groups data or null if invalid
 */
export const generateGroupsCacheKey = (options: CacheKeyOptions): string | null => generateCacheKey('groups', options);

/**
 * Generates cache key specifically for stories data
 * @param groupId - The group ID for which stories are cached
 * @param options - Configuration options
 * @returns Cache key for stories data or null if invalid
 */
export const generateStoriesCacheKey = (
  groupId: string,
  options: CacheKeyOptions,
): string | null => generateCacheKey('stories', {
  ...options,
  customSuffix: `group_${groupId}`,
});

/**
 * Generates cache key specifically for app data
 * @param options - Configuration options
 * @returns Cache key for app data or null if invalid
 */
export const generateAppCacheKey = (options: CacheKeyOptions): string | null => generateCacheKey('app', options);
