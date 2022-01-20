// import { GroupType } from '@storysdk/react';
import { API } from '../services';

const actionToWidget = (widget: any, storyId: string, groupId: string, uniqUserId: string) => {
  switch (widget.content.type) {
    case 'choose_answer':
      return (answer: string) =>
        API.statistics.widgets.chooseAnswer.onAnswer({
          widgetId: widget.id as string,
          storyId,
          groupId,
          uniqUserId,
          answer
        });
    case 'emoji_reaction':
      return (emoji: string) =>
        API.statistics.widgets.emojiReaction.onReact({
          widgetId: widget.id as string,
          storyId,
          groupId,
          uniqUserId,
          emoji
        });
    case 'talk_about':
      return (answer: string) =>
        API.statistics.widgets.talkAbout.onAnswer({
          widgetId: widget.id as string,
          storyId,
          groupId,
          uniqUserId,
          answer
        });
    case 'click_me':
      return () =>
        API.statistics.widgets.clickMe.onClick({
          widgetId: widget.id as string,
          storyId,
          groupId,
          uniqUserId,
          url: widget.content.params.url
        });
    case 'question':
      return (answer: string) =>
        API.statistics.widgets.question.onAnswer({
          widgetId: widget.id as string,
          answer,
          storyId,
          groupId,
          uniqUserId
        });
    case 'slider':
      return (value: number) =>
        API.statistics.widgets.slider.onSlide({
          widgetId: widget.id as string,
          value,
          storyId,
          groupId,
          uniqUserId
        });
    case 'swipe_up':
      return () =>
        API.statistics.widgets.swipeUp.onSwipe({
          widgetId: widget.id as string,
          storyId,
          groupId,
          uniqUserId,
          url: widget.content.params.url
        });
    default:
      return undefined;
  }
};

const adaptWidgets = (widgets: any, storyId: string, groupId: string, uniqUserId: string) =>
  widgets.map((widget: any) => ({
    ...widget,
    action: actionToWidget(widget, storyId, groupId, uniqUserId)
  }));

export const adaptGroupData = (data: any, uniqUserId: string) =>
  data
    .filter((group: any) => (group.stories ? group.stories.length : 0))
    .map((group: any) => ({
      id: group.id,
      title: group.title,
      imageUrl: group.image_url,
      stories: group.stories.map((story: any, index: number) => ({
        id: story.id,
        background: story.story_data.background,
        storyData: adaptWidgets(story.story_data.widgets, story.id, group.id, uniqUserId),
        positionIndex: index
      }))
    }));
