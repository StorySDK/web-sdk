import React from 'react';
import block from 'bem-cn';
import './GroupsList.scss';
import { GroupType } from '../../types';
import { GroupItem, StoryModal } from '..';

const b = block('GroupsList');

interface GroupsListProps {
  groups: GroupType[];
  onOpenGroup?(id: string): void;
  onCloseGroup?(id: string): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string): void;
  onOpenStory?(groupId: string, storyId: string): void;
}

export const GroupsList: React.FC<GroupsListProps> = (props) => {
  const { groups, onOpenGroup, onCloseGroup, onNextStory, onPrevStory, onCloseStory, onOpenStory } =
    props;
  const [currentGroup, setCurrentGroup] = React.useState(0);
  const [modalShow, setModalShow] = React.useState(false);

  const handleSelectGroup = (groupIndex: number) => () => {
    setCurrentGroup(groupIndex);
    setModalShow(true);

    if (onOpenGroup) {
      onOpenGroup(groups[groupIndex].id);
    }
  };

  const handlePrevGroup = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);

      if (onOpenGroup && onCloseGroup) {
        onCloseGroup(groups[currentGroup].id);

        setTimeout(() => {
          onOpenGroup(groups[currentGroup - 1].id);
        }, 0);
      }
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < groups.length) {
      setCurrentGroup(currentGroup + 1);

      if (onOpenGroup && onCloseGroup) {
        onCloseGroup(groups[currentGroup].id);

        setTimeout(() => {
          onOpenGroup(groups[currentGroup + 1].id);
        }, 0);
      }
    }
  };

  const handleCloseModal = () => {
    if (onCloseGroup) {
      onCloseGroup(groups[currentGroup].id);
    }

    setModalShow(false);
  };

  return (
    <>
      {groups.length ? (
        <>
          <div className={b()}>
            <div className={b('carousel')}>
              {groups.map((group, index) => {
                if (group.stories.length) {
                  return (
                    <GroupItem
                      imageUrl={group.imageUrl}
                      key={group.id}
                      rounded
                      size="lg"
                      theme="light"
                      title={group.title}
                      onClick={handleSelectGroup(index)}
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>

          <StoryModal
            currentGroup={groups[currentGroup]}
            isFirstGroup={currentGroup === 0}
            isLastGroup={currentGroup === groups.length - 1}
            showed={modalShow}
            stories={groups[currentGroup].stories}
            onClose={handleCloseModal}
            onCloseStory={onCloseStory}
            onNextGroup={handleNextGroup}
            onNextStory={onNextStory}
            onOpenStory={onOpenStory}
            onPrevGroup={handlePrevGroup}
            onPrevStory={onPrevStory}
          />
        </>
      ) : (
        <p>No groups to display</p>
      )}
    </>
  );
};
