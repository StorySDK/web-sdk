import { StoryType } from '.';

export interface GroupType {
  id: string;
  imageUrl: string;
  title: string;
  stories: StoryType[];
}
