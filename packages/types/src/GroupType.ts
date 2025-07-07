/* eslint-disable no-shadow */
import { ColorValue, StoryType } from '.';

export enum GroupType {
  GROUP = 'group',
  ONBOARDING = 'onboarding',
  TEMPLATE = "template",
  PARENT_GROUP = 'parent-group',
  PREVIEW_WIDGET = 'preview-widget',
  CAROUSEL = 'carousel'
}

export enum StorySize {
  SMALL = 'SMALL',
  LARGE = 'LARGE'
}

export enum ScoreType {
  NUMBERS = 'numbers',
  LETTERS = 'letters'
}

export type PlatformStyleSettings = {
  ios?: string;
  android?: string;
  react?: string;
  web?: string;
};

export interface GroupStyleSettings {
  itemStyle?: PlatformStyleSettings;
  titlePosition?: PlatformStyleSettings;
  isShowMockup?: boolean;
  strokeThickness?: number;
  activeColor?: string;
  inactiveColor?: string;
  width?: number;
  height?: number;
  showTitle?: boolean;
  title?: string;
  position?: string;
  size?: string;
  showPlayButton?: boolean;
  autoplay?: boolean;
  allowDragDrop?: boolean;
  radius?: number;
  border?: number;
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
  style?: GroupStyleSettings
}

export interface Group {
  id: string;
  parentId?: string;
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

export enum GroupsDisplayType {
  HIGHLIGHTS = 'highlights',
  CAROUSEL = 'carousel',
  POPVIDEO = 'popvideo'
}
