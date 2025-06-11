import { ScoreType } from './GroupType';

export type PlayStatusType = 'wait' | 'play' | 'pause';

export interface StoryContenxt {
  currentStoryId: string;
  quizMode?: ScoreType;
  confetti?: any;
  playStatus: PlayStatusType;
  container?: Element | HTMLDivElement | null;
  uniqUserId?: string;
  token?: string;
  closeStoryGroup?: () => void;
  playStatusChange?: (status: PlayStatusType) => void;
  handleQuizAnswer?: (params: { type: string; answer: number | string }) => void;
  getAnswerCache?: (widgetId: string) => any;
  setAnswerCache?: (widgetId: string, answer: any) => void;
}
