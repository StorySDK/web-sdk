import React from 'react';
import {
  ChooseAnswerWidget,
  ClickMeWidget,
  EllipseWidget,
  EmojiReactionWidget,
  GiphyWidget,
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
  TimerWidget
} from '@widgets';
import { WidgetObjectType, WidgetsTypes } from '../types';

interface WidgetFactoryProps {
  storyId: string;
  jsConfetti?: any;
  widget: WidgetObjectType;
  handleGoToStory?: (storyId: string) => void;
}

export class WidgetFactory extends React.Component<WidgetFactoryProps> {
  private makeWidget() {
    switch (this.props.widget.content.type) {
      case WidgetsTypes.CHOOSE_ANSWER:
        return (
          <ChooseAnswerWidget
            id={this.props.widget.id}
            jsConfetti={this.props.jsConfetti}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.CLICK_ME:
        return (
          <ClickMeWidget
            params={this.props.widget.content.params}
            onClick={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.ELLIPSE:
        return <EllipseWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.EMOJI_REACTION:
        return (
          <EmojiReactionWidget
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.GIPHY:
        return <GiphyWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.QUESTION:
        return (
          <QuestionWidget
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.RECTANGLE:
        return <RectangleWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.SLIDER:
        return (
          <SliderWidget
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            storyId={this.props.storyId}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.SWIPE_UP:
        return (
          <SwipeUpWidget
            params={this.props.widget.content.params}
            onSwipe={this.props.widget.action}
          />
        );
      case WidgetsTypes.TALK_ABOUT:
        return (
          <TalkAboutWidget
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onAnswer={this.props.widget.action}
          />
        );
      case WidgetsTypes.TEXT:
        return <TextWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.TIMER:
        return (
          <TimerWidget
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
          />
        );
      case WidgetsTypes.QUIZ_ONE_ANSWER:
        return (
          <QuizOneAnswerWidget
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.QUIZ_MULTIPLE_ANSWERS:
        return (
          <QuizMultipleAnswerWidget
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE:
        return (
          <QuizMultipleAnswerWithImageWidget
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.QUIZ_OPEN_ANSWER:
        return (
          <QuizOpenAnswerWidget
            id={this.props.widget.id}
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onAnswer={this.props.widget.action}
            onGoToStory={this.props.handleGoToStory}
          />
        );
      case WidgetsTypes.QUIZ_RATE:
        return (
          <QuizRateWidget
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
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
