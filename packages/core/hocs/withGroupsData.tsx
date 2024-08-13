import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Group, GroupType, GroupsListProps } from '@storysdk/react';
import { useWindowSize } from '@react-hook/window-size';
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import axios from 'axios';
import { API } from '../services/API';
import { adaptGroupData } from '../utils/groupsAdapter';
import { getNavigatorLanguage } from '../utils/localization';
import { loadFontsToPage } from '../utils/fontsInclude';
import { getUniqUserId } from '../utils';
import { useGroupCache, useStoryCache } from '../hooks';

interface DurationProps {
  storyId?: string;
  groupId: string;
  startTime: number;
}

const withGroupsData =
  (
    GroupsList: React.FC<GroupsListProps>,
    options?: {
      groupImageWidth?: number;
      groupImageHeight?: number;
      groupTitleSize?: number;
      groupClassName?: string;
      isShowMockup?: boolean;
      isStatusBarActive?: boolean;
      storyWidth?: number;
      storyHeight?: number;
      groupsClassName?: string;
      autoplay?: boolean;
      openInExternalModal?: boolean;
      groupId?: string;
      startStoryId?: string;
      forbidClose?: boolean;
      devMode?: 'staging' | 'development';
    }
  ) =>
  () => {
    const [data, setData] = useState<any[] | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [groupView, setGroupView] = useState<GroupsListProps['groupView']>('circle');
    const [isShowMockup, setIsShowMockup] = useState(options?.isShowMockup);
    const [appLocale, setAppLocale] = useState(null);
    const [groupsWithStories, setGroupsWithStories] = useState<Group[]>([]);
    const [loadStatus, setLoadStatus] = useState('pending');
    const uniqUserId = useMemo(() => getUniqUserId() || nanoid(), []);
    const [getGroupCache, setGroupCache] = useGroupCache(uniqUserId);
    const [getStoryCache, setStoryCache] = useStoryCache(uniqUserId);
    const [width] = useWindowSize();

    const isMobile = useMemo(() => width < 768, [width]);

    const [groupDuration, setGroupDuration] = useState<DurationProps>({
      groupId: '',
      startTime: 0
    });

    const [storyDuration, setStoryDuration] = useState<DurationProps>({
      storyId: '',
      groupId: '',
      startTime: 0
    });

    const language = useMemo(() => {
      if (appLocale) {
        return getNavigatorLanguage(appLocale);
      }

      return 'en';
    }, [appLocale]);

    useEffect(() => {
      if (language) {
        axios.defaults.headers.common['Accept-Language'] = language;
      }
    }, [language]);

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

    const handleStartQuiz = useCallback(
      (groupId: string, storyId?: string) => {
        const time = DateTime.now().toISO();

        return API.statistics.quiz.onQuizStart({ groupId, storyId, uniqUserId, time, language });
      },
      [uniqUserId, language]
    );

    const handleFinishQuiz = useCallback(
      (groupId: string, storyId?: string) => {
        if (!storyId) {
          const groupCache = getGroupCache(groupId);

          if (groupCache?.isFinished) {
            return undefined;
          }

          setGroupCache(groupId, {
            isFinished: true
          });
        } else {
          const storyCache = getStoryCache(storyId);

          if (storyCache?.isFinished) {
            return undefined;
          }

          setStoryCache(storyId, {
            isFinished: true
          });
        }

        const time = DateTime.now().toISO();

        return API.statistics.quiz.onQuizFinish({ groupId, storyId, uniqUserId, time, language });
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
        const currentGroup = data?.find((group) => group.id === groupId);
        const currentStory = currentGroup?.stories?.find((story: any) => story.id === storyId);

        const isResultStory =
          currentGroup?.settings?.scoreResultLayersGroupId ===
          currentStory?.layerData?.layersGroupId;

        if (isResultStory) {
          handleFinishQuiz(groupId);
        }

        setStoryDuration(() => ({
          groupId,
          storyId,
          startTime: DateTime.now().toSeconds()
        }));

        API.statistics.story.onOpen({ groupId, storyId, uniqUserId, language });
      },

      [data, uniqUserId, language, handleFinishQuiz]
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

      API.app.getApp().then((appData) => {
        if (!appData.data.error) {
          const app = appData.data.data;

          if (app) {
            const appGroupView = app.settings?.groupView?.web
              ? app.settings.groupView.web
              : 'circle';

            const isShowMockupApp =
              options?.isShowMockup !== undefined
                ? options.isShowMockup
                : app.settings?.isShowMockup;

            if (app.settings.fonts?.length) {
              loadFontsToPage(app.settings.fonts);
            }

            setAppLocale(app.localization);
            setGroupView(appGroupView);
            setIsShowMockup(isShowMockupApp);

            API.groups.getList().then((groupsData) => {
              if (!groupsData.data.error) {
                const groupsFetchedData = groupsData.data.data
                  .filter((item: any) => {
                    const isActive = item.active && item.type;

                    if (item.type === GroupType.ONBOARDING) {
                      if (options?.groupId === item.id) {
                        return isActive;
                      }

                      return isActive && item.settings?.addToStories;
                    }

                    return isActive;
                  })
                  .map((item: any) => ({
                    id: item.id,
                    app_id: item.app_id,
                    title: item.title,
                    image_url: item.image_url,
                    settings: item.settings,
                    type: item.type
                  }))
                  .sort((a: any, b: any) => {
                    if (a.type === GroupType.ONBOARDING && b.type !== GroupType.ONBOARDING) {
                      return -1;
                    }
                    if (a.type !== GroupType.ONBOARDING && b.type === GroupType.ONBOARDING) {
                      return 1;
                    }
                    if (a.settings?.position && b.settings?.position) {
                      return a.settings.position - b.settings.position;
                    }
                    return 0;
                  });
                setGroups(groupsFetchedData);
                setGroupsWithStories(groupsFetchedData);
                setLoadStatus('pending');
              }
            });
          }
        }
      });
    }, []);

    useEffect(() => {
      if (groups.length) {
        setLoadStatus('loading');
        groups.forEach((groupItem: Group, groupIndex: number) => {
          API.stories
            .getList({
              groupId: groupItem.id
            })
            .then((storiesData) => {
              if (!storiesData.data.error) {
                const stories = storiesData.data.data.filter(
                  (storyItem: any) =>
                    storyItem.story_data.status === 'active' &&
                    storyItem.story_data.background.type !== 'transparent' &&
                    ((!storyItem.story_data.start_time && !storyItem.story_data.end_time) ||
                      (((storyItem.story_data.start_time &&
                        DateTime.fromISO(storyItem.story_data.start_time).toSeconds() <
                          DateTime.now().toSeconds()) ||
                        !storyItem.story_data.start_time) &&
                        ((storyItem.story_data.end_time &&
                          DateTime.fromISO(storyItem.story_data.end_time).toSeconds() >
                            DateTime.now().toSeconds()) ||
                          !storyItem.story_data.end_time)))
                );

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
        if (groupsWithStories.length) {
          const adaptedData = adaptGroupData(groupsWithStories, uniqUserId, language, isMobile);

          setData(adaptedData);
        } else {
          setData([]);
        }
      }
    }, [loadStatus, groupsWithStories, uniqUserId, language, isMobile]);

    return (
      <GroupsList
        autoplay={options?.autoplay}
        devMode={options?.devMode}
        forbidClose={options?.forbidClose}
        groupClassName={options?.groupClassName}
        groupImageHeight={options?.groupImageHeight}
        groupImageWidth={options?.groupImageWidth}
        groupTitleSize={options?.groupTitleSize}
        groupView={groupView}
        groups={data ?? []}
        groupsClassName={options?.groupsClassName}
        isLoading={data === null}
        isShowMockup={isShowMockup}
        isStatusBarActive={options?.isStatusBarActive}
        openInExternalModal={options?.openInExternalModal}
        startGroupId={options?.groupId}
        startStoryId={options?.startStoryId}
        storyHeight={options?.storyHeight}
        storyWidth={options?.storyWidth}
        onCloseGroup={handleCloseGroup}
        onCloseStory={handleCloseStory}
        onFinishQuiz={handleFinishQuiz}
        onNextStory={handleNextStory}
        onOpenGroup={handleOpenGroup}
        onOpenStory={handleOpenStory}
        onPrevStory={handlePrevStory}
        onStartQuiz={handleStartQuiz}
      />
    );
  };

export default withGroupsData;
