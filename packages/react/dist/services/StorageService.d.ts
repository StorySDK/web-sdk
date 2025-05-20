export interface CachedData<T> {
    data: T;
    lastModified?: string;
}
export interface StorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
}
export declare const StorageService: {
    /**
     * Get item from storage
     * @param key Storage key
     * @returns Stored value or null
     */
    getItem<T>(key: string): Promise<T | null>;
    /**
     * Set item in storage
     * @param key Storage key
     * @param value Value to store
     */
    setItem<T_1>(key: string, value: T_1): Promise<void>;
    /**
     * Get cached data with lastModified check
     * @param key Cache key
     * @param lastModified Last-Modified header value
     * @returns Cached data if valid, null if expired or not found
     */
    getCachedData<T_2>(key: string, lastModified?: string): Promise<T_2 | null>;
    /**
     * Store data with lastModified value
     * @param key Cache key
     * @param data Data to cache
     * @param lastModified Last-Modified header value
     */
    setCachedData<T_3>(key: string, data: T_3, lastModified?: string): Promise<void>;
};
export default StorageService;
