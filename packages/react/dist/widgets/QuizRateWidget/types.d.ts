export interface QuizRateWidgetParamsType {
    title: string;
    isTitleHidden: boolean;
    storeLinks: {
        [key: string]: string;
    };
    storyId?: string;
}
