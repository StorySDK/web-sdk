import { StoryType } from '.';
export declare enum GroupType {
    GROUP = "group",
    ONBOARDING = "onboarding"
}
export interface Group {
    id: string;
    imageUrl: string;
    title: string;
    stories: StoryType[];
    type: GroupType;
    settings: any;
}
