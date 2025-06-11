/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useRef } from 'react';
import { VideoWidgetParamsType } from '@storysdk/types';
import { block } from '@utils';
import { IconPlay } from '@components/icons';
import Hls from 'hls.js';
import { VideoCache } from '../../services/VideoCache';
import './VideoWidget.scss';

const b = block('VideoWidget');

// For backward compatibility
export const preloadVideo = VideoCache.preloadVideo;

export const VideoWidget: React.FunctionComponent<{
  params: VideoWidgetParamsType;
  isVideoPlaying?: boolean;
  isMuted?: boolean;
  isAutoplay?: boolean;
  isDisplaying?: boolean;
  handleMediaPlaying?: (isPlaying: boolean) => void;
  handleMediaLoading?: (isLoading: boolean) => void;
  nextVideoUrl?: string; // Optional URL for the next video to preload
}> = React.memo((props) => {
  const {
    videoUrl, videoPreviewUrl, widgetOpacity, borderRadius,
  } = props.params;

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isInitialMount = useRef(true);
  const directSourceRef = useRef<string | null>(null);
  const playTriedRef = useRef(false);
  const playbackStartedRef = useRef(false);
  const loadEndCalledRef = useRef(false);

  const styles = {
    opacity: widgetOpacity / 100,
    borderRadius: `${borderRadius}px`,
  };

  const [isReadyToPlay, setIsReadyToPlay] = React.useState(false);
  const [loadAttempts, setLoadAttempts] = React.useState(0);
  const hasBeenPlayed = useRef(VideoCache.hasPlayed(videoUrl));

  useEffect(() => {
    props.handleMediaLoading?.(!isReadyToPlay);
  }, [isReadyToPlay]);

  const togglePlay = () => {
    props.handleMediaPlaying?.(!props.isVideoPlaying);
  };

  const hls = useRef<Hls | null>(null);

  const directVideoUrl = useMemo(() => {
    if (!videoUrl) return '';
    return videoUrl;
  }, [videoUrl]);

  // Determine optimal stream source
  const streamSource = useMemo(() => {
    // For previously played videos, prefer direct link if available
    if (hasBeenPlayed.current && directSourceRef.current) {
      return directSourceRef.current;
    }

    // Use direct link if number of attempts exceeded the limit
    if (loadAttempts >= 2) {
      return directVideoUrl;
    }

    // Check if we already have an HLS link
    if (videoUrl.includes('ik-master.m3u8')) {
      return videoUrl;
    }

    return `${videoUrl}/ik-master.m3u8?tr=${VideoCache.getOptimalQuality()}`;
  }, [videoUrl, loadAttempts, directVideoUrl, hasBeenPlayed]);

  // Check availability of direct link
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
    const cannotPlay = !videoElement || !props.isVideoPlaying || !props.isDisplaying
      || !isReadyToPlay || playTriedRef.current;

    if (cannotPlay) {
      return;
    }

    playTriedRef.current = true;

    // If video was played before, start immediately
    // For new videos use a small delay of 50ms
    const playWithTimeout = hasBeenPlayed.current ? 0 : 50;

    // Try to play
    setTimeout(() => {
      if (videoElement && props.isVideoPlaying && props.isDisplaying) {
        // Set playbackRate temporarily to 1.25 for faster initial playback
        if (!hasBeenPlayed.current) {
          videoElement.playbackRate = 1.25;
          setTimeout(() => {
            if (videoElement) videoElement.playbackRate = 1.0;
          }, 1000);
        }

        videoElement.play()
          .then(() => {
            VideoCache.markAsPlayed(videoUrl);
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

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return () => { };
    }

    const isNativeHlsSupport = videoElement?.canPlayType('application/vnd.apple.mpegurl');
    const useFallbackSource = loadAttempts >= 2 || streamSource === directVideoUrl;

    // Check if this video was preloaded
    const preloadedData = VideoCache.getPreloadedData(videoUrl);

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
        props.handleMediaLoading?.(true);
      }
    };

    const handleCanPlay = () => {
      setIsReadyToPlay(true);

      if (!loadEndCalledRef.current) {
        props.handleMediaLoading?.(false);
        loadEndCalledRef.current = true;
      }

      if (props.isVideoPlaying && props.isDisplaying && !playTriedRef.current) {
        tryPlay();
      }
    };

    // Use direct source if HLS failed or if the video was played before
    if (useFallbackSource || (hasBeenPlayed.current && directSourceRef.current)) {
      // Use available direct source or try the original
      const directSource = directSourceRef.current || directVideoUrl || videoUrl;

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
        VideoCache.deletePreloadedData(videoUrl);

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
        hls.current = new Hls(VideoCache.createHlsConfig());

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
      : (directSourceRef.current || directVideoUrl || videoUrl);

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
  }, [streamSource, videoUrl, loadAttempts, directVideoUrl, props.isDisplaying]);

  // Responding to isVideoPlaying changes (from parent component)
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !props.isDisplaying || !isReadyToPlay) return;

    if (props.isVideoPlaying) {
      if (!playbackStartedRef.current) {
        tryPlay();
      } else if (videoElement.paused) {
        // If playback has already started earlier, but video is currently paused
        videoElement.play().catch(() => { });
      }
    } else if (!videoElement.paused) {
      videoElement.pause();
    }
  }, [props.isVideoPlaying, props.isDisplaying, isReadyToPlay]);

  // Preload next video if specified
  useEffect(() => {
    if (props.nextVideoUrl
      && !VideoCache.hasPlayed(props.nextVideoUrl)
      && !VideoCache.isPreloaded(props.nextVideoUrl)) {
      VideoCache.preloadVideo(props.nextVideoUrl);
    }
  }, [props.nextVideoUrl]);

  return (
    <div
      className={b()}
      role="button"
      tabIndex={0}
      onClick={!props.isAutoplay ? togglePlay : undefined}
    >
      <video
        className={b('video')}
        disablePictureInPicture
        loop
        muted={props.isMuted ?? props.isAutoplay}
        playsInline
        preload="auto"
        ref={videoRef}
        src={videoPreviewUrl ?? videoUrl}
        style={styles}
        // eslint-disable-next-line react/no-unknown-property
        webkit-playsinline="true"
      />
      {!props.isVideoPlaying && !props.isAutoplay && isReadyToPlay && (
        <div className={b('playBtn')} role="button" tabIndex={0}>
          <IconPlay />
        </div>
      )}
    </div>
  );
});
