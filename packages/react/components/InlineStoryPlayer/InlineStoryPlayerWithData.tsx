import React, {
  useState, useEffect, useCallback, useMemo, useRef,
} from 'react';
import axios from 'axios';
import {
  Group, GroupType, StoryType, BackgroundType, BackgroundColorType,
} from '@storysdk/types';
import { DateTime } from 'luxon';
import { IconLoader } from '../icons';
import { InlineStoryPlayer } from './InlineStoryPlayer';
import './InlineStoryPlayer.scss';

// API response types
interface RawStoryData {
  id: string;
  position: number;
  story_data: {
    status: string;
    background: {
      type: string;
      value?: string;
    };
    widgets: any[];
    start_time?: string;
    end_time?: string;
  };
  layer_data?: {
    layers_group_id?: string;
    is_default_layer?: boolean;
    duration?: number;
    score?: {
      letter: string;
      points: number;
    };
  };
}

interface RawGroupData {
  id: string;
  app_id: string;
  title: string;
  image_url: string;
  type: GroupType;
  active: boolean;
  settings?: any;
}

// Helper to convert raw background to BackgroundType
const convertBackground = (rawBg: { type: string; value?: string }): BackgroundType => {
  if (rawBg.type === 'color' || rawBg.type === BackgroundColorType.COLOR) {
    return { type: BackgroundColorType.COLOR, value: rawBg.value || '#000000' };
  }
  if (rawBg.type === 'gradient' || rawBg.type === BackgroundColorType.GRADIENT) {
    return { type: BackgroundColorType.GRADIENT, value: rawBg.value ? [rawBg.value] : ['#000000'] };
  }
  if (rawBg.type === 'transparent' || rawBg.type === BackgroundColorType.TRANSPARENT) {
    return { type: BackgroundColorType.TRANSPARENT, value: rawBg.value || '' };
  }
  // For image/video types
  return { type: BackgroundColorType.COLOR, value: rawBg.value || '#000000' };
};

interface InlineStoryPlayerWithDataProps {
  /** Your StorySDK app token */
  token: string;
  /** Optional group ID to display specific group. If not provided, displays first available group */
  groupId?: string;
  /** Container width (defaults to 100%) */
  width?: number | string;
  /** Container height (defaults to auto based on aspect ratio) */
  height?: number | string;
  /** Story content width (defaults to 360) */
  storyWidth?: number;
  /** Story content height (defaults to 640) */
  storyHeight?: number;
  /** Initial story ID to start with */
  startStoryId?: string;
  /** Hide progress indicators */
  isProgressHidden?: boolean;
  /** Show status bar */
  isStatusBarActive?: boolean;
  /** Disable caching */
  isCacheDisabled?: boolean;
  /** Dev mode */
  devMode?: 'staging' | 'development';
  /** Background color */
  backgroundColor?: string;
  /** Autoplay videos */
  autoplayVideos?: boolean;
  /** Initial muted state for videos */
  isVideoMutedInitial?: boolean;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Arrows color */
  arrowsColor?: string;
  /** Border radius */
  borderRadius?: number;
  /** Show controls (play/pause, mute) */
  showControls?: boolean;
  /** Disable user interaction with widgets */
  disableInteraction?: boolean;
  /** Loop stories */
  loop?: boolean;
  /** Pause on hover */
  pauseOnHover?: boolean;
  /** Custom loader component */
  loader?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Callback when data is loaded */
  onDataLoaded?(group: Group): void;
  /** Callback when error occurs */
  onError?(error: Error): void;
  /** Callback when story opens */
  onOpenStory?(groupId: string, storyId: string): void;
  /** Callback when story closes */
  onCloseStory?(groupId: string, storyId: string, duration: number): void;
  /** Callback when navigating to next story */
  onNextStory?(groupId: string, storyId: string): void;
  /** Callback when navigating to previous story */
  onPrevStory?(groupId: string, storyId: string): void;
  /** Callback when quiz starts */
  onStartQuiz?(groupId: string, storyId?: string): void;
  /** Callback when quiz finishes */
  onFinishQuiz?(groupId: string, storyId?: string): void;
  /** Callback when all stories are viewed */
  onComplete?(groupId: string): void;
}

// API base URL resolver
const getApiBaseUrl = (devMode?: 'staging' | 'development'): string => {
  if (devMode === 'staging') {
    return 'https://api.diffapp.link/sdk/v1';
  }
  if (devMode === 'development') {
    return 'http://localhost:8080/sdk/v1';
  }
  return 'https://api.storysdk.com/sdk/v1';
};

export const InlineStoryPlayerWithData: React.FC<InlineStoryPlayerWithDataProps> = (props) => {
  const {
    token,
    groupId,
    width = '100%',
    height,
    storyWidth,
    storyHeight,
    startStoryId,
    isProgressHidden,
    isStatusBarActive,
    isCacheDisabled,
    devMode,
    backgroundColor,
    autoplayVideos,
    isVideoMutedInitial,
    showArrows,
    arrowsColor,
    borderRadius = 8,
    showControls,
    disableInteraction,
    loop,
    pauseOnHover,
    loader,
    errorComponent,
    onDataLoaded,
    onError,
    onOpenStory,
    onCloseStory,
    onNextStory,
    onPrevStory,
    onStartQuiz,
    onFinishQuiz,
    onComplete,
  } = props;

  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = useMemo(() => getApiBaseUrl(devMode), [devMode]);

  // Use refs for callbacks to avoid infinite loops in useEffect
  const onDataLoadedRef = useRef(onDataLoaded);
  const onErrorRef = useRef(onError);
  onDataLoadedRef.current = onDataLoaded;
  onErrorRef.current = onError;

  // Filter active stories
  const filterActiveStories = useCallback((storiesData: RawStoryData[]): RawStoryData[] => storiesData.filter(
    (storyItem) => storyItem.story_data.status === 'active'
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

  // Adapt story data to internal format
  const adaptStoryData = useCallback((rawStory: RawStoryData, index: number): StoryType => ({
    id: rawStory.id,
    storyData: rawStory.story_data.widgets || [],
    background: convertBackground(rawStory.story_data.background || { type: 'color', value: '#000000' }),
    position: rawStory.position || 0,
    positionIndex: index,
    layerData: {
      layersGroupId: rawStory.layer_data?.layers_group_id || '',
      positionInGroup: index,
      isDefaultLayer: rawStory.layer_data?.is_default_layer ?? true,
      duration: rawStory.layer_data?.duration || 7,
      score: rawStory.layer_data?.score || { letter: '', points: 0 },
    },
  }), []);

  // Load data
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!token) {
        const err = new Error('Token is required');
        setError(err);
        setIsLoading(false);
        onErrorRef.current?.(err);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Configure axios for this request
        const axiosInstance = axios.create({
          baseURL: baseUrl,
          headers: {
            Authorization: `SDK ${token}`,
          },
        });

        // Fetch groups
        const groupsResponse = await axiosInstance.get('/groups');

        if (!isMounted) return;

        if (groupsResponse.data.error) {
          throw new Error(groupsResponse.data.error);
        }

        const groupsData = groupsResponse.data.data || [];

        // Filter and find the target group
        let targetGroup: RawGroupData | undefined;

        if (groupId) {
          // Find specific group by ID
          targetGroup = groupsData.find((g: RawGroupData) => g.id === groupId && g.active);
        } else {
          // Find first active non-onboarding group
          targetGroup = groupsData.find((g: RawGroupData) => g.active
            && g.type !== GroupType.ONBOARDING
            && g.type !== GroupType.PARENT_GROUP);
        }

        if (!targetGroup) {
          throw new Error(groupId ? `Group with ID "${groupId}" not found` : 'No active groups found');
        }

        // Fetch stories for the group
        const storiesResponse = await axiosInstance.get(`/groups/${targetGroup.id}/stories`);

        if (!isMounted) return;

        if (storiesResponse.data.error) {
          throw new Error(storiesResponse.data.error);
        }

        const rawStories: RawStoryData[] = storiesResponse.data.data || [];
        const activeStories = filterActiveStories(rawStories);
        const adaptedStories = activeStories.map((story, index) => adaptStoryData(story, index));

        // Build the group object
        const adaptedGroup: Group = {
          id: targetGroup.id,
          title: targetGroup.title,
          imageUrl: targetGroup.image_url,
          type: targetGroup.type,
          settings: targetGroup.settings,
          stories: adaptedStories,
        };

        if (!isMounted) return;

        setGroup(adaptedGroup);
        setIsLoading(false);
        onDataLoadedRef.current?.(adaptedGroup);
      } catch (err) {
        if (!isMounted) return;

        const loadError = err instanceof Error ? err : new Error('Failed to load data');
        setError(loadError);
        setIsLoading(false);
        onErrorRef.current?.(loadError);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token, groupId, baseUrl, filterActiveStories, adaptStoryData]);

  // Render loading state
  if (isLoading) {
    if (loader) {
      return <>{loader}</>;
    }

    return (
      <div
        className="StorySdkInlinePlayer StorySdkInlinePlayer--loading"
        style={{
          width,
          height: height || 400,
          borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor || '#05051D',
        }}
      >
        <IconLoader className="StorySdkInlinePlayer__loaderIcon" />
      </div>
    );
  }

  // Render error state
  if (error || !group) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    return (
      <div
        className="StorySdkInlinePlayer StorySdkInlinePlayer--error"
        style={{
          width,
          height: height || 400,
          borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor || '#05051D',
          color: '#fff',
          fontSize: 14,
          textAlign: 'center',
          padding: 20,
        }}
      >
        {error?.message || 'Failed to load stories'}
      </div>
    );
  }

  // Render player
  return (
    <InlineStoryPlayer
      arrowsColor={arrowsColor}
      autoplayVideos={autoplayVideos}
      borderRadius={borderRadius}
      disableInteraction={disableInteraction}
      group={group}
      height={height}
      isProgressHidden={isProgressHidden}
      isVideoMutedInitial={isVideoMutedInitial}
      loop={loop}
      showArrows={showArrows}
      showControls={showControls}
      startStoryId={startStoryId}
      storyHeight={storyHeight}
      storyWidth={storyWidth}
      width={width}
      onCloseStory={onCloseStory}
      onComplete={onComplete}
      onNextStory={onNextStory}
      onOpenStory={onOpenStory}
      onPrevStory={onPrevStory}
    />
  );
};

export default InlineStoryPlayerWithData;
