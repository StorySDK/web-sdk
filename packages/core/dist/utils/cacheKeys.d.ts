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
export declare const generateCacheKey: (type: string, options?: CacheKeyOptions) => string | null;
/**
 * Generates cache key specifically for adapted group data
 * @param options - Configuration options
 * @returns Cache key for adapted data or null if invalid
 */
export declare const generateAdaptedDataCacheKey: (options: CacheKeyOptions) => string | null;
/**
 * Generates cache key specifically for raw groups data
 * @param options - Configuration options
 * @returns Cache key for groups data or null if invalid
 */
export declare const generateGroupsCacheKey: (options: CacheKeyOptions) => string | null;
/**
 * Generates cache key specifically for stories data
 * @param groupId - The group ID for which stories are cached
 * @param options - Configuration options
 * @returns Cache key for stories data or null if invalid
 */
export declare const generateStoriesCacheKey: (groupId: string, options: CacheKeyOptions) => string | null;
/**
 * Generates cache key specifically for app data
 * @param options - Configuration options
 * @returns Cache key for app data or null if invalid
 */
export declare const generateAppCacheKey: (options: CacheKeyOptions) => string | null;
