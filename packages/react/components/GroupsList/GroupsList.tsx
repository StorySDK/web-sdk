import React, { useCallback, useState } from 'react';
import block from 'bem-cn';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames';
import { GroupType } from '../../types';
import { GroupItem, StoryModal } from '..';

import 'react-loading-skeleton/dist/skeleton.css';
import './GroupsList.scss';

const b = block('GroupsSdkList');

interface GroupsListProps {
  groups: GroupType[];
  groupImageWidth?: number;
  groupImageHeight?: number;
  groupTitleSize?: number;
  groupsClassName?: string;
  groupClassName?: string;
  isLoading?: boolean;
  groupView: 'circle' | 'square' | 'bigSquare' | 'rectangle';
  onOpenGroup?(id: string): void;
  onCloseGroup?(id: string): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string): void;
  onOpenStory?(groupId: string, storyId: string): void;
}

export const GroupsList: React.FC<GroupsListProps> = (props) => {
  const {
    groups,
    groupView,
    isLoading,
    groupClassName,
    groupsClassName,
    groupImageWidth,
    groupImageHeight,
    groupTitleSize,
    onOpenGroup,
    onCloseGroup,
    onNextStory,
    onPrevStory,
    onCloseStory,
    onOpenStory
  } = props;

  const [currentGroup, setCurrentGroup] = useState(0);
  const [modalShow, setModalShow] = useState(false);

  const handleSelectGroup = useCallback(
    (groupIndex: number) => {
      setCurrentGroup(groupIndex);
      setModalShow(true);

      if (onOpenGroup) {
        onOpenGroup(groups[groupIndex].id);
      }
    },
    [groups, onOpenGroup]
  );

  const handlePrevGroup = useCallback(() => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);

      if (onOpenGroup && onCloseGroup) {
        onCloseGroup(groups[currentGroup].id);

        setTimeout(() => {
          onOpenGroup(groups[currentGroup - 1].id);
        }, 0);
      }
    }
  }, [currentGroup, groups, onCloseGroup, onOpenGroup]);

  const handleNextGroup = useCallback(() => {
    if (currentGroup < groups.length) {
      setCurrentGroup(currentGroup + 1);

      if (onOpenGroup && onCloseGroup) {
        onCloseGroup(groups[currentGroup].id);

        setTimeout(() => {
          onOpenGroup(groups[currentGroup + 1].id);
        }, 0);
      }
    }
  }, [currentGroup, groups, onCloseGroup, onOpenGroup]);

  const handleCloseModal = useCallback(() => {
    if (onCloseGroup) {
      onCloseGroup(groups[currentGroup].id);
    }

    setModalShow(false);
  }, [currentGroup, groups, onCloseGroup]);

  return (
    <>
      {isLoading ? (
        <div className={b()}>
          <div className={b('carousel')}>
            <div className={b('loaderItem')}>
              <Skeleton height={groupImageWidth || 64} width={groupImageWidth || 64} />
              <Skeleton height={16} style={{ marginTop: 8 }} width={groupImageWidth || 64} />
            </div>
            <div className={b('loaderItem')}>
              <Skeleton height={groupImageWidth || 64} width={groupImageWidth || 64} />
              <Skeleton height={16} style={{ marginTop: 8 }} width={groupImageWidth || 64} />
            </div>
            <div className={b('loaderItem')}>
              <Skeleton height={groupImageWidth || 64} width={groupImageWidth || 64} />
              <Skeleton height={16} style={{ marginTop: 8 }} width={groupImageWidth || 64} />
            </div>
            <div className={b('loaderItem')}>
              <Skeleton height={groupImageWidth || 64} width={groupImageWidth || 64} />
              <Skeleton height={16} style={{ marginTop: 8 }} width={groupImageWidth || 64} />
            </div>
          </div>
        </div>
      ) : (
        <>
          {groups.length ? (
            <>
              <div className={classNames(b(), groupsClassName)}>
                <div className={b('carousel')}>
                  {groups
                    .filter((group: any) => group.stories.length)
                    .map((group, index) => (
                      <GroupItem
                        groupClassName={groupClassName}
                        groupImageHeight={groupImageHeight}
                        groupImageWidth={groupImageWidth}
                        groupTitleSize={groupTitleSize}
                        imageUrl={group.imageUrl}
                        index={index}
                        key={group.id}
                        title={group.title}
                        type={groupView}
                        onClick={handleSelectGroup}
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
                onCloseStory={onCloseStory}
                onNextGroup={handleNextGroup}
                onNextStory={onNextStory}
                onOpenStory={onOpenStory}
                onPrevGroup={handlePrevGroup}
                onPrevStory={onPrevStory}
              />
            </>
          ) : (
            <div className={b({ empty: true })}>
              <p className={b('emptyText')}>Stories will be here</p>
            </div>
          )}
        </>
      )}
    </>
  );
};
