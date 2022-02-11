import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import { GroupType } from '@storysdk/react';
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import { API } from '../services/API';
import { adaptGroupData } from '../utils/groupsAdapter';

interface GroupsListProps {
  groups: GroupType[];
  groupView: 'circle' | 'square' | 'bigSquare' | 'rectangle' | string;
  isLoading?: boolean;
  onOpenGroup?(id: string): void;
  onCloseGroup?(id: string): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onOpenStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string): void;
}

interface DurationProps {
  storyId?: string;
  groupId: string;
  startTime: number;
}

const withGroupsData = (GroupsList: React.FC<GroupsListProps>, token: string) => () => {
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupView, setGroupView] = useState('circle');
  const [groupsWithStories, setGroupsWithStories] = useState([]);
  const [loadStatus, setLoadStatus] = useState('pending');

  const [groupDuration, setGroupDuration] = useState<DurationProps>({
    groupId: '',
    startTime: 0
  });

  const [storyDuration, setStoryDuration] = useState<DurationProps>({
    storyId: '',
    groupId: '',
    startTime: 0
  });
  const uniqUserId = useMemo(() => nanoid(), []);

  const handleOpenGroup = useCallback(
    (groupId: string) => {
      setGroupDuration(() => ({
        groupId,
        startTime: DateTime.now().toSeconds()
      }));

      return API.statistics.group.onOpen({ groupId, uniqUserId });
    },
    [uniqUserId]
  );

  const handleCloseGroup = useCallback(
    (groupId: string) => {
      const duration = DateTime.now().toSeconds() - groupDuration.startTime;

      API.statistics.group.sendDuration({
        groupId: groupDuration.groupId,
        uniqUserId,
        seconds: duration
      });

      return API.statistics.group.onClose({ groupId, uniqUserId });
    },
    [groupDuration, uniqUserId]
  );

  const handleOpenStory = useCallback(
    (groupId: string, storyId: string) => {
      setStoryDuration(() => ({
        groupId,
        storyId,
        startTime: DateTime.now().toSeconds()
      }));

      API.statistics.story.onOpen({ groupId, storyId, uniqUserId });
    },

    [uniqUserId]
  );

  const handleCloseStory = useCallback(
    (groupId: string, storyId: string) => {
      if (storyDuration.storyId === storyId && storyDuration.groupId === groupId) {
        const duration = DateTime.now().toSeconds() - storyDuration.startTime;

        API.statistics.story.sendDuration({
          storyId: storyDuration.storyId,
          groupId: storyDuration.groupId,
          uniqUserId,
          seconds: duration
        });

        if (duration > 1) {
          API.statistics.story.sendImpression({
            storyId: storyDuration.storyId,
            groupId: storyDuration.groupId,
            uniqUserId,
            seconds: duration
          });
        }
      }
      API.statistics.story.onClose({ groupId, storyId, uniqUserId });
    },
    [storyDuration, uniqUserId]
  );

  const handleNextStory = useCallback(
    (groupId: string, storyId: string) =>
      API.statistics.story.onNext({ groupId, storyId, uniqUserId }),
    [uniqUserId]
  );

  const handlePrevStory = useCallback(
    (groupId: string, storyId: string) =>
      API.statistics.story.onPrev({ groupId, storyId, uniqUserId }),
    [uniqUserId]
  );

  useEffect(() => {
    setLoadStatus('loading');

    API.apps.getList().then((appData) => {
      if (!appData.data.error) {
        const app = appData.data.data.filter((item: any) => item.sdk_token === token);
        const appId = app.length ? app[0].id : '';
        const appGroupView =
          app.length && app[0].settings && app[0].settings.groupView
            ? app[0].settings.groupView
            : 'circle';

        setGroupView(appGroupView);

        API.groups.getList({ appId }).then((groupsData) => {
          if (!groupsData.data.error) {
            const groupsFetchedData = groupsData.data.data
              .filter((item: any) => item.active)
              .map((item: any) => ({
                id: item.id,
                app_id: item.app_id,
                title: item.title,
                image_url: item.image_url
              }));

            setGroups(groupsFetchedData);
            setGroupsWithStories(groupsFetchedData);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (groups.length) {
      groups.forEach((groupItem: any, groupIndex: number) => {
        API.stories
          .getList({
            appId: groupItem.app_id,
            groupId: groupItem.id
          })
          .then((storiesData) => {
            if (!storiesData.data.error) {
              const stories = storiesData.data.data.filter(
                (storyItem: any) => storyItem.status === 'active'
              );

              // @ts-ignore
              setGroupsWithStories((prevState) =>
                prevState.map((item: any) => {
                  if (item.id === groupItem.id) {
                    return { ...item, stories };
                  }

                  return item;
                })
              );

              if (groupIndex === groups.length - 1) {
                setLoadStatus('loaded');
              }
            }
          });
      });
    }
  }, [groups]);

  useEffect(() => {
    if (loadStatus === 'loaded' && groupsWithStories.length) {
      const adaptedData = adaptGroupData(groupsWithStories, uniqUserId);

      setData(adaptedData);
    }
  }, [loadStatus, groupsWithStories, uniqUserId]);

  return (
    <GroupsList
      groupView={groupView}
      groups={data}
      isLoading={loadStatus === 'loading'}
      onCloseGroup={handleCloseGroup}
      onCloseStory={handleCloseStory}
      onNextStory={handleNextStory}
      onOpenGroup={handleOpenGroup}
      onOpenStory={handleOpenStory}
      onPrevStory={handlePrevStory}
    />
  );
};

export default withGroupsData;
