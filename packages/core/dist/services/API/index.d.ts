export declare const API: {
    app: {
        getApp(): import("axios").AxiosPromise<any>;
    };
    groups: {
        getList(): import("axios").AxiosPromise<any>;
    };
    stories: {
        getList(params: {
            groupId: string;
        }): import("axios").AxiosPromise<any>;
    };
    statistics: {
        group: {
            sendDuration(params: {
                groupId: string;
                uniqUserId: string;
                seconds: number;
                language: string;
            }): import("axios").AxiosPromise<any>;
            onOpen(params: {
                groupId: string;
                uniqUserId: string;
                language: string;
            }): import("axios").AxiosPromise<any>;
            onClose(params: {
                groupId: string;
                uniqUserId: string;
                language: string;
            }): import("axios").AxiosPromise<any>;
        };
        story: {
            sendDuration(params: {
                groupId: string;
                storyId: string;
                uniqUserId: string;
                seconds: number;
                language: string;
            }): import("axios").AxiosPromise<any>;
            sendImpression(params: {
                groupId: string;
                storyId: string;
                uniqUserId: string;
                seconds: number;
                language: string;
            }): import("axios").AxiosPromise<any>;
            onOpen(params: {
                groupId: string;
                storyId: string;
                uniqUserId: string;
                language: string;
            }): import("axios").AxiosPromise<any>;
            onClose(params: {
                groupId: string;
                storyId: string;
                uniqUserId: string;
                language: string;
            }): import("axios").AxiosPromise<any>;
            onNext(params: {
                groupId: string;
                storyId: string;
                uniqUserId: string;
                language: string;
            }): import("axios").AxiosPromise<any>;
            onPrev(params: {
                groupId: string;
                storyId: string;
                uniqUserId: string;
                language: string;
            }): import("axios").AxiosPromise<any>;
        };
        widgets: {
            chooseAnswer: {
                onAnswer(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    answer: string;
                    uniqUserId: string;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
            clickMe: {
                onClick(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    uniqUserId: string;
                    url: string;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
            emojiReaction: {
                onReact(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    uniqUserId: string;
                    emoji: string;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
            question: {
                onAnswer(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    uniqUserId: string;
                    answer: string;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
            slider: {
                onSlide(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    uniqUserId: string;
                    value: number;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
            swipeUp: {
                onSwipe(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    uniqUserId: string;
                    url: string;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
            talkAbout: {
                onAnswer(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    uniqUserId: string;
                    answer: string;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
        };
    };
};
