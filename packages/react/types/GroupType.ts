/* eslint-disable no-shadow */
import { StoryType } from '.';

export enum GroupType {
  GROUP = 'group',
  ONBOARDING = 'onboarding'
}

export enum StorySize {
  SMALL = 'SMALL',
  LARGE = 'LARGE'
}

export interface StoriesGroupSettings {
  storiesSize?: StorySize;
  isProgressHidden?: boolean;
  isProhibitToClose?: boolean;
  addToStories?: boolean;
}

export interface Group {
  id: string;
  imageUrl: string;
  title: string;
  stories: StoryType[];
  type: GroupType;
  settings?: StoriesGroupSettings;
}
