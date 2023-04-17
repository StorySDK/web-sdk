import React from 'react';
import { Group } from '../../types';
import { StoryModal } from '..';

interface GroupProps {
  group: Group;
  isFirstGroup: boolean;
  isLastGroup: boolean;
  isForceCloseAvailable?: boolean;
  handleCloseModal: () => void;
  handleNextGroup: () => void;
  handlePrevGroup: () => void;
  isShowing: boolean;
  isShowMockup?: boolean;
  isStatusBarActive?: boolean;
  startStoryId?: string;
  isCacheDisabled?: boolean;
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
    handleCloseModal,
    handleNextGroup,
    handlePrevGroup,
    isShowing,
    isCacheDisabled
  } = props;

  return (
    <>
      {children}

      {isShowing && (
        <StoryModal
          currentGroup={group}
          isCacheDisabled={isCacheDisabled}
          isFirstGroup={isFirstGroup}
          isForceCloseAvailable={isForceCloseAvailable}
          isLastGroup={isLastGroup}
          isShowMockup={isShowMockup}
          isShowing={isShowing}
          isStatusBarActive={isStatusBarActive}
          startStoryId={startStoryId}
          stories={group.stories}
          onClose={handleCloseModal}
          onNextGroup={handleNextGroup}
          onPrevGroup={handlePrevGroup}
        />
      )}
    </>
  );
};
