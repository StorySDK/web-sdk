import React from 'react';
import { GroupType } from '../../types';
import { StoryModal } from '..';

interface GroupProps {
  group: GroupType;
  isFirstGroup: boolean;
  isLastGroup: boolean;
  isForceCloseAvailable?: boolean;
  handleCloseModal: () => void;
  handleNextGroup: () => void;
  handlePrevGroup: () => void;
  isShowing: boolean;
  startStoryId?: string;
}

export const CustomGroupControl: React.FC<GroupProps> = (props) => {
  const {
    children,
    group,
    isFirstGroup,
    isLastGroup,
    startStoryId,
    isForceCloseAvailable,
    handleCloseModal,
    handleNextGroup,
    handlePrevGroup,
    isShowing
  } = props;

  return (
    <>
      {children}

      <StoryModal
        currentGroup={group}
        isFirstGroup={isFirstGroup}
        isForceCloseAvailable={isForceCloseAvailable}
        isLastGroup={isLastGroup}
        isShowing={isShowing}
        startStoryId={startStoryId}
        stories={group.stories}
        onClose={handleCloseModal}
        onNextGroup={handleNextGroup}
        onPrevGroup={handlePrevGroup}
      />
    </>
  );
};
