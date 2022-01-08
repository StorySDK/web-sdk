import React from 'react';
import { GroupType } from '../../types';
import { StoryModal } from '..';

interface GroupProps {
  group: GroupType;
  isFirstGroup: boolean;
  isLastGroup: boolean;
  handleCloseModal: () => void;
  handleNextGroup: () => void;
  handlePrevGroup: () => void;
  isShowing: boolean;
}

export const CustomGroupControl: React.FC<GroupProps> = (props) => {
  const {
    children,
    group,
    isFirstGroup,
    isLastGroup,
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
        isLastGroup={isLastGroup}
        showed={isShowing}
        stories={group.stories}
        onClose={handleCloseModal}
        onNextGroup={handleNextGroup}
        onPrevGroup={handlePrevGroup}
      />
    </>
  );
};
