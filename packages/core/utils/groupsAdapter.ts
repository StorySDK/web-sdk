import { WidgetsTypes } from '@storysdk/react';
import { API } from '../services';

const answerWidgets = [
  WidgetsTypes.CHOOSE_ANSWER,
  WidgetsTypes.EMOJI_REACTION,
  WidgetsTypes.TALK_ABOUT,
  WidgetsTypes.QUESTION,
  WidgetsTypes.SLIDER,
  WidgetsTypes.QUIZ_ONE_ANSWER,
  WidgetsTypes.QUIZ_OPEN_ANSWER,
  WidgetsTypes.QUIZ_RATE,
  WidgetsTypes.QUIZ_MULTIPLE_ANSWERS,
  WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE
];

const clickWidgets = [WidgetsTypes.CLICK_ME, WidgetsTypes.SWIPE_UP];

const actionToWidget = (
  widget: any,
  storyId: string,
  groupId: string,
  uniqUserId: string,
  language: string
) => {
  if (answerWidgets.includes(widget.content.type)) {
    return (answer: string) =>
      API.statistics.widgets.answer.onAnswer({
        widgetId: widget.id as string,
        storyId,
        groupId,
        uniqUserId,
        answer,
        language
      });
  }

  if (clickWidgets.includes(widget.content.type)) {
    return () =>
      API.statistics.widgets.click.onClick({
        widgetId: widget.id as string,
        storyId,
        groupId,
        uniqUserId,
        url: widget.content.params.url,
        language
      });
  }

  return undefined;
};

const adaptWidgets = (
  widgets: any,
  storyId: string,
  groupId: string,
  uniqUserId: string,
  language: string,
  useAlternativePosition?: boolean
) =>
  widgets.map((widget: any) => {
    const newWidget = JSON.parse(JSON.stringify(widget));

    if (useAlternativePosition && newWidget.position.alternative) {
      newWidget.position.x = newWidget.position.alternative.x;
      newWidget.position.y = newWidget.position.alternative.y;
    }

    return {
      ...newWidget,
      action: actionToWidget(newWidget, storyId, groupId, uniqUserId, language)
    };
  });

export const adaptGroupData = (
  data: any,
  uniqUserId: string,
  language: string,
  isMobile?: boolean
) =>
  data
    .filter((group: any) => (group.stories ? group.stories.length : 0))
    .map((group: any) => ({
      id: group.id,
      title: group.title,
      imageUrl: group.image_url,
      type: group.type,
      settings: group.settings,
      stories: group.stories.map((story: any, index: number) => ({
        id: story.id,
        background: story.story_data.background,
        storyData: adaptWidgets(
          story.story_data.widgets,
          story.id,
          group.id,
          uniqUserId,
          language,
          group.settings?.storiesSize === 'LARGE' && isMobile
        ),
        layerData: story.layer_data,
        positionIndex: index,
        position: story.position
      }))
    }));
