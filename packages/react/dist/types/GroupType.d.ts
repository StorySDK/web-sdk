import { StoryType } from '.';
export declare enum GroupType {
    GROUP = "group",
    ONBOARDING = "onboarding"
}
export declare enum StorySize {
    SMALL = "SMALL",
    LARGE = "LARGE"
}
export declare enum ScoreType {
    NUMBERS = "numbers",
    LETTERS = "letters"
}
export interface StoriesGroupSettings {
    storiesSize?: StorySize;
    isProgressHidden?: boolean;
    isProhibitToClose?: boolean;
    addToStories?: boolean;
    scoreType?: ScoreType;
    scoreResultLayersGroupId?: string;
}
export interface Group {
    id: string;
    imageUrl: string;
    title: string;
    stories: StoryType[];
    type: GroupType;
    settings?: StoriesGroupSettings;
}
