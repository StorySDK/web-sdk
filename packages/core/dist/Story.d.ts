import EventEmitter from './EventEmitter';
import { StoryEventTypes } from './types';
declare global {
    interface Window {
        storysdk?: Story;
        Story?: typeof Story;
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}
/**
 * Main Story class for StorySDK
 */
export declare class Story extends EventEmitter {
    token: string;
    isInReactNativeWebView: boolean;
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
        isForceCloseAvailable?: boolean;
        autoplay?: boolean;
        groupId?: string;
        isOnboarding?: boolean;
        isDebugMode?: boolean;
        startStoryId?: string;
        forbidClose?: boolean;
        activeGroupOutlineColor?: string;
        groupsOutlineColor?: string;
        openInExternalModal?: boolean;
        isOnlyGroups?: boolean;
        devMode?: 'staging' | 'development';
        isInReactNativeWebView?: boolean;
        preventCloseOnGroupClick?: boolean;
        disableCache?: boolean;
    };
    container?: Element | HTMLDivElement | null;
    root: any;
    eventHandlers: {
        [key: string]: ((data: any) => void)[];
    };
    private listenersSetup;
    private isDestroying;
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
        isForceCloseAvailable?: boolean;
        isStatusBarActive?: boolean;
        autoplay?: boolean;
        groupId?: string;
        startStoryId?: string;
        forbidClose?: boolean;
        isOnboarding?: boolean;
        openInExternalModal?: boolean;
        devMode?: 'staging' | 'development';
        isInReactNativeWebView?: boolean;
        preventCloseOnGroupClick?: boolean;
        isOnlyGroups?: boolean;
        disableCache?: boolean;
    });
    private handleReactNativeMessage;
    private sendMessageToReactNative;
    /**
     * Sends debug messages to React Native WebView if isInReactNativeWebView and isDebugMode = true
     */
    private sendDebugInfoToReactNative;
    emit(eventName: StoryEventTypes, data: any): void;
    /**
     * Updates the token and axios headers
     */
    updateToken(newToken: string): void;
    private setupEventListeners;
    renderGroups(container?: Element | HTMLDivElement | null): void;
    destroy(): void;
}
export declare const init: () => void;
