/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useMemo, useRef } from 'react';
import block from 'bem-cn';
import { IconLoader } from '@components/icons';
import Hls from 'hls.js';
import './StoryVideoBackground.scss';

const b = block('StorySdkVideoBackground');

// Cache for tracking already played videos
const playedVideosCache = new Set<string>();
// Cache for preloaded videos
const preloadedVideosCache = new Map<string, { hls: Hls | null, directUrl: string | null }>();

type PropTypes = {
  src: string;
  nextSrc?: string;
  isLoading?: boolean;
  isMuted?: boolean;
  isFilled?: boolean;
  isPlaying?: boolean;
  isDisplaying?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
};

// Preload function that can be exported and used to preload upcoming videos
export const preloadVideo = (src: string) => {
  if (!src || playedVideosCache.has(src) || preloadedVideosCache.has(src)) {
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
      preloadedVideosCache.set(src, { hls: null, directUrl });
    })
    .catch(() => {
      directUrl = null;
      preloadedVideosCache.set(src, { hls: null, directUrl });
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
      preloadedVideosCache.set(src, { hls: preloadHls, directUrl });
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
      preloadedVideosCache.set(src, { hls: null, directUrl });
    });
  }
};

export const StoryVideoBackground = ({
  src,
  nextSrc,
  isLoading,
  isPlaying,
  isDisplaying,
  isMuted,
  isFilled,
  onLoadStart,
  onLoadEnd,
}: PropTypes) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isInitialMount = useRef(true);
  const directSourceRef = useRef<string | null>(null);
  const playTriedRef = useRef(false);
  const playbackStartedRef = useRef(false);
  const loadEndCalledRef = useRef(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !!isMuted;
    }
  }, [isMuted]);

  const [isReadyToPlay, setIsReadyToPlay] = React.useState(false);
  const [loadAttempts, setLoadAttempts] = React.useState(0);
  const hasBeenPlayed = useRef(playedVideosCache.has(src));

  const hls = useRef<Hls | null>(null);

  // Determine optimal video quality based on screen size
  const getOptimalQuality = () => {
    const width = window.innerWidth;

    if (width <= 1024) {
      return 'sr-480_720';
    }
    return 'sr-720_1080';
  };

  // Get the correct direct video link (without double .mp4)
  const directVideoUrl = useMemo(() => {
    if (!src) return '';

    // Check if src already ends with .mp4
    if (src.toLowerCase().endsWith('.mp4')) {
      return src;
    }

    // Remove any URL parameters
    const urlParts = src.split('?');
    const baseUrl = urlParts[0];

    // Check if the URL already ends with .mp4
    if (baseUrl.toLowerCase().endsWith('.mp4')) {
      return baseUrl;
    }

    // Add .mp4 only if necessary
    return `${baseUrl}.mp4`;
  }, [src]);

  const streamSource = useMemo(() => {
    // For previously played videos, prefer direct link if available
    if (hasBeenPlayed.current && directSourceRef.current) {
      return directSourceRef.current;
    }

    // Try to use direct link if the number of attempts exceeded the limit
    if (loadAttempts >= 2) {
      return directVideoUrl;
    }

    // Check if we already have an HLS link
    if (src.includes('ik-master.m3u8')) {
      return src;
    }

    return `${src}/ik-master.m3u8?tr=${getOptimalQuality()}`;
  }, [src, loadAttempts, directVideoUrl, hasBeenPlayed]);

  // Check the availability of direct link
  useEffect(() => {
    if (!directVideoUrl || directSourceRef.current === directVideoUrl) return;

    directSourceRef.current = directVideoUrl;

    // Skip HEAD request for previously played videos to improve performance
    if (hasBeenPlayed.current) {
      return;
    }

    // Check if mp4 file exists
    fetch(directVideoUrl, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) {
          directSourceRef.current = null;
        }
      })
      .catch(() => {
        directSourceRef.current = null;
      });
  }, [directVideoUrl]);

  // Function to attempt video playback
  const tryPlay = () => {
    const videoElement = videoRef.current;

    // Check all conditions for playback
    const cannotPlay = !videoElement || !isPlaying || !isDisplaying
      || !isReadyToPlay || playTriedRef.current;

    if (cannotPlay) {
      return;
    }

    playTriedRef.current = true;

    // Если видео уже воспроизводилось ранее, можно начать сразу
    // Для новых видео используем небольшую задержку 50мс вместо 100мс
    const playWithTimeout = hasBeenPlayed.current ? 0 : 50;

    // Try to play
    setTimeout(() => {
      if (videoElement && isPlaying && isDisplaying) {
        // Устанавливаем playbackRate временно в 1.25 для более быстрого начального воспроизведения
        // (вернется к нормальной скорости после секунды воспроизведения)
        if (!hasBeenPlayed.current) {
          videoElement.playbackRate = 1.25;
          setTimeout(() => {
            if (videoElement) videoElement.playbackRate = 1.0;
          }, 1000);
        }

        videoElement.play()
          .then(() => {
            playedVideosCache.add(src);
            hasBeenPlayed.current = true;
            playbackStartedRef.current = true;
          })
          .catch((error) => {
            if (error.name === 'NotAllowedError') {
              videoElement.muted = true;
              videoElement.play()
                .then(() => {
                  playbackStartedRef.current = true;
                })
                .catch(() => { });
            }
          });
      }
    }, playWithTimeout);
  };

  // Direct work with video
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return () => { };
    }

    const isNativeHlsSupport = videoElement?.canPlayType('application/vnd.apple.mpegurl');
    const useFallbackSource = loadAttempts >= 2 || streamSource === directVideoUrl;

    // Check if this video was preloaded
    const preloadedData = preloadedVideosCache.get(src);

    // Reset readiness state when source changes
    if (!isInitialMount.current) {
      setIsReadyToPlay(false);
      loadEndCalledRef.current = false;
    }
    isInitialMount.current = false;

    const handleError = (e: Event) => {
      // Increase the load attempt counter
      setLoadAttempts((prev) => Math.min(prev + 1, 3));
    };

    const handleLoadStart = () => {
      setIsReadyToPlay(false);
      playTriedRef.current = false;
      playbackStartedRef.current = false;
      loadEndCalledRef.current = false;

      // For previously played videos, we can skip loading event
      if (!hasBeenPlayed.current) {
        onLoadStart?.();
      }
    };

    const handleCanPlay = () => {
      setIsReadyToPlay(true);

      if (!loadEndCalledRef.current) {
        onLoadEnd?.();
        loadEndCalledRef.current = true;
      }

      if (isPlaying && isDisplaying && !playTriedRef.current) {
        tryPlay();
      }
    };

    // Use direct source if HLS failed or if the video was played before
    if (useFallbackSource || (hasBeenPlayed.current && directSourceRef.current)) {
      // Use available direct source or try the original
      const directSource = directSourceRef.current || directVideoUrl || src;

      videoElement.src = directSource;
      handleLoadStart();

      if (videoElement.readyState === HTMLMediaElement.HAVE_NOTHING) {
        videoElement.load();
      }

      videoElement.addEventListener('loadeddata', handleCanPlay);
      videoElement.addEventListener('error', handleError);

      return () => {
        videoElement.removeEventListener('loadeddata', handleCanPlay);
        videoElement.removeEventListener('error', handleError);
      };
    }

    // HLS implementation
    if (!isNativeHlsSupport && Hls.isSupported()) {
      // Try to destroy the previous HLS instance if it exists
      if (hls.current) {
        try {
          hls.current.detachMedia();
          hls.current.destroy();
          hls.current = null;
        } catch (e) {
          // Error destroying HLS
        }
      }

      handleLoadStart();

      // Use preloaded HLS instance if available
      if (preloadedData?.hls) {
        hls.current = preloadedData.hls;
        preloadedVideosCache.delete(src);

        // Reattach the preloaded HLS instance to our video element
        try {
          hls.current.attachMedia(videoElement);
        } catch (e) {
          // If reattaching fails, create a new instance
          hls.current.destroy();
          hls.current = null;
        }
      }

      // Create a new HLS instance if needed
      if (!hls.current) {
        hls.current = new Hls({
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
          xhrSetup: (xhr) => {
            xhr.timeout = 20000;
          },
        });

        hls.current.loadSource(streamSource);
        hls.current.attachMedia(videoElement);

        hls.current.on(Hls.Events.BUFFER_APPENDED, () => {
          handleCanPlay();
        });

        hls.current.on(Hls.Events.MEDIA_ATTACHED, () => {
          // Media attached
        });

        hls.current.on(Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            // For critical errors, immediately switch to direct source
            if (hls.current) {
              try {
                hls.current.destroy();
              } catch (e) {
                // Error destroying HLS after fatal error
              }
              hls.current = null;
            }

            setLoadAttempts(3); // Force transition to direct source
            return;
          }

          if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            if (hls.current) {
              hls.current.recoverMediaError();
            }
          } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            setLoadAttempts((prev) => prev + 1);
          } else {
            setLoadAttempts((prev) => prev + 1);
          }
        });
      }

      return () => {
        if (hls.current) {
          try {
            hls.current.detachMedia();
          } catch (e) {
            // Error detaching media
          }
        }
        videoElement?.removeEventListener('loadeddata', handleCanPlay);
        videoElement?.removeEventListener('error', handleError);
      };
    }
    // Native HLS support (Safari)

    const source = isNativeHlsSupport
      ? streamSource
      : (directSourceRef.current || directVideoUrl || src);

    videoElement.src = source;
    handleLoadStart();

    if (videoElement.readyState === HTMLMediaElement.HAVE_NOTHING) {
      videoElement.load();
    }

    videoElement.addEventListener('loadeddata', handleCanPlay);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('loadeddata', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
    };
  }, [streamSource, src, loadAttempts, directVideoUrl, isDisplaying]);

  // Responding to isPlaying changes (from parent component)
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    if (isPlaying && isDisplaying && isReadyToPlay) {
      if (!playbackStartedRef.current) {
        setTimeout(() => {
          if (!videoElement || !isPlaying || !isDisplaying) return;

          videoElement.play()
            .then(() => {
              playedVideosCache.add(src);
              hasBeenPlayed.current = true;
              playbackStartedRef.current = true;
            })
            .catch((error) => {
              if (error.name === 'NotAllowedError') {
                videoElement.muted = true;
                videoElement.play()
                  .then(() => {
                    playbackStartedRef.current = true;
                  })
                  .catch(() => { });
              }
            });
        }, 0);
      } else if (videoElement.paused) {
        // If playback has already started earlier, but video is currently paused
        videoElement.play().catch(() => { });
      }
    } else if (!isPlaying && videoElement && !videoElement.paused) {
      videoElement.pause();
    }
  }, [isPlaying, isDisplaying, isReadyToPlay, src]);

  // Предзагрузка следующего видео, если оно указано
  useEffect(() => {
    if (nextSrc && !playedVideosCache.has(nextSrc) && !preloadedVideosCache.has(nextSrc)) {
      preloadVideo(nextSrc);
    }
  }, [nextSrc]);

  return (
    <div className={b()} role="button" tabIndex={0}>
      <video
        className={b('video', {
          loading: isLoading,
          cover: isFilled,
          ready: isReadyToPlay,
          cached: hasBeenPlayed.current,
        })}
        disablePictureInPicture
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        ref={videoRef}
        // eslint-disable-next-line react/no-unknown-property
        webkit-playsinline="true"
      />
      <div className={b('loader', { show: isLoading && !hasBeenPlayed.current })}>
        <IconLoader className={b('loaderIcon').toString()} />
      </div>
    </div>
  );
};
