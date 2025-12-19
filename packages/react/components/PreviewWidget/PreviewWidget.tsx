import React, {
  useState, useRef, useCallback, useMemo,
} from 'react';
import block from 'bem-cn';
import classNames from 'classnames';
import { Group } from '@storysdk/types';
import { StoryPreview } from '../StoryPreview';
import { useStoryModal } from '../../hooks';
import '../GroupsList/GroupsList.scss';
import './PreviewWidget.scss';

const b = block('GroupsSdkList');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PreviewWidgetProps {
  groups: Group[];
  groupsClassName?: string;
  isLoading?: boolean;
  isInReactNativeWebView?: boolean;
  // StoryModal props - keeping for future compatibility
  storyWidth?: number;
  storyHeight?: number;
  isStatusBarActive?: boolean;
  isShowMockup?: boolean;
  isShowLabel?: boolean;
  token?: string;
  arrowsColor?: string;
  autoplay?: boolean;
  startStoryId?: string;
  isForceCloseAvailable?: boolean;
  backgroundColor?: string;
  startGroupId?: string;
  forbidClose?: boolean;
  openInExternalModal?: boolean;
  devMode?: 'staging' | 'development';
  container?: Element | HTMLDivElement | null;
  style?: {
    isShowMockup?: boolean;
    showTitle?: boolean;
    title?: string;
    position?: string;
    size?: string;
    showPlayButton?: boolean;
    autoplay?: boolean;
    allowDragDrop?: boolean;
    radius?: number;
    border?: number;
  } | null;
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

export const PreviewWidget: React.FC<PreviewWidgetProps> = (props) => {
  const {
    groups,
    isLoading,
    groupsClassName,
    isInReactNativeWebView,
    // StoryModal props
    storyWidth,
    storyHeight,
    isStatusBarActive,
    isShowMockup,
    isShowLabel,
    token,
    arrowsColor,
    autoplay,
    startStoryId,
    isForceCloseAvailable,
    backgroundColor,
    startGroupId,
    forbidClose,
    openInExternalModal,
    devMode,
    container,
    style,
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
  } = props;

  // Apply style settings from groups settings if available
  const finalIsShowMockup = style?.isShowMockup !== undefined ? style.isShowMockup : isShowMockup;
  const finalShowTitle = style?.showTitle;
  const finalTitle = style?.title;
  const finalPosition = style?.position;
  const finalSize = style?.size;
  const finalShowPlayButton = style?.showPlayButton;
  const finalAutoplay = style?.autoplay !== undefined ? style.autoplay : autoplay;
  const finalAllowDragDrop = style?.allowDragDrop;
  const finalRadius = style?.radius;
  const finalBorder = style?.border;

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Preview widget dimensions based on size
  const getSizeConfig = (size: string | undefined) => {
    switch (size) {
      case 'small':
        return { width: 50, height: 60 };
      case 'medium':
        return { width: 70, height: 80 };
      case 'large':
        return { width: 90, height: 110 };
      default:
        return { width: 70, height: 80 }; // medium as default
    }
  };

  const { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT } = getSizeConfig(finalSize);

  // Calculate initial position based on style settings
  const getInitialPosition = useCallback((positionType: string | undefined) => {
    const padding = 20;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    switch (positionType) {
      case 'left-top':
        return { x: padding, y: padding };
      case 'left-bottom':
        return { x: padding, y: Math.max(padding, windowHeight - PREVIEW_HEIGHT - padding) };
      case 'right-top':
        return { x: Math.max(padding, windowWidth - PREVIEW_WIDTH - padding), y: padding };
      case 'right-bottom':
        return {
          x: Math.max(padding, windowWidth - PREVIEW_WIDTH - padding),
          y: Math.max(padding, windowHeight - PREVIEW_HEIGHT - padding),
        };
      default:
        return { x: padding, y: padding }; // left-top as default
    }
  }, [PREVIEW_WIDTH, PREVIEW_HEIGHT]);

  const [position, setPosition] = useState(() => getInitialPosition(finalPosition));

  // Update position when style settings change
  React.useEffect(() => {
    setPosition(getInitialPosition(finalPosition));
  }, [finalPosition, finalSize, getInitialPosition]);

  // Get first group and first story
  const firstGroup = groups[0];
  const firstStory = firstGroup?.stories?.[0];

  // Memoize all callbacks to prevent unnecessary re-renders of useStoryModal
  const memoizedOnOpenGroup = useCallback((id: string) => {
    onOpenGroup?.(id);
  }, [onOpenGroup]);

  const memoizedOnCloseGroup = useCallback((id: string) => {
    onCloseGroup?.(id);
  }, [onCloseGroup]);

  const memoizedOnNextStory = useCallback((groupId: string, storyId: string) => {
    onNextStory?.(groupId, storyId);
  }, [onNextStory]);

  const memoizedOnPrevStory = useCallback((groupId: string, storyId: string) => {
    onPrevStory?.(groupId, storyId);
  }, [onPrevStory]);

  const memoizedOnCloseStory = useCallback((groupId: string, storyId: string, duration: number) => {
    onCloseStory?.(groupId, storyId, duration);
  }, [onCloseStory]);

  const memoizedOnOpenStory = useCallback((groupId: string, storyId: string) => {
    onOpenStory?.(groupId, storyId);
  }, [onOpenStory]);

  const memoizedOnStartQuiz = useCallback((groupId: string, storyId?: string) => {
    onStartQuiz?.(groupId, storyId);
  }, [onStartQuiz]);

  const memoizedOnFinishQuiz = useCallback((groupId: string, storyId?: string) => {
    onFinishQuiz?.(groupId, storyId);
  }, [onFinishQuiz]);

  const memoizedOnModalOpen = useCallback((groupId: string, storyId: string) => {
    onModalOpen?.(groupId, storyId);
  }, [onModalOpen]);

  const memoizedOnModalClose = useCallback((groupId: string, storyId: string) => {
    onModalClose?.(groupId, storyId);
  }, [onModalClose]);

  // Memoize modal options to prevent hook re-creation
  const storyModalOptions = useMemo(() => ({
    group: firstGroup,
    autoplay: false,
    startStoryId,
    startGroupId,
    forbidClose,
    isOnlyGroups: false,
    isLoading,
    arrowsColor,
    backgroundColor,
    container,
    devMode,
    isForceCloseAvailable,
    isInReactNativeWebView,
    isShowLabel,
    isShowMockup: finalIsShowMockup,
    isStatusBarActive,
    openInExternalModal,
    storyHeight,
    storyWidth,
    token,
    onOpenGroup: memoizedOnOpenGroup,
    onCloseGroup: memoizedOnCloseGroup,
    onNextStory: memoizedOnNextStory,
    onPrevStory: memoizedOnPrevStory,
    onCloseStory: memoizedOnCloseStory,
    onOpenStory: memoizedOnOpenStory,
    onStartQuiz: memoizedOnStartQuiz,
    onFinishQuiz: memoizedOnFinishQuiz,
    onModalOpen: memoizedOnModalOpen,
    onModalClose: memoizedOnModalClose,
  }), [
    firstGroup,
    finalAutoplay,
    startStoryId,
    startGroupId,
    forbidClose,
    isLoading,
    arrowsColor,
    backgroundColor,
    container,
    devMode,
    isForceCloseAvailable,
    isInReactNativeWebView,
    isShowLabel,
    finalIsShowMockup,
    isStatusBarActive,
    openInExternalModal,
    storyHeight,
    storyWidth,
    token,
    memoizedOnOpenGroup,
    memoizedOnCloseGroup,
    memoizedOnNextStory,
    memoizedOnPrevStory,
    memoizedOnCloseStory,
    memoizedOnOpenStory,
    memoizedOnStartQuiz,
    memoizedOnFinishQuiz,
    memoizedOnModalOpen,
    memoizedOnModalClose,
  ]);

  // Initialize story modal hook
  const { openStoryModal, modalShow } = useStoryModal(storyModalOptions);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDragging && finalAllowDragDrop !== false) {
      e.preventDefault(); // Prevent default click behavior during drag
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialPosition(position);
      setHasMoved(false);
    }
  }, [isDragging, position, finalAllowDragDrop]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Mark as moved if dragged more than 5 pixels
      const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (dragDistance > 5) {
        setHasMoved(true);
      }

      const newX = Math.max(0, Math.min(window.innerWidth - PREVIEW_WIDTH, initialPosition.x + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - PREVIEW_HEIGHT, initialPosition.y + deltaY));

      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragStart, initialPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Reset hasMoved after a short delay to prevent accidental modal opening
    setTimeout(() => setHasMoved(false), 100);
  }, []);

  // Touch handlers for mobile devices
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!isDragging && touch && finalAllowDragDrop !== false) {
      e.preventDefault(); // Prevent default touch behavior during drag
      setIsDragging(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setInitialPosition(position);
      setHasMoved(false);
    }
  }, [isDragging, position, finalAllowDragDrop]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      // Mark as moved if dragged more than 5 pixels
      const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (dragDistance > 5) {
        setHasMoved(true);
      }

      const newX = Math.max(0, Math.min(window.innerWidth - PREVIEW_WIDTH, initialPosition.x + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - PREVIEW_HEIGHT, initialPosition.y + deltaY));

      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragStart, initialPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    // Reset hasMoved after a short delay to prevent accidental modal opening
    setTimeout(() => setHasMoved(false), 100);
  }, []);

  // Event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
    return undefined;
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Handle click to open modal
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only open modal if there was no dragging movement
    if (!hasMoved && firstGroup) {
      e.stopPropagation();
      openStoryModal(0, firstStory?.id);
    }
  }, [hasMoved, firstGroup, firstStory, openStoryModal]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (firstGroup) {
        openStoryModal(0, firstStory?.id);
      }
    }
  }, [firstGroup, firstStory, openStoryModal]);

  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <div
        className={classNames(b('preview-widget-loader'), groupsClassName)}
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          zIndex: 9999,
          borderRadius: finalRadius ? `${finalRadius}px` : '8px',
          border: finalBorder ? `${finalBorder}px solid rgba(255, 255, 255, 0.2)` : '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className={b('loader')} />
      </div>
    );
  }

  // If there are no groups or first story, don't show the widget
  if (!firstGroup || !firstStory) {
    return null;
  }

  // Hide widget when modal is open
  if (modalShow) {
    return null;
  }

  return (
    <div
      aria-label="Open story preview"
      className={classNames(b('preview-widget'), groupsClassName, {
        [b('preview-widget', { dragging: true })]: isDragging,
      })}
      ref={widgetRef}
      role="button"
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        zIndex: 9999,
        cursor: (() => {
          if (finalAllowDragDrop === false) return 'pointer';
          return isDragging ? 'grabbing' : 'grab';
        })(),
        borderRadius: finalRadius ? `${finalRadius}px` : '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: finalBorder ? `${finalBorder}px solid rgba(255, 255, 255, 0.2)` : '2px solid rgba(255, 255, 255, 0.2)',
      }}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <StoryPreview
        autoplayVideos={finalAutoplay}
        borderRadius={finalRadius}
        disableInteraction
        height={PREVIEW_HEIGHT}
        isVideoMuted
        story={firstStory}
        storyHeight={storyHeight || 640}
        storyWidth={storyWidth || 360}
        width={PREVIEW_WIDTH}
      />
    </div>
  );
};
