import React from 'react';
import { WidgetObjectType, WidgetsTypes } from '../types';
import {
  ChooseAnswerWidget,
  ClickMeWidget,
  EllipseWidget,
  EmojiReactionWidget,
  GiphyWidget,
  QuestionWidget,
  RectangleWidget,
  SliderWidget,
  SwipeUpWidget,
  TalkAboutWidget,
  TextWidget,
  TimerWidget
} from '../widgets';

interface WidgetFactoryProps {
  storyId: string;
  canvasRef: any;
  widget: WidgetObjectType;
}

export class WidgetFactory extends React.Component<WidgetFactoryProps> {
  private makeWidget() {
    switch (this.props.widget.content.type) {
      case WidgetsTypes.CHOOSE_ANSWER:
        return (
          <ChooseAnswerWidget
            canvasRef={this.props.canvasRef}
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
          />
        );
      case WidgetsTypes.ELLIPSE:
        return <EllipseWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.EMOJI_REACTION:
        return (
          <EmojiReactionWidget
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            onReact={this.props.widget.action}
          />
        );
      case WidgetsTypes.GIPHY:
        return <GiphyWidget params={this.props.widget.content.params} />;
      case WidgetsTypes.QUESTION:
        return (
          <QuestionWidget
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
            params={this.props.widget.content.params}
            position={this.props.widget.position}
            positionLimits={this.props.widget.positionLimits}
            storyId={this.props.storyId}
            onSlide={this.props.widget.action}
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
      default:
        return undefined;
    }
  }

  render() {
    return <>{this.makeWidget()}</>;
  }
}
