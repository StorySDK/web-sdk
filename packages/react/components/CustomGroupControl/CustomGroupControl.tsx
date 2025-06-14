import React, { useEffect, useMemo } from 'react';
import { Group } from '@storysdk/types';
import { StoryModal } from '..';

interface GroupProps {
  children?: React.ReactNode;
  group?: Group;
  isFirstGroup: boolean;
  isLastGroup: boolean;
  isForceCloseAvailable?: boolean;
  isShowing: boolean;
  storyWidth?: number;
  storyHeight?: number;
  isProgressHidden?: boolean;
  isShowMockup?: boolean;
  isStatusBarActive?: boolean;
  startStoryId?: string;
  forbidClose?: boolean;
  isCacheDisabled?: boolean;
  isEditorMode?: boolean;
  handleCloseModal: () => void;
  handleNextGroup: () => void;
  handlePrevGroup: () => void;
}

export const CustomGroupControl: React.FC<GroupProps> = (props) => {
  const {
    children,
    group,
    isFirstGroup,
    isLastGroup,
    startStoryId,
    isProgressHidden,
    isForceCloseAvailable,
    isShowMockup,
    isStatusBarActive,
    forbidClose,
    storyWidth,
    storyHeight,
    isEditorMode,
    isShowing,
    isCacheDisabled,
    handleCloseModal,
    handleNextGroup,
    handlePrevGroup,
  } = props;

  const initOverlow = useMemo(() => document.body.style.overflow, []);

  useEffect(() => {
    if (isShowing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = initOverlow ?? 'auto';
    }
  }, [isShowing]);

  return (
    <>
      {children}

      {isShowing && (
        <StoryModal
          currentGroup={group}
          forbidClose={forbidClose}
          isCacheDisabled={isCacheDisabled}
          isEditorMode={isEditorMode}
          isFirstGroup={isFirstGroup}
          isForceCloseAvailable={isForceCloseAvailable}
          isLastGroup={isLastGroup}
          isProgressHidden={isProgressHidden}
          isShowMockup={isShowMockup}
          isShowing={isShowing}
          isStatusBarActive={isStatusBarActive}
          startStoryId={startStoryId}
          stories={group?.stories}
          storyHeight={storyHeight}
          storyWidth={storyWidth}
          onClose={handleCloseModal}
          onNextGroup={handleNextGroup}
          onPrevGroup={handlePrevGroup}
        />
      )}
    </>
  );
};
