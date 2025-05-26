import React, {
  useState, useEffect, useMemo, useCallback, Suspense, useRef, useReducer,
} from 'react';
import type { Group, GroupsListProps } from '@storysdk/react';
import { getUniqUserId, GroupType, StorageService } from '@storysdk/react';
import { useWindowSize } from '@react-hook/window-size';
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import axios from 'axios';
import { API } from '../services/API';
import { adaptGroupData } from '../utils/groupsAdapter';
import { getNavigatorLanguage } from '../utils/localization';
import { loadFontsToPage, preloadFonts } from '../utils/fontsInclude';
import {
  checkIos, initGA, writeToDebug,
} from '../utils';
import { useGroupCache, useStoryCache } from '../hooks';

export interface DurationProps {
  storyId?: string;
  groupId: string;
  startTime: number;
  endTime?: number;
}

// Types for loading state
interface LoadingState {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  app: 'idle' | 'loading' | 'loaded' | 'error';
  groups: 'idle' | 'loading' | 'loaded' | 'error';
  stories: 'idle' | 'loading' | 'loaded' | 'error';
}

interface AppState {
  loading: LoadingState;
  userId: string;
  appLocale: any;
  language: string;
  groups: Group[];
  groupsWithStories: Group[];
  data: any[] | null;
  groupView: GroupsListProps['groupView'];
  isShowMockup: boolean;
  isShowLabel: boolean;
  groupDuration: DurationProps;
}

// Actions for reducer
type AppAction =
  | {
    type: 'SET_LOADING_STATUS'; payload: {
      key: keyof LoadingState;
      status: LoadingState[keyof LoadingState]
    }
  }
  | { type: 'SET_USER_ID'; payload: string }
  | { type: 'SET_APP_LOCALE'; payload: any }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_GROUPS'; payload: any[] }
  | { type: 'SET_GROUPS_WITH_STORIES'; payload: any[] }
  | { type: 'SET_DATA'; payload: any[] | null }
  | { type: 'SET_GROUP_VIEW'; payload: GroupsListProps['groupView'] }
  | { type: 'SET_IS_SHOW_MOCKUP'; payload: boolean }
  | { type: 'SET_IS_SHOW_LABEL'; payload: boolean }
  | { type: 'SET_GROUP_DURATION'; payload: DurationProps };

// Reducer for state management
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING_STATUS':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.status,
        },
      };
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'SET_APP_LOCALE':
      return { ...state, appLocale: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    case 'SET_GROUPS_WITH_STORIES':
      return { ...state, groupsWithStories: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_GROUP_VIEW':
      return { ...state, groupView: action.payload };
    case 'SET_IS_SHOW_MOCKUP':
      return { ...state, isShowMockup: action.payload };
    case 'SET_IS_SHOW_LABEL':
      return { ...state, isShowLabel: action.payload };
    case 'SET_GROUP_DURATION':
      return { ...state, groupDuration: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState: AppState = {
  loading: {
    status: 'idle',
    app: 'idle',
    groups: 'idle',
    stories: 'idle',
  },
  userId: '',
  appLocale: null,
  language: 'en',
  groups: [],
  groupsWithStories: [],
  data: null,
  groupView: 'circle',
  isShowMockup: false,
  isShowLabel: false,
  groupDuration: {
    groupId: '',
    startTime: 0,
  },
};

const withGroupsData = (
  GroupsList: React.FC<GroupsListProps>,
  options?: {
    token?: string;
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
    isOnboarding?: boolean;
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
    isOnlyGroups?: boolean;
    on?(event: string, callback: (data: any) => void): void;
    off?(event: string, callback: (data: any) => void): void;
    destroy?(): void;
  },
  container?: Element | HTMLDivElement | null,
) => () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isNeedToLoad, setIsNeedToLoad] = useState(false);

  // Cache
  const [getGroupCache, setGroupCache] = useGroupCache(state.userId || null);
  const [getStoryCache, setStoryCache] = useStoryCache(state.userId || null);

  // Refs for request cancellation and state tracking
  const apiRequestsRef = useRef<AbortController[]>([]);
  const initialUserIdRef = useRef<string | null>(null);
  const isUserIdChangingRef = useRef<boolean>(false);

  // Viewport detection
  const [width] = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);

  // Function to update loading status
  const setLoadingStatus = useCallback((
    key: keyof LoadingState,
    status: LoadingState[keyof LoadingState],
  ) => {
    dispatch({ type: 'SET_LOADING_STATUS', payload: { key, status } });
  }, []);

  // Get consistent userId
  const getConsistentUserId = useCallback(() => initialUserIdRef.current || state.userId,
    [state.userId]);

  // Split language calculation for early initialization
  useEffect(() => {
    if (state.appLocale) {
      const detectedLanguage = getNavigatorLanguage(state.appLocale);
      dispatch({ type: 'SET_LANGUAGE', payload: detectedLanguage });
      axios.defaults.headers.common['Accept-Language'] = detectedLanguage;
    }
  }, [state.appLocale]);

  // Set up cancellation for API requests
  useEffect(() => {
    const controller = new AbortController();
    apiRequestsRef.current.push(controller);

    return () => {
      apiRequestsRef.current.forEach((ctrl) => ctrl.signal.aborted || ctrl.abort());
    };
  }, []);

  // Fetch user ID early and independently
  useEffect(() => {
    const fetchUserId = async () => {
      if (isUserIdChangingRef.current || initialUserIdRef.current) {
        if (options?.isDebugMode) {
          writeToDebug(`Skipping userId fetch - already in progress or set. Current: ${state.userId}, initial: ${initialUserIdRef.current}`);
        }
        return;
      }

      isUserIdChangingRef.current = true;

      try {
        const id = await getUniqUserId();
        if (options?.isDebugMode) {
          writeToDebug(`userId obtained: ${id}, previous: ${state.userId || 'empty'}`);
        }

        if (!initialUserIdRef.current) {
          initialUserIdRef.current = id;
          dispatch({ type: 'SET_USER_ID', payload: id });
          if (options?.isDebugMode) {
            writeToDebug(`Setting initial userId: ${id}`);
          }
        }
      } catch {
        const newId = nanoid();
        if (options?.isDebugMode) {
          writeToDebug(`Error obtaining userId, created new: ${newId}`);
        }

        if (!initialUserIdRef.current) {
          initialUserIdRef.current = newId;
          dispatch({ type: 'SET_USER_ID', payload: newId });
        }
      } finally {
        isUserIdChangingRef.current = false;
      }
    };

    fetchUserId();
  }, []);

  // Optimized app data fetching
  const fetchAppData = useCallback(async () => {
    setLoadingStatus('app', 'loading');

    try {
      const appData = await API.app.getApp();

      if (options?.isDebugMode) {
        writeToDebug(`App data: ${JSON.stringify(appData)}`);
      }

      if (!appData.data.error) {
        const app = appData.data.data;

        if (app) {
          const appGroupView = app.settings?.groupView?.web || 'circle';
          const isShowMockupApp = options?.isShowMockup !== undefined
            ? options.isShowMockup
            : app.settings?.isShowMockup;

          dispatch({ type: 'SET_APP_LOCALE', payload: app.localization });
          dispatch({ type: 'SET_GROUP_VIEW', payload: appGroupView });
          dispatch({ type: 'SET_IS_SHOW_MOCKUP', payload: checkIos() ? false : isShowMockupApp });
          dispatch({ type: 'SET_IS_SHOW_LABEL', payload: !app.premium_owner });

          if (app.settings?.fonts?.length) {
            preloadFonts(app.settings.fonts);
            setTimeout(() => loadFontsToPage(app.settings.fonts), 0);
          }

          if (app.settings?.integrations?.googleAnalytics?.trackingId) {
            setTimeout(() => {
              initGA(app.settings?.integrations?.googleAnalytics?.trackingId);
            }, 100);
          }

          setLoadingStatus('app', 'loaded');
          return true;
        }
      }

      setLoadingStatus('app', 'error');
      return false;
    } catch (error) {
      console.error('Error fetching app data:', error);
      setLoadingStatus('app', 'error');
      return false;
    }
  }, [options?.isDebugMode, options?.isShowMockup, setLoadingStatus]);

  // Groups fetching
  const fetchGroups = useCallback(async () => {
    setLoadingStatus('groups', 'loading');

    try {
      const groupsData = await API.groups.getList();

      if (options?.isDebugMode) {
        writeToDebug(`Groups loaded, status: ${groupsData.status}, data items: ${groupsData.data.data?.length || 0}`);
      }

      if (!groupsData.data.error) {
        const groupsFetchedData = groupsData.data.data
          .filter((item: any) => {
            const isActive = item.active && item.type;
            const isOnboarding = item.type === GroupType.ONBOARDING;

            if (options?.isOnboarding) {
              return options?.groupId === item.id && isActive;
            }

            if (isOnboarding) {
              if (options?.groupId === item.id || options?.autoplay) {
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
            type: item.type,
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

        dispatch({ type: 'SET_GROUPS', payload: groupsFetchedData });
        dispatch({ type: 'SET_GROUPS_WITH_STORIES', payload: groupsFetchedData });

        const consistentUserId = getConsistentUserId();

        if (options?.isOnlyGroups) {
          // Use consistentUserId if available, otherwise use 'anonymous' for isOnlyGroups mode
          const userIdForGroups = consistentUserId || 'anonymous';
          const onlyGroupsData = adaptGroupData(
            groupsFetchedData.map((group: any) => ({
              ...group,
              stories: [],
            })),
            userIdForGroups,
            state.language,
            isMobile,
            true,
          );
          dispatch({ type: 'SET_DATA', payload: onlyGroupsData });
          setLoadingStatus('status', 'loaded');

          const dataLoadedEvent = new CustomEvent('storysdk:data:loaded', {
            detail: { message: 'Groups data loaded successfully (only groups mode)' },
          });
          container?.dispatchEvent(dataLoadedEvent);
        }

        setLoadingStatus('groups', 'loaded');
        return true;
      }

      setLoadingStatus('groups', 'error');
      return false;
    } catch (error) {
      console.error('Error fetching groups:', error);
      setLoadingStatus('groups', 'error');
      return false;
    }
  }, [state.language, isMobile, getConsistentUserId, options?.isOnboarding,
  options?.groupId, options?.autoplay, options?.isOnlyGroups, setLoadingStatus]);

  // Filter active stories
  const filterActiveStories = useCallback((storiesData: any[]) => storiesData.filter(
    (storyItem: any) => storyItem.story_data.status === 'active'
      && storyItem.story_data.background.type !== 'transparent'
      && ((!storyItem.story_data.start_time && !storyItem.story_data.end_time)
        || (((storyItem.story_data.start_time
          && DateTime.fromISO(storyItem.story_data.start_time).toSeconds()
          < DateTime.now().toSeconds())
          || !storyItem.story_data.start_time)
          && ((storyItem.story_data.end_time
            && DateTime.fromISO(storyItem.story_data.end_time).toSeconds()
            > DateTime.now().toSeconds())
            || !storyItem.story_data.end_time))),
  ), []);

  // Stories fetching with server-side caching support
  const fetchStories = useCallback(async () => {
    const activeUserId = getConsistentUserId();

    if (options?.isDebugMode) {
      writeToDebug(`fetchStories called: groups.length=${state.groups.length}, isOnlyGroups=${options?.isOnlyGroups}, loading.stories=${state.loading.stories}, userId=${activeUserId}`);
    }

    if (!state.groups.length || options?.isOnlyGroups) {
      if (options?.isDebugMode) {
        writeToDebug(`fetchStories: skipping - no groups (${state.groups.length}) or isOnlyGroups (${options?.isOnlyGroups}), userId: ${activeUserId}`);
      }
      return false;
    }

    if (state.loading.stories === 'loading') {
      if (options?.isDebugMode) {
        writeToDebug(`fetchStories: stories are already loading, userId: ${activeUserId}`);
      }
      return false;
    }

    if (options?.isDebugMode) {
      writeToDebug(`fetchStories: starting to load stories for ${state.groups.length} groups, userId: ${activeUserId}`);
    }

    setLoadingStatus('stories', 'loading');

    try {
      const loadStoriesForGroup = async (groupItem: any) => {
        try {
          if (options?.isDebugMode) {
            writeToDebug(`Loading stories for group ${groupItem.id}`);
          }

          // Use API service which handles HEAD requests and Last-Modified automatically
          const storiesData = await API.stories.getList({ groupId: groupItem.id });

          if (options?.isDebugMode) {
            const cacheStatus = storiesData.statusText?.includes('cache') ? 'from cache' : 'from server';
            writeToDebug(`Stories for group ${groupItem.id} loaded ${cacheStatus}, status: ${storiesData.status}, data items: ${storiesData.data?.data?.length || 0}`);
          }

          if (storiesData.status === 400 || storiesData.status === 401) {
            if (options?.isDebugMode) {
              writeToDebug(`Stories request failed for group ${groupItem.id} with status ${storiesData.status}`);
            }
            return null;
          }

          if (!storiesData.data.error) {
            const stories = filterActiveStories(storiesData.data.data);

            if (options?.isDebugMode) {
              writeToDebug(`Filtered ${stories.length} active stories for group ${groupItem.id}`);
            }

            if (stories && stories.length > 0) {
              return {
                groupId: groupItem.id,
                stories,
                fromCache: storiesData.statusText?.includes('cache') || false,
              };
            }
          } else if (options?.isDebugMode) {
            writeToDebug(`Stories data has error for group ${groupItem.id}: ${storiesData.data.error}`);
          }
        } catch (error) {
          console.error(`Error fetching stories for group ${groupItem.id}:`, error);
          if (options?.isDebugMode) {
            writeToDebug(`Exception loading stories for group ${groupItem.id}: ${error.message}`);
          }
        }
        return null;
      };

      if (options?.isDebugMode) {
        writeToDebug(`Starting parallel loading of stories for groups: ${state.groups.map((g) => g.id).join(', ')}`);
      }

      const allResults = await Promise.all(state.groups.map(loadStoriesForGroup));
      const validResults = allResults.filter(Boolean) as Array<{
        groupId: string;
        stories: any[];
        fromCache: boolean;
      }>;

      if (options?.isDebugMode) {
        writeToDebug(`Stories loading completed: ${validResults.length}/${state.groups.length} groups have stories`);
      }

      if (validResults.length > 0) {
        let newUpdatedGroupsWithStories = [...state.groupsWithStories];
        let hasNewDataFromServer = false;

        validResults.forEach((result) => {
          // Track if we got any new data from server (not from cache)
          if (!result.fromCache) {
            hasNewDataFromServer = true;
          }

          newUpdatedGroupsWithStories = newUpdatedGroupsWithStories.map((group: Group) => {
            if (group.id === result.groupId) {
              return { ...group, stories: result.stories };
            }
            return group;
          });
        });

        dispatch({ type: 'SET_GROUPS_WITH_STORIES', payload: newUpdatedGroupsWithStories });

        const userIdForAdapt = activeUserId || 'anonymous';
        const updatedData = adaptGroupData(
          newUpdatedGroupsWithStories,
          userIdForAdapt,
          state.language,
          isMobile,
        );
        dispatch({ type: 'SET_DATA', payload: updatedData });

        // Update adapted data cache only if we got new data from server
        if (activeUserId && hasNewDataFromServer) {
          const adaptedCacheKey = `storysdk_adapted_data_${options?.token || 'no-token'}_${state.language}_${activeUserId}`;
          StorageService.setItem(adaptedCacheKey, updatedData).catch((error) => {
            console.error('Error saving adapted data to cache:', error);
          });

          if (options?.isDebugMode) {
            writeToDebug(`Updated adapted data cache due to new server data, userId: ${activeUserId}`);
          }
        }
      } else if (options?.isDebugMode) {
        writeToDebug('No valid story results found for any groups');
      }

      setLoadingStatus('stories', 'loaded');
      setLoadingStatus('status', 'loaded');

      const dataLoadedEvent = new CustomEvent('storysdk:data:loaded', {
        detail: { message: 'All data loaded successfully' },
      });
      container?.dispatchEvent(dataLoadedEvent);

      return true;
    } catch (error) {
      console.error('Error fetching stories:', error);
      if (options?.isDebugMode) {
        writeToDebug(`fetchStories failed with error: ${error.message}`);
      }
      setLoadingStatus('stories', 'error');
      return false;
    }
  }, [state.groups, state.groupsWithStories, state.language, isMobile,
    getConsistentUserId, filterActiveStories, options?.isOnlyGroups,
  options?.isDebugMode, setLoadingStatus, options?.token]);

  // General data loading function with server-side caching
  const loadData = useCallback(async () => {
    const activeUserId = getConsistentUserId();

    setLoadingStatus('status', 'loading');

    // Try to load adapted data from cache first for fast initial render
    if (state.language && activeUserId) {
      const adaptedCacheKey = `storysdk_adapted_data_${options?.token || 'no-token'}_${state.language}_${activeUserId}`;

      try {
        const cachedData = await StorageService.getItem<any[]>(adaptedCacheKey);
        if (cachedData) {
          if (options?.isDebugMode) {
            writeToDebug(`Loading adapted data from cache for ${activeUserId}`);
          }
          dispatch({ type: 'SET_DATA', payload: cachedData });
          setLoadingStatus('status', 'loaded');
        }
      } catch (error) {
        console.error('Error loading from cache:', error);
      }
    }

    // Always check server for updates (API service handles caching with Last-Modified)
    if (options?.isDebugMode) {
      writeToDebug(`Loading data from server (with server-side caching), userId: ${activeUserId}`);
    }

    const appLoaded = await fetchAppData();
    if (appLoaded) {
      await fetchGroups();
      // Remove fetchStories call from here - it will be triggered by useEffect when groups change
    }
  }, [getConsistentUserId, state.language, fetchAppData, fetchGroups,
    options?.isDebugMode, setLoadingStatus, options?.token]);

  // Auto-trigger fetchStories when groups are loaded
  useEffect(() => {
    if (state.groups.length > 0 && state.loading.groups === 'loaded' && !options?.isOnlyGroups) {
      if (options?.isDebugMode) {
        writeToDebug(`Groups loaded (${state.groups.length}), triggering fetchStories`);
      }
      fetchStories();
    }
  }, [
    state.groups,
    state.loading.groups,
    options?.isOnlyGroups,
    options?.isDebugMode,
    fetchStories,
  ]);

  // Initialize data loading
  useEffect(() => {
    if (!isNeedToLoad) {
      setIsNeedToLoad(true);
    }

    const handleResume = () => {
      setIsNeedToLoad(true);
    };

    document.addEventListener('resume', handleResume, false);

    return () => {
      document.removeEventListener('resume', handleResume, false);
    };
  }, []);

  // Main data loading
  useEffect(() => {
    if (!isNeedToLoad || !state.language || !state.userId) return;

    if (options?.isDebugMode) {
      writeToDebug(`Starting data loading: isNeedToLoad=${isNeedToLoad}, language=${state.language}, userId=${state.userId}`);
    }

    requestAnimationFrame(() => {
      loadData();
      setIsNeedToLoad(false);
    });
  }, [isNeedToLoad, state.language, state.userId, loadData, options?.isDebugMode]);

  // Factory for creating event handlers
  const createEventHandler = useCallback((
    eventName: string,
    apiHandler?: (data: any) => any,
    customHandler?: (data: any) => any,
  ) => (...args: any[]) => {
    const activeUserId = getConsistentUserId();
    if (!activeUserId) return undefined;

    const [groupId, storyId, ...rest] = args;
    const eventData = {
      groupId,
      storyId,
      uniqUserId: activeUserId,
      language: state.language,
      ...rest.reduce((acc, val, idx) => ({ ...acc, [`arg${idx}`]: val }), {}),
    };

    // Execute custom logic if exists
    const customResult = customHandler?.(eventData);

    // Dispatch event
    const customEvent = new CustomEvent(`storysdk:${eventName}`, {
      detail: eventData,
    });
    container?.dispatchEvent(customEvent);

    // Call API handler
    return apiHandler?.(eventData) || customResult;
  }, [getConsistentUserId, state.language, container]);

  // Event handlers
  const handleOpenGroup = useMemo(() => createEventHandler(
    'group:open',
    (data) => API.statistics.group.onOpen(data),
    (data) => {
      const startTime = DateTime.now().toSeconds();
      dispatch({
        type: 'SET_GROUP_DURATION',
        payload: { groupId: data.groupId, startTime },
      });
      return startTime;
    },
  ), [createEventHandler]);

  const handleStartQuiz = useMemo(() => createEventHandler(
    'quiz:start',
    (data) => API.statistics.quiz.onQuizStart({ ...data, time: DateTime.now().toISO() }),
  ), [createEventHandler]);

  const handleFinishQuiz = useMemo(() => createEventHandler(
    'quiz:finish',
    (data) => API.statistics.quiz.onQuizFinish({ ...data, time: DateTime.now().toISO() }),
    (data) => {
      if (!data.storyId) {
        const groupCache = getGroupCache(data.groupId);
        if (groupCache?.isFinished) return undefined;
        setGroupCache(data.groupId, { isFinished: true });
      } else {
        const storyCache = getStoryCache(data.storyId);
        if (storyCache?.isFinished) return undefined;
        setStoryCache(data.storyId, { isFinished: true });
      }
      return undefined;
    },
  ), [createEventHandler, getGroupCache, setGroupCache, getStoryCache, setStoryCache]);

  const handleCloseGroup = useMemo(() => createEventHandler(
    'group:close',
    (data) => {
      const duration = DateTime.now().toSeconds() - state.groupDuration.startTime;
      API.statistics.group.sendDuration({
        groupId: state.groupDuration.groupId,
        uniqUserId: data.uniqUserId,
        seconds: duration,
        language: data.language,
      });
      return API.statistics.group.onClose(data);
    },
  ), [createEventHandler, state.groupDuration.startTime]);

  const handleOpenStory = useMemo(() => createEventHandler(
    'story:open',
    (data) => API.statistics.story.onOpen(data),
    (data) => {
      const currentGroup = state.data?.find((group) => group.id === data.groupId);
      const currentStory = currentGroup?.stories?.find((story: any) => story.id === data.storyId);
      const isResultStory = currentGroup?.settings?.scoreResultLayersGroupId
        === currentStory?.layerData?.layersGroupId;

      if (isResultStory) {
        handleFinishQuiz(data.groupId);
      }
      return undefined;
    },
  ), [createEventHandler, state.data, handleFinishQuiz]);

  const handleCloseStory = useMemo(() => createEventHandler(
    'story:close',
    (data) => {
      const { duration } = data.arg0 || {};
      API.statistics.story.sendDuration({
        storyId: data.storyId,
        groupId: data.groupId,
        uniqUserId: data.uniqUserId,
        seconds: duration,
        language: data.language,
      });

      if (duration > 1) {
        API.statistics.story.sendImpression({
          storyId: data.storyId,
          groupId: data.groupId,
          uniqUserId: data.uniqUserId,
          seconds: duration,
          language: data.language,
        });
      }

      return API.statistics.story.onClose(data);
    },
  ), [createEventHandler]);

  const handleNextStory = useMemo(() => createEventHandler('story:next', (data) => API.statistics.story.onNext(data)), [createEventHandler]);
  const handleModalOpen = useMemo(() => createEventHandler('modal:open'), [createEventHandler]);
  const handleModalClose = useMemo(() => createEventHandler('modal:close'), [createEventHandler]);
  const handlePrevStory = useMemo(() => createEventHandler('story:prev', (data) => API.statistics.story.onPrev(data)), [createEventHandler]);

  return (
    <Suspense fallback={<div className="storysdk-skeleton-loader" />}>
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
        groupView={state.groupView}
        groups={state.data ?? []}
        groupsClassName={options?.groupsClassName}
        groupsOutlineColor={options?.groupsOutlineColor}
        isForceCloseAvailable={options?.isForceCloseAvailable}
        isInReactNativeWebView={options?.isInReactNativeWebView}
        isLoading={options?.isOnlyGroups ? state.loading.groups !== 'loaded' : state.loading.status !== 'loaded'}
        isShowLabel={state.isShowLabel}
        isShowMockup={state.isShowMockup}
        isStatusBarActive={options?.isStatusBarActive}
        openInExternalModal={options?.openInExternalModal}
        preventCloseOnGroupClick={options?.preventCloseOnGroupClick || options?.isOnlyGroups}
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
    </Suspense>
  );
};

export default withGroupsData;
