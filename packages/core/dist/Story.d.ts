import EventEmitter from './EventEmitter';
import '@storysdk/react/dist/bundle.css';
declare global {
    interface Window {
        storysdk?: Story;
    }
}
/**
 * Main Story class for StorySDK
 */
export declare class Story extends EventEmitter {
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
        arrowsColor?: string;
        backgroundColor?: string;
        isStatusBarActive?: boolean;
        autoplay?: boolean;
        groupId?: string;
        isDebugMode?: boolean;
        startStoryId?: string;
        forbidClose?: boolean;
        activeGroupOutlineColor?: string;
        groupsOutlineColor?: string;
        openInExternalModal?: boolean;
        devMode?: 'staging' | 'development';
    };
    container?: Element | HTMLDivElement | null;
    eventHandlers: {
        [key: string]: ((data: any) => void)[];
    };
    constructor(token: string, options?: {
        isDebugMode?: boolean;
        groupImageWidth?: number;
        groupImageHeight?: number;
        activeGroupOutlineColor?: string;
        groupsOutlineColor?: string;
        groupTitleSize?: number;
        groupClassName?: string;
        groupsClassName?: string;
        arrowsColor?: string;
        backgroundColor?: string;
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
    private setupEventListeners;
    renderGroups(container?: Element | HTMLDivElement | null): void;
    destroy(): void;
}
export declare const init: () => void;
