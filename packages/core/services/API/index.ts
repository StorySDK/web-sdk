import axios from 'axios';

export const API = {
  apps: {
    getList() {
      return axios({
        method: 'get',
        url: '/apps'
      });
    }
  },
  groups: {
    getList(params: { appId: string }) {
      return axios({
        method: 'get',
        url: `/apps/${params.appId}/groups`
      });
    }
  },
  stories: {
    getList(params: { appId: string; groupId: string }) {
      return axios({
        method: 'get',
        url: `/apps/${params.appId}/groups/${params.groupId}/stories`
      });
    }
  },
  statistics: {
    group: {
      sendDuration(params: { groupId: string; uniqUserId: string; seconds: number }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'duration',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: params.seconds
          }
        });
      },
      onOpen(params: { groupId: string; uniqUserId: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'open',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: ''
          }
        });
      },
      onClose(params: { groupId: string; uniqUserId: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'close',
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: ''
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
      }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'duration',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: params.seconds
          }
        });
      },
      onOpen(params: { groupId: string; storyId: string; uniqUserId: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'open',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: ''
          }
        });
      },
      onClose(params: { groupId: string; storyId: string; uniqUserId: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'close',
            story_id: params.storyId,
            user_id: params.uniqUserId,
            group_id: params.groupId,
            value: ''
          }
        });
      },
      onNext(params: { groupId: string; storyId: string; uniqUserId: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'next',
            user_id: params.uniqUserId,
            story_id: params.storyId,
            group_id: params.groupId,
            value: ''
          }
        });
      },
      onPrev(params: { groupId: string; storyId: string; uniqUserId: string }) {
        return axios({
          method: 'post',
          url: `/reactions`,
          data: {
            type: 'back',
            user_id: params.uniqUserId,
            story_id: params.storyId,
            group_id: params.groupId,
            value: ''
          }
        });
      }
    },
    widgets: {
      chooseAnswer: {
        onAnswer(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          answer: string;
          uniqUserId: string;
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
              value: params.answer
            }
          });
        }
      },
      clickMe: {
        onClick(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          uniqUserId: string;
          url: string;
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
              value: params.url
            }
          });
        }
      },
      emojiReaction: {
        onReact(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          uniqUserId: string;
          emoji: string;
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
              value: params.emoji
            }
          });
        }
      },
      question: {
        onAnswer(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          uniqUserId: string;
          answer: string;
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
              value: params.answer
            }
          });
        }
      },
      slider: {
        onSlide(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          uniqUserId: string;
          value: number;
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
              value: params.value
            }
          });
        }
      },
      swipeUp: {
        onSwipe(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          uniqUserId: string;
          url: string;
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
              value: params.url
            }
          });
        }
      },
      talkAbout: {
        onAnswer(params: {
          widgetId: string;
          storyId: string;
          groupId: string;
          uniqUserId: string;
          answer: string;
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
              value: params.answer
            }
          });
        }
      }
    }
  }
};
