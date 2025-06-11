import Hls from 'hls.js';
/**
 * VideoCache service manages caching and preloading of videos
 * for both VideoWidget and StoryVideoBackground components.
 */
export declare class VideoCache {
    /**
     * Cache for tracking already played videos
     * Persists between component mounts/unmounts and page navigations
     */
    private static playedVideosCache;
    /**
     * Cache for preloaded videos data
     * Stores HLS instances and direct URLs for faster video loading
     */
    private static preloadedVideosCache;
    /**
     * Check if a video has been played before
     * @param url - The video URL to check
     * @returns Boolean indicating if the video has been played
     */
    static hasPlayed(url: string): boolean;
    /**
     * Mark a video as played
     * @param url - The video URL to mark as played
     */
    static markAsPlayed(url: string): void;
    /**
     * Get preloaded data for a video if available
     * @param url - The video URL to get preloaded data for
     * @returns The preloaded HLS instance and direct URL, or undefined if not preloaded
     */
    static getPreloadedData(url: string): {
        hls: Hls | null;
        directUrl: string | null;
    } | undefined;
    /**
     * Store preloaded data for a video
     * @param url - The video URL to store data for
     * @param data - The preloaded HLS instance and direct URL
     */
    static setPreloadedData(url: string, data: {
        hls: Hls | null;
        directUrl: string | null;
    }): void;
    /**
     * Remove preloaded data for a video
     * @param url - The video URL to remove data for
     */
    static deletePreloadedData(url: string): void;
    /**
     * Check if a video is currently preloaded
     * @param url - The video URL to check
     * @returns Boolean indicating if the video is preloaded
     */
    static isPreloaded(url: string): boolean;
    /**
     * Get the optimal quality setting based on screen size
     * @returns The quality parameter string (e.g., 'sr-480_720')
     */
    static getOptimalQuality(): string;
    /**
     * Preload a video for faster initial playback
     * @param src - The video URL to preload
     */
    static preloadVideo(src: string): void;
    /**
     * Preload multiple videos in sequence
     * @param sources - Array of video URLs to preload
     */
    static preloadMultipleVideos(sources: string[]): void;
    /**
     * Create optimal HLS configuration
     * @param lowBuffer - Whether to use lower buffer settings for faster startup
     * @returns HLS configuration object
     */
    static createHlsConfig(lowBuffer?: boolean): Record<string, any>;
    /**
     * Clear all caches (for testing or memory management)
     */
    static clearAll(): void;
}
