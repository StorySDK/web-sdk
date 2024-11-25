import '@storysdk/react/dist/bundle.css';
export declare class Story {
    token: string;
    options?: {
        groupImageWidth?: number;
        groupImageHeight?: number;
        groupTitleSize?: number;
        groupClassName?: string;
        groupsClassName?: string;
        storyWidth?: number;
        storyHeight?: number;
        isShowMockup?: boolean;
        isShowLabel?: boolean;
        isStatusBarActive?: boolean;
        autoplay?: boolean;
        groupId?: string;
        isDebugMode?: boolean;
        startStoryId?: string;
        forbidClose?: boolean;
        groupOutlineColor?: string;
        openInExternalModal?: boolean;
        devMode?: 'staging' | 'development';
    };
    constructor(token: string, options?: {
        isDebugMode?: boolean;
        groupImageWidth?: number;
        groupImageHeight?: number;
        groupOutlineColor?: string;
        groupTitleSize?: number;
        groupClassName?: string;
        groupsClassName?: string;
        storyWidth?: number;
        storyHeight?: number;
        isShowMockup?: boolean;
        isShowLabel?: boolean;
        isStatusBarActive?: boolean;
        autoplay?: boolean;
        groupId?: string;
        startStoryId?: string;
        forbidClose?: boolean;
        openInExternalModal?: boolean;
        devMode?: 'staging' | 'development';
    });
    renderGroups(element?: Element | HTMLDivElement | null): void;
}
export declare const init: () => void;
