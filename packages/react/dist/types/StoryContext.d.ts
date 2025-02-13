import { PlayStatusType } from '@components';
import { ScoreType } from '@types';
export interface StoryContenxt {
    currentStoryId: string;
    quizMode?: ScoreType;
    confetti?: any;
    playStatus: PlayStatusType;
    closeStoryGroup?: () => void;
    playStatusChange?: (status: PlayStatusType) => void;
    handleQuizAnswer?: (params: {
        type: string;
        answer: number | string;
    }) => void;
    getAnswerCache?: (widgetId: string) => any;
    setAnswerCache?: (widgetId: string, answer: any) => void;
}
