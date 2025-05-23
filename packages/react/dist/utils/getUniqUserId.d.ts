/**
 * Gets or creates a unique user ID for tracking across sessions
 * Using StorageService which handles storage for both browser and React Native
 */
export declare const getUniqUserId: () => Promise<string>;
