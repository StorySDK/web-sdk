import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import block from 'bem-cn';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames';
import SimpleBar from 'simplebar-react';
import ReactDOM from 'react-dom';
import { Group } from '../../types';
import { GroupItem, StoryModal } from '..';

import 'simplebar-react/dist/simplebar.min.css';
import 'react-loading-skeleton/dist/skeleton.css';
import './GroupsList.scss';

const b = block('GroupsSdkList');

export interface GroupsListProps {
  groups: Group[];
  groupImageWidth?: number;
  groupImageHeight?: number;
  groupTitleSize?: number;
  groupsClassName?: string;
  storyWidth?: number;
  storyHeight?: number;
  isStatusBarActive?: boolean;
  groupClassName?: string;
  isShowMockup?: boolean;
  isLoading?: boolean;
  autoplay?: boolean;
  startStoryId?: string;
  forbidClose?: boolean;
  openInExternalModal?: boolean;
  devMode?: 'staging' | 'development';
  groupView: 'circle' | 'square' | 'bigSquare' | 'rectangle';
  onOpenGroup?(id: string): void;
  onCloseGroup?(id: string): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string): void;
  onOpenStory?(groupId: string, storyId: string): void;
  onStartQuiz?(groupId: string, storyId?: string): void;
  onFinishQuiz?(groupId: string, storyId?: string): void;
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
    isShowMockup,
    isStatusBarActive,
    autoplay,
    startStoryId,
    devMode,
    forbidClose,
    openInExternalModal,
    storyWidth,
    storyHeight,
    onOpenGroup,
    onCloseGroup,
    onNextStory,
    onPrevStory,
    onCloseStory,
    onOpenStory,
    onStartQuiz,
    onFinishQuiz
  } = props;

  const [currentGroup, setCurrentGroup] = useState(0);
  const [modalShow, setModalShow] = useState(!!autoplay);

  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (autoplay && onOpenGroup && groups?.length) {
      onOpenGroup(groups[0].id);
    }
  }, [autoplay, groups, onOpenGroup]);

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
    if (onCloseGroup && groups?.[currentGroup]) {
      onCloseGroup(groups[currentGroup].id);
    }

    if (!forbidClose) {
      setModalShow(false);
    }
  }, [currentGroup, forbidClose, groups, onCloseGroup]);

  const rootElement = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    document.body.appendChild(rootElement);
  }, [rootElement]);

  const currentGroupMemo = useMemo(() => groups?.[currentGroup], [groups, currentGroup]);

  useEffect(() => {
    if (!isLoading || autoplay) {
      ReactDOM.render(
        <StoryModal
          currentGroup={currentGroupMemo}
          devMode={devMode}
          forbidClose={forbidClose}
          isFirstGroup={currentGroup === 0}
          isLastGroup={currentGroup === groups?.length - 1}
          isLoading={isLoading}
          isShowMockup={isShowMockup}
          isShowing={modalShow}
          isStatusBarActive={isStatusBarActive}
          openInExternalModal={openInExternalModal}
          startStoryId={startStoryId}
          stories={currentGroupMemo?.stories}
          storyHeight={storyHeight}
          storyWidth={storyWidth}
          onClose={handleCloseModal}
          onCloseStory={onCloseStory}
          onFinishQuiz={onFinishQuiz}
          onNextGroup={handleNextGroup}
          onNextStory={onNextStory}
          onOpenStory={onOpenStory}
          onPrevGroup={handlePrevGroup}
          onPrevStory={onPrevStory}
          onStartQuiz={onStartQuiz}
        />,
        rootElement
      );
    }
  }, [isLoading, autoplay, currentGroupMemo, modalShow]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.recalculate();
    }
  }, [groups.length, isLoading, autoplay]);

  return (
    <>
      <div className={classNames(b(), groupsClassName)}>
        <SimpleBar
          ref={scrollRef}
          style={{
            width: '100%'
          }}
        >
          {isLoading && !autoplay ? (
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
          ) : (
            <>
              {groups.length ? (
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
                        type={group.type}
                        view={groupView}
                        onClick={handleSelectGroup}
                      />
                    ))}
                </div>
              ) : (
                <p className={b('emptyText')}>Stories will be here</p>
              )}
            </>
          )}
        </SimpleBar>
      </div>
    </>
  );
};
