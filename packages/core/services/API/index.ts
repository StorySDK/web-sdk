import axios from 'axios';

export const API = {
  app: {
    getApp() {
      return axios({
        method: 'get',
        url: '/app'
      });
    }
  },
  groups: {
    getList() {
      return axios({
        method: 'get',
        url: `/groups`
      });
    }
  },
  stories: {
    getList(params: { groupId: string }) {
      return axios({
        method: 'get',
        url: `/groups/${params.groupId}/stories`
      });
    }
  },
  statistics: {
    group: {
      sendDuration(params: {
        groupId: string;
        uniqUserId: string;
        seconds: number;
        language: string;
      }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'duration',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: params.seconds,
            locale: params.language
          }
        });
      },
      onOpen(params: { groupId: string; uniqUserId: string; language: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'open',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: '',
            locale: params.language
          }
        });
      },
      onClose(params: { groupId: string; uniqUserId: string; language: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'close',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: '',
            locale: params.language
          }
        });
      }
    },
    story: {
      sendDuration(params: {
        groupId: string;
        storyId: string;
        uniqUserId: string;
        seconds: number;
        language: string;
      }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'duration',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: params.seconds,
            locale: params.language
          }
        });
      },

      sendImpression(params: {
        groupId: string;
        storyId: string;
        uniqUserId: string;
        seconds: number;
        language: string;
      }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'impression',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: params.seconds,
            locale: params.language
          }
        });
      },
      onOpen(params: { groupId: string; storyId: string; uniqUserId: string; language: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'open',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: '',
            locale: params.language
          }
        });
      },
      onClose(params: { groupId: string; storyId: string; uniqUserId: string; language: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'close',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: '',
            locale: params.language
          }
        });
      },
      onNext(params: { groupId: string; storyId: string; uniqUserId: string; language: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'next',
            user_id: params.uniqUserId,
            story_id: params.storyId,
            group_id: params.groupId,
            value: '',
            locale: params.language
          }
        });
      },
      onPrev(params: { groupId: string; storyId: string; uniqUserId: string; language: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'back',
            user_id: params.uniqUserId,
            story_id: params.storyId,
            group_id: params.groupId,
            value: '',
            locale: params.language
          }
        });
      }
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
          return axios({
            method: 'post',
            url: `/reactions`,
            data: {
              type: 'answer',
              group_id: params.groupId,
              story_id: params.storyId,
              widget_id: params.widgetId,
              user_id: params.uniqUserId,
              value: params.answer,
              locale: params.language
            }
          });
        }
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
          return axios({
            method: 'post',
            url: `/reactions`,
            data: {
              type: 'click',
              group_id: params.groupId,
              story_id: params.storyId,
              widget_id: params.widgetId,
              user_id: params.uniqUserId,
              value: params.url,
              locale: params.language
            }
          });
        }
      }
    },
    quiz: {
      onQuizStart(params: {
        groupId: string;
        uniqUserId: string;
        time: string;
        language: string;
        storyId?: string;
      }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'start',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            story_id: params.storyId,
            value: params.time,
            locale: params.language
          }
        });
      },
      onQuizFinish(params: {
        groupId: string;
        uniqUserId: string;
        time: string;
        language: string;
        storyId?: string;
      }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'finish',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: params.time,
            story_id: params.storyId,
            locale: params.language
          }
        });
      }
    }
  }
};
