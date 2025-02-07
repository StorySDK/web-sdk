import React, { useEffect, useState, useCallback, useRef, useReducer, useMemo } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import JSConfetti from 'js-confetti';
import { eventPublish, getUniqUserId } from '@utils';
import { IconClose, IconMute, IconStoryPause, IconStoryPlay, IconUnmute } from '@components/icons';
import { useLongPress } from 'use-long-press';
import { DateTime } from 'luxon';
import { useAdaptiveValue, useAnswersCache, useSwipe } from '../../hooks';
import { StoryType, Group, GroupType, StoryContenxt, ScoreType, WidgetsTypes } from '../../types';
import largeIphoneMockup from '../../assets/images/iphone-mockup-large.svg';
import smallIphoneMockup from '../../assets/images/iphone-mockup-small-1.svg';
import storySdkLogo from '../../assets/images/storysdk-logo.svg';
import { StorySwiperContent } from './_components';

import './StoryModal.scss';

const b = block('StorySdkModal');
interface StoryModalProps {
  currentGroup?: Group;
  stories?: StoryType[];
  isShowing: boolean;
  isAutoplay?: boolean;
  forbidClose?: boolean;
  isProgressHidden?: boolean;
  isShowMockup?: boolean;
  isShowLabel?: boolean;
  storyWidth?: number;
  storyHeight?: number;
  isLastGroup: boolean;
  isFirstGroup: boolean;
  startStoryId?: string;
  isStatusBarActive?: boolean;
  isForceCloseAvailable?: boolean;
  isCacheDisabled?: boolean;
  devMode?: 'staging' | 'development';
  isLoading?: boolean;
  isEditorMode?: boolean;
  openInExternalModal?: boolean;
  onClose(): void;
  onPrevGroup(): void;
  onNextGroup(): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onOpenStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string, duration: number): void;
  onStartQuiz?(groupId: string, storyId?: string): void;
  onFinishQuiz?(groupId: string, storyId?: string): void;
}

const LeftArrowIcon: React.FC = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 12H5"
      stroke="#FAFAFA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M12 19L5 12L12 4.99997"
      stroke="#FAFAFA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const RightArrowIcon: React.FC = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12H19"
      stroke="#FAFAFA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M12 4.99997L19 12L12 19"
      stroke="#FAFAFA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const StoryContext = React.createContext<StoryContenxt>({
  currentStoryId: '',
  playStatusChange: () => {},
  confetti: null
});

export type PlayStatusType = 'wait' | 'play' | 'pause';

export type StoryCurrentSize = {
  width: number;
  height: number;
};

export const STORY_SIZE_DEFAULT = {
  width: 360,
  height: 640
};

export const STORY_SIZE_LARGE = {
  width: 360,
  height: 780
};

export const DEFAULT_STORY_DURATION = 7;
export const PADDING_SIZE = 25;
export const MOBILE_BREAKPOINT = 768;

const INIT_LARGE_PADDING = 30;
const INIT_SMALL_PADDING = 145;
const INIT_INNER_GROUP_PADDING = 115;
const INIT_CONTAINER_BORDER_RADIUS = 50;
const LONG_PRESS_THRESHOLD = 500;

const initQuizeState = {
  points: 0,
  letters: ''
};

const reducer = (state: any, action: any) => {
  if (action.type === 'add_points') {
    return {
      points: state.points + +action.payload,
      letters: state.letters
    };
  }
  if (action.type === 'add_letters') {
    return {
      points: state.points,
      letters: state.letters + action.payload
    };
  }
  if (action.type === 'remove_points') {
    return {
      points: state.points - +action.payload,
      letters: state.letters
    };
  }
  if (action.type === 'remove_letters') {
    return {
      points: state.points,
      letters: state.letters.replace(action.payload, '')
    };
  }
  if (action.type === 'reset') {
    return initQuizeState;
  }
  throw Error('Unknown action.');
};

export const StoryModal: React.FC<StoryModalProps> = (props) => {
  const {
    stories,
    isShowing,
    isLastGroup,
    isFirstGroup,
    startStoryId,
    isShowMockup,
    isShowLabel,
    isForceCloseAvailable,
    isStatusBarActive,
    currentGroup,
    isCacheDisabled,
    forbidClose,
    isLoading,
    isProgressHidden,
    isEditorMode,
    storyWidth,
    devMode,
    storyHeight,
    isAutoplay,
    openInExternalModal,
    onClose,
    onNextGroup,
    onPrevGroup,
    onNextStory,
    onPrevStory,
    onOpenStory,
    onCloseStory,
    onStartQuiz,
    onFinishQuiz
  } = props;

  const [quizState, dispatchQuizState] = useReducer(reducer, initQuizeState);
  const [currentStory, setCurrentStory] = useState(0);
  const [currentStoryId, setCurrentStoryId] = useState('');
  const [isOpened, setIsOpened] = useState(isShowing);
  const [playStatus, setPlayStatus] = useState<PlayStatusType>('wait');
  const storyModalRef = useRef<HTMLDivElement>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [quizStartedStoryIds, setQuizStartedStoryIds] = useState<{ [key: string]: boolean }>({});
  const [width, height] = useWindowSize();
  const [activeStoriesWithResult, setActiveStoriesWithResult] = useState<StoryType[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isBackgroundVideoPlaying, setIsBackgroundVideoPlaying] = useState(false);
  const [isSwiped, setIsSwiped] = useState(false);
  const [isAutoplayVideos, setIsAutoplayVideos] = useState<boolean>(false);
  const [loadedStoriesIds, setLoadedStoriesIds] = useState<{ [key: string]: boolean }>({});
  const [bodyContainerWidth, setBodyContainerWidth] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);

  const [storyDuration, setStoryDuration] = useState({
    storyId: '',
    groupId: '',
    startTime: 0
  });

  const handleOpenStory = useCallback((groupId: string, storyId: string) => {
    setStoryDuration({
      groupId,
      storyId,
      startTime: DateTime.now().toSeconds()
    });

    onOpenStory?.(groupId, storyId);
  }, []);

  useEffect(() => {
    if (!isAutoplay) {
      setIsVideoMuted(!isVideoPlaying || !isBackgroundVideoPlaying);
    }
  }, [isVideoPlaying, isBackgroundVideoPlaying]);

  const isVideoExists = useMemo(
    () =>
      activeStoriesWithResult[currentStory]?.storyData.some(
        (widget) => widget.content.type === WidgetsTypes.VIDEO
      ) || activeStoriesWithResult[currentStory]?.background.type === 'video',
    [activeStoriesWithResult, currentStory]
  );

  const isMobile = useMemo(() => width < MOBILE_BREAKPOINT, [width]);

  const isShowMockupCurrent = useMemo(
    () => (currentGroup?.type === GroupType.ONBOARDING && !isMobile ? true : isShowMockup),
    [currentGroup?.type, isMobile, isShowMockup]
  );

  const mockupRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleResume = () => {
      setLoadedStoriesIds({});
    };

    document.addEventListener('resume', handleResume, false);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsAutoplayVideos(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('resume', handleResume, false);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (mockupRef.current && isShowMockupCurrent) {
      const observer = new ResizeObserver(() => {
        if (mockupRef.current?.offsetWidth) {
          setBodyContainerWidth(mockupRef.current.offsetWidth);
        } else {
          setBodyContainerWidth(0);
        }
      });

      observer.observe(mockupRef.current);

      return () => {
        observer.disconnect();
      };
    }
    return undefined;
  }, [mockupRef, isShowMockupCurrent]);

  const appLink = useMemo(() => {
    if (devMode === 'staging') {
      return 'https://app.diffapp.link';
    }

    if (devMode === 'development') {
      return 'http://localhost:3000';
    }

    return 'https://app.storysdk.com';
  }, [devMode]);

  useEffect(() => {
    if (isVideoPlaying || isBackgroundVideoPlaying) {
      setIsAutoplayVideos(true);
    }
  }, [isVideoPlaying, isBackgroundVideoPlaying]);

  useEffect(() => {
    setIsAutoplayVideos(currentGroup?.settings?.autoplayVideos ?? false);
  }, [currentGroup]);

  useEffect(() => {
    if (isAutoplayVideos) {
      setIsBackgroundVideoPlaying(true);
      setIsVideoPlaying(true);
    }
  }, [isAutoplayVideos]);

  const currentStorySize: StoryCurrentSize = useMemo(() => {
    if (storyWidth && storyHeight) {
      return {
        width: storyWidth,
        height: storyHeight
      };
    }

    if (currentGroup?.type === GroupType.ONBOARDING) {
      if (isMobile) {
        return STORY_SIZE_DEFAULT;
      }
      return STORY_SIZE_LARGE;
    }

    return STORY_SIZE_DEFAULT;
  }, [storyWidth, storyHeight, isMobile, currentGroup?.type]);

  useEffect(() => {
    if (openInExternalModal && isShowing) {
      const leftPosition = isMobile ? 0 : 100;

      window.open(
        `${appLink}/share/${currentGroup?.settings?.shortDataId}`,
        '_blank',
        `popup,left=${leftPosition},top=${isMobile ? 0 : 50},width=${
          isMobile ? width : 1000
        },height=${640}`
      );

      onClose();
    }

    if (!openInExternalModal) {
      setIsOpened(isShowing);
    }
  }, [isShowing]);

  useEffect(() => {
    if (stories && currentGroup) {
      const sortedStories = stories
        .filter((story) => {
          if (story.layerData?.layersGroupId === currentGroup.settings?.scoreResultLayersGroupId) {
            return true;
          }

          if (isEditorMode) {
            return story.layerData?.isDefaultLayer || story.id === startStoryId;
          }

          return story.layerData?.isDefaultLayer;
        })
        .sort((storyA, storyB) => (storyA.position < storyB.position ? -1 : 1))
        .sort((storyA, storyB) => {
          if (storyA.layerData?.layersGroupId === currentGroup.settings?.scoreResultLayersGroupId) {
            return 1;
          }
          if (storyB.layerData?.layersGroupId === currentGroup.settings?.scoreResultLayersGroupId) {
            return -1;
          }

          return 0;
        });

      setActiveStoriesWithResult(sortedStories);
    }
  }, [currentGroup, stories]);

  const currentGroupType = currentGroup?.type || GroupType.GROUP;
  const isBackroundFilled = true;
  const initBodyOverflow = useMemo(() => document.body.style.overflow, []);
  const largeHeightGap = useAdaptiveValue(INIT_LARGE_PADDING);
  const smallHeightGap = useAdaptiveValue(INIT_SMALL_PADDING);
  const groupInnerHeightGap = useAdaptiveValue(INIT_INNER_GROUP_PADDING);
  const containerBorderRadius = useAdaptiveValue(INIT_CONTAINER_BORDER_RADIUS);

  const isLarge = useMemo(
    () => currentStorySize.height === STORY_SIZE_LARGE.height,
    [currentGroupType, isMobile, currentStorySize]
  );

  const isGroupWithFilledBackground = useMemo(
    () => currentGroupType === GroupType.GROUP && !isMobile && isBackroundFilled,
    [currentGroupType, isBackroundFilled, isMobile]
  );

  const isGroupWithUnfilledBackground = useMemo(
    () => currentGroupType === GroupType.GROUP && !isMobile && !isBackroundFilled,
    [currentGroupType, isBackroundFilled, isMobile]
  );

  const heightGap = isLarge ? largeHeightGap : smallHeightGap;

  const contentWidth = useMemo(() => {
    if (isMobile) {
      const newWidth = Math.round(currentStorySize.width * (height / currentStorySize.height));

      if (newWidth < width) {
        return newWidth;
      }
    }

    return `100%`;
  }, [currentStorySize.height, currentStorySize.width, height, isMobile, width]);

  const contentHeight = useMemo(() => {
    const backgroundHeightGap =
      isShowMockupCurrent && isGroupWithUnfilledBackground ? groupInnerHeightGap : 0;

    if (isMobile) {
      if (contentWidth === '100%') {
        return Math.round(currentStorySize.height * (width / currentStorySize.width));
      }
      return '100%';
    }

    return `calc(100% - ${backgroundHeightGap}px)`;
  }, [
    contentWidth,
    currentStorySize.height,
    currentStorySize.width,
    groupInnerHeightGap,
    isGroupWithUnfilledBackground,
    isMobile,
    isShowMockupCurrent,
    width
  ]);

  useEffect(() => {
    const body = document.querySelector('body');
    if (storyModalRef.current && body) {
      if (isMobile) {
        storyModalRef.current.style.setProperty('height', `100vh`);
      } else {
        storyModalRef.current.style.setProperty('height', `100%`);
      }
    }
  }, [width, height, isMobile, contentHeight]);

  useEffect(() => {
    let currentStoryIndex = 0;

    if (startStoryId && activeStoriesWithResult.length) {
      const storyIndex = activeStoriesWithResult.findIndex((story) => story.id === startStoryId);
      currentStoryIndex = storyIndex > -1 ? storyIndex : 0;
    }

    setCurrentStory(currentStoryIndex);

    const body = document.querySelector('body');

    if (isOpened) {
      setPlayStatus('play');

      if (body) {
        body.style.overflow = 'hidden';
      }
    } else {
      setPlayStatus('wait');

      if (body) {
        body.style.overflow = initBodyOverflow ?? 'auto';
      }
    }

    if (isOpened && activeStoriesWithResult.length) {
      setCurrentStoryId(activeStoriesWithResult[currentStoryIndex].id);

      if (currentGroup) {
        handleOpenStory(currentGroup.id, activeStoriesWithResult[currentStoryIndex].id);
      }
    }
  }, [
    activeStoriesWithResult.length,
    handleOpenStory,
    activeStoriesWithResult,
    currentGroup,
    isOpened,
    startStoryId
  ]);

  const handleClose = useCallback(() => {
    onClose();

    if (onCloseStory && currentGroup) {
      const duration = DateTime.now().toSeconds() - storyDuration.startTime;
      onCloseStory(currentGroup.id, currentStoryId, duration);
    }
  }, [
    currentGroup?.id,
    currentStory,
    onClose,
    onCloseStory,
    activeStoriesWithResult,
    currentStoryId,
    storyDuration
  ]);

  const resultStories = useMemo(() => {
    if (currentGroup?.settings?.scoreResultLayersGroupId && stories) {
      return stories
        .filter(
          (story) =>
            story.layerData?.layersGroupId === currentGroup.settings?.scoreResultLayersGroupId
        )
        .map((story) => ({
          id: story.id,
          isDefaultLayer: story.layerData?.isDefaultLayer,
          score: story.layerData.score
        }));
    }

    return [];
  }, [currentGroup?.settings?.scoreResultLayersGroupId, stories]);

  const getResultStoryId = useCallback(() => {
    if (!resultStories.length || !currentGroup?.settings?.scoreResultLayersGroupId) {
      return '';
    }

    const nextLayersGroupId = activeStoriesWithResult[currentStory + 1]?.layerData.layersGroupId;
    const prevLayersGroupId = activeStoriesWithResult[currentStory - 1]?.layerData.layersGroupId;
    let resultStoryId = '';

    if (
      (nextLayersGroupId &&
        nextLayersGroupId === currentGroup.settings?.scoreResultLayersGroupId) ||
      (prevLayersGroupId && prevLayersGroupId === currentGroup.settings?.scoreResultLayersGroupId)
    ) {
      resultStoryId = resultStories.find((story) => story.isDefaultLayer)?.id ?? '';

      if (currentGroup.settings?.scoreType === ScoreType.NUMBERS && quizState.points > 0) {
        for (let i = 0; i < resultStories.length; i++) {
          if (+resultStories[i].score.points <= quizState.points) {
            resultStoryId = resultStories[i].id;
          }
        }
      } else if (currentGroup.settings?.scoreType === ScoreType.LETTERS && quizState.letters) {
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

        resultStoryId =
          resultStories.find((story) => story.score.letter.toLowerCase() === mostFrequentSymbol)
            ?.id ?? '';
      }
    }

    return resultStoryId;
  }, [
    resultStories,
    activeStoriesWithResult,
    currentGroup?.settings?.scoreResultLayersGroupId,
    currentGroup?.settings?.scoreType,
    currentStory,
    quizState
  ]);

  const handleFinishStoryQuiz = useCallback(() => {
    const isNotResultStory =
      currentGroup?.settings?.scoreResultLayersGroupId !==
      activeStoriesWithResult[currentStory]?.layerData?.layersGroupId;

    if (onFinishQuiz && currentGroup?.settings?.scoreResultLayersGroupId && isNotResultStory) {
      onFinishQuiz(currentGroup.id, currentStoryId);
    }
  }, [
    activeStoriesWithResult,
    currentGroup?.id,
    currentGroup?.settings?.scoreResultLayersGroupId,
    currentStory,
    currentStoryId,
    onFinishQuiz
  ]);

  const handleNextGroup = useCallback(() => {
    dispatchQuizState({ type: 'reset' });
    if (isLastGroup) {
      handleClose();
    } else {
      onNextGroup();
      setIsSwiped(true);

      if (onCloseStory && currentGroup) {
        const duration = DateTime.now().toSeconds() - storyDuration.startTime;
        onCloseStory(currentGroup.id, activeStoriesWithResult[currentStory].id, duration);
      }
    }
  }, [
    activeStoriesWithResult,
    currentGroup,
    currentStory,
    handleClose,
    isLastGroup,
    onCloseStory,
    onNextGroup,
    storyDuration
  ]);

  const handleNext = useCallback(() => {
    eventPublish('nextStory', {
      stotyId: activeStoriesWithResult[currentStory].id
    });

    const resultStoryId = getResultStoryId();

    if (
      currentStory === activeStoriesWithResult.length - 1 ||
      activeStoriesWithResult[currentStory].id === resultStoryId
    ) {
      handleNextGroup();
    } else {
      handleFinishStoryQuiz();

      if (onCloseStory && currentGroup) {
        const duration = DateTime.now().toSeconds() - storyDuration.startTime;
        onCloseStory(currentGroup.id, activeStoriesWithResult[currentStory].id, duration);
      }

      if (currentGroup) {
        setTimeout(() => {
          handleOpenStory(currentGroup.id, activeStoriesWithResult[currentStory + 1].id);
        }, 0);
      }

      if (onNextStory && currentGroup) {
        onNextStory(currentGroup.id, activeStoriesWithResult[currentStory].id);
      }

      if (resultStoryId) {
        const resultStoryIndex = activeStoriesWithResult.findIndex(
          (story) => story.id === resultStoryId
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
    currentStoryId,
    getResultStoryId,
    isLastGroup,
    handleClose,
    onNextGroup,
    onCloseStory,
    currentGroup?.id,
    handleOpenStory,
    onNextStory,
    storyDuration
  ]);

  const handleAnimationEnd = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handlePrevGroup = useCallback(() => {
    dispatchQuizState({ type: 'reset' });
    isFirstGroup ? handleClose() : onPrevGroup();
  }, [handleClose, isFirstGroup, onPrevGroup]);

  const handlePrev = useCallback(() => {
    eventPublish('prevStory', {
      stotyId: activeStoriesWithResult[currentStory].id
    });

    const resultStoryId = getResultStoryId();
    const resultStory = activeStoriesWithResult.find((story) => story.id === resultStoryId);

    if (currentStory === 0) {
      handlePrevGroup();
    } else {
      if (onCloseStory && currentGroup) {
        const duration = DateTime.now().toSeconds() - storyDuration.startTime;
        onCloseStory(currentGroup.id, activeStoriesWithResult[currentStory].id, duration);
      }

      handleFinishStoryQuiz();

      if (currentGroup) {
        setTimeout(() => {
          handleOpenStory(currentGroup.id, activeStoriesWithResult[currentStory - 1].id);
        }, 0);
      }

      if (onPrevStory && currentGroup) {
        onPrevStory(currentGroup.id, activeStoriesWithResult[currentStory].id);
      }

      if (
        activeStoriesWithResult[currentStory - 1].layerData.layersGroupId ===
        resultStory?.layerData.layersGroupId
      ) {
        const prevStoryIndex =
          activeStoriesWithResult.findIndex(
            (story) => story.layerData.layersGroupId === resultStory?.layerData.layersGroupId
          ) - 1;

        setCurrentStory(prevStoryIndex);
        setCurrentStoryId(activeStoriesWithResult[prevStoryIndex].id);
      } else {
        setCurrentStory(currentStory - 1);
        setCurrentStoryId(activeStoriesWithResult[currentStory - 1].id);
      }
    }
  }, [
    activeStoriesWithResult,
    currentStory,
    getResultStoryId,
    isFirstGroup,
    handleClose,
    onPrevGroup,
    onCloseStory,
    handleOpenStory,
    onPrevStory,
    currentGroup?.id
  ]);

  const handleGoToStory = (storyId: string) => {
    const storyIndex = activeStoriesWithResult.findIndex((story) => story.id === storyId);

    if (storyIndex > -1) {
      eventPublish('nextStory', {
        stotyId: storyId
      });

      if (currentGroup) {
        setTimeout(() => {
          handleOpenStory(currentGroup.id, activeStoriesWithResult[storyIndex].id);
        }, 0);
      }

      setCurrentStory(storyIndex);
      setCurrentStoryId(activeStoriesWithResult[storyIndex].id);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jsConfetti = useRef(
    new JSConfetti({
      canvas: canvasRef.current as HTMLCanvasElement
    })
  );

  const handleQuizAnswer = (params: { type: string; answer: string | number }) => {
    if (params.type === 'add' && !isQuizStarted && currentGroup) {
      onStartQuiz && onStartQuiz(currentGroup.id);
      setIsQuizStarted(true);
    }

    if (params.type === 'add' && !quizStartedStoryIds[currentStoryId] && currentGroup) {
      onStartQuiz && onStartQuiz(currentGroup.id, currentStoryId);
      setQuizStartedStoryIds((prevState) => ({ ...prevState, [currentStoryId]: true }));
    }

    if (currentGroup?.settings?.scoreType === ScoreType.LETTERS && params.type === 'add') {
      dispatchQuizState({
        type: 'add_letters',
        payload: params.answer
      });
    } else if (currentGroup?.settings?.scoreType === ScoreType.NUMBERS && params.type === 'add') {
      dispatchQuizState({
        type: 'add_points',
        payload: +params.answer
      });
    } else if (
      currentGroup?.settings?.scoreType === ScoreType.LETTERS &&
      params.type === 'remove'
    ) {
      dispatchQuizState({
        type: 'remove_letters',
        payload: params.answer
      });
    } else if (
      currentGroup?.settings?.scoreType === ScoreType.NUMBERS &&
      params.type === 'remove'
    ) {
      dispatchQuizState({
        type: 'remove_points',
        payload: +params.answer
      });
    }
  };

  const uniqUserId = getUniqUserId();
  const [getAnswerCache, setAnswerCache] = useAnswersCache(uniqUserId);

  useEffect(() => {
    if (isMediaLoading) {
      setPlayStatus('pause');
    } else {
      setPlayStatus('play');
    }
  }, [isMediaLoading, currentStoryId]);

  const [clickTimestamp, setClickTimestamp] = useState(0);

  const handleLongPress = useCallback(
    (e) => {
      setPlayStatus('play');

      if (e.timeStamp - clickTimestamp < LONG_PRESS_THRESHOLD) {
        let isTransitionAllowed = false;
        let transitionType = 'next';
        let element: HTMLElement | null = e.target as HTMLElement;

        const scopeElement = document.querySelector('.StorySdkContent__scope');

        if (scopeElement) {
          const scopeElementRect = scopeElement.getBoundingClientRect();
          const scopeElemenetCenter = scopeElementRect.left + scopeElementRect.width / 2;

          if (e.clientX < scopeElemenetCenter) {
            transitionType = 'prev';
          }
        }

        if (element.classList.contains('StorySdkContent__scope')) {
          isTransitionAllowed = true;
        } else {
          while (element) {
            if (element.classList.contains('StorySdkContent__object_noClickable')) {
              isTransitionAllowed = true;
              break;
            }
            element = (element as HTMLElement).offsetParent as HTMLElement;
          }
        }

        if (isTransitionAllowed) {
          if (transitionType === 'prev') {
            handlePrev();
          } else {
            handleNext();
          }
        }
      }
    },
    [clickTimestamp, handleNext, handlePrev]
  );

  const pressHandlers = useLongPress(() => {}, {
    onStart: (e) => {
      setClickTimestamp(e.timeStamp);
      setPlayStatus('pause');
    },
    onFinish: (e) => {
      handleLongPress(e);
    },
    onCancel: (e) => {
      handleLongPress(e);
    },
    threshold: LONG_PRESS_THRESHOLD
  });

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => handleNextGroup(),
    onSwipedRight: () => handlePrevGroup()
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isSwiped) {
        setIsSwiped(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [isSwiped]);

  const handleLoadStory = useCallback((id: string) => {
    setLoadedStoriesIds((prevState) => ({
      ...prevState,
      [id]: true
    }));
  }, []);

  return (
    <StoryContext.Provider
      value={{
        currentStoryId,
        quizMode: currentGroup?.settings?.scoreType,
        playStatusChange: setPlayStatus,
        handleQuizAnswer,
        getAnswerCache: isCacheDisabled ? undefined : getAnswerCache,
        setAnswerCache: isCacheDisabled ? undefined : setAnswerCache
      }}
    >
      <div
        className={b({ isShowing: isOpened })}
        ref={storyModalRef}
        style={{
          top: window?.pageYOffset || document.documentElement.scrollTop
        }}
      >
        <div
          className={b('body', { centered: isMobile })}
          style={{
            height: isMobile ? contentHeight : undefined
          }}
        >
          {!isLoading && (
            <button className={b('arrowButton', { left: true })} onClick={handlePrev}>
              <LeftArrowIcon />
            </button>
          )}

          {!isLoading && (
            <button className={b('arrowButton', { right: true })} onClick={handleNext}>
              <RightArrowIcon />
            </button>
          )}

          <div
            className={b('bodyContainer', {
              black: !isMobile && isShowMockupCurrent,
              swiped: isSwiped && isMobile
            })}
            style={{
              borderRadius: containerBorderRadius,
              width: !isMobile && bodyContainerWidth ? bodyContainerWidth : '100%'
            }}
          >
            <StorySwiperContent
              activeStoriesWithResult={activeStoriesWithResult}
              contentHeight={contentHeight}
              contentWidth={contentWidth}
              currentGroup={currentGroup}
              currentGroupType={currentGroupType}
              currentStory={currentStory}
              currentStorySize={currentStorySize}
              forbidClose={forbidClose}
              handleAnimationEnd={handleAnimationEnd}
              handleClose={handleClose}
              handleGoToStory={handleGoToStory}
              handleLoadStory={handleLoadStory}
              handleMediaLoading={setIsMediaLoading}
              handleMuteVideo={setIsVideoMuted}
              handleVideoPlaying={setIsVideoPlaying}
              height={height}
              heightGap={heightGap}
              isAutoplayVideos={isAutoplayVideos}
              isBackgroundVideoPlaying={isBackgroundVideoPlaying}
              isBackroundFilled={isBackroundFilled}
              isForceCloseAvailable={isForceCloseAvailable}
              isGroupWithFilledBackground={isGroupWithFilledBackground}
              isLarge={isLarge}
              isLoading={isLoading}
              isMediaLoading={isMediaLoading}
              isMobile={isMobile}
              isOpened={isOpened}
              isProgressHidden={isProgressHidden}
              isShowMockupCurrent={isShowMockupCurrent}
              isStatusBarActive={isStatusBarActive}
              isVideoExists={isVideoExists}
              isVideoMuted={isVideoMuted}
              isVideoPlaying={isVideoPlaying}
              jsConfetti={jsConfetti}
              loadedStoriesIds={loadedStoriesIds}
              playStatus={playStatus}
              pressHandlers={pressHandlers}
              storyHeight={storyHeight}
              storyWidth={storyWidth}
              swipeHandlers={swipeHandlers}
            />

            {isShowMockupCurrent && !isMobile && (
              <img
                className={b('mockup')}
                ref={mockupRef}
                src={isLarge ? largeIphoneMockup : smallIphoneMockup}
              />
            )}
          </div>
        </div>

        {isShowLabel && !isMobile && (
          <a className={b('label')} href="https://storysdk.com/">
            <img alt="StorySDK" className={b('labelLogo')} src={storySdkLogo} />
            <div className={b('labelTextContainer')}>
              <span className={b('labelTitle')}>StorySDK</span>
              <span className={b('labelText')}>create own widget</span>
            </div>
          </a>
        )}
        {(currentGroup?.type === GroupType.ONBOARDING ||
          (currentGroup?.type === GroupType.TEMPLATE &&
            currentGroup?.category === 'onboarding')) && (
          <div className={b('closeContainer')}>
            {!currentGroup?.settings?.isProgressHidden && playStatus !== 'wait' && (
              <>
                <button
                  className={b('topBtn')}
                  onClick={
                    playStatus === 'play'
                      ? () => setPlayStatus('pause')
                      : () => setPlayStatus('play')
                  }
                >
                  {playStatus === 'play' ? (
                    <IconStoryPause className={b('playBtnIcon').toString()} />
                  ) : (
                    <IconStoryPlay className={b('playBtnIcon').toString()} />
                  )}
                </button>
              </>
            )}
            {isVideoExists && (
              <button
                className={b('muteBtn')}
                onClick={() => {
                  setIsVideoMuted(!isVideoMuted);
                }}
              >
                {isVideoMuted ? (
                  <IconMute className={b('muteBtnIcon').toString()} />
                ) : (
                  <IconUnmute className={b('muteBtnIcon').toString()} />
                )}
              </button>
            )}

            {(!forbidClose || isForceCloseAvailable) && (
              <button className={b('close')} onClick={handleClose}>
                <IconClose />
              </button>
            )}
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          display: 'none'
        }}
      />
    </StoryContext.Provider>
  );
};
