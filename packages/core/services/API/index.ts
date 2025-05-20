import axios from 'axios';
import ReactGA from 'react-ga4';
import { StorageService } from '@storysdk/react';

// Request wrapper with caching capability
const makeRequestWithHeadCheck = async (options: any) => {
  const cacheKey = `storysdk_api_cache_${options.url}`;

  // First make a HEAD request
  const headResult = await axios({
    method: 'head',
    url: options.url,
  });

  const lastModified = headResult.headers['last-modified'];

  // Try to get cached data
  const cachedData = await StorageService.getCachedData(cacheKey, lastModified);

  // If we have valid cached data, return it
  if (cachedData) {
    return {
      data: cachedData,
      status: 200,
      statusText: 'OK (from cache)',
      headers: headResult.headers,
      config: {},
    };
  }

  // If no cache or it's outdated - perform the main request
  const response = await axios(options);

  // Save the result to cache along with the last-modified date
  if (lastModified) {
    await StorageService.setCachedData(cacheKey, response.data, lastModified);
  }

  return response;
};

export const API = {
  app: {
    getApp() {
      return makeRequestWithHeadCheck({
        method: 'get',
        url: '/app',
      });
    },
  },
  groups: {
    getList() {
      return makeRequestWithHeadCheck({
        method: 'get',
        url: '/groups',
      });
    },
  },
  stories: {
    getList(params: { groupId: string }) {
      return makeRequestWithHeadCheck({
        method: 'get',
        url: `/groups/${params.groupId}/stories`,
      });
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
