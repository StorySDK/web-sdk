import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GroupType } from '@storysdk/react';
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import { API } from '../services/API';
import { adaptGroupData } from '../utils/groupsAdapter';
import { getNavigatorLanguage } from '../utils/localization';

interface GroupsListProps {
  groups: GroupType[];
  groupClassName?: string;
  groupsClassName?: string;
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

const withGroupsData =
  (
    GroupsList: React.FC<GroupsListProps>,
    token: string,
    groupClassName?: string,
    groupsClassName?: string
  ) =>
  () => {
    const [data, setData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupView, setGroupView] = useState('circle');
    const [appLocale, setAppLocale] = useState(null);
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

    const getUniqUserId = useCallback(() => {
      if (localStorage.getItem('userId')) {
        return localStorage.getItem('userId');
      }
      const id = nanoid();
      localStorage.setItem('userId', id);

      return id;
    }, []);

    const uniqUserId = useMemo(() => getUniqUserId() || nanoid(), [getUniqUserId]);

    const language = useMemo(() => {
      if (appLocale) {
        return getNavigatorLanguage(appLocale);
      }

      return 'en';
    }, [appLocale]);

    const handleOpenGroup = useCallback(
      (groupId: string) => {
        setGroupDuration(() => ({
          groupId,
          startTime: DateTime.now().toSeconds()
        }));

        return API.statistics.group.onOpen({ groupId, uniqUserId, language });
      },
      [uniqUserId, language]
    );

    const handleCloseGroup = useCallback(
      (groupId: string) => {
        const duration = DateTime.now().toSeconds() - groupDuration.startTime;

        API.statistics.group.sendDuration({
          groupId: groupDuration.groupId,
          uniqUserId,
          seconds: duration,
          language
        });

        return API.statistics.group.onClose({ groupId, uniqUserId, language });
      },
      [groupDuration, uniqUserId, language]
    );

    const handleOpenStory = useCallback(
      (groupId: string, storyId: string) => {
        setStoryDuration(() => ({
          groupId,
          storyId,
          startTime: DateTime.now().toSeconds()
        }));

        API.statistics.story.onOpen({ groupId, storyId, uniqUserId, language });
      },

      [uniqUserId, language]
    );

    const handleCloseStory = useCallback(
      (groupId: string, storyId: string) => {
        if (storyDuration.storyId === storyId && storyDuration.groupId === groupId) {
          const duration = DateTime.now().toSeconds() - storyDuration.startTime;

          API.statistics.story.sendDuration({
            storyId: storyDuration.storyId,
            groupId: storyDuration.groupId,
            uniqUserId,
            seconds: duration,
            language
          });

          if (duration > 1) {
            API.statistics.story.sendImpression({
              storyId: storyDuration.storyId,
              groupId: storyDuration.groupId,
              uniqUserId,
              seconds: duration,
              language
            });
          }
        }
        API.statistics.story.onClose({ groupId, storyId, uniqUserId, language });
      },
      [storyDuration, uniqUserId, language]
    );

    const handleNextStory = useCallback(
      (groupId: string, storyId: string) =>
        API.statistics.story.onNext({ groupId, storyId, uniqUserId, language }),
      [uniqUserId, language]
    );

    const handlePrevStory = useCallback(
      (groupId: string, storyId: string) =>
        API.statistics.story.onPrev({ groupId, storyId, uniqUserId, language }),
      [uniqUserId, language]
    );

    useEffect(() => {
      setLoadStatus('loading');

      API.apps.getList().then((appData) => {
        if (!appData.data.error) {
          const app = appData.data.data.filter((item: any) => item.sdk_token === token);

          const appId = app.length ? app[0].id : '';
          const appGroupView =
            app.length &&
            app[0].settings &&
            app[0].settings.groupView &&
            app[0].settings.groupView.web
              ? app[0].settings.groupView.web
              : 'circle';

          setAppLocale(app[0].localization);
          setGroupView(appGroupView);

          API.groups.getList({ appId }).then((groupsData) => {
            if (!groupsData.data.error) {
              const groupsFetchedData = groupsData.data.data
                .filter((item: any) => item.active)
                .map((item: any) => ({
                  id: item.id,
                  app_id: item.app_id,
                  title: item.title[language],
                  image_url: item.image_url[language]
                }));

              setGroups(groupsFetchedData);
              setGroupsWithStories(groupsFetchedData);
            }
          });
        }
      });
    }, [language]);

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
                  (storyItem: any) => storyItem.story_data[language].status === 'active'
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
    }, [groups, language]);

    useEffect(() => {
      if (loadStatus === 'loaded' && groupsWithStories.length) {
        const adaptedData = adaptGroupData(groupsWithStories, uniqUserId, language);

        setData(adaptedData);
      }
    }, [loadStatus, groupsWithStories, uniqUserId, language]);

    return (
      <GroupsList
        groupClassName={groupClassName}
        groupView={groupView}
        groups={data}
        groupsClassName={groupsClassName}
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
