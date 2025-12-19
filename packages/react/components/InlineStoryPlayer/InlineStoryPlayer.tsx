import React, {
  useEffect, useState, useCallback, useRef, useReducer, useMemo,
} from 'react';
import block from 'bem-cn';
import JSConfetti from 'js-confetti';
import { eventPublish, getUniqUserId } from '@utils';
import { IconArrow } from '@components/icons';
import { useLongPress } from 'use-long-press';
import { DateTime } from 'luxon';
import {
  StoryType, Group, GroupType, ScoreType, PlayStatusType,
} from '@storysdk/types';
import { useAnswersCache, useSwipe } from '../../hooks';
import {
  StoryContext, StoryCurrentSize, STORY_SIZE_DEFAULT,
} from '../StoryModal/StoryModal';
import { StorySwiperContent } from '../StoryModal/_components/StorySwiperContent/StorySwiperContent';
import { useElementSize } from '../../hooks/useElementSize';
import './InlineStoryPlayer.scss';
import '../StoryModal/StoryModal.scss';

const b = block('StorySdkInlinePlayer');

interface InlineStoryPlayerProps {
  /** Story group to display */
  group: Group;
  /** Stories to display (if not provided, will use group.stories) */
  stories?: StoryType[];
  /** Container width (defaults to 100%) */
  width?: number | string;
  /** Container height (defaults to 100%) */
  height?: number | string;
  /** Story content width */
  storyWidth?: number;
  /** Story content height */
  storyHeight?: number;
  /** Border radius */
  borderRadius?: number;
  /** Autoplay videos */
  autoplayVideos?: boolean;
  /** Initial video muted state */
  isVideoMutedInitial?: boolean;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Arrows color */
  arrowsColor?: string;
  /** Show play/pause and mute controls */
  showControls?: boolean;
  /** Disable all user interaction */
  disableInteraction?: boolean;
  /** Loop stories */
  loop?: boolean;
  /** Starting story ID */
  startStoryId?: string;
  /** Hide progress indicators */
  isProgressHidden?: boolean;
  /** Callback when story opens */
  onOpenStory?: (groupId: string, storyId: string) => void;
  /** Callback when story closes */
  onCloseStory?: (groupId: string, storyId: string, duration: number) => void;
  /** Callback when navigating to next story */
  onNextStory?: (groupId: string, storyId: string, duration: number) => void;
  /** Callback when navigating to previous story */
  onPrevStory?: (groupId: string, storyId: string, duration: number) => void;
  /** Callback when all stories complete */
  onComplete?: (groupId: string) => void;
}

const LONG_PRESS_THRESHOLD = 500;

interface QuizState {
  points: number;
  letters: string;
}

const initQuizeState: QuizState = {
  points: 0,
  letters: '',
};

function reducer(state: QuizState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'add_points':
      return { ...state, points: state.points + action.payload };
    case 'add_letter':
      return { ...state, letters: state.letters + action.payload };
    case 'reset':
      return initQuizeState;
    default:
      throw new Error();
  }
}

export const InlineStoryPlayer: React.FC<InlineStoryPlayerProps> = ({
  group,
  stories: storiesProp,
  width = '100%',
  height = '100%',
  storyWidth = STORY_SIZE_DEFAULT.width,
  storyHeight = STORY_SIZE_DEFAULT.height,
  borderRadius = 10,
  autoplayVideos = true,
  isVideoMutedInitial = true,
  showArrows = true,
  arrowsColor = 'white',
  showControls = true,
  disableInteraction = false,
  loop = false,
  startStoryId,
  isProgressHidden = false,
  onOpenStory,
  onCloseStory,
  onNextStory,
  onPrevStory,
  onComplete,
}) => {
  const stories = storiesProp || group?.stories || [];

  // State
  const [quizState, dispatchQuizState] = useReducer(reducer, initQuizeState);
  const [currentStory, setCurrentStory] = useState(0);
  const [currentStoryId, setCurrentStoryId] = useState('');
  const [playStatus, setPlayStatus] = useState<PlayStatusType>('wait');
  const [isOpened, setIsOpened] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [quizStartedStoryIds, setQuizStartedStoryIds] = useState<{ [key: string]: boolean }>({});
  const [isVideoMuted, setIsVideoMuted] = useState(isVideoMutedInitial);
  const [isVideoExists, setIsVideoExists] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isBackgroundVideoPlaying, setIsBackgroundVideoPlaying] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isAutoplayVideos, setIsAutoplayVideos] = useState(autoplayVideos);
  const [loadedStoriesIds, setLoadedStoriesIds] = useState<{ [key: string]: boolean }>({});
  const [userId, setUserId] = useState<string>('');
  const [storyDuration, setStoryDuration] = useState({
    groupId: '',
    storyId: '',
    startTime: 0,
  });

  // Refs
  const jsConfetti = useRef(new JSConfetti());
  const containerRef = useRef<HTMLDivElement>(null);

  // Active stories with result - must be before containerSize to use in dependencies
  const [activeStoriesWithResult, setActiveStoriesWithResult] = useState<StoryType[]>([]);

  useEffect(() => {
    if (group && stories.length) {
      const defaultLayerStories = stories.filter((story) => story.layerData?.isDefaultLayer);
      const sortedStories = [...defaultLayerStories]
        .sort((storyA, storyB) => {
          if (storyA.positionIndex !== undefined && storyB.positionIndex !== undefined) {
            return storyA.positionIndex - storyB.positionIndex;
          }
          return 0;
        });

      setActiveStoriesWithResult(sortedStories);
    }
  }, [group, stories]);

  // Container size - need to track activeStoriesWithResult.length to re-measure
  // when container first appears (before that it returns null)
  const containerSize = useElementSize(containerRef, [activeStoriesWithResult.length]);

  // Original story size (the size stories were designed for)
  const currentStorySize: StoryCurrentSize = useMemo(() => ({
    width: storyWidth,
    height: storyHeight,
  }), [storyWidth, storyHeight]);

  // Calculate content dimensions like StoryModal does
  // StorySwiperContent uses: desktopWidth = currentRatioIndex * contentHeight
  // So we need contentHeight such that desktopWidth fits in container
  const storyAspectRatio = useMemo(() => storyWidth / storyHeight, [storyWidth, storyHeight]);

  const contentHeight = useMemo(() => {
    if (!containerSize.width || !containerSize.height) return storyHeight;

    // Calculate height that would make width fit in container
    // desktopWidth = storyAspectRatio * contentHeight
    // We want: desktopWidth <= containerSize.width
    // So: contentHeight <= containerSize.width / storyAspectRatio
    const maxHeightByWidth = containerSize.width / storyAspectRatio;
    const maxHeightByHeight = containerSize.height;

    // Use the smaller of the two constraints
    return Math.floor(Math.min(maxHeightByWidth, maxHeightByHeight));
  }, [containerSize.width, containerSize.height, storyAspectRatio, storyHeight]);

  // contentWidth should match what StorySwiperContent calculates as desktopWidth
  const contentWidth = useMemo(() => {
    if (!containerSize.width || !containerSize.height) return storyWidth;

    return Math.ceil(storyAspectRatio * contentHeight);
  }, [containerSize.width, containerSize.height, storyAspectRatio, contentHeight, storyWidth]);

  // Initialize
  useEffect(() => {
    if (activeStoriesWithResult.length > 0 && !isOpened) {
      let initialIndex = 0;

      if (startStoryId) {
        const idx = activeStoriesWithResult.findIndex((s) => s.id === startStoryId);
        if (idx > -1) initialIndex = idx;
      }

      setCurrentStory(initialIndex);
      setCurrentStoryId(activeStoriesWithResult[initialIndex].id);

      // First set isOpened without playing
      setTimeout(() => {
        setIsOpened(true);
        handleOpenStory(group.id, activeStoriesWithResult[initialIndex].id);
      }, 50);

      // Then start playing after a delay to ensure CSS is ready
      setTimeout(() => {
        setPlayStatus('play');
      }, 150);
    }
  }, [activeStoriesWithResult.length]);

  // Autoplay videos
  useEffect(() => {
    setIsAutoplayVideos(group?.settings?.autoplayVideos ?? autoplayVideos);
  }, [group, autoplayVideos]);

  useEffect(() => {
    if (isAutoplayVideos) {
      setIsBackgroundVideoPlaying(true);
      setIsVideoPlaying(true);
    }
  }, [isAutoplayVideos]);

  // Handle media loading
  useEffect(() => {
    if (!isOpened) return;

    if (isMediaLoading) {
      setPlayStatus('pause');
    } else {
      setPlayStatus('play');
    }
  }, [isMediaLoading, currentStoryId, isOpened]);

  // Get user ID
  useEffect(() => {
    getUniqUserId().then((id) => setUserId(id));
  }, []);

  // Answers cache
  const [getAnswer, cacheAnswer] = useAnswersCache(group?.id);
  const answers = useMemo(() => ({}), []);

  // Callbacks
  const handleOpenStory = useCallback((groupId: string, storyId: string) => {
    setStoryDuration({
      groupId,
      storyId,
      startTime: DateTime.now().toSeconds(),
    });
    onOpenStory?.(groupId, storyId);
  }, [onOpenStory]);

  // Result stories for quizzes
  const resultStories = useMemo(() => {
    if (group?.settings?.scoreResultLayersGroupId && stories) {
      return stories
        .filter(
          (story) => story.layerData?.layersGroupId === group.settings?.scoreResultLayersGroupId,
        )
        .map((story) => ({
          id: story.id,
          isDefaultLayer: story.layerData?.isDefaultLayer,
          score: story.layerData.score,
        }));
    }
    return [];
  }, [group?.settings?.scoreResultLayersGroupId, stories]);

  const getResultStoryId = useCallback(() => {
    if (!resultStories.length || !group?.settings?.scoreResultLayersGroupId) {
      return '';
    }

    const nextLayersGroupId = activeStoriesWithResult[currentStory + 1]?.layerData.layersGroupId;
    const prevLayersGroupId = activeStoriesWithResult[currentStory - 1]?.layerData.layersGroupId;
    let resultStoryId = '';

    if (
      (nextLayersGroupId && nextLayersGroupId === group.settings?.scoreResultLayersGroupId)
      || (prevLayersGroupId && prevLayersGroupId === group.settings?.scoreResultLayersGroupId)
    ) {
      resultStoryId = resultStories.find((story) => story.isDefaultLayer)?.id ?? '';

      if (group.settings?.scoreType === ScoreType.NUMBERS && quizState.points > 0) {
        for (let i = 0; i < resultStories.length; i++) {
          if (+resultStories[i].score.points <= quizState.points) {
            resultStoryId = resultStories[i].id;
          }
        }
      } else if (group.settings?.scoreType === ScoreType.LETTERS && quizState.letters) {
        const lettersArr = quizState.letters.toLowerCase().split('');

        let mostFrequentSymbol = '';
        let maxCount = 0;
        const letterCounts = {} as any;

        for (let i = 0; i < lettersArr.length; i++) {
          const letter = lettersArr[i];
          if (!letterCounts[letter]) {
            letterCounts[letter] = 1;
          } else {
            letterCounts[letter]++;
          }
          if (letterCounts[letter] > maxCount) {
            maxCount = letterCounts[letter];
            mostFrequentSymbol = letter;
          }
        }

        for (let i = 0; i < resultStories.length; i++) {
          if (resultStories[i].score?.letter?.toLowerCase() === mostFrequentSymbol) {
            resultStoryId = resultStories[i].id;
          }
        }
      }
    }

    return resultStoryId;
  }, [
    activeStoriesWithResult,
    currentStory,
    group?.settings?.scoreResultLayersGroupId,
    group?.settings?.scoreType,
    quizState.letters,
    quizState.points,
    resultStories,
  ]);

  const handleFinishStoryQuiz = useCallback(() => {
    if (!quizStartedStoryIds[currentStoryId]) return;

    setQuizStartedStoryIds((prev) => ({
      ...prev,
      [currentStoryId]: false,
    }));
    setIsQuizStarted(false);
  }, [currentStoryId, quizStartedStoryIds]);

  const handleNext = useCallback(() => {
    eventPublish('nextStory', {
      storyId: activeStoriesWithResult[currentStory].id,
    });

    const resultStoryId = getResultStoryId();

    if (isAutoplayVideos) {
      setIsVideoMuted(true);
    }

    const isLastStory = currentStory === activeStoriesWithResult.length - 1
      || activeStoriesWithResult[currentStory].id === resultStoryId;

    if (isLastStory) {
      if (loop) {
        dispatchQuizState({ type: 'reset' });
        setCurrentStory(0);
        setCurrentStoryId(activeStoriesWithResult[0].id);

        if (onCloseStory && group) {
          const duration = DateTime.now().toSeconds() - storyDuration.startTime;
          onCloseStory(group.id, activeStoriesWithResult[currentStory].id, duration);
        }

        setTimeout(() => {
          handleOpenStory(group.id, activeStoriesWithResult[0].id);
        }, 0);
      } else {
        onComplete?.(group.id);

        if (onCloseStory && group) {
          const duration = DateTime.now().toSeconds() - storyDuration.startTime;
          onCloseStory(group.id, activeStoriesWithResult[currentStory].id, duration);
        }
      }
    } else {
      handleFinishStoryQuiz();

      if (onNextStory && group) {
        const duration = DateTime.now().toSeconds() - storyDuration.startTime;
        onNextStory(group.id, activeStoriesWithResult[currentStory].id, duration);
      }

      if (onCloseStory && group) {
        const duration = DateTime.now().toSeconds() - storyDuration.startTime;
        onCloseStory(group.id, activeStoriesWithResult[currentStory].id, duration);
      }

      if (resultStoryId) {
        const resultStoryIndex = activeStoriesWithResult.findIndex(
          (story) => story.id === resultStoryId,
        );
        setCurrentStory(resultStoryIndex);
        setCurrentStoryId(activeStoriesWithResult[resultStoryIndex].id);
      } else {
        setCurrentStory(currentStory + 1);
        setCurrentStoryId(activeStoriesWithResult[currentStory + 1].id);
      }
    }
  }, [
    activeStoriesWithResult,
    currentStory,
    getResultStoryId,
    handleFinishStoryQuiz,
    handleOpenStory,
    group,
    isAutoplayVideos,
    loop,
    onCloseStory,
    onComplete,
    onNextStory,
    storyDuration,
  ]);

  const handleAnimationEnd = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handlePrev = useCallback(() => {
    eventPublish('prevStory', {
      storyId: activeStoriesWithResult[currentStory]?.id,
    });

    const resultStoryId = getResultStoryId();
    const resultStory = activeStoriesWithResult.find((story) => story.id === resultStoryId);

    if (currentStory === 0) {
      if (loop) {
        const lastIndex = activeStoriesWithResult.length - 1;
        setCurrentStory(lastIndex);
        setCurrentStoryId(activeStoriesWithResult[lastIndex].id);
      }
    } else {
      handleFinishStoryQuiz();

      if (onPrevStory && group) {
        const duration = DateTime.now().toSeconds() - storyDuration.startTime;
        onPrevStory(group.id, activeStoriesWithResult[currentStory].id, duration);
      }

      if (resultStory) {
        const resultStoryIndex = activeStoriesWithResult.findIndex(
          (story) => story.id === resultStoryId,
        );
        const newIndex = resultStoryIndex > 0 ? resultStoryIndex - 1 : 0;
        setCurrentStory(newIndex);
        setCurrentStoryId(activeStoriesWithResult[newIndex].id);
      } else {
        setCurrentStory(currentStory - 1);
        setCurrentStoryId(activeStoriesWithResult[currentStory - 1].id);
      }
    }
  }, [
    activeStoriesWithResult,
    currentStory,
    getResultStoryId,
    group,
    handleFinishStoryQuiz,
    loop,
    onPrevStory,
    storyDuration,
  ]);

  // Open new story after navigation
  useEffect(() => {
    if (currentStoryId && group && isOpened) {
      handleOpenStory(group.id, currentStoryId);
    }
  }, [currentStoryId]);

  const handleLoadStory = useCallback((storyId: string) => {
    setLoadedStoriesIds((prev) => ({ ...prev, [storyId]: true }));
  }, []);

  const handleGoToStory = useCallback((storyId: string) => {
    const storyIndex = activeStoriesWithResult.findIndex((s) => s.id === storyId);
    if (storyIndex > -1) {
      setCurrentStory(storyIndex);
      setCurrentStoryId(storyId);
    }
  }, [activeStoriesWithResult]);

  const handleClose = useCallback(() => {
    onComplete?.(group.id);
  }, [group, onComplete]);

  // Quiz handlers
  const handleQuizAnswer = useCallback((params: any) => {
    if (!params.answer || !params.widgetId) return;
    cacheAnswer(params.widgetId, params.answer);
  }, [cacheAnswer]);

  const handleStartQuiz = useCallback(() => {
    setQuizStartedStoryIds((prev) => ({
      ...prev,
      [currentStoryId]: true,
    }));
    setIsQuizStarted(true);
  }, [currentStoryId]);

  // Long press & swipe handlers
  const [clickTimestamp, setClickTimestamp] = useState(0);

  const handleLongPress = useCallback(
    (e) => {
      setPlayStatus('play');

      if (e.timeStamp - clickTimestamp < LONG_PRESS_THRESHOLD) {
        let isTransitionAllowed = false;
        let transitionType = 'next';
        let element: HTMLElement | null = e.target as HTMLElement;

        while (element !== null) {
          if ((element as HTMLElement).dataset.storyTransition === 'true') {
            isTransitionAllowed = true;
            transitionType = (element as HTMLElement).dataset.storyTransitionType || 'next';
            break;
          }

          element = (element as HTMLElement).parentElement;
        }

        if (!isTransitionAllowed) {
          return;
        }

        if (!disableInteraction) {
          transitionType === 'next' ? handleNext() : handlePrev();
        }
      }
    },
    [clickTimestamp, handleNext, handlePrev, disableInteraction],
  );

  const pressHandlers = useLongPress(handleLongPress, {
    onStart: (e) => {
      setClickTimestamp(e.timeStamp);
      setPlayStatus('pause');
    },
    onFinish: (e) => {
      setPlayStatus('play');
    },
    onCancel: (e) => {
      setPlayStatus('play');
    },
    threshold: LONG_PRESS_THRESHOLD,
    captureEvent: true,
    cancelOnMovement: true,
  });

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => {
      if (!disableInteraction) handleNext();
    },
    onSwipedRight: () => {
      if (!disableInteraction) handlePrev();
    },
  });

  // Context value
  const contextValue = useMemo(
    () => ({
      currentStoryId,
      playStatus,
      container: containerRef.current,
      playStatusChange: disableInteraction ? undefined : setPlayStatus,
      closeStoryGroup: handleClose,
      handleQuizAnswer,
      handleStartQuiz,
      quizState,
      userId,
      quizMode: undefined,
      isQuizStarted,
      answers,
    }),
    [
      answers,
      currentStoryId,
      handleClose,
      handleQuizAnswer,
      handleStartQuiz,
      isQuizStarted,
      playStatus,
      quizState,
      userId,
      disableInteraction,
    ],
  );

  if (!group || activeStoriesWithResult.length === 0) {
    return null;
  }

  return (
    <StoryContext.Provider value={contextValue}>
      <div
        className={b()}
        ref={containerRef}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          borderRadius: `${borderRadius}px`,
        }}
      >
        {/* Navigation arrows */}
        {showArrows && !disableInteraction && (
          <>
            <div
              className={b('arrowButton', { left: true })}
              role="button"
              tabIndex={0}
              onClick={handlePrev}
              onKeyDown={(e) => e.key === 'Enter' && handlePrev()}
            >
              <IconArrow className={b('arrowIcon').toString()} stroke={arrowsColor} />
            </div>
            <div
              className={b('arrowButton', { right: true })}
              role="button"
              tabIndex={0}
              onClick={() => handleNext()}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            >
              <IconArrow className={b('arrowIcon', { right: true }).toString()} stroke={arrowsColor} />
            </div>
          </>
        )}

        <StorySwiperContent
          activeStoriesWithResult={activeStoriesWithResult}
          contentHeight={contentHeight}
          contentWidth={contentWidth}
          currentGroup={group}
          currentGroupType={group.type || GroupType.GROUP}
          currentStory={currentStory}
          currentStorySize={currentStorySize}
          forbidClose
          handleAnimationEnd={handleAnimationEnd}
          handleClose={handleClose}
          handleGoToStory={handleGoToStory}
          handleLoadStory={handleLoadStory}
          handleMediaLoading={setIsMediaLoading}
          handleMuteVideo={setIsVideoMuted}
          handleVideoPlaying={setIsVideoPlaying}
          isAutoplayVideos={isAutoplayVideos}
          isBackgroundVideoPlaying={isBackgroundVideoPlaying}
          isLarge={false}
          isLoading={false}
          isMediaLoading={isMediaLoading}
          isMobile={false}
          isOpened={isOpened}
          isProgressHidden={isProgressHidden}
          isStatusBarActive={false}
          isVideoExists={isVideoExists}
          isVideoMuted={isVideoMuted}
          isVideoPlaying={isVideoPlaying}
          jsConfetti={jsConfetti}
          loadedStoriesIds={loadedStoriesIds}
          playStatus={playStatus}
          pressHandlers={disableInteraction ? undefined : pressHandlers}
          storyHeight={storyHeight}
          storyWidth={storyWidth}
          swipeHandlers={swipeHandlers}
        />

        <canvas className={b('canvas')} ref={(el) => { jsConfetti.current = new JSConfetti({ canvas: el || undefined }); }} />
      </div>
    </StoryContext.Provider>
  );
};

export default InlineStoryPlayer;
