import { Group } from '@storysdk/types';
export interface UseStoryModalOptions {
    groups?: Group[];
    group?: Group;
    autoplay?: boolean;
    startStoryId?: string;
    startGroupId?: string;
    forbidClose?: boolean;
    isOnlyGroups?: boolean;
    isLoading?: boolean;
    arrowsColor?: string;
    backgroundColor?: string;
    container?: Element | HTMLDivElement | null;
    devMode?: 'staging' | 'development';
    isForceCloseAvailable?: boolean;
    isInReactNativeWebView?: boolean;
    isShowLabel?: boolean;
    isShowMockup?: boolean;
    isStatusBarActive?: boolean;
    openInExternalModal?: boolean;
    storyHeight?: number;
    storyWidth?: number;
    token?: string;
    onOpenGroup?(id: string): void;
    onCloseGroup?(id: string): void;
    onNextStory?(groupId: string, storyId: string): void;
    onPrevStory?(groupId: string, storyId: string): void;
    onCloseStory?(groupId: string, storyId: string, duration: number): void;
    onOpenStory?(groupId: string, storyId: string): void;
    onStartQuiz?(groupId: string, storyId?: string): void;
    onFinishQuiz?(groupId: string, storyId?: string): void;
    onModalOpen?(groupId: string, storyId: string): void;
    onModalClose?(groupId: string, storyId: string): void;
}
export interface UseStoryModalReturn {
    modalShow: boolean;
    currentGroup: number;
    currentGroupItem?: Group;
    openStoryModal: (groupIndex?: number, storyId?: string) => void;
    closeStoryModal: () => void;
    selectGroup: (groupIndex: number) => void;
    nextGroup: () => void;
    prevGroup: () => void;
    openStoryInGroup: (groupId: string, storyId: string) => void;
}
export declare const useStoryModal: (options: UseStoryModalOptions) => UseStoryModalReturn;
