import Hls from 'hls.js';

/**
 * VideoCache service manages caching and preloading of videos
 * for both VideoWidget and StoryVideoBackground components.
 */
export class VideoCache {
  /**
   * Cache for tracking already played videos
   * Persists between component mounts/unmounts and page navigations
   */
  private static playedVideosCache = new Set<string>();

  /**
   * Cache for preloaded videos data
   * Stores HLS instances and direct URLs for faster video loading
   */
  private static preloadedVideosCache = new Map<string, {
    hls: Hls | null,
    directUrl: string | null
  }>();

  /**
   * Check if a video has been played before
   * @param url - The video URL to check
   * @returns Boolean indicating if the video has been played
   */
  static hasPlayed(url: string): boolean {
    return this.playedVideosCache.has(url);
  }

  /**
   * Mark a video as played
   * @param url - The video URL to mark as played
   */
  static markAsPlayed(url: string): void {
    this.playedVideosCache.add(url);
  }

  /**
   * Get preloaded data for a video if available
   * @param url - The video URL to get preloaded data for
   * @returns The preloaded HLS instance and direct URL, or undefined if not preloaded
   */
  static getPreloadedData(url: string) {
    return this.preloadedVideosCache.get(url);
  }

  /**
   * Store preloaded data for a video
   * @param url - The video URL to store data for
   * @param data - The preloaded HLS instance and direct URL
   */
  static setPreloadedData(url: string, data: { hls: Hls | null, directUrl: string | null }): void {
    this.preloadedVideosCache.set(url, data);
  }

  /**
   * Remove preloaded data for a video
   * @param url - The video URL to remove data for
   */
  static deletePreloadedData(url: string): void {
    this.preloadedVideosCache.delete(url);
  }

  /**
   * Check if a video is currently preloaded
   * @param url - The video URL to check
   * @returns Boolean indicating if the video is preloaded
   */
  static isPreloaded(url: string): boolean {
    return this.preloadedVideosCache.has(url);
  }

  /**
   * Get the optimal quality setting based on screen size
   * @returns The quality parameter string (e.g., 'sr-480_720')
   */
  static getOptimalQuality(): string {
    const width = window.innerWidth;

    if (width <= 1024) {
      return 'sr-480_720';
    }
    return 'sr-720_1080';
  }

  /**
   * Preload a video for faster initial playback
   * @param src - The video URL to preload
   */
  static preloadVideo(src: string) {
    if (!src || this.playedVideosCache.has(src) || this.preloadedVideosCache.has(src)) {
      return;
    }

    // Determine direct URL
    let directUrl: string | null = null;
    if (src.toLowerCase().endsWith('.mp4')) {
      directUrl = src;
    } else {
      const urlParts = src.split('?');
      const baseUrl = urlParts[0];
      directUrl = baseUrl.toLowerCase().endsWith('.mp4') ? baseUrl : `${baseUrl}.mp4`;
    }

    // Check direct URL availability
    fetch(directUrl, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) {
          directUrl = null;
        }
        this.preloadedVideosCache.set(src, { hls: null, directUrl });
      })
      .catch(() => {
        directUrl = null;
        this.preloadedVideosCache.set(src, { hls: null, directUrl });
      });

    // For devices that support HLS, start preloading manifest
    if (Hls.isSupported()) {
      const preloadHls = new Hls({
        maxBufferLength: 5,
        maxMaxBufferLength: 15,
        lowLatencyMode: true,
      });

      const hlsUrl = src.includes('ik-master.m3u8')
        ? src
        : `${src}/ik-master.m3u8?tr=sr-480_720`; // Always preload with lower quality

      preloadHls.loadSource(hlsUrl);
      preloadHls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.preloadedVideosCache.set(src, { hls: preloadHls, directUrl });
      });

      preloadHls.on(Hls.Events.ERROR, () => {
        // On error, clean up and rely on direct URL
        if (preloadHls) {
          try {
            preloadHls.destroy();
          } catch (e) {
            // Ignore cleanup errors
          }
        }
        this.preloadedVideosCache.set(src, { hls: null, directUrl });
      });
    }
  }

  /**
   * Preload multiple videos in sequence
   * @param sources - Array of video URLs to preload
   */
  static preloadMultipleVideos(sources: string[]): void {
    if (!sources || sources.length === 0) return;

    // Filter out already played or preloaded videos
    const urlsToPreload = sources.filter((url) => url
      && !this.playedVideosCache.has(url)
      && !this.preloadedVideosCache.has(url));

    // Preload each video
    urlsToPreload.forEach((url) => {
      this.preloadVideo(url);
    });
  }

  /**
   * Create optimal HLS configuration
   * @param lowBuffer - Whether to use lower buffer settings for faster startup
   * @returns HLS configuration object
   */
  static createHlsConfig(lowBuffer = false): Record<string, any> {
    if (lowBuffer) {
      return {
        maxBufferLength: 5,
        maxMaxBufferLength: 15,
        manifestLoadingTimeOut: 8000,
        manifestLoadingMaxRetry: 2,
        levelLoadingTimeOut: 8000,
        lowLatencyMode: true,
      };
    }

    return {
      maxBufferLength: 10,
      maxMaxBufferLength: 30,
      manifestLoadingTimeOut: 8000,
      manifestLoadingMaxRetry: 2,
      levelLoadingTimeOut: 8000,
      fragLoadingTimeOut: 15000,
      startLevel: 0,
      autoStartLoad: true,
      debug: false,
      lowLatencyMode: true,
      progressive: true,
      xhrSetup: (xhr: XMLHttpRequest) => {
        xhr.timeout = 20000;
      },
    };
  }

  /**
   * Clear all caches (for testing or memory management)
   */
  static clearAll(): void {
    this.playedVideosCache.clear();

    // Destroy all HLS instances before clearing
    this.preloadedVideosCache.forEach(({ hls }) => {
      if (hls) {
        try {
          hls.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    });
    this.preloadedVideosCache.clear();
  }
}
