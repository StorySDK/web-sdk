import React, {
  useState, useEffect, useMemo, useCallback, Suspense, useRef, useReducer,
} from 'react';
import type { Group } from '@storysdk/types';
import { getUniqUserId, StorageService, GroupsListProps } from '@storysdk/react';
import { GroupType } from '@storysdk/types';
import { useWindowSize } from '@react-hook/window-size';
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import axios from 'axios';
import { API } from '../services/API';
import { adaptGroupData } from '../utils/groupsAdapter';
import { getNavigatorLanguage } from '../utils/localization';
import { loadFontsToPage, preloadFonts } from '../utils/fontsInclude';
import {
  checkIos, initGA, writeToDebug, generateAdaptedDataCacheKey,
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
  GroupsList: React.FC<any>,
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
    disableCache?: boolean;
    on?(event: string, callback: (data: any) => void): void;
    off?(event: string, callback: (data: any) => void): void;
    destroy?(): void;
  },
  container?: Element | HTMLDivElement | null,
) => () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isNeedToLoad, setIsNeedToLoad] = useState(false);

  // Always call hooks at the top level, regardless of token validity
  const rawGroupCache = useGroupCache(state.userId || null, options?.token || '');
  const rawStoryCache = useStoryCache(state.userId || null, options?.token || '');

  // Cache - only use if valid token is provided
  const [getGroupCache, setGroupCache] = useMemo(() => {
    // CRITICAL: Check if token is valid before using cache hooks
    if (!options?.token || options.token === 'no-token' || options.token.length < 5) {
      // Return dummy functions if token is invalid
      console.warn('withGroupsData: Invalid token provided, cache hooks disabled');
      return [
        () => null, // getGroupCache returns null
        () => { }, // setGroupCache does nothing
      ];
    }

    return rawGroupCache;
  }, [rawGroupCache, options?.token]);

  const [getStoryCache, setStoryCache] = useMemo(() => {
    // CRITICAL: Check if token is valid before using cache hooks
    if (!options?.token || options.token === 'no-token' || options.token.length < 5) {
      // Return dummy functions if token is invalid
      return [
        () => null, // getStoryCache returns null
        () => { }, // setStoryCache does nothing
      ];
    }

    return rawStoryCache;
  }, [rawStoryCache, options?.token]);

  // Refs for request cancellation and state tracking
  const apiRequestsRef = useRef<AbortController[]>([]);
  const initialUserIdRef = useRef<string | null>(null);
  const isUserIdChangingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastFetchStoriesCallRef = useRef<number>(0);
  const isStoriesLoadingRef = useRef<boolean>(false);

  // Viewport detection
  const [width] = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);

  // Function to update loading status with mount check
  const setLoadingStatus = useCallback((
    key: keyof LoadingState,
    status: LoadingState[keyof LoadingState],
  ) => {
    if (isMountedRef.current) {
      dispatch({ type: 'SET_LOADING_STATUS', payload: { key, status } });
    }
  }, []);

  // Get consistent userId
  const getConsistentUserId = useCallback(() => initialUserIdRef.current || state.userId,
    [state.userId]);

  // Memoize stable cache key components to prevent unnecessary regeneration
  const stableCacheComponents = useMemo(() => {
    const activeUserId = getConsistentUserId();
    return {
      userId: activeUserId,
      token: options?.token,
      language: state.language,
      isValidForCache: !!(
        activeUserId
        && activeUserId !== 'anonymous'
        && activeUserId !== 'promise-user-id'
        && options?.token
        && options.token !== 'no-token'
        && options.token.length >= 5
        && state.language
      ),
    };
  }, [getConsistentUserId, options?.token, state.language]);

  // Split language calculation for early initialization
  useEffect(() => {
    if (state.appLocale && isMountedRef.current) {
      const detectedLanguage = getNavigatorLanguage(state.appLocale);
      if (isMountedRef.current) {
        dispatch({ type: 'SET_LANGUAGE', payload: detectedLanguage });
        axios.defaults.headers.common['Accept-Language'] = detectedLanguage;
      }
    }
  }, [state.appLocale]);

  // Set up cancellation for API requests and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();
    apiRequestsRef.current.push(controller);

    return () => {
      isMountedRef.current = false;

      // Cancel all API requests
      apiRequestsRef.current.forEach((ctrl) => {
        if (!ctrl.signal.aborted) {
          ctrl.abort();
        }
      });

      // Clear all timeouts
      timeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeoutsRef.current = [];

      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  // Fetch user ID early and independently
  useEffect(() => {
    const fetchUserId = async () => {
      if (isUserIdChangingRef.current || initialUserIdRef.current || !isMountedRef.current) {
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

        if (!initialUserIdRef.current && isMountedRef.current) {
          initialUserIdRef.current = id;
          dispatch({ type: 'SET_USER_ID', payload: id });
          if (options?.isDebugMode) {
            writeToDebug(`Setting initial userId: ${id}`);
          }
        }
      } catch (error) {
        if (options?.isDebugMode) {
          writeToDebug(`Error obtaining userId: ${error}`);
        }

        const newId = nanoid();
        if (options?.isDebugMode) {
          writeToDebug(`Created fallback userId: ${newId}`);
        }

        if (!initialUserIdRef.current && isMountedRef.current) {
          initialUserIdRef.current = newId;
          dispatch({ type: 'SET_USER_ID', payload: newId });

          // Try to save fallback ID in storage
          StorageService.setItem('storysdk_user_id', newId).catch((storageError) => {
            if (options?.isDebugMode) {
              writeToDebug(`Failed to save fallback userId to storage: ${storageError}`);
            }
          });
        }
      } finally {
        isUserIdChangingRef.current = false;
      }
    };

    fetchUserId();
  }, []);

  // Optimized app data fetching
  const fetchAppData = useCallback(async () => {
    if (!isMountedRef.current) return false;

    setLoadingStatus('app', 'loading');

    try {
      const appData = await API.app.getApp(options?.disableCache, options?.isDebugMode);

      if (!isMountedRef.current) return false;

      if (options?.isDebugMode) {
        writeToDebug(`App data: ${JSON.stringify(appData)}`);
      }

      if (!appData.data.error) {
        const app = appData.data.data;

        if (app && isMountedRef.current) {
          const appGroupView = app.settings?.groupView?.web || 'circle';
          const isShowMockupApp = options?.isShowMockup !== undefined
            ? options.isShowMockup
            : app.settings?.isShowMockup;

          if (isMountedRef.current) {
            dispatch({ type: 'SET_APP_LOCALE', payload: app.localization });
            dispatch({ type: 'SET_GROUP_VIEW', payload: appGroupView });
            dispatch({ type: 'SET_IS_SHOW_MOCKUP', payload: checkIos() ? false : isShowMockupApp });
            dispatch({ type: 'SET_IS_SHOW_LABEL', payload: !app.premium_owner });
          }

          if (app.settings?.fonts?.length) {
            preloadFonts(app.settings.fonts);
            const fontTimeout = setTimeout(() => {
              if (isMountedRef.current) {
                loadFontsToPage(app.settings.fonts);
              }
            }, 0);
            timeoutsRef.current.push(fontTimeout);
          }

          if (app.settings?.integrations?.googleAnalytics?.trackingId) {
            const gaTimeout = setTimeout(() => {
              if (isMountedRef.current) {
                initGA(app.settings?.integrations?.googleAnalytics?.trackingId);
              }
            }, 100);
            timeoutsRef.current.push(gaTimeout);
          }

          setLoadingStatus('app', 'loaded');
          return true;
        }
      }

      setLoadingStatus('app', 'error');
      return false;
    } catch (error) {
      console.error('Error fetching app data:', error);
      if (isMountedRef.current) {
        setLoadingStatus('app', 'error');
      }
      return false;
    }
  }, [options?.isDebugMode, options?.isShowMockup, setLoadingStatus]);

  // Groups fetching
  const fetchGroups = useCallback(async () => {
    if (!isMountedRef.current) return false;

    setLoadingStatus('groups', 'loading');

    try {
      const groupsData = await API.groups.getList(options?.disableCache, options?.isDebugMode);

      if (!isMountedRef.current) return false;

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
              if (options?.groupId) {
                return options?.groupId === item.id && isActive;
              }
              if (options?.autoplay) {
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

        if (!isMountedRef.current) return false;

        if (isMountedRef.current) {
          dispatch({ type: 'SET_GROUPS', payload: groupsFetchedData });
          dispatch({ type: 'SET_GROUPS_WITH_STORIES', payload: groupsFetchedData });
        }

        const consistentUserId = getConsistentUserId();

        if (options?.isOnlyGroups && isMountedRef.current) {
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

          if (isMountedRef.current) {
            dispatch({ type: 'SET_DATA', payload: onlyGroupsData });
            setLoadingStatus('status', 'loaded');

            // Cache groups-only data separately
            if (consistentUserId && !options?.disableCache) {
              const groupsOnlyCacheKey = generateAdaptedDataCacheKey({
                token: stableCacheComponents.token,
                language: stableCacheComponents.language,
                userId: stableCacheComponents.userId,
                includeStories: false,
              });

              // Only cache if we have a valid cache key
              if (groupsOnlyCacheKey) {
                StorageService.setItem(groupsOnlyCacheKey, onlyGroupsData).catch((error) => {
                  console.error('Error saving groups-only data to cache:', error);
                });

                if (options?.isDebugMode) {
                  writeToDebug(`Cached groups-only data with key: ${groupsOnlyCacheKey}`);
                }
              } else if (options?.isDebugMode) {
                writeToDebug('Skipping groups-only data caching due to invalid cache key');
              }
            }

            const dataLoadedEvent = new CustomEvent('storysdk:data:loaded', {
              detail: { message: 'Groups data loaded successfully (only groups mode)' },
            });
            container?.dispatchEvent(dataLoadedEvent);
          }
        }

        setLoadingStatus('groups', 'loaded');
        return true;
      }

      setLoadingStatus('groups', 'error');
      return false;
    } catch (error) {
      console.error('Error fetching groups:', error);
      if (isMountedRef.current) {
        setLoadingStatus('groups', 'error');
      }
      return false;
    }
  }, [state.language, isMobile, getConsistentUserId, options?.isOnboarding,
  options?.groupId, options?.autoplay, options?.isOnlyGroups, setLoadingStatus,
  options?.disableCache, options?.isDebugMode, stableCacheComponents]);

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
    const now = Date.now();

    if (!isMountedRef.current) return false;

    // Prevent rapid successive calls (debounce by 100ms)
    if (now - lastFetchStoriesCallRef.current < 100) {
      if (options?.isDebugMode) {
        const timeSinceLastCall = now - lastFetchStoriesCallRef.current;
        writeToDebug(`fetchStories: debounced call, skipping (${timeSinceLastCall}ms ago)`);
      }
      return false;
    }

    // Prevent concurrent calls
    if (isStoriesLoadingRef.current) {
      if (options?.isDebugMode) {
        writeToDebug('fetchStories: already loading stories, skipping concurrent call');
      }
      return false;
    }

    lastFetchStoriesCallRef.current = now;

    if (options?.isDebugMode) {
      writeToDebug(`fetchStories called: groups.length=${state.groups.length}, isOnlyGroups=${options?.isOnlyGroups}, loading.stories=${state.loading.stories}, userId=${activeUserId}`);
    }

    if (!state.groups.length || (options?.isOnlyGroups && !options?.isOnboarding)) {
      if (options?.isDebugMode) {
        writeToDebug(`fetchStories: skipping - no groups (${state.groups.length}) or isOnlyGroups (${options?.isOnlyGroups}) without onboarding (${options?.isOnboarding}), userId: ${activeUserId}`);
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

    isStoriesLoadingRef.current = true;
    setLoadingStatus('stories', 'loading');

    try {
      const loadStoriesForGroup = async (groupItem: any) => {
        try {
          if (!isMountedRef.current) return null;

          if (options?.isDebugMode) {
            writeToDebug(`Loading stories for group ${groupItem.id}`);
          }

          // Use API service which handles HEAD requests and Last-Modified automatically
          const storiesData = await API.stories.getList(
            { groupId: groupItem.id },
            options?.disableCache,
            options?.isDebugMode,
          );

          if (!isMountedRef.current) return null;

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

      if (!isMountedRef.current) return false;

      const validResults = allResults.filter(Boolean) as Array<{
        groupId: string;
        stories: any[];
        fromCache: boolean;
      }>;

      if (options?.isDebugMode) {
        writeToDebug(`Stories loading completed: ${validResults.length}/${state.groups.length} groups have stories`);
      }

      if (validResults.length > 0 && isMountedRef.current) {
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

        if (isMountedRef.current) {
          dispatch({ type: 'SET_GROUPS_WITH_STORIES', payload: newUpdatedGroupsWithStories });

          const userIdForAdapt = activeUserId || 'anonymous';
          const updatedData = adaptGroupData(
            newUpdatedGroupsWithStories,
            userIdForAdapt,
            state.language,
            isMobile,
          );
          dispatch({ type: 'SET_DATA', payload: updatedData });

          // Update adapted data cache only if we got new data from server and cache is not disabled
          // Use stable cache components
          if (stableCacheComponents.isValidForCache && hasNewDataFromServer && !options?.disableCache) {
            const adaptedWithStoriesCacheKey = generateAdaptedDataCacheKey({
              token: stableCacheComponents.token,
              language: stableCacheComponents.language,
              userId: stableCacheComponents.userId,
              includeStories: true,
            });

            // Only cache if we have a valid cache key
            if (adaptedWithStoriesCacheKey) {
              StorageService.setItem(adaptedWithStoriesCacheKey, updatedData).catch((error) => {
                console.error('Error saving adapted data with stories to cache:', error);
              });

              if (options?.isDebugMode) {
                writeToDebug(`Updated adapted data cache with stories due to new server data, userId: ${activeUserId}, key: ${adaptedWithStoriesCacheKey}`);
              }
            } else if (options?.isDebugMode) {
              writeToDebug('Skipping adapted data with stories caching due to invalid cache key');
            }
          }
        }
      } else {
        if (options?.isDebugMode) {
          writeToDebug('No valid story results found for any groups');
        }

        // For onboarding mode or when no stories are found, still set the data with empty stories
        if (isMountedRef.current) {
          const userIdForAdapt = activeUserId || 'anonymous';
          const dataWithEmptyStories = adaptGroupData(
            state.groupsWithStories.map((group: Group) => ({ ...group, stories: [] })),
            userIdForAdapt,
            state.language,
            isMobile,
          );
          dispatch({ type: 'SET_DATA', payload: dataWithEmptyStories });
        }
      }

      if (isMountedRef.current) {
        setLoadingStatus('stories', 'loaded');
        setLoadingStatus('status', 'loaded');

        const dataLoadedEvent = new CustomEvent('storysdk:data:loaded', {
          detail: { message: validResults.length > 0 ? 'All data loaded successfully' : 'Groups loaded, no stories available' },
        });
        container?.dispatchEvent(dataLoadedEvent);
      }

      return true;
    } catch (error) {
      console.error('Error fetching stories:', error);
      if (options?.isDebugMode) {
        writeToDebug(`fetchStories failed with error: ${error.message}`);
      }
      if (isMountedRef.current) {
        setLoadingStatus('stories', 'error');
      }
      return false;
    } finally {
      isStoriesLoadingRef.current = false;
    }
  }, [state.groups, state.groupsWithStories, state.language, isMobile,
    getConsistentUserId, filterActiveStories, options?.isOnlyGroups,
  options?.isDebugMode, setLoadingStatus, stableCacheComponents,
  options?.disableCache, options?.isOnboarding]);

  // Ref to store latest fetchStories function to avoid infinite loops
  const fetchStoriesRef = useRef(fetchStories);
  fetchStoriesRef.current = fetchStories;

  // General data loading function with server-side caching
  const loadData = useCallback(async () => {
    const activeUserId = getConsistentUserId();

    if (!isMountedRef.current) return;

    setLoadingStatus('status', 'loading');

    // Try to load adapted data from cache first for fast initial render (skip if cache disabled)
    if (stableCacheComponents.isValidForCache && !options?.disableCache && isMountedRef.current) {
      // Use appropriate cache key based on whether we need stories or not
      const adaptedCacheKey = generateAdaptedDataCacheKey({
        token: stableCacheComponents.token,
        language: stableCacheComponents.language,
        userId: stableCacheComponents.userId,
        includeStories: !options?.isOnlyGroups,
      });

      // Only try to load from cache if we have a valid cache key
      if (adaptedCacheKey) {
        try {
          const cachedData = await StorageService.getItem<any[]>(adaptedCacheKey);
          if (cachedData && isMountedRef.current) {
            if (options?.isDebugMode) {
              const cacheType = options?.isOnlyGroups ? 'groups-only' : 'with-stories';
              writeToDebug(`Loading adapted ${cacheType} data from cache for ${activeUserId}, key: ${adaptedCacheKey}`);
            }
            dispatch({ type: 'SET_DATA', payload: cachedData });
            setLoadingStatus('status', 'loaded');
          }
        } catch (error) {
          console.error('Error loading from cache:', error);
        }
      } else if (options?.isDebugMode) {
        writeToDebug('Skipping cache loading due to invalid cache key');
      }
    }

    // Always check server for updates (API service handles caching with Last-Modified)
    if (options?.isDebugMode && isMountedRef.current) {
      const cacheModeText = options?.disableCache ? 'with cache disabled' : 'with server-side caching';
      const dataType = options?.isOnlyGroups ? 'groups-only' : 'with-stories';
      writeToDebug(`Loading ${dataType} data from server (${cacheModeText}), userId: ${activeUserId}`);
    }

    if (isMountedRef.current) {
      const appLoaded = await fetchAppData();
      if (appLoaded && isMountedRef.current) {
        await fetchGroups();
      }
    }
  }, [getConsistentUserId, stableCacheComponents, fetchAppData, fetchGroups,
    options?.isDebugMode, setLoadingStatus, options?.isOnlyGroups, options?.disableCache]);

  // Auto-trigger fetchStories when groups are loaded
  useEffect(() => {
    if (!isMountedRef.current) return;

    if (state.groups.length > 0 && state.loading.groups === 'loaded' && !options?.isOnlyGroups) {
      if (options?.isDebugMode) {
        writeToDebug(`Groups loaded (${state.groups.length}), triggering fetchStories`);
      }
      fetchStoriesRef.current();
    } else if (state.groups.length === 0 && state.loading.groups === 'loaded' && !options?.isOnlyGroups) {
      if (options?.isDebugMode) {
        writeToDebug('No groups found after loading, setting status to loaded');
      }
      setLoadingStatus('status', 'loaded');
    } else if (state.groups.length > 0 && state.loading.groups === 'loaded' && options?.isOnboarding) {
      // Special handling for onboarding mode - always load stories even if isOnlyGroups is true
      if (options?.isDebugMode) {
        writeToDebug(`Onboarding mode: Groups loaded (${state.groups.length}), triggering fetchStories for onboarding`);
      }
      fetchStoriesRef.current();
    }
  }, [
    state.groups,
    state.loading.groups,
    options?.isOnlyGroups,
    options?.isOnboarding,
    options?.isDebugMode,
    setLoadingStatus,
  ]);

  // Initialize data loading
  useEffect(() => {
    if (!isNeedToLoad && isMountedRef.current) {
      setIsNeedToLoad(true);
    }

    const handleResume = () => {
      if (isMountedRef.current) {
        setIsNeedToLoad(true);
      }
    };

    document.addEventListener('resume', handleResume, false);

    return () => {
      document.removeEventListener('resume', handleResume, false);
    };
  }, []);

  // Main data loading
  useEffect(() => {
    if (!isNeedToLoad || !state.language || !state.userId || !isMountedRef.current) return;

    if (options?.isDebugMode) {
      writeToDebug(`Starting data loading: isNeedToLoad=${isNeedToLoad}, language=${state.language}, userId=${state.userId}`);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (isMountedRef.current) {
        loadData();
        setIsNeedToLoad(false);
      }
      animationFrameRef.current = null;
    });
  }, [isNeedToLoad, state.language, state.userId, loadData, options?.isDebugMode]);

  // Cleanup animation frame on dependencies change
  useEffect(() => () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [isNeedToLoad, state.language, state.userId, loadData]);

  // Factory for creating event handlers
  const createEventHandler = useCallback((
    eventName: string,
    apiHandler?: (data: any) => any,
    customHandler?: (data: any) => any,
  ) => (...args: any[]) => {
    const activeUserId = getConsistentUserId();
    if (!activeUserId || !isMountedRef.current) return undefined;

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

    // Dispatch event only if component is still mounted
    if (isMountedRef.current) {
      const customEvent = new CustomEvent(`storysdk:${eventName}`, {
        detail: eventData,
      });
      container?.dispatchEvent(customEvent);
    }

    // Call API handler
    return apiHandler?.(eventData) || customResult;
  }, [getConsistentUserId, state.language, container]);

  // Event handlers
  const handleOpenGroup = useMemo(() => createEventHandler(
    'group:open',
    (data) => API.statistics.group.onOpen(data),
    (data) => {
      if (!isMountedRef.current) return undefined;
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
      // Проверяем, что у нас есть валидный groupId для отправки duration
      if (state.groupDuration.groupId && state.groupDuration.groupId.trim() !== '') {
        const duration = DateTime.now().toSeconds() - state.groupDuration.startTime;
        API.statistics.group.sendDuration({
          groupId: state.groupDuration.groupId,
          uniqUserId: data.uniqUserId,
          seconds: duration,
          language: data.language,
        });
      }
      return API.statistics.group.onClose(data);
    },
  ), [createEventHandler, state.groupDuration.startTime, state.groupDuration.groupId]);

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

      if (data.groupId && data.groupId.trim() !== '') {
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
        isOnlyGroups={options?.isOnlyGroups}
        isShowLabel={state.isShowLabel}
        isShowMockup={state.isShowMockup}
        isStatusBarActive={options?.isStatusBarActive}
        openInExternalModal={options?.openInExternalModal}
        preventCloseOnGroupClick={options?.preventCloseOnGroupClick || options?.isOnlyGroups}
        startGroupId={options?.groupId}
        startStoryId={options?.startStoryId}
        storyHeight={options?.storyHeight}
        storyWidth={options?.storyWidth}
        token={options?.token}
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
