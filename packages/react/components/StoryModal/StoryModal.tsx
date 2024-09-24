import React, { useEffect, useState, useCallback, useRef, useReducer, useMemo } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import JSConfetti from 'js-confetti';
import { eventPublish, getUniqUserId } from '@utils';
import { IconClose } from '@components/icons';
import { useLongPress } from 'use-long-press';
import { useAdaptiveValue, useAnswersCache, useSwipe } from '../../hooks';
import { StoryType, Group, GroupType, StoryContenxt, ScoreType } from '../../types';
import largeIphoneMockup from '../../assets/images/iphone-mockup-large.svg';
import smallIphoneMockup from '../../assets/images/iphone-mockup-small.svg';
import { StorySwiperContent } from './_components';

import './StoryModal.scss';

const b = block('StorySdkModal');

interface StoryModalProps {
  currentGroup?: Group;
  stories?: StoryType[];
  isShowing: boolean;
  forbidClose?: boolean;
  isProgressHidden?: boolean;
  isShowMockup?: boolean;
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
  onCloseStory?(groupId: string, storyId: string): void;
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
  const [isAutoplayVideos, setIsAutoplayVideos] = useState<boolean>(true);
  const [loadedStoriesIds, setLoadedStoriesIds] = useState<{ [key: string]: boolean }>({});

  const appLink = useMemo(() => {
    if (devMode === 'staging') {
      return 'https://app.diffapp.link';
    }

    if (devMode === 'development') {
      return 'http://localhost:3000';
    }

    return 'https://app.storysdk.com';
  }, [devMode]);

  const isMobile = useMemo(() => width < MOBILE_BREAKPOINT, [width]);

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

    return STORY_SIZE_LARGE;
  }, [storyWidth, storyHeight, isMobile, currentGroup?.type]);

  const isShowMockupCurrent =
    currentGroup?.type === GroupType.ONBOARDING && !isMobile ? true : isShowMockup;

  useEffect(() => {
    if (openInExternalModal && isShowing) {
      const leftPosition = isMobile ? 0 : 100;

      window.open(
        `${appLink}/share/${currentGroup?.settings?.shortDataId}`,
        '_blank',
        `popup,left=${leftPosition},top=${isMobile ? 0 : 50},width=${
          isMobile ? width : 1000
        },height=${780}`
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
  const isBackroundFilled =
    activeStoriesWithResult[currentStory]?.background?.isFilled &&
    currentGroupType === GroupType.GROUP;
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
      if (isMobile && contentHeight !== '100%') {
        storyModalRef.current.style.setProperty('height', `${contentHeight}px`);
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

      if (onOpenStory && currentGroup) {
        onOpenStory(currentGroup.id, activeStoriesWithResult[currentStoryIndex].id);
      }
    }
  }, [
    activeStoriesWithResult.length,
    onOpenStory,
    activeStoriesWithResult,
    currentGroup,
    isOpened,
    startStoryId
  ]);

  const handleClose = useCallback(() => {
    onClose();

    if (onCloseStory && currentGroup) {
      onCloseStory(currentGroup.id, currentStoryId);
    }
  }, [
    currentGroup?.id,
    currentStory,
    onClose,
    onCloseStory,
    activeStoriesWithResult,
    currentStoryId
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
        onCloseStory(currentGroup.id, activeStoriesWithResult[currentStory].id);
      }
    }
  }, [
    activeStoriesWithResult,
    currentGroup,
    currentStory,
    handleClose,
    isLastGroup,
    onCloseStory,
    onNextGroup
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
        onCloseStory(currentGroup.id, activeStoriesWithResult[currentStory].id);
      }

      if (onOpenStory && currentGroup) {
        setTimeout(() => {
          onOpenStory(currentGroup.id, activeStoriesWithResult[currentStory + 1].id);
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
    onOpenStory,
    onNextStory
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
        onCloseStory(currentGroup.id, activeStoriesWithResult[currentStory].id);
      }

      handleFinishStoryQuiz();

      if (onOpenStory && currentGroup) {
        setTimeout(() => {
          onOpenStory(currentGroup.id, activeStoriesWithResult[currentStory - 1].id);
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
    onOpenStory,
    onPrevStory,
    currentGroup?.id
  ]);

  const handleGoToStory = (storyId: string) => {
    const storyIndex = activeStoriesWithResult.findIndex((story) => story.id === storyId);

    if (storyIndex > -1) {
      eventPublish('nextStory', {
        stotyId: storyId
      });

      if (onOpenStory && currentGroup) {
        setTimeout(() => {
          onOpenStory(currentGroup.id, activeStoriesWithResult[storyIndex].id);
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
    // console.log('isBackgroundVideoPlaying', isBackgroundVideoPlaying);
    // console.log('isVideoPlaying', isVideoPlaying);
    // console.log('isMediaLoading', isMediaLoading);
    // console.log('currentStoryId', currentStoryId);

    if (isMediaLoading) {
      // console.log('PAUSE HERE');
      setPlayStatus('pause');
    } else {
      // console.log('PLAY HERE');
      setPlayStatus('play');
    }
  }, [isMediaLoading, currentStoryId]);

  const [clickTimestamp, setClickTimestamp] = useState(0);

  const handleLongPress = useCallback(
    (e) => {
      setPlayStatus('play');

      if (e.timeStamp - clickTimestamp < LONG_PRESS_THRESHOLD) {
        let isNextAllowed = false;
        let element: HTMLElement | null = e.target as HTMLElement;

        if (element.classList.contains('StorySdkContent__scope')) {
          isNextAllowed = true;
        } else {
          while (element) {
            if (element.classList.contains('StorySdkContent__object_noClickable')) {
              isNextAllowed = true;
              break;
            }
            element = (element as HTMLElement).offsetParent as HTMLElement;
          }
        }

        if (isNextAllowed) {
          handleNext();
        }
      }
    },
    [clickTimestamp, handleNext]
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
        <div className={b('body')}>
          {!isLoading && (
            <button className={b('arrowButton', { left: true })} onClick={handlePrev}>
              <LeftArrowIcon />
            </button>
          )}

          {!isLoading && !isMobile && (
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
              borderRadius: containerBorderRadius
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
              handleVideoBackgroundPlaying={setIsBackgroundVideoPlaying}
              handleVideoPlaying={setIsVideoPlaying}
              height={height}
              heightGap={heightGap}
              isAutoplayVideos={isAutoplayVideos}
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
              jsConfetti={jsConfetti}
              loadedStoriesIds={loadedStoriesIds}
              playStatus={playStatus}
              pressHandlers={pressHandlers}
              storyHeight={storyHeight}
              storyWidth={storyWidth}
              swipeHandlers={swipeHandlers}
            />

            {isShowMockupCurrent && !isMobile && (
              <img className={b('mockup')} src={isLarge ? largeIphoneMockup : smallIphoneMockup} />
            )}
          </div>
        </div>

        {isForceCloseAvailable && (
          <button className={b('close', { general: true })} onClick={handleClose}>
            <IconClose />
          </button>
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
