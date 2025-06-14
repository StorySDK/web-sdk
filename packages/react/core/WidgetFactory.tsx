import React from 'react';
import {
  ChooseAnswerWidget,
  ClickMeWidget,
  EllipseWidget,
  EmojiReactionWidget,
  GiphyWidget,
  ImageWidget,
  LinkWidget,
  QuestionWidget,
  QuizMultipleAnswerWidget,
  QuizMultipleAnswerWithImageWidget,
  QuizOneAnswerWidget,
  QuizOpenAnswerWidget,
  QuizRateWidget,
  RectangleWidget,
  SliderWidget,
  SwipeUpWidget,
  TalkAboutWidget,
  TextWidget,
  VideoWidget,
} from '@widgets';
import { STORY_SIZE_DEFAULT, StoryCurrentSize } from '@components';
import {
  ChooseAnswerWidgetElemetsType,
  EmojiReactionWidgetElemetsType,
  QuestionWidgetElementsType,
  QuizMultipleAnswerWidgetElementsType,
  QuizMultipleAnswerWidgetWithImageElementsType,
  QuizOneAnswerWidgetElementsType,
  QuizOpenAnswerWidgetElementsType,
  QuizRateWidgetElementsType,
  SliderWidgetElementsType,
  TalkAboutElementsType,
  WidgetObjectType,
  WidgetsTypes,
} from '@storysdk/types';

interface WidgetFactoryProps {
  storyId: string;
  currentStorySize: StoryCurrentSize;
  jsConfetti?: any;
  isDisplaying?: boolean;
  isVideoMuted?: boolean;
  isVideoPlaying?: boolean;
  isAutoplayVideos?: boolean;
  widget: WidgetObjectType;
  handleMuteVideo?: (isMuted: boolean) => void;
  handleGoToStory?: (storyId: string) => void;
  handleCloseStory?: () => void;
  handleVideoPlaying?: (isPlaying: boolean) => void;
  handleMediaLoading?: (isLoading: boolean) => void;
}

export class WidgetFactory extends React.Component<WidgetFactoryProps> {
  private makeWidget() {
    const elementsSize = this.props.widget.positionByResolutions[
      `${this.props.currentStorySize.width}x${this.props.currentStorySize.height}`
    ]?.elementsSize
      ?? this.props.widget.positionByResolutions[
        `${STORY_SIZE_DEFAULT.width}x${STORY_SIZE_DEFAULT.height}`
      ]?.elementsSize;

    switch (this.props.widget.content.type) {
      case WidgetsTypes.CHOOSE_ANSWER:
        return (
          <ChooseAnswerWidget
            elementsSize={elementsSize as ChooseAnswerWidgetElemetsType}
            id={this.props.widget.id}
            jsConfetti={this.props.jsConfetti}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.CLICK_ME:
        return (
          <ClickMeWidget
            handleMuteVideo={this.props.handleMuteVideo}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onClick={this.props.widget.action}
            onCloseStory={this.props.handleCloseStory}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.LINK:
        return (
          <LinkWidget
            handleMuteVideo={this.props.handleMuteVideo}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onClick={this.props.widget.action}
          />
        );
      case WidgetsTypes.ELLIPSE:
        return <EllipseWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.IMAGE:
        return (
          <ImageWidget
            handleMediaLoading={this.props.handleMediaLoading}
            height={this.props.widget.positionByResolutions[`${this.props.currentStorySize.width}x${this.props.currentStorySize.height}`]?.origin.height}
            params={this.props.widget.content.params}
            width={this.props.widget.positionByResolutions[`${this.props.currentStorySize.width}x${this.props.currentStorySize.height}`]?.origin.width}
          />
        );
      case WidgetsTypes.VIDEO:
        return (
          <VideoWidget
            handleMediaLoading={this.props.handleMediaLoading}
            handleMediaPlaying={this.props.handleVideoPlaying}
            isAutoplay={this.props.isAutoplayVideos}
            isDisplaying={this.props.isDisplaying}
            isMuted={this.props.isVideoMuted}
            isVideoPlaying={this.props.isVideoPlaying}
            params={this.props.widget.content.params}
          />
        );
      case WidgetsTypes.EMOJI_REACTION:
        return (
          <EmojiReactionWidget
            elementsSize={elementsSize as EmojiReactionWidgetElemetsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.GIPHY:
        return <GiphyWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.QUESTION:
        return (
          <QuestionWidget
            elementsSize={elementsSize as QuestionWidgetElementsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.RECTANGLE:
        return <RectangleWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.SLIDER:
        return (
          <SliderWidget
            elementsSize={elementsSize as SliderWidgetElementsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            storyId={this.props.storyId}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.SWIPE_UP:
        return (
          <SwipeUpWidget
            handleMuteVideo={this.props.handleMuteVideo}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onSwipe={this.props.widget.action}
          />
        );
      case WidgetsTypes.TALK_ABOUT:
        return (
          <TalkAboutWidget
            elementsSize={elementsSize as TalkAboutElementsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.TEXT:
        return <TextWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.QUIZ_ONE_ANSWER:
        return (
          <QuizOneAnswerWidget
            elementsSize={elementsSize as QuizOneAnswerWidgetElementsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.QUIZ_MULTIPLE_ANSWERS:
        return (
          <QuizMultipleAnswerWidget
            elementsSize={elementsSize as QuizMultipleAnswerWidgetElementsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE:
        return (
          <QuizMultipleAnswerWithImageWidget
            elementsSize={elementsSize as QuizMultipleAnswerWidgetWithImageElementsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.QUIZ_OPEN_ANSWER:
        return (
          <QuizOpenAnswerWidget
            elementsSize={elementsSize as QuizOpenAnswerWidgetElementsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.QUIZ_RATE:
        return (
          <QuizRateWidget
            elementsSize={elementsSize as QuizRateWidgetElementsType}
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      default:
        return undefined;
    }
  }

  render() {
    return <>{this.makeWidget()}</>;
  }
}
