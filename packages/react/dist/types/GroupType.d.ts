import { StoryType } from '.';
export declare enum GroupType {
    GROUP = "group",
    ONBOARDING = "onboarding",
    TEMPLATE = "template"
}
export declare enum ScoreType {
    NUMBERS = "numbers",
    LETTERS = "letters"
}
export interface StoriesGroupSettings {
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
