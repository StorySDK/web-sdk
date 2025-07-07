import React from 'react';
import {
  Group, GroupsDisplayType, GroupStyleSettings, GroupType,
} from '@storysdk/types';
import { CarouselListLoader } from '@components/CarouselList';
import { GroupsList } from '../GroupsList/GroupsList';
import { CarouselList } from '../CarouselList/CarouselList';
import { PreviewWidget } from '../PreviewWidget/PreviewWidget';
import { GroupsListLoader } from '../GroupsList/GroupsListLoader';

export interface GroupsRendererProps {
  groups: Group[];
  isLoading?: boolean;
  widgetId?: string;
  type?: GroupsDisplayType;
  style?: GroupStyleSettings;
  groupImageWidth?: number;
  groupImageHeight?: number;
  groupTitleSize?: number;
  groupsClassName?: string;
  storyWidth?: number;
  storyHeight?: number;
  activeGroupOutlineColor?: string;
  groupsOutlineColor?: string;
  isStatusBarActive?: boolean;
  groupClassName?: string;
  isShowMockup?: boolean;
  isOnlyGroups?: boolean;
  isShowLabel?: boolean;
  token?: string;
  arrowsColor?: string;
  preventCloseOnGroupClick?: boolean;
  isInReactNativeWebView?: boolean;
  autoplay?: boolean;
  startStoryId?: string;
  isForceCloseAvailable?: boolean;
  backgroundColor?: string;
  startGroupId?: string;
  forbidClose?: boolean;
  openInExternalModal?: boolean;
  devMode?: 'staging' | 'development';
  groupView: 'circle' | 'square' | 'bigSquare' | 'rectangle';
  container?: Element | HTMLDivElement | null;
  onOpenGroup?(id: string): void;
  onCloseGroup?(id: string): void;
  onNextStory?(groupId: string, storyId: string): void;
  onPrevStory?(groupId: string, storyId: string): void;
  onCloseStory?(groupId: string, storyId: string, duration: number): void;
  onOpenStory?(groupId: string, storyId: string): void;
  onStartQuiz?(groupId: string, storyId?: string): void;
  onFinishQuiz?(groupId: string, storyId?: string): void;
  onModalOpen?(groupId: string, storyId: string): void;
  onModalClose?(groupId: string, storyId: string): void;
}

// Helper function to find PARENT_GROUP and extract style settings for GroupsList
const getGroupsListStyleSettings = (groups: Group[]) => {
  const parentGroup = groups.find((group) => group.type === GroupType.PARENT_GROUP);
  const style = parentGroup?.settings?.style;

  if (!style) return null;

  return {
    itemStyle: style.itemStyle,
    isShowMockup: style.isShowMockup,
    strokeThickness: style.strokeThickness,
    activeColor: style.activeColor,
    inactiveColor: style.inactiveColor,
    width: style.width,
    height: style.height,
  };
};

// Helper function to extract style settings for CarouselList
const getCarouselStyleSettings = (group: Group) => {
  const style = group?.settings?.style;

  if (!style) return null;

  return {
    titlePosition: style.titlePosition,
    isShowMockup: style.isShowMockup,
  };
};

// Helper function to extract style settings for PreviewWidget
const getPreviewWidgetStyleSettings = (group: Group) => {
  const style = group?.settings?.style;

  if (!style) return null;

  return {
    isShowMockup: style.isShowMockup,
    showTitle: style.showTitle,
    title: style.title,
    position: style.position,
    size: style.size,
    showPlayButton: style.showPlayButton,
    autoplay: style.autoplay,
    allowDragDrop: style.allowDragDrop,
    radius: style.radius,
    border: style.border,
  };
};

export const GroupsRenderer: React.FC<GroupsRendererProps> = (props) => {
  const {
    groups,
    isLoading,
    widgetId,
    type,
    isInReactNativeWebView,
  } = props;

  // Show loader if type is specified and data is still loading
  if (isLoading && type !== GroupsDisplayType.POPVIDEO) {
    if (type === GroupsDisplayType.CAROUSEL) {
      return <CarouselListLoader />;
    }
    return (
      <GroupsListLoader
        isCentered
        isReactNativeWebView={isInReactNativeWebView}
        showSkeleton
      />
    );
  }

  if (groups.length === 0 && !isLoading) {
    return <p>Published groups not found</p>;
  }

  // If no widgetId - render GroupsList with PARENT_GROUP style settings
  if (!widgetId) {
    const groupsListStyle = getGroupsListStyleSettings(groups);
    return <GroupsList {...props} style={groupsListStyle} />;
  }

  // If widgetId is specified, determine group type and render appropriate component
  const groupType = groups.length > 0 ? groups[0].type : null;

  if (!groupType) {
    return null;
  }

  switch (groupType) {
    case GroupType.PARENT_GROUP: {
      const groupsListStyle = getGroupsListStyleSettings(groups);
      return <GroupsList {...props} style={groupsListStyle} />;
    }

    case GroupType.CAROUSEL: {
      const carouselStyle = getCarouselStyleSettings(groups[0]);
      return <CarouselList group={groups[0]} {...props} style={carouselStyle} />;
    }

    case GroupType.PREVIEW_WIDGET: {
      const previewWidgetStyle = getPreviewWidgetStyleSettings(groups[0]);
      return <PreviewWidget {...props} style={previewWidgetStyle} />;
    }

    default: {
      const groupsListStyle = getGroupsListStyleSettings(groups);
      return <GroupsList {...props} style={groupsListStyle} />;
    }
  }
};
