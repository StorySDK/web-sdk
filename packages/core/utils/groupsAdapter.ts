import { WidgetsTypes } from '@storysdk/types';
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
  WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE,
];

export const DEFAULT_STORY_DURATION = 7;

const clickWidgets = [WidgetsTypes.CLICK_ME, WidgetsTypes.SWIPE_UP, WidgetsTypes.LINK];

const actionToWidget = (
  widget: any,
  storyId: string,
  groupId: string,
  uniqUserId: string,
  language: string,
) => {
  if (answerWidgets.includes(widget.content.type)) {
    return (answer: string) => API.statistics.widgets.answer.onAnswer({
      widgetId: widget.id as string,
      storyId,
      groupId,
      uniqUserId,
      answer,
      language,
    });
  }

  if (clickWidgets.includes(widget.content.type)) {
    return () => API.statistics.widgets.click.onClick({
      widgetId: widget.id as string,
      storyId,
      groupId,
      uniqUserId,
      url: widget.content.params.url,
      language,
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
  useAlternativePosition?: boolean,
) => widgets.map((widget: any) => {
  const newWidget = JSON.parse(JSON.stringify(widget));

  if (useAlternativePosition && newWidget.position.alternative) {
    newWidget.position.x = newWidget.position.alternative.x;
    newWidget.position.y = newWidget.position.alternative.y;
  }

  return {
    ...newWidget,
    action: actionToWidget(newWidget, storyId, groupId, uniqUserId, language),
  };
});

export const getStoryDuration = (story: any) => {
  let duration = DEFAULT_STORY_DURATION;

  if (
    story.story_data.background.type === 'video'
    && story.story_data.background.metadata?.duration
    && story.story_data.background.metadata.duration > duration
  ) {
    duration = story.story_data.background.metadata.duration;
  }

  story.story_data.widgets.forEach((widget: any) => {
    if (
      widget.content.type === WidgetsTypes.RECTANGLE
      && widget.content.params.fillColor.type === 'video'
      && widget.content.params.fillColor.metadata?.duration
      && widget.content.params.fillColor.metadata.duration > duration
    ) {
      duration = widget.content.params.fillColor.metadata.duration;
    } else if (
      widget.content.type === WidgetsTypes.VIDEO
      && widget.content.params.metadata?.duration
      && widget.content.params.metadata.duration > duration
    ) {
      duration = widget.content.params.metadata.duration;
    }
  });

  return duration;
};

export const adaptGroupData = (
  data: any,
  uniqUserId: string,
  language: string,
  isMobile?: boolean,
  isOnlyGroups?: boolean,
) => data
  .filter((group: any) => (group.stories ? group.stories.length : 0) || isOnlyGroups)
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
        group.settings?.storiesSize === 'LARGE' && isMobile,
      ),
      layerData: { ...story.layer_data, duration: getStoryDuration(story) },
      positionIndex: index,
      position: story.position,
    })),
  }));
