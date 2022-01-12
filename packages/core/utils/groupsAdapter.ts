// import { GroupType } from '@storysdk/react';
import { API } from '../services';

const actionToWidget = (widget: any) => {
  switch (widget.content.type) {
    case 'choose_answer':
      return (answer: string) =>
        API.statistics.widgets.chooseAnswer.onAnswer({
          widgetId: widget.id as string,
          answer
        });
    case 'emoji_reaction':
      return (emoji: string) =>
        API.statistics.widgets.emojiReaction.onReact({
          widgetId: widget.id as string,
          emoji
        });
    case 'talk_about':
      return (answer: string) =>
        API.statistics.widgets.talkAbout.onAnswer({
          widgetId: widget.id as string,
          answer
        });
    case 'click_me':
      return () => API.statistics.widgets.clickMe.onClick({ widgetId: widget.id as string });
    case 'question':
      return (answer: string) =>
        API.statistics.widgets.question.onAnswer({ widgetId: widget.id as string, answer });
    case 'slider':
      return (value: number) =>
        API.statistics.widgets.slider.onSlide({ widgetId: widget.id as string, value });
    case 'swipe_up':
      return () => API.statistics.widgets.swipeUp.onSwipe({ widgetId: widget.id as string });
    default:
      return undefined;
  }
};

const adaptWidgets = (widgets: any) =>
  widgets.map((widget: any) => ({
    ...widget,
    action: actionToWidget(widget)
  }));

export const adaptGroupData = (data: any) =>
  data
    .filter((group: any) => group.stories.length)
    .map((group: any) => ({
      id: group.id,
      title: group.title,
      imageUrl: group.image_url,
      stories: group.stories.map((story: any, index: number) => ({
        id: story.id,
        background: story.story_data.background,
        storyData: adaptWidgets(story.story_data.widgets),
        positionIndex: index
      }))
    }));
