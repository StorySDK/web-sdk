import React from 'react';
import block from 'bem-cn';
import './GroupsList.scss';
import { GroupType } from '../../types';
import { GroupItem, StoryModal } from '..';

const b = block('GroupsList');

interface GroupsListProps {
  groups: GroupType[];
}

export const GroupsList: React.FC<GroupsListProps> = (props) => {
  const { groups } = props;
  const [currentGroup, setCurrentGroup] = React.useState(0);
  const [modalShow, setModalShow] = React.useState(false);

  const handleSelectGroup = (groupIndex: number) => () => {
    setCurrentGroup(groupIndex);
    setModalShow(true);
  };

  const handlePrevGroup = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < groups.length) {
      setCurrentGroup(currentGroup + 1);
    }
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  return (
    <>
      {groups.length ? (
        <>
          <div className={b()}>
            <div className={b('carousel')}>
              {groups.map((group, index) => (
                <GroupItem
                  imageUrl={group.imageUrl}
                  key={group.id}
                  rounded
                  size="lg"
                  theme="light"
                  title={group.title}
                  onClick={handleSelectGroup(index)}
                />
              ))}
            </div>
          </div>

          <StoryModal
            currentGroup={groups[currentGroup]}
            isFirstGroup={currentGroup === 0}
            isLastGroup={currentGroup === groups.length - 1}
            showed={modalShow}
            stories={groups[currentGroup].stories}
            onClose={handleCloseModal}
            onNextGroup={handleNextGroup}
            onPrevGroup={handlePrevGroup}
          />
        </>
      ) : (
        <p>No groups to display</p>
      )}
    </>
  );
};
