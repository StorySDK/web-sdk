import '@storysdk/react/dist/bundle.css';
export declare class Story {
    token: string;
    options?: {
        groupImageWidth?: number;
        groupImageHeight?: number;
        groupTitleSize?: number;
        groupClassName?: string;
        groupsClassName?: string;
        autoplay?: boolean;
        groupId?: string;
        startStoryId?: string;
        forbidClose?: boolean;
        storyWidth?: number;
        storyHeight?: number;
        devMode?: boolean;
    };
    constructor(token: string, options?: {
        groupImageWidth?: number;
        groupImageHeight?: number;
        groupTitleSize?: number;
        groupClassName?: string;
        groupsClassName?: string;
        autoplay?: boolean;
        groupId?: string;
        startStoryId?: string;
        forbidClose?: boolean;
        storyWidth?: number;
        storyHeight?: number;
        devMode?: boolean;
    });
    renderGroups(element?: Element | HTMLDivElement | null): void;
}
export declare const init: () => void;
