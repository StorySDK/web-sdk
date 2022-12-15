import React, { useEffect, useState, useCallback, useRef } from 'react';
import block from 'bem-cn';
import './StoryModal.scss';
import { useWindowSize } from '@react-hook/window-size';
import JSConfetti from 'js-confetti';
import { StoryType, GroupType } from '../../types';
import { StoryContent } from '..';

const b = block('StorySdkModal');

interface StoryModalProps {
  currentGroup: GroupType;
  stories: StoryType[];
  isShowing: boolean;
  isLastGroup: boolean;
  isFirstGroup: boolean;
  startStoryId?: string;
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

export const STORY_SIZE = {
  width: 1080,
  height: 1920
};
export const PADDING_SIZE = 20;
export const MOBILE_BREAKPOINT = 768;

const ratioIndex = STORY_SIZE.width / STORY_SIZE.height;

export const StoryModal: React.FC<StoryModalProps> = (props) => {
  const {
    stories,
    isShowing,
    isLastGroup,
    isFirstGroup,
    startStoryId,
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
      setCurrentStory(currentStory + 1);
      setCurrentStoryId(stories[currentStory + 1].id);

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
    handleNext();
  }, [handleNext]);

  const handlePrev = useCallback(() => {
    if (currentStory === 0) {
      isFirstGroup ? handleClose() : onPrevGroup();
    } else {
      setCurrentStory(currentStory - 1);
      setCurrentStoryId(stories[currentStory - 1].id);

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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jsConfetti = useRef(
    new JSConfetti({
      canvas: canvasRef.current as HTMLCanvasElement
    })
  );

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
          <button className={b('arrowButton', { left: true })} onClick={handlePrev}>
            <LeftArrowIcon />
          </button>

          <div
            className={b('swiper')}
            style={{
              width: width >= MOBILE_BREAKPOINT ? ratioIndex * (height - PADDING_SIZE) : '100%'
            }}
          >
            <div className={b('swiperContent')}>
              {stories.map((story, index) => (
                <div className={b('story', { current: index === currentStory })} key={story.id}>
                  <StoryContent jsConfetti={jsConfetti} story={story} />
                </div>
              ))}
            </div>

            <div className={b('controls')}>
              <div className={b('indicators', { stopAnimation: playStatus === 'pause' })}>
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
              <div className={b('group')}>
                <div className={b('groupImgWrapper')}>
                  <img alt="" className={b('groupImg')} src={currentGroup.imageUrl} />
                </div>
                <p className={b('groupTitle')}>{currentGroup.title}</p>
              </div>
              <button className={b('close')} onClick={handleClose}>
                <CloseIcon />
              </button>
            </div>
          </div>

          <button className={b('arrowButton', { right: true })} onClick={handleNext}>
            <RightArrowIcon />
          </button>
        </div>
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
