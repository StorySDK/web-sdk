import React, { useEffect } from 'react';
import { Group } from '../../types';
import { StoryModal } from '..';

interface GroupProps {
  group?: Group;
  isFirstGroup: boolean;
  isLastGroup: boolean;
  isForceCloseAvailable?: boolean;
  isShowing: boolean;
  isShowMockup?: boolean;
  isStatusBarActive?: boolean;
  startStoryId?: string;
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
    isForceCloseAvailable,
    isShowMockup,
    isStatusBarActive,
    isEditorMode,
    isShowing,
    isCacheDisabled,
    handleCloseModal,
    handleNextGroup,
    handlePrevGroup,
  } = props;

  useEffect(() => {
    const initOverlow = document.body.style.overflow;

    if (isShowing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = initOverlow ?? 'auto'
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
          isShowMockup={isShowMockup}
          isShowing={isShowing}
          isStatusBarActive={isStatusBarActive}
          startStoryId={startStoryId}
          stories={group?.stories}
          onClose={handleCloseModal}
          onNextGroup={handleNextGroup}
          onPrevGroup={handlePrevGroup}
        />
      )}
    </>
  );
};
