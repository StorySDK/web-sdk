/**
 * Clean up corrupted StorySDK data from storage
 */
export declare const cleanupCorruptedStorageData: () => Promise<void>;
/**
 * Check if there are any corrupted StorySDK data in storage
 */
export declare const hasCorruptedStorageData: () => Promise<boolean>;
/**
 * Get diagnostic information about storage
 */
export declare const getStorageDiagnostics: () => Promise<{
    isStorageAvailable: boolean;
    corruptedKeys: string[];
    validKeys: string[];
}>;
