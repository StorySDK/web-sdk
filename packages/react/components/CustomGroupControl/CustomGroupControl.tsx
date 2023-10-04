import React, { useEffect, useMemo } from 'react';
import { Group } from '../../types';
import { StoryModal } from '..';

interface GroupProps {
  group?: Group;
  isFirstGroup: boolean;
  isLastGroup: boolean;
  isForceCloseAvailable?: boolean;
  isShowing: boolean;
  startStoryId?: string;
  isCacheDisabled?: boolean;
  isEditorMode?: boolean;
  storyWidth?: number;
  storyHeight?: number;
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
    isForceCloseAvailable,
    isEditorMode,
    isShowing,
    isCacheDisabled,
    storyWidth,
    storyHeight,
    handleCloseModal,
    handleNextGroup,
    handlePrevGroup
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
          isCacheDisabled={isCacheDisabled}
          isEditorMode={isEditorMode}
          isFirstGroup={isFirstGroup}
          isForceCloseAvailable={isForceCloseAvailable}
          isLastGroup={isLastGroup}
          isShowing={isShowing}
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
