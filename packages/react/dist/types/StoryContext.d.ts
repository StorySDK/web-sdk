import { ScoreType } from '@types';
export interface StoryContenxt {
    currentStoryId: string;
    quizMode?: ScoreType;
    playStatusChange?: any;
    confetti?: any;
    handleQuizAnswer?: (params: {
        type: string;
        answer: number | string;
    }) => void;
    getAnswerCache?: (widgetId: string) => any;
    setAnswerCache?: (widgetId: string, answer: any) => void;
}
