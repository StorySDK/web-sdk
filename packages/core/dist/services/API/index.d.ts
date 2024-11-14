import { time } from 'console';
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
            answer: {
                onAnswer(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    answer: string | string[] | number;
                    uniqUserId: string;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
            click: {
                onClick(params: {
                    widgetId: string;
                    storyId: string;
                    groupId: string;
                    uniqUserId: string;
                    url: string;
                    language: string;
                }): import("axios").AxiosPromise<any>;
            };
        };
        quiz: {
            onQuizStart(params: {
                groupId: string;
                uniqUserId: string;
                time: string;
                language: string;
                storyId?: string;
            }): import("axios").AxiosPromise<any>;
            onQuizFinish(params: {
                groupId: string;
                uniqUserId: string;
                time: string;
                language: string;
                storyId?: string;
            }): import("axios").AxiosPromise<any>;
        };
    };
};
