import React from 'react';
import block from 'bem-cn';
import './StoryModal.scss';
import { useWindowWidth } from '@react-hook/window-size';
import { StoryType, GroupType } from '../../types';
import { StoryContent } from '..';

const b = block('StoryModal');

interface StoryModalProps {
  currentGroup: GroupType;
  stories: StoryType[];
  showed: boolean;
  isLastGroup: boolean;
  isFirstGroup: boolean;
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

export const CurrentStoryContext = React.createContext('');

export const StoryModal: React.FC<StoryModalProps> = (props) => {
  const {
    stories,
    showed,
    isLastGroup,
    isFirstGroup,
    onClose,
    onNextGroup,
    onPrevGroup,
    onNextStory,
    onPrevStory,
    onOpenStory,
    onCloseStory,
    currentGroup
  } = props;

  const [currentStory, setCurrentStory] = React.useState(0);
  const [currentStoryId, setCurrentStoryId] = React.useState(stories.length ? stories[0].id : '');

  const width = useWindowWidth();

  React.useEffect(() => {
    setCurrentStory(0);

    if (onOpenStory && showed && stories.length) {
      onOpenStory(currentGroup.id, stories[0].id);
    }
  }, [stories.length, onOpenStory, stories, currentGroup, showed]);

  const handleClose = () => {
    onClose();

    if (onCloseStory) {
      onCloseStory(currentGroup.id, stories[currentStory].id);
    }
  };

  const handleAnimationEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    if (currentStory === stories.length - 1) {
      isLastGroup ? handleClose() : onNextGroup();
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
  };

  const handlePrev = () => {
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
  };

  return (
    <CurrentStoryContext.Provider value={currentStoryId}>
      <div
        className={b({ showed })}
        style={{ height: width < 768 ? Math.round(694 * (width / 390)) : '100%' }}
      >
        <div className={b('body')}>
          {!isFirstGroup && (
            <button className={b('arrowButton', { left: true })} onClick={handlePrev}>
              <LeftArrowIcon />
            </button>
          )}

          <div className={b('swiper')}>
            <div className={b('swiperContent')}>
              {stories.map((story, index) => (
                <div className={b('story', { current: index === currentStory })} key={story.id}>
                  <StoryContent story={story} />
                </div>
              ))}
            </div>

            <div className={b('controls')}>
              <div className={b('indicators')}>
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

          {isLastGroup && (
            <button className={b('arrowButton', { right: true })} onClick={handleNext}>
              <RightArrowIcon />
            </button>
          )}
        </div>
      </div>
    </CurrentStoryContext.Provider>
  );
};
