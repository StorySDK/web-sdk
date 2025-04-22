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
import { checkIos, getUniqUserId, initGA, writeToDebug } from '../utils';

import { useGroupCache, useStoryCache } from '../hooks';

export interface DurationProps {
  storyId?: string;
  groupId: string;
  startTime: number;
  endTime?: number;
}

const withGroupsData =
  (
    GroupsList: React.FC<GroupsListProps>,
    options?: {
      groupImageWidth?: number;
      groupImageHeight?: number;
      groupTitleSize?: number;
      groupClassName?: string;
      activeGroupOutlineColor?: string;
      groupsOutlineColor?: string;
      isShowMockup?: boolean;
      isShowLabel?: boolean;
      isDebugMode?: boolean;
      arrowsColor?: string;
      backgroundColor?: string;
      isStatusBarActive?: boolean;
      storyWidth?: number;
      storyHeight?: number;
      preventCloseOnGroupClick?: boolean;
      groupsClassName?: string;
      autoplay?: boolean;
      isForceCloseAvailable?: boolean;
      openInExternalModal?: boolean;
      isInReactNativeWebView?: boolean;
      groupId?: string;
      startStoryId?: string;
      forbidClose?: boolean;
      devMode?: 'staging' | 'development';
      on?(event: string, callback: (data: any) => void): void;
      off?(event: string, callback: (data: any) => void): void;
      destroy?(): void;
    },
    container?: Element | HTMLDivElement | null
  ) =>
    () => {
      const [data, setData] = useState<any[] | null>(null);
      const [groups, setGroups] = useState<Group[]>([]);
      const [groupView, setGroupView] = useState<GroupsListProps['groupView']>('circle');
      const [isShowMockup, setIsShowMockup] = useState(options?.isShowMockup);
      const [isShowLabel, setIsShowLabel] = useState(false);
      const [appLocale, setAppLocale] = useState(null);
      const [groupsWithStories, setGroupsWithStories] = useState<Group[]>([]);
      const [loadStatus, setLoadStatus] = useState('pending');
      const [userId, setUserId] = useState<string>('');
      const [getGroupCache, setGroupCache] = useGroupCache(userId || null);
      const [getStoryCache, setStoryCache] = useStoryCache(userId || null);
      const [width] = useWindowSize();
      const isMobile = useMemo(() => width < 768, [width]);
      const [isNeedToLoad, setIsNeedToLoad] = useState(false);

      const [groupDuration, setGroupDuration] = useState<DurationProps>({
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
        const source = axios.CancelToken.source();
        axios.defaults.cancelToken = source.token;

        return () => {
          source.cancel('Component unmounted');
        };
      }, []);

      useEffect(() => {
        if (language) {
          axios.defaults.headers.common['Accept-Language'] = language;
        }
      }, [language]);

      useEffect(() => {
        const fetchUserId = async () => {
          try {
            const id = await getUniqUserId();
            setUserId(typeof id === 'string' ? id : nanoid());
          } catch {
            setUserId(nanoid());
          }
        };
        
        fetchUserId();
      }, []);

      const uniqUserId = userId || '';

      const handleOpenGroup = useCallback(
        (groupId: string) => {
          const startTime = DateTime.now().toSeconds();

          setGroupDuration(() => ({
            groupId,
            startTime
          }));

          const customEvent = new CustomEvent('storysdk:group:open', {
            detail: {
              uniqUserId: uniqUserId || '',
              groupId,
              startTime,
              language
            }
          });

          container?.dispatchEvent(customEvent);

          return API.statistics.group.onOpen({ groupId, uniqUserId: uniqUserId || '', language });
        },
        [uniqUserId, language]
      );

      const handleStartQuiz = useCallback(
        (groupId: string, storyId?: string) => {
          const time = DateTime.now().toISO();

          const customEvent = new CustomEvent('storysdk:quiz:start', {
            detail: {
              groupId,
              storyId,
              uniqUserId: uniqUserId || '',
              startTime: time,
              language
            }
          });

          container?.dispatchEvent(customEvent);

          return API.statistics.quiz.onQuizStart({
            groupId,
            storyId,
            uniqUserId: uniqUserId || '',
            time,
            language
          });
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

          const customEvent = new CustomEvent('storysdk:quiz:finish', {
            detail: {
              groupId,
              storyId,
              uniqUserId: uniqUserId || '',
              entTime: time,
              language
            }
          });

          container?.dispatchEvent(customEvent);

          return API.statistics.quiz.onQuizFinish({
            groupId,
            storyId,
            uniqUserId: uniqUserId || '',
            time,
            language
          });
        },
        [uniqUserId, language, getGroupCache, setGroupCache, getStoryCache, setStoryCache]
      );

      const handleCloseGroup = useCallback(
        (groupId: string) => {
          const duration = DateTime.now().toSeconds() - groupDuration.startTime;

          API.statistics.group.sendDuration({
            groupId: groupDuration.groupId,
            uniqUserId: uniqUserId || '',
            seconds: duration,
            language
          });

          const customEvent = new CustomEvent('storysdk:group:close', {
            detail: {
              groupId,
              uniqUserId: uniqUserId || '',
              duration,
              language
            }
          });

          container?.dispatchEvent(customEvent);

          return API.statistics.group.onClose({ groupId, uniqUserId: uniqUserId || '', language });
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

          const customEvent = new CustomEvent('storysdk:story:open', {
            detail: {
              groupId,
              storyId,
              uniqUserId: uniqUserId || '',
              language
            }
          });

          container?.dispatchEvent(customEvent);

          API.statistics.story.onOpen({ groupId, storyId, uniqUserId: uniqUserId || '', language });
        },
        [data, uniqUserId, language, handleFinishQuiz]
      );

      const handleCloseStory = useCallback(
        (groupId: string, storyId: string, duration: number) => {
          API.statistics.story.sendDuration({
            storyId,
            groupId,
            uniqUserId: uniqUserId || '',
            seconds: duration,
            language
          });

          if (duration > 1) {
            API.statistics.story.sendImpression({
              storyId,
              groupId,
              uniqUserId: uniqUserId || '',
              seconds: duration,
              language
            });
          }

          const customEvent = new CustomEvent('storysdk:story:close', {
            detail: {
              groupId,
              storyId,
              uniqUserId: uniqUserId || '',
              duration,
              language
            }
          });

          container?.dispatchEvent(customEvent);

          API.statistics.story.onClose({
            groupId,
            storyId,
            uniqUserId: uniqUserId || '',
            language
          });
        },
        [uniqUserId, language]
      );

      const handleNextStory = useCallback(
        (groupId: string, storyId: string) => {
          const customEvent = new CustomEvent('storysdk:story:next', {
            detail: {
              groupId,
              storyId,
              uniqUserId: uniqUserId || '',
              language
            }
          });

          container?.dispatchEvent(customEvent);

          API.statistics.story.onNext({ groupId, storyId, uniqUserId: uniqUserId || '', language });
        },
        [uniqUserId, language]
      );

      const handleModalOpen = useCallback(
        (groupId: string, storyId: string) => {
          const customEvent = new CustomEvent('storysdk:modal:open', {
            detail: {
              groupId,
              storyId,
              uniqUserId: uniqUserId || '',
              language
            }
          });

          container?.dispatchEvent(customEvent);
        },
        [uniqUserId, language]
      );

      const handleModalClose = useCallback(
        (groupId: string, storyId: string) => {
          const customEvent = new CustomEvent('storysdk:modal:close', {
            detail: {
              groupId,
              storyId,
              uniqUserId: uniqUserId || '',
              language
            }
          });

          container?.dispatchEvent(customEvent);
        },
        [uniqUserId, language]
      );

      const handlePrevStory = useCallback(
        (groupId: string, storyId: string) => {
          const customEvent = new CustomEvent('storysdk:story:prev', {
            detail: {
              groupId,
              storyId,
              uniqUserId: uniqUserId || '',
              language
            }
          });

          container?.dispatchEvent(customEvent);

          API.statistics.story.onPrev({ groupId, storyId, uniqUserId: uniqUserId || '', language });
        },
        [uniqUserId, language]
      );

      useEffect(() => {
        setIsNeedToLoad(true);

        const handleResume = () => {
          setIsNeedToLoad(true);
        };

        document.addEventListener('resume', handleResume, false);

        return () => {
          document.removeEventListener('resume', handleResume, false);
        };
      }, []);

      useEffect(() => {
        if (!isNeedToLoad) return;

        setLoadStatus('loading');

        API.app.getApp().then((appData) => {
          if (options?.isDebugMode) {
            writeToDebug(`App data: ${JSON.stringify(appData)}`);
          }

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

              if (app.settings?.fonts?.length) {
                loadFontsToPage(app.settings.fonts);
              }

              initGA(app.settings?.integrations?.googleAnalytics?.trackingId);

              setAppLocale(app.localization);
              setGroupView(appGroupView);
              setIsShowMockup(checkIos() ? false : isShowMockupApp);
              setIsShowLabel(!app.premium_owner);

              API.groups.getList().then((groupsData) => {
                if (options?.isDebugMode) {
                  writeToDebug(`Groupd data: ${JSON.stringify(groupsData)}`);
                }

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

        setIsNeedToLoad(false);
      }, [isNeedToLoad]);

      useEffect(() => {
        if (groups.length) {
          setLoadStatus('loading');

          groups.forEach((groupItem: Group, groupIndex: number) => {
            API.stories
              .getList({
                groupId: groupItem.id
              })
              .then((storiesData) => {
                if (options?.isDebugMode) {
                  writeToDebug(`Stories data: ${JSON.stringify(storiesData)}`);
                }

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
            const adaptedData = adaptGroupData(groupsWithStories, uniqUserId || '', language, isMobile);

            setData(adaptedData);
          } else {
            setData([]);
          }
        }
      }, [loadStatus, groupsWithStories, uniqUserId, language, isMobile]);

      return (
        <GroupsList
          activeGroupOutlineColor={options?.activeGroupOutlineColor}
          arrowsColor={options?.arrowsColor}
          autoplay={options?.autoplay}
          backgroundColor={options?.backgroundColor}
          container={container}
          devMode={options?.devMode}
          forbidClose={options?.forbidClose || options?.autoplay}
          groupClassName={options?.groupClassName}
          groupImageHeight={options?.groupImageHeight}
          groupImageWidth={options?.groupImageWidth}
          groupTitleSize={options?.groupTitleSize}
          groupView={groupView}
          groups={data ?? []}
          groupsClassName={options?.groupsClassName}
          groupsOutlineColor={options?.groupsOutlineColor}
          isForceCloseAvailable={options?.isForceCloseAvailable}
          isInReactNativeWebView={options?.isInReactNativeWebView}
          isLoading={data === null || loadStatus === 'loading'}
          isShowLabel={isShowLabel}
          isShowMockup={isShowMockup}
          isStatusBarActive={options?.isStatusBarActive}
          openInExternalModal={options?.openInExternalModal}
          preventCloseOnGroupClick={options?.preventCloseOnGroupClick}
          startGroupId={options?.groupId}
          startStoryId={options?.startStoryId}
          storyHeight={options?.storyHeight}
          storyWidth={options?.storyWidth}
          onCloseGroup={handleCloseGroup}
          onCloseStory={handleCloseStory}
          onFinishQuiz={handleFinishQuiz}
          onModalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          onNextStory={handleNextStory}
          onOpenGroup={handleOpenGroup}
          onOpenStory={handleOpenStory}
          onPrevStory={handlePrevStory}
          onStartQuiz={handleStartQuiz}
        />
      );
    };

export default withGroupsData;
