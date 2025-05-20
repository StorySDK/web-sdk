export declare const API: {
    app: {
        getApp(): Promise<import("axios").AxiosResponse<any, any>>;
    };
    groups: {
        getList(): Promise<import("axios").AxiosResponse<any, any>>;
    };
    stories: {
        getList(params: {
            groupId: string;
        }): Promise<import("axios").AxiosResponse<any, any>>;
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
