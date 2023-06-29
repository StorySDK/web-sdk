import '@storysdk/react/dist/bundle.css';
export declare class Story {
    token: string;
    viewOptions?: {
        groupImageWidth?: number;
        groupImageHeight?: number;
        groupTitleSize?: number;
        groupClassName?: string;
        groupsClassName?: string;
    };
    playOptions?: {
        autoplay?: boolean;
        groupId?: string;
        startStoryId?: string;
        forbidClose?: boolean;
        devMode?: boolean;
    };
    constructor(token: string, viewOptions?: {
        groupImageWidth?: number;
        groupImageHeight?: number;
        groupTitleSize?: number;
        groupClassName?: string;
        groupsClassName?: string;
    }, playOptions?: {
        autoplay?: boolean;
        groupId?: string;
        startStoryId?: string;
        forbidClose?: boolean;
        devMode?: boolean;
    });
    renderGroups(element?: Element | HTMLDivElement | null): void;
}
