import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Group } from '@storysdk/types';
import { renderElement, unmountComponent } from '../utils/reactUtils';
import { StoryModal } from '../components';

// Global counter for unique modal IDs
let modalCounter = 0;

export interface UseStoryModalOptions {
  groups?: Group[];
  group?: Group; // Для случая с одной группой (как в CarouselList)
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
  // Callbacks
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
  // State
  modalShow: boolean;
  currentGroup: number;
  currentGroupItem?: Group;

  // Actions
  openStoryModal: (groupIndex?: number, storyId?: string) => void;
  closeStoryModal: () => void;
  selectGroup: (groupIndex: number) => void;
  nextGroup: () => void;
  prevGroup: () => void;

  // For direct story opening (CarouselList case)
  openStoryInGroup: (groupId: string, storyId: string) => void;
}

export const useStoryModal = (options: UseStoryModalOptions): UseStoryModalReturn => {
  const {
    groups,
    group,
    autoplay = false,
    startStoryId,
    startGroupId,
    forbidClose = false,
    isOnlyGroups = false,
    isLoading = false,
    // StoryModal props
    arrowsColor,
    backgroundColor,
    container,
    devMode,
    isForceCloseAvailable,
    isInReactNativeWebView,
    isShowLabel,
    isShowMockup,
    isStatusBarActive,
    openInExternalModal,
    storyHeight,
    storyWidth,
    token,
    // Callbacks
    onOpenGroup,
    onCloseGroup,
    onNextStory,
    onPrevStory,
    onCloseStory,
    onOpenStory,
    onStartQuiz,
    onFinishQuiz,
    onModalOpen,
    onModalClose,
  } = options;

  // Create unique ID for this hook instance
  const modalId = useMemo(() => `storysdk-modal-${++modalCounter}`, []);

  // Normalize groups - either from groups prop or single group
  const normalizedGroups = useMemo(() => {
    if (groups && groups.length > 0) {
      return groups;
    }
    if (group) {
      return [group];
    }
    return [];
  }, [groups, group]);

  const [currentGroup, setCurrentGroup] = useState(-1);
  const [modalShow, setModalShow] = useState(!!autoplay);
  const [currentGroupItem, setCurrentGroupItem] = useState<Group | undefined>();
  const [currentStoryId, setCurrentStoryId] = useState<string | undefined>(startStoryId);

  const modalRootRef = useRef<any>(null);
  const rootElementRef = useRef<HTMLElement | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Create modal root element with unique ID
  const rootElement = useMemo(() => {
    // Check if we already have a root element for this instance
    if (rootElementRef.current) {
      return rootElementRef.current;
    }

    const element = document.createElement('div');
    element.id = modalId;
    element.style.zIndex = '10000';
    rootElementRef.current = element;
    return element;
  }, [modalId]);

  // Manage root element in DOM
  useEffect(() => {
    isMountedRef.current = true;

    if (rootElement && !document.getElementById(modalId)) {
      document.body.appendChild(rootElement);
    }

    return () => {
      // Mark as unmounted immediately
      isMountedRef.current = false;

      // Cleanup: remove root element when hook unmounts
      if (rootElement && document.getElementById(modalId)) {
        // First unmount React components
        if (modalRootRef.current) {
          unmountComponent(null, modalRootRef.current).catch((error) => {
            console.warn('StorySDK: Error during cleanup unmount:', error);
          });
          modalRootRef.current = null;
        }

        // Then remove DOM element
        try {
          document.body.removeChild(rootElement);
        } catch (error) {
          console.warn('StorySDK: Error removing modal root element:', error);
        }
      }
    };
  }, [rootElement, modalId]);

  // Initialize current group
  useEffect(() => {
    if (startGroupId && normalizedGroups.length > 0) {
      const groupIndex = normalizedGroups.findIndex((g) => g.id === startGroupId);
      if (groupIndex !== -1) {
        setCurrentGroup(groupIndex);
      }
    } else if (normalizedGroups.length > 0) {
      setCurrentGroup(0);
    }
  }, [normalizedGroups, startGroupId]);

  // Update current group item when currentGroup changes
  useEffect(() => {
    if (normalizedGroups[currentGroup]) {
      setCurrentGroupItem(normalizedGroups[currentGroup]);
    } else {
      setCurrentGroupItem(undefined);
    }
  }, [currentGroup, normalizedGroups]);

  // Auto-open group on autoplay
  useEffect(() => {
    if (autoplay && onOpenGroup && normalizedGroups.length > 0) {
      onOpenGroup(startGroupId ?? normalizedGroups[0].id);
    }
  }, [autoplay, normalizedGroups.length, startGroupId, onOpenGroup]);

  // Handlers
  const handleSelectGroup = useCallback(
    (groupIndex: number) => {
      setCurrentGroup(groupIndex);
      setModalShow(true);

      if (onOpenGroup && normalizedGroups[groupIndex]) {
        onOpenGroup(normalizedGroups[groupIndex].id);
      }
    },
    [normalizedGroups, onOpenGroup],
  );

  const handlePrevGroup = useCallback(() => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);

      if (onOpenGroup && onCloseGroup && normalizedGroups[currentGroup] && normalizedGroups[currentGroup - 1]) {
        onCloseGroup(normalizedGroups[currentGroup].id);

        setTimeout(() => {
          onOpenGroup(normalizedGroups[currentGroup - 1].id);
        }, 0);
      }
    }
  }, [currentGroup, normalizedGroups, onCloseGroup, onOpenGroup]);

  const handleNextGroup = useCallback(() => {
    if (currentGroup < normalizedGroups.length - 1) {
      setCurrentGroup(currentGroup + 1);

      if (onOpenGroup && onCloseGroup && normalizedGroups[currentGroup] && normalizedGroups[currentGroup + 1]) {
        onCloseGroup(normalizedGroups[currentGroup].id);

        setTimeout(() => {
          onOpenGroup(normalizedGroups[currentGroup + 1].id);
        }, 0);
      }
    }
  }, [currentGroup, normalizedGroups, onCloseGroup, onOpenGroup]);

  const handleCloseModal = useCallback(() => {
    if (onCloseGroup && normalizedGroups[currentGroup]) {
      onCloseGroup(normalizedGroups[currentGroup].id);
    }

    if (!forbidClose) {
      setModalShow(false);
    }
  }, [currentGroup, forbidClose, normalizedGroups, onCloseGroup]);

  const handleOpenStoryInGroup = useCallback((groupId: string, storyId: string) => {
    const groupIndex = normalizedGroups.findIndex((g) => g.id === groupId);
    if (groupIndex !== -1) {
      setCurrentGroup(groupIndex);
      setCurrentStoryId(storyId);
      setModalShow(true);

      if (onOpenGroup) {
        onOpenGroup(groupId);
      }
    }
  }, [normalizedGroups, onOpenGroup]);

  const handleOpenStoryModal = useCallback((groupIndex?: number, storyId?: string) => {
    if (groupIndex !== undefined) {
      setCurrentGroup(groupIndex);
    }
    if (storyId) {
      setCurrentStoryId(storyId);
    }
    setModalShow(true);

    if (onOpenGroup && normalizedGroups[groupIndex ?? currentGroup]) {
      onOpenGroup(normalizedGroups[groupIndex ?? currentGroup].id);
    }
  }, [normalizedGroups, onOpenGroup, currentGroup]);

  // Memoize modal props to prevent unnecessary re-renders
  const modalProps = useMemo(() => ({
    arrowsColor,
    backgroundColor,
    container,
    currentGroup: currentGroupItem,
    devMode,
    forbidClose,
    isFirstGroup: currentGroup === 0,
    isForceCloseAvailable,
    isInReactNativeWebView,
    isLastGroup: currentGroup === normalizedGroups.length - 1,
    isLoading,
    isShowLabel,
    isShowMockup,
    isShowing: modalShow,
    isStatusBarActive,
    openInExternalModal,
    startStoryId: currentStoryId || startStoryId,
    stories: currentGroupItem?.stories,
    storyHeight,
    storyWidth,
    token,
    onClose: handleCloseModal,
    onCloseStory,
    onFinishQuiz,
    onModalClose,
    onModalOpen,
    onNextGroup: handleNextGroup,
    onNextStory,
    onOpenStory,
    onPrevGroup: handlePrevGroup,
    onPrevStory,
    onStartQuiz,
  }), [
    arrowsColor,
    backgroundColor,
    container,
    currentGroupItem,
    devMode,
    forbidClose,
    currentGroup,
    normalizedGroups.length,
    isLoading,
    isShowLabel,
    isShowMockup,
    modalShow,
    isStatusBarActive,
    openInExternalModal,
    currentStoryId,
    startStoryId,
    storyHeight,
    storyWidth,
    token,
    isForceCloseAvailable,
    isInReactNativeWebView,
    handleCloseModal,
    onCloseStory,
    onFinishQuiz,
    onModalClose,
    onModalOpen,
    handleNextGroup,
    onNextStory,
    onOpenStory,
    handlePrevGroup,
    onPrevStory,
    onStartQuiz,
  ]);

  // Create StoryModal component only when props actually change
  const createStoryModal = useCallback(() => React.createElement(StoryModal, modalProps),
    [modalProps]);

  // Track previous props to avoid unnecessary re-renders
  const prevModalPropsRef = useRef(modalProps);
  const shouldRenderRef = useRef(true);

  // Only update if props actually changed (safe comparison)
  useEffect(() => {
    const prev = prevModalPropsRef.current;
    const current = modalProps;

    // Critical props that should trigger re-render
    const criticalPropsChanged = (
      prev.isShowing !== current.isShowing
      || prev.currentGroup !== current.currentGroup
      || prev.stories !== current.stories
      || prev.startStoryId !== current.startStoryId
    );

    // Safe comparison for other props (excluding HTML elements and functions)
    const safePropsChanged = (
      prev.arrowsColor !== current.arrowsColor
      || prev.backgroundColor !== current.backgroundColor
      || prev.devMode !== current.devMode
      || prev.forbidClose !== current.forbidClose
      || prev.isFirstGroup !== current.isFirstGroup
      || prev.isForceCloseAvailable !== current.isForceCloseAvailable
      || prev.isInReactNativeWebView !== current.isInReactNativeWebView
      || prev.isLastGroup !== current.isLastGroup
      || prev.isLoading !== current.isLoading
      || prev.isShowLabel !== current.isShowLabel
      || prev.isShowMockup !== current.isShowMockup
      || prev.isStatusBarActive !== current.isStatusBarActive
      || prev.openInExternalModal !== current.openInExternalModal
      || prev.storyHeight !== current.storyHeight
      || prev.storyWidth !== current.storyWidth
      || prev.token !== current.token
      || prev.container !== current.container
    );

    shouldRenderRef.current = criticalPropsChanged || safePropsChanged;

    prevModalPropsRef.current = current;
  }, [modalProps]);

  // Render and update StoryModal only when necessary
  useEffect(() => {
    if (isOnlyGroups || !rootElement || !isMountedRef.current || !shouldRenderRef.current) {
      return;
    }

    // Clean up previous render if exists
    if (modalRootRef.current) {
      unmountComponent(null, modalRootRef.current).catch((error) => {
        console.warn('StorySDK: Error during previous render cleanup:', error);
      });
      modalRootRef.current = null;
    }

    // Render new modal with mounted check
    renderElement(
      createStoryModal(),
      rootElement,
    ).then((root) => {
      // Only update if still mounted
      if (isMountedRef.current) {
        modalRootRef.current = root;
        return;
      }

      // If unmounted while rendering, clean up the root
      if (root && typeof root.unmount === 'function') {
        root.unmount();
      }
    }).catch((error) => {
      if (isMountedRef.current) {
        console.error('StorySDK: Error during modal render:', error);
      }
    });

    // Reset the render flag
    shouldRenderRef.current = false;
  }, [createStoryModal, isOnlyGroups, rootElement]);

  return {
    // State
    modalShow,
    currentGroup,
    currentGroupItem,

    // Actions
    openStoryModal: handleOpenStoryModal,
    closeStoryModal: handleCloseModal,
    selectGroup: handleSelectGroup,
    nextGroup: handleNextGroup,
    prevGroup: handlePrevGroup,
    openStoryInGroup: handleOpenStoryInGroup,
  };
};
