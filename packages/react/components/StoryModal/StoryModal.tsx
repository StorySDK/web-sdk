import React, { useEffect, useState, useCallback, useRef, useReducer, useMemo } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import JSConfetti from 'js-confetti';
import { eventPublish, getUniqUserId } from '@utils';
import { IconLoader } from '@components/icons';
import { useAdaptiveValue, useAnswersCache } from '../../hooks';
import { StoryType, Group, GroupType, StoryContenxt, ScoreType } from '../../types';
import { StoryContent } from '..';
import largeIphoneMockup from '../../assets/images/iphone-mockup-large.svg';
import smallIphoneMockup from '../../assets/images/iphone-mockup-small.svg';
import iphoneMockupBottom from '../../assets/images/iphone-mockup-bottom.png';
import { StatusBar } from './_components';
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
  isLoading?: boolean;
  isEditorMode?: boolean;
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

const CloseIcon: React.FC = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.0002 6.00079L6.00024 18.0008"
      stroke="#FAFAFA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.72796"
    />
    <path
      d="M6.00024 6.00079L18.0002 18.0008"
      stroke="#FAFAFA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.72796"
    />
  </svg>
);

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

type PlayStatusType = 'wait' | 'play' | 'pause';

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
export const PADDING_SIZE = 20;
export const MOBILE_BREAKPOINT = 768;

const INIT_TOP_ELEMENTS = 20;
const INIT_TOP_STATUS_BAR = 16;
const INIT_TOP_INDICATOR = 10;
const INIT_LARGE_PADDING = 30;
const INIT_LARGE_RADIUS = 43;
const INIT_SMALL_PADDING = 145;
const INIT_INNER_GROUP_PADDING = 115;
const INIT_SMALL_RADIUS = 5;
const INIT_CONTROL_TOP = 10;
const INIT_CONTROL_TOP_LARGE = 11;
const INIT_CONTROL_SIDE_PADDING = 8;
const INIT_CONTROL_SIDE_PADDING_LARGE = 20;
const INIT_CONTAINER_BORDER_RADIUS = 50;
const INIT_CONTROL_GAP_LARGE = 8;
const INIT_MOCK_PADDING_BOTTOM = 40;

const defaultRatioIndex = STORY_SIZE_DEFAULT.width / STORY_SIZE_DEFAULT.height;

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
    storyHeight,
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
  const [playStatus, setPlayStatus] = useState<PlayStatusType>('wait');
  const storyModalRef = useRef<HTMLDivElement>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [quizStartedStoryIds, setQuizStartedStoryIds] = useState<{ [key: string]: boolean }>({});
  const [width, height] = useWindowSize();
  const [activeStoriesWithResult, setActiveStoriesWithResult] = useState<StoryType[]>([]);

  const currentStorySize: StoryCurrentSize = useMemo(() => {
    if (storyWidth && storyHeight) {
      return {
        width: storyWidth,
        height: storyHeight
      };
    }
    return STORY_SIZE_DEFAULT;
  }, [storyWidth, storyHeight]);

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

  const isMobile = useMemo(() => width < MOBILE_BREAKPOINT, [width]);
  const currentGroupType = currentGroup?.type || GroupType.GROUP;
  const isBackroundFilled =
    activeStoriesWithResult[currentStory]?.background?.isFilled &&
    currentGroupType === GroupType.GROUP;

  const initBodyOverflow = useMemo(() => document.body.style.overflow, []);

  const largeHeightGap = useAdaptiveValue(INIT_LARGE_PADDING);
  const largeBorderRadius = useAdaptiveValue(INIT_LARGE_RADIUS);
  const largeElementsTop = useAdaptiveValue(INIT_TOP_ELEMENTS);
  const largeIndicatorTop = useAdaptiveValue(INIT_TOP_INDICATOR);
  const smallHeightGap = useAdaptiveValue(INIT_SMALL_PADDING);
  const smallBorderRadius = useAdaptiveValue(INIT_SMALL_RADIUS);
  const groupInnerHeightGap = useAdaptiveValue(INIT_INNER_GROUP_PADDING);
  const controlTopSmall = useAdaptiveValue(INIT_CONTROL_TOP);
  const controlTopLarge = useAdaptiveValue(INIT_CONTROL_TOP_LARGE);
  const controlSidePaddingSmall = useAdaptiveValue(INIT_CONTROL_SIDE_PADDING);
  const controlSidePaddingLarge = useAdaptiveValue(INIT_CONTROL_SIDE_PADDING_LARGE);
  const controlGapLarge = useAdaptiveValue(INIT_CONTROL_GAP_LARGE);
  const containerBorderRadius = useAdaptiveValue(INIT_CONTAINER_BORDER_RADIUS);
  const statusBarTop = useAdaptiveValue(INIT_TOP_STATUS_BAR);
  const mockPaddingBottom = useAdaptiveValue(INIT_MOCK_PADDING_BOTTOM);

  const isLarge = useMemo(
    () =>
      storyHeight === STORY_SIZE_LARGE.height &&
      !isMobile &&
      (currentGroupType === GroupType.ONBOARDING || currentGroupType === GroupType.TEMPLATE),
    [currentGroupType, isMobile, storyHeight]
  );

  const isGroupWithFilledBackground = useMemo(
    () => currentGroupType === GroupType.GROUP && !isMobile && isShowMockup && isBackroundFilled,
    [currentGroupType, isBackroundFilled, isMobile, isShowMockup]
  );

  const controlTop = isLarge || isGroupWithFilledBackground ? controlTopLarge : controlTopSmall;
  const controlSidePadding =
    isLarge || isGroupWithFilledBackground ? controlSidePaddingLarge : controlSidePaddingSmall;

  const controlGap =
    isLarge || isGroupWithFilledBackground ? controlGapLarge : controlSidePaddingSmall;

  const currentRatioIndex = useMemo(() => {
    if (isGroupWithFilledBackground) {
      return STORY_SIZE_LARGE.width / STORY_SIZE_LARGE.height;
    }
    if (storyWidth && storyHeight) {
      return storyWidth / storyHeight;
    }

    return defaultRatioIndex;
  }, [isGroupWithFilledBackground, storyHeight, storyWidth]);

  const heightGap = isLarge || isGroupWithFilledBackground ? largeHeightGap : smallHeightGap;
  const borderRadius =
    isLarge || isGroupWithFilledBackground ? largeBorderRadius : smallBorderRadius;
  const currentPaddingSize = isShowMockup ? PADDING_SIZE + heightGap : PADDING_SIZE;
  const isShowStatusBarInStory =
    isShowMockup && !isMobile && (isLarge || isGroupWithFilledBackground) && isStatusBarActive;
  const isShowStatusBarInContainer =
    isShowMockup &&
    !isMobile &&
    currentGroupType === GroupType.GROUP &&
    !isBackroundFilled &&
    isStatusBarActive;
  const desktopWidth = currentRatioIndex * (height - currentPaddingSize);

  const getBorderRadius = () => {
    if (isShowMockup && currentGroupType === GroupType.GROUP && !isBackroundFilled && !isMobile) {
      return 0;
    }

    return isShowMockup && !isMobile ? borderRadius : undefined;
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (storyModalRef.current && body) {
      if (width < 767) {
        storyModalRef.current.style.setProperty('height', `${body.clientHeight}px`);
      } else {
        storyModalRef.current.style.setProperty('height', `100%`);
      }
    }
  }, [width, height]);

  useEffect(() => {
    let currentStoryIndex = 0;

    if (startStoryId && activeStoriesWithResult.length) {
      const storyIndex = activeStoriesWithResult.findIndex((story) => story.id === startStoryId);
      currentStoryIndex = storyIndex > -1 ? storyIndex : 0;
    }

    setCurrentStory(currentStoryIndex);

    const body = document.querySelector('body');

    if (isShowing) {
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

    if (isShowing && activeStoriesWithResult.length) {
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
    isShowing,
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

  const handleNext = useCallback(() => {
    eventPublish('nextStory', {
      stotyId: activeStoriesWithResult[currentStory].id
    });

    const resultStoryId = getResultStoryId();

    if (
      currentStory === activeStoriesWithResult.length - 1 ||
      activeStoriesWithResult[currentStory].id === resultStoryId
    ) {
      dispatchQuizState({ type: 'reset' });
      if (isLastGroup) {
        handleClose();
      } else {
        onNextGroup();

        if (onCloseStory && currentGroup) {
          onCloseStory(currentGroup.id, activeStoriesWithResult[currentStory].id);
        }
      }
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

  const handlePrev = useCallback(() => {
    eventPublish('prevStory', {
      stotyId: activeStoriesWithResult[currentStory].id
    });

    const resultStoryId = getResultStoryId();
    const resultStory = activeStoriesWithResult.find((story) => story.id === resultStoryId);

    if (currentStory === 0) {
      dispatchQuizState({ type: 'reset' });
      isFirstGroup ? handleClose() : onPrevGroup();
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

  const noTopShadow =
    (currentGroupType === GroupType.ONBOARDING &&
      currentGroup?.settings?.isProgressHidden &&
      currentGroup?.settings?.isProhibitToClose) ||
    isGroupWithFilledBackground;

  const noTopBackgroundShadow =
    currentGroupType === GroupType.ONBOARDING ||
    (currentGroupType === GroupType.GROUP && !isBackroundFilled);

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

  const heightModalGap = useMemo(() => {
    if (isMobile) {
      return 0;
    }

    if (isShowMockup) {
      return heightGap + PADDING_SIZE;
    }

    return PADDING_SIZE;
  }, [isMobile, isShowMockup, heightGap]);

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
        className={b({ isShowing })}
        ref={storyModalRef}
        style={{
          top: window.pageYOffset || document.documentElement.scrollTop
        }}
      >
        <div className={b('body')}>
          {activeStoriesWithResult.length > 1 && !isLoading && (
            <button className={b('arrowButton', { left: true })} onClick={handlePrev}>
              <LeftArrowIcon />
            </button>
          )}

          <div
            className={b('bodyContainer', {
              black:
                currentGroupType === GroupType.GROUP &&
                !isBackroundFilled &&
                !isMobile &&
                isShowMockup
            })}
            style={{
              borderRadius: containerBorderRadius
            }}
          >
            {isShowStatusBarInContainer && (
              <>
                <div
                  className={b('statusBar')}
                  style={{
                    paddingTop: statusBarTop,
                    paddingLeft: statusBarTop,
                    paddingRight: statusBarTop
                  }}
                >
                  <StatusBar />
                </div>

                <div
                  className={b('bottomMock')}
                  style={{
                    paddingBottom: mockPaddingBottom
                  }}
                >
                  <img alt="" className={b('bottomMockImg')} src={iphoneMockupBottom} />
                </div>
              </>
            )}

            <div
              className={b('swiper', {
                mockup: !isMobile && isShowMockup,
                smallTop:
                  !isMobile &&
                  isShowMockup &&
                  currentGroupType === GroupType.GROUP &&
                  !isBackroundFilled
              })}
              style={{
                width: !isMobile ? desktopWidth : '100%',
                height: `calc(100vh - ${heightModalGap}px)`,
                borderRadius: getBorderRadius()
              }}
            >
              <>
                {isLoading || !currentGroup?.stories ? (
                  <div className={b('loader')}>
                    <IconLoader className={b('loaderIcon').toString()} />
                  </div>
                ) : (
                  <>
                    <div className={b('swiperContent')}>
                      {activeStoriesWithResult.map((story, index) => (
                        <div
                          className={b('story', { current: index === currentStory })}
                          key={story.id}
                        >
                          <StoryContent
                            currentPaddingSize={currentPaddingSize}
                            currentStorySize={currentStorySize}
                            handleGoToStory={handleGoToStory}
                            innerHeightGap={
                              isShowMockup && isGroupWithFilledBackground ? groupInnerHeightGap : 0
                            }
                            isLarge={isLarge || isGroupWithFilledBackground}
                            isLargeBackground={isShowMockup && currentGroupType === GroupType.GROUP}
                            jsConfetti={jsConfetti}
                            noTopBackgroundShadow={noTopBackgroundShadow}
                            noTopShadow={noTopShadow}
                            story={story}
                          />
                        </div>
                      ))}
                    </div>

                    <div className={b('topContainer')}>
                      <>
                        {isShowStatusBarInStory && <StatusBar />}

                        <div
                          className={b('controls')}
                          style={{
                            gap: !isShowStatusBarInStory && !isMobile ? controlGap : undefined,
                            paddingTop: !isShowStatusBarInStory ? controlTop : undefined,
                            paddingLeft:
                              !isShowStatusBarInStory && !isMobile ? controlSidePadding : undefined,
                            paddingRight:
                              !isShowStatusBarInStory && !isMobile ? controlSidePadding : undefined
                          }}
                        >
                          {!currentGroup?.settings?.isProgressHidden && !isProgressHidden && (
                            <div
                              className={b('indicators', {
                                stopAnimation: playStatus === 'pause',
                                widePadding:
                                  isShowMockup && (isLarge || isGroupWithFilledBackground)
                              })}
                              style={{
                                top:
                                  isShowMockup && (isLarge || isGroupWithFilledBackground)
                                    ? largeIndicatorTop
                                    : undefined
                              }}
                            >
                              {activeStoriesWithResult
                                .filter((story) => story.layerData?.isDefaultLayer)
                                .map((story, index) => (
                                  <div
                                    className={b('indicator', {
                                      filled: index < currentStory,
                                      current: index === currentStory
                                    })}
                                    key={story.id}
                                    style={{
                                      animationDuration: `${story.layerData?.duration}s`
                                    }}
                                    onAnimationEnd={handleAnimationEnd}
                                  />
                                ))}
                            </div>
                          )}

                          {currentGroupType === GroupType.GROUP && (
                            <div
                              className={b('group', {
                                noProgress:
                                  currentGroup?.settings?.isProgressHidden || isProgressHidden,
                                wideLeft: isShowMockup && (isLarge || isGroupWithFilledBackground)
                              })}
                              style={{
                                top:
                                  isShowMockup && (isLarge || isGroupWithFilledBackground)
                                    ? largeElementsTop
                                    : undefined
                              }}
                            >
                              {currentGroup?.imageUrl && (
                                <div className={b('groupImgWrapper')}>
                                  <img
                                    alt=""
                                    className={b('groupImg')}
                                    src={currentGroup?.imageUrl}
                                  />
                                </div>
                              )}
                              {currentGroup?.title && (
                                <p className={b('groupTitle')}>{currentGroup?.title}</p>
                              )}
                            </div>
                          )}

                          {!currentGroup?.settings?.isProhibitToClose && !forbidClose && (
                            <button
                              className={b('close', {
                                noProgress:
                                  currentGroup?.settings?.isProgressHidden || isProgressHidden,
                                wideRight: isShowMockup && (isLarge || isGroupWithFilledBackground)
                              })}
                              style={{
                                top:
                                  isShowMockup && (isLarge || isGroupWithFilledBackground)
                                    ? largeElementsTop
                                    : undefined
                              }}
                              onClick={handleClose}
                            >
                              <CloseIcon />
                            </button>
                          )}
                        </div>
                      </>
                    </div>
                  </>
                )}
              </>
            </div>

            {isShowMockup && !isMobile && (
              <img
                className={b('mockup')}
                src={
                  isLarge || currentGroupType === GroupType.GROUP
                    ? largeIphoneMockup
                    : smallIphoneMockup
                }
              />
            )}
          </div>

          {activeStoriesWithResult.length > 1 && !isLoading && (
            <button className={b('arrowButton', { right: true })} onClick={handleNext}>
              <RightArrowIcon />
            </button>
          )}
        </div>

        {isForceCloseAvailable && currentGroup?.settings?.isProhibitToClose && (
          <button className={b('close', { general: true })} onClick={handleClose}>
            <CloseIcon />
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
