export interface QuizMultipleAnswerWithImageWidgetParamsType {
    title: string;
    color?: string;
    answers: Array<{
        id: string;
        title: string;
        image?: {
            url: string;
            fileId: string;
        };
    }>;
    isTitleHidden: boolean;
    storyId?: string;
}
