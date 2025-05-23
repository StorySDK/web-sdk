/* eslint-disable no-shadow */
import { ColorValue, StoryType } from '.';

export enum GroupType {
  GROUP = 'group',
  ONBOARDING = 'onboarding',
  TEMPLATE = 'template'
}

export enum StorySize {
  SMALL = 'SMALL',
  LARGE = 'LARGE'
}

export enum ScoreType {
  NUMBERS = 'numbers',
  LETTERS = 'letters'
}

export interface StoriesGroupSettings {
  isProgressHidden?: boolean;
  isProhibitToClose?: boolean;
  addToStories?: boolean;
  scoreType?: ScoreType;
  scoreResultLayersGroupId?: string;
  lastStoryPosition?: number;
  shortDataId?: string;
  autoplayVideos?: boolean;
  background?: ColorValue;
}

export interface Group {
  id: string;
  imageUrl: string;
  title: string;
  stories: StoryType[];
  type: GroupType;
  settings?: StoriesGroupSettings;
  category?: string;
}

export interface LoadStory {
  id: string;
  position: number;
  groupId: string;
  status: 'init' | 'waiting' | 'loading' | 'ready';
}
