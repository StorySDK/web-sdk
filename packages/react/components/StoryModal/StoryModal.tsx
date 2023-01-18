import React, { useEffect, useState, useCallback, useRef } from 'react';
import block from 'bem-cn';
import { useWindowSize } from '@react-hook/window-size';
import JSConfetti from 'js-confetti';
import { useAdaptiveValue } from '../../hooks';
import { StoryType, Group, GroupType, StorySize } from '../../types';
import { StoryContent } from '..';
import largeIphoneMockup from '../../assets/images/iphone-mockup-large.png';
import smallIphoneMockup from '../../assets/images/iphone-mockup-small.svg';
import './StoryModal.scss';

const b = block('StorySdkModal');

interface StoryModalProps {
  currentGroup: Group;
  stories: StoryType[];
  isShowing: boolean;
  isShowMockup?: boolean;
  isLastGroup: boolean;
  isFirstGroup: boolean;
  startStoryId?: string;
  isForceCloseAvailable?: boolean;
  onClose(): void;
  onPrevGroup(): void;
  onNextGroup(): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onOpenStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string): void;
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

export const StoryContext = React.createContext<{
  currentStoryId: string;
  playStatusChange?: any;
  confetti?: any;
}>({
  currentStoryId: '',
  playStatusChange: () => {},
  confetti: null
});

type PlayStatusType = 'wait' | 'play' | 'pause';

export type StoryCurrentSize = {
  width: number;
  height: number;
};

export const STORY_SIZE = {
  width: 1080,
  height: 1920
};

export const STORY_SIZE_LARGE = {
  width: 1080,
  height: 2338
};

export const PADDING_SIZE = 20;
export const MOBILE_BREAKPOINT = 768;
const INIT_TOP_ELEMENTS = 20;
const INIT_TOP_INDICATOR = 10;
const INIT_LARGE_PADDING = 30;
const INIT_LARGE_RADIUS = 30;
const INIT_SMALL_PADDING = 145;
const INIT_INNER_GROUP_PADDING = 115;
const INIT_SMALL_RADIUS = 5;

const ratioIndex = STORY_SIZE.width / STORY_SIZE.height;
const ratioIndexLarge = STORY_SIZE_LARGE.width / STORY_SIZE_LARGE.height;

export const StoryModal: React.FC<StoryModalProps> = (props) => {
  const {
    stories,
    isShowing,
    isLastGroup,
    isFirstGroup,
    startStoryId,
    isForceCloseAvailable,
    isShowMockup,
    onClose,
    onNextGroup,
    onPrevGroup,
    onNextStory,
    onPrevStory,
    onOpenStory,
    onCloseStory,
    currentGroup
  } = props;

  const [currentStory, setCurrentStory] = useState(0);
  const [currentStoryId, setCurrentStoryId] = useState('');
  const [playStatus, setPlayStatus] = useState<PlayStatusType>('wait');
  const storyModalRef = useRef<HTMLDivElement>(null);

  const [width, height] = useWindowSize();

  const currentGroupType = currentGroup.type || GroupType.GROUP;

  const isLarge =
    (currentGroup.settings?.storiesSize === StorySize.LARGE &&
      currentGroupType === GroupType.ONBOARDING) ||
    (currentGroupType === GroupType.GROUP && isShowMockup);

  const currentRationIndex = isLarge ? ratioIndexLarge : ratioIndex;
  const currentStorySize: StoryCurrentSize = isLarge ? STORY_SIZE_LARGE : STORY_SIZE;

  const largeHeightGap = useAdaptiveValue(INIT_LARGE_PADDING);
  const largeBorderRadius = useAdaptiveValue(INIT_LARGE_RADIUS);

  const largeElementsTop = useAdaptiveValue(INIT_TOP_ELEMENTS);
  const largeIndicatorTop = useAdaptiveValue(INIT_TOP_INDICATOR);

  const smallHeightGap = useAdaptiveValue(INIT_SMALL_PADDING);
  const smallBorderRadius = useAdaptiveValue(INIT_SMALL_RADIUS);

  const groupInnerHeightGap = useAdaptiveValue(INIT_INNER_GROUP_PADDING);

  const heightGap = isLarge ? largeHeightGap : smallHeightGap;
  const borderRadius = isLarge ? largeBorderRadius : smallBorderRadius;

  const currentPaddingSize = isShowMockup ? PADDING_SIZE + heightGap : PADDING_SIZE;

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

    if (startStoryId && stories.length) {
      const storyIndex = stories.findIndex((story) => story.id === startStoryId);
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
        body.style.overflow = 'auto';
      }
    }

    if (isShowing && stories.length) {
      setCurrentStoryId(stories[currentStoryIndex].id);

      if (onOpenStory) {
        onOpenStory(currentGroup.id, stories[currentStoryIndex].id);
      }
    }
  }, [stories.length, onOpenStory, stories, currentGroup, isShowing, startStoryId]);

  const handleClose = useCallback(() => {
    onClose();

    if (onCloseStory) {
      onCloseStory(currentGroup.id, stories[currentStory].id);
    }
  }, [currentGroup.id, currentStory, onClose, onCloseStory, stories]);

  const handleNext = useCallback(() => {
    if (currentStory === stories.length - 1) {
      if (isLastGroup) {
        handleClose();
      } else {
        onNextGroup();

        if (onCloseStory) {
          onCloseStory(currentGroup.id, stories[currentStory].id);
        }
      }
    } else {
      if (onCloseStory) {
        onCloseStory(currentGroup.id, stories[currentStory].id);
      }

      if (onOpenStory) {
        setTimeout(() => {
          onOpenStory(currentGroup.id, stories[currentStory + 1].id);
        }, 0);
      }

      if (onNextStory) {
        onNextStory(currentGroup.id, stories[currentStory].id);
      }

      setCurrentStory(currentStory + 1);
      setCurrentStoryId(stories[currentStory + 1].id);
    }
  }, [
    currentGroup.id,
    currentStory,
    handleClose,
    isLastGroup,
    onCloseStory,
    onNextGroup,
    onNextStory,
    onOpenStory,
    stories
  ]);

  const handleAnimationEnd = useCallback(() => {
    // handleNext();
  }, [handleNext]);

  const handlePrev = useCallback(() => {
    if (currentStory === 0) {
      isFirstGroup ? handleClose() : onPrevGroup();
    } else {
      if (onCloseStory) {
        onCloseStory(currentGroup.id, stories[currentStory].id);
      }

      if (onOpenStory) {
        setTimeout(() => {
          onOpenStory(currentGroup.id, stories[currentStory - 1].id);
        }, 0);
      }

      if (onPrevStory) {
        onPrevStory(currentGroup.id, stories[currentStory].id);
      }

      setCurrentStory(currentStory - 1);
      setCurrentStoryId(stories[currentStory - 1].id);
    }
  }, [
    currentGroup.id,
    currentStory,
    handleClose,
    isFirstGroup,
    onCloseStory,
    onOpenStory,
    onPrevGroup,
    onPrevStory,
    stories
  ]);

  const handleGoToStory = (storyId: string) => {
    const storyIndex = stories.findIndex((story) => story.id === storyId);

    if (storyIndex > -1) {
      if (onOpenStory) {
        setTimeout(() => {
          onOpenStory(currentGroup.id, stories[storyIndex].id);
        }, 0);
      }

      setCurrentStory(storyIndex);
      setCurrentStoryId(stories[storyIndex].id);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jsConfetti = useRef(
    new JSConfetti({
      canvas: canvasRef.current as HTMLCanvasElement
    })
  );

  const noTopShadow =
    currentGroupType === GroupType.ONBOARDING &&
    currentGroup.settings?.isProgressHidden &&
    currentGroup.settings?.isProhibitToClose;

  const isMobile = width < MOBILE_BREAKPOINT;

  return (
    <StoryContext.Provider value={{ currentStoryId, playStatusChange: setPlayStatus }}>
      <div
        className={b({ isShowing })}
        ref={storyModalRef}
        style={{
          top: window.pageYOffset || document.documentElement.scrollTop
        }}
      >
        <div className={b('body')}>
          {stories.length > 1 && (
            <button className={b('arrowButton', { left: true })} onClick={handlePrev}>
              <LeftArrowIcon />
            </button>
          )}

          <div className={b('bodyContainer')}>
            <div
              className={b('swiper', {
                mockup: !isMobile && isShowMockup,
                small: !isMobile && !isLarge && isShowMockup
              })}
              style={{
                width:
                  width >= MOBILE_BREAKPOINT
                    ? currentRationIndex * (height - currentPaddingSize)
                    : '100%',
                height: `calc(100% - ${isShowMockup ? heightGap : 0}px)`,
                borderRadius: isShowMockup ? borderRadius : undefined
              }}
            >
              <div className={b('swiperContent')}>
                {stories.map((story, index) => (
                  <div className={b('story', { current: index === currentStory })} key={story.id}>
                    <StoryContent
                      currentPaddingSize={currentPaddingSize}
                      handleGoToStory={handleGoToStory}
                      innerHeightGap={
                        isShowMockup && currentGroupType === GroupType.GROUP
                          ? groupInnerHeightGap
                          : 0
                      }
                      isLarge={
                        currentGroup.settings?.storiesSize === StorySize.LARGE &&
                        currentGroupType === GroupType.ONBOARDING
                      }
                      isLargeBackground={isShowMockup && currentGroupType === GroupType.GROUP}
                      jsConfetti={jsConfetti}
                      noTopShadow={noTopShadow}
                      story={story}
                      storyCurrentSize={currentStorySize}
                    />
                  </div>
                ))}
              </div>

              <div className={b('controls')}>
                {!currentGroup.settings?.isProgressHidden && (
                  <div
                    className={b('indicators', {
                      stopAnimation: playStatus === 'pause',
                      widePadding: isShowMockup && isLarge
                    })}
                    style={{
                      top: isShowMockup && isLarge ? largeIndicatorTop : undefined
                    }}
                  >
                    {stories.map((story, index) => (
                      <div
                        className={b('indicator', {
                          filled: index < currentStory,
                          current: index === currentStory
                        })}
                        key={story.id}
                        onAnimationEnd={handleAnimationEnd}
                      />
                    ))}
                  </div>
                )}

                {currentGroupType === GroupType.GROUP && (
                  <div
                    className={b('group', {
                      noProgress: currentGroup.settings?.isProgressHidden,
                      wideLeft: isShowMockup && isLarge
                    })}
                    style={{
                      top: isShowMockup && isLarge ? largeElementsTop : undefined
                    }}
                  >
                    <div className={b('groupImgWrapper')}>
                      <img alt="" className={b('groupImg')} src={currentGroup.imageUrl} />
                    </div>
                    <p className={b('groupTitle')}>{currentGroup.title}</p>
                  </div>
                )}

                {!currentGroup.settings?.isProhibitToClose && (
                  <button
                    className={b('close', {
                      noProgress: currentGroup.settings?.isProgressHidden,
                      wideRight: isShowMockup && isLarge
                    })}
                    style={{
                      top: isShowMockup && isLarge ? largeElementsTop : undefined
                    }}
                    onClick={handleClose}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            </div>

            {isShowMockup && (
              <img
                className={b('mockup', { large: isLarge })}
                src={isLarge ? largeIphoneMockup : smallIphoneMockup}
              />
            )}
          </div>

          {stories.length > 1 && (
            <button className={b('arrowButton', { right: true })} onClick={handleNext}>
              <RightArrowIcon />
            </button>
          )}
        </div>

        {isForceCloseAvailable && currentGroup.settings?.isProhibitToClose && (
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
