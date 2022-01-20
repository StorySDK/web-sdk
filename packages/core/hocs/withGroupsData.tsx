import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GroupType } from '@storysdk/react';
import { nanoid } from 'nanoid';
import { API } from '../services/API';
import { adaptGroupData } from '../utils/groupsAdapter';

interface GroupsListProps {
  groups: GroupType[];
  onOpenGroup?(id: string): void;
  onCloseGroup?(id: string): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onOpenStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string): void;
}

const withGroupsData = (GroupsList: React.FC<GroupsListProps>, token: string) => () => {
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupsWithStories, setGroupsWithStories] = useState([]);
  const [loadStatus, setLoadStatus] = useState('pending');

  const [groupDurationStatus, setGroupDurationStatus] = useState({
    groupId: '',
    status: 'pending'
  });

  const [stroyDurationStatus, setStoryDurationStatus] = useState({
    storyId: '',
    groupId: '',
    status: 'pending'
  });

  const [groupDurationTime, setGroupDurationTime] = useState(0); // seconds
  const [storyDurationTime, setStoryDurationTime] = useState(0); // seconds

  const uniqUserId = useMemo(() => nanoid(), []);

  useEffect(() => {
    let interval: number | NodeJS.Timeout | undefined;

    if (groupDurationStatus.status === 'calculating') {
      interval = setInterval(() => {
        setGroupDurationTime((seconds) => seconds + 1);
      }, 1000);
    } else if (groupDurationStatus.status === 'calculated') {
      if (interval) {
        clearInterval(interval as NodeJS.Timeout);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval as NodeJS.Timeout);
      }
    };
  }, [groupDurationStatus]);

  useEffect(() => {
    let interval: number | NodeJS.Timeout | undefined;

    if (stroyDurationStatus.status === 'calculating') {
      interval = setInterval(() => {
        setStoryDurationTime((seconds) => seconds + 1);
      }, 1000);
    } else if (stroyDurationStatus.status === 'calculated') {
      if (interval) {
        clearInterval(interval as NodeJS.Timeout);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval as NodeJS.Timeout);
      }
    };
  }, [stroyDurationStatus]);

  useEffect(() => {
    if (groupDurationStatus.status === 'calculated') {
      API.statistics.group
        .sendDuration({
          groupId: groupDurationStatus.groupId,
          uniqUserId,
          seconds: groupDurationTime
        })
        .then(() => {
          setGroupDurationTime(0);
        });
    }

    // eslint-disable-next-line
  }, [groupDurationStatus, uniqUserId]);

  useEffect(() => {
    if (stroyDurationStatus.status === 'calculated') {
      API.statistics.story
        .sendDuration({
          storyId: stroyDurationStatus.storyId,
          groupId: stroyDurationStatus.groupId,
          uniqUserId,
          seconds: storyDurationTime
        })
        .then(() => {
          setStoryDurationTime(0);
        });
    }

    // eslint-disable-next-line
  }, [stroyDurationStatus, uniqUserId]);

  const handleOpenGroup = useCallback(
    (groupId: string) => {
      setGroupDurationStatus(() => ({ groupId, status: 'calculating' }));
      return API.statistics.group.onOpen({ groupId, uniqUserId });
    },
    [uniqUserId]
  );

  const handleCloseGroup = useCallback(
    (groupId: string) => {
      setGroupDurationStatus((prevState) => ({ ...prevState, status: 'calculated' }));
      return API.statistics.group.onClose({ groupId, uniqUserId });
    },
    [uniqUserId]
  );

  const handleOpenStory = useCallback(
    (groupId: string, storyId: string) => {
      setStoryDurationStatus(() => ({ groupId, storyId, status: 'calculating' }));
      return API.statistics.story.onOpen({ groupId, storyId, uniqUserId });
    },
    [uniqUserId]
  );

  const handleCloseStory = useCallback(
    (groupId: string, storyId: string) => {
      if (stroyDurationStatus.storyId === storyId && stroyDurationStatus.groupId === groupId) {
        setStoryDurationStatus((prevState) => ({ ...prevState, status: 'calculated' }));
      }
      return API.statistics.story.onClose({ groupId, storyId, uniqUserId });
    },
    [stroyDurationStatus, uniqUserId]
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
      groups={data}
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
