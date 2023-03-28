import { ScoreType } from '@types';

export interface StoryContenxt {
  currentStoryId: string;
  quizMode?: ScoreType;
  playStatusChange?: any;
  confetti?: any;
  handleQuizAnswer?(answer: number | string): void;
}
