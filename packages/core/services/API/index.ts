import axios from 'axios';
import ReactGA from 'react-ga4';
import { StorageService } from '@storysdk/react';
import { writeToDebug } from '../../utils';

// Helper function to add cache-busting parameter to prevent browser caching
const addCacheBusting = (config: any = {}) => {
  const url = new URL(config.url, 'http://dummy');
  url.searchParams.set('_t', Date.now().toString());

  return {
    ...config,
    url: url.pathname + url.search,
  };
};

// Request wrapper with caching capability
const makeRequestWithHeadCheck = async (options: any, isDisableCache?: boolean) => {
  // Extract token from Authorization header
  const authHeader = axios.defaults.headers.common?.Authorization as string;
  const token = authHeader?.replace('SDK ', '') || '';

  // SECURITY CHECK: Don't use cache if token is invalid
  const isValidToken = token && token !== 'no-token' && token.length >= 5;

  if (!isValidToken) {
    // If token is invalid, make direct request without caching
    writeToDebug(`StorySDK - Invalid token detected, making direct request without cache to: ${options.url}`);
    return axios(addCacheBusting(options));
  }

  // Check if token has changed and clear cache if needed
  // eslint-disable-next-line no-underscore-dangle
  const previousToken = (window as any).__STORYSDK_API_PREVIOUS_TOKEN__;
  if (previousToken && previousToken !== token) {
    writeToDebug(`StorySDK - Token changed from ${previousToken} to ${token}, clearing API cache...`);

    // Clear all API cache for the old token
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith('storysdk_api_cache_')) {
          keysToRemove.push(key);
        }
      }

      // Remove keys using StorageService's clearCorruptedData method
      await Promise.all(keysToRemove.map((key) => StorageService.clearCorruptedData(key)));
      writeToDebug(`StorySDK - Cleared ${keysToRemove.length} API cache keys`);
    } catch (error) {
      writeToDebug(`StorySDK - Error clearing API cache: ${error}`);
    }
  }

  // Store current token for next comparison
  // eslint-disable-next-line no-underscore-dangle
  (window as any).__STORYSDK_API_PREVIOUS_TOKEN__ = token;

  const cacheKey = `storysdk_api_cache_${token}_${options.url}`;

  try {
    // If cache is disabled, make direct request without HEAD check
    if (isDisableCache) {
      writeToDebug(`StorySDK - Cache disabled, making direct request to: ${options.url}`);
      return await axios(addCacheBusting(options));
    }

    // First make a HEAD request - always fresh, no caching
    const headResult = await axios(addCacheBusting({
      method: 'head',
      url: options.url,
    })).catch((error) => {
      writeToDebug(`StorySDK - HEAD request failed: ${error}`);
      return { headers: {} };
    });

    const lastModified = headResult.headers
      ? (headResult.headers as Record<string, string>)['last-modified']
      : undefined;

    let cachedData = null;

    if (lastModified) {
      cachedData = await StorageService.getCachedData(cacheKey, lastModified);
    }

    // Only use cache if it actually exists and is not empty
    if (cachedData) {
      return {
        data: cachedData,
        status: 200,
        statusText: 'OK (from cache)',
        headers: headResult.headers,
        config: {},
      };
    }

    // Always make a request if cache is missing or empty
    const response = await axios(addCacheBusting(options));

    const isDataNotEmpty = (data: any): boolean => {
      if (Array.isArray(data)) {
        return data.length > 0;
      }
      if (typeof data === 'object' && data !== null) {
        return Object.keys(data).length > 0;
      }
      return data !== null && data !== undefined;
    };

    if (lastModified && response.data && isDataNotEmpty(response.data)) {
      await StorageService.setCachedData(cacheKey, response.data, lastModified);
    }

    return response;
  } catch (error) {
    console.error('StorySDK - Request failed:', options.url, error);
    throw error;
  }
};

export const API = {
  app: {
    getApp(isDisableCache?: boolean, isDebugMode?: boolean) {
      if (isDebugMode) {
        writeToDebug(`StorySDK - API.app.getApp called with disableCache: ${isDisableCache}`);
      }
      return makeRequestWithHeadCheck({
        method: 'get',
        url: '/app',
      }, isDisableCache);
    },
  },
  groups: {
    getList(isDisableCache?: boolean, isDebugMode?: boolean) {
      if (isDebugMode) {
        writeToDebug(`StorySDK - API.groups.getList called with disableCache: ${isDisableCache}`);
      }
      return makeRequestWithHeadCheck({
        method: 'get',
        url: '/groups',
      }, isDisableCache);
    },
  },
  stories: {
    getList(params: { groupId: string }, isDisableCache?: boolean, isDebugMode?: boolean) {
      if (isDebugMode) {
        writeToDebug(`StorySDK - API.stories.getList called for group: ${params.groupId} with disableCache: ${isDisableCache}`);
      }
      return makeRequestWithHeadCheck({
        method: 'get',
        url: `/groups/${params.groupId}/stories`,
      }, isDisableCache);
    },
  },
  statistics: {
    group: {
      sendDuration(params: {
        groupId: string;
        uniqUserId: string;
        seconds: number;
        language: string;
      }) {
        if (!params.groupId || params.groupId.trim() === '') {
          console.warn('StorySDK: Attempted to send group duration without valid groupId');
          return Promise.resolve();
        }

        ReactGA.gtag('event', 'storysdk_group_duration', {
          event_category: 'storysdk_groups',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          value: params.seconds,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'duration',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: `${params.seconds}`,
            locale: params.language,
          },
        });
      },
      onOpen(params: { groupId: string; uniqUserId: string; language: string }) {
        ReactGA.gtag('event', 'storysdk_group_open', {
          event_category: 'storysdk_groups',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'open',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: '',
            locale: params.language,
          },
        });
      },
      onClose(params: { groupId: string; uniqUserId: string; language: string }) {
        ReactGA.gtag('event', 'storysdk_group_close', {
          event_category: 'storysdk_groups',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'close',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: '',
            locale: params.language,
          },
        });
      },
    },
    story: {
      sendDuration(params: {
        groupId: string;
        storyId: string;
        uniqUserId: string;
        seconds: number;
        language: string;
      }) {
        // Предотвращаем отправку реакции duration без валидного group_id
        if (!params.groupId || params.groupId.trim() === '') {
          console.warn('StorySDK: Attempted to send story duration without valid groupId');
          return Promise.resolve();
        }

        ReactGA.gtag('event', 'storysdk_story_duration', {
          event_category: 'storysdk_stories',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          story_id: params.storyId,
          value: params.seconds,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'duration',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: `${params.seconds}`,
            locale: params.language,
          },
        });
      },
      sendImpression(params: {
        groupId: string;
        storyId: string;
        uniqUserId: string;
        seconds: number;
        language: string;
      }) {
        // Предотвращаем отправку реакции impression без валидного group_id
        if (!params.groupId || params.groupId.trim() === '') {
          console.warn('StorySDK: Attempted to send story impression without valid groupId');
          return Promise.resolve();
        }

        ReactGA.gtag('event', 'storysdk_story_impression', {
          event_category: 'storysdk_stories',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          story_id: params.storyId,
          value: params.seconds,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'impression',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: `${params.seconds}`,
            locale: params.language,
          },
        });
      },
      onOpen(params: { groupId: string; storyId: string; uniqUserId: string; language: string }) {
        ReactGA.gtag('event', 'storysdk_story_open', {
          event_category: 'storysdk_stories',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          story_id: params.storyId,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'open',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: '',
            locale: params.language,
          },
        });
      },
      onClose(params: { groupId: string; storyId: string; uniqUserId: string; language: string }) {
        ReactGA.gtag('event', 'storysdk_story_close', {
          event_category: 'storysdk_stories',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          story_id: params.storyId,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'close',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: '',
            locale: params.language,
          },
        });
      },
      onNext(params: { groupId: string; storyId: string; uniqUserId: string; language: string }) {
        ReactGA.gtag('event', 'storysdk_story_next', {
          event_category: 'storysdk_stories',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          story_id: params.storyId,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'next',
            user_id: params.uniqUserId,
            story_id: params.storyId,
            group_id: params.groupId,
            value: '',
            locale: params.language,
          },
        });
      },
      onPrev(params: { groupId: string; storyId: string; uniqUserId: string; language: string }) {
        ReactGA.gtag('event', 'storysdk_story_back', {
          event_category: 'storysdk_stories',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          story_id: params.storyId,
          language: params.language,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'back',
            user_id: params.uniqUserId,
            story_id: params.storyId,
            group_id: params.groupId,
            value: '',
            locale: params.language,
          },
        });
      },
    },
    widgets: {
      answer: {
        onAnswer(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          answer: string | string[] | number;
          uniqUserId: string;
          language: string;
        }) {
          ReactGA.gtag('event', 'storysdk_widget_answer', {
            event_category: 'storysdk_widgets',
            group_id: params.groupId,
            user_id: params.uniqUserId,
            story_id: params.storyId,
            language: params.language,
            value: params.answer,
            widget_id: params.widgetId,
          });

          return axios({
            method: 'post',
            url: '/reactions',
            data: {
              type: 'answer',
              group_id: params.groupId,
              story_id: params.storyId,
              widget_id: params.widgetId,
              user_id: params.uniqUserId,
              value: `${params.answer}`,
              locale: params.language,
            },
          });
        },
      },
      click: {
        onClick(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          uniqUserId: string;
          url: string;
          language: string;
        }) {
          ReactGA.gtag('event', 'storysdk_widget_click', {
            event_category: 'storysdk_widgets',
            group_id: params.groupId,
            user_id: params.uniqUserId,
            story_id: params.storyId,
            language: params.language,
            value: params.url,
            widget_id: params.widgetId,
          });

          return axios({
            method: 'post',
            url: '/reactions',
            data: {
              type: 'click',
              group_id: params.groupId,
              story_id: params.storyId,
              widget_id: params.widgetId,
              user_id: params.uniqUserId,
              value: `${params.url}`,
              locale: params.language,
            },
          });
        },
      },
    },
    quiz: {
      onQuizStart(params: {
        groupId: string;
        uniqUserId: string;
        time: string;
        language: string;
        storyId?: string;
      }) {
        ReactGA.gtag('event', 'storysdk_quiz_start', {
          event_category: 'storysdk_quizes',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          story_id: params.storyId,
          language: params.language,
          time: params.time,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'start',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            story_id: params.storyId,
            value: `${params.time}`,
            locale: params.language,
          },
        });
      },
      onQuizFinish(params: {
        groupId: string;
        uniqUserId: string;
        time: string;
        language: string;
        storyId?: string;
      }) {
        ReactGA.gtag('event', 'storysdk_quiz_finish', {
          event_category: 'storysdk_quizes',
          group_id: params.groupId,
          user_id: params.uniqUserId,
          story_id: params.storyId,
          language: params.language,
          time: params.time,
        });

        return axios({
          method: 'post',
          url: '/reactions',
          data: {
            type: 'finish',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: `${params.time}`,
            story_id: params.storyId,
            locale: params.language,
          },
        });
      },
    },
  },
};
