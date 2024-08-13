import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { GroupsList } from '@storysdk/react';
import withGroupsData from './hocs/withGroupsData';
import '@storysdk/react/dist/bundle.css';

export class Story {
  token: string;

  options?: {
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupTitleSize?: number;
    groupClassName?: string;
    groupsClassName?: string;
    storyWidth?: number;
    storyHeight?: number;
    isShowMockup?: boolean;
    isStatusBarActive?: boolean;
    autoplay?: boolean;
    groupId?: string;
    startStoryId?: string;
    forbidClose?: boolean;
    openInExternalModal?: boolean;
    devMode?: 'staging' | 'development';
  };

  constructor(
    token: string,
    options?: {
      groupImageWidth?: number;
      groupImageHeight?: number;
      groupTitleSize?: number;
      groupClassName?: string;
      groupsClassName?: string;
      storyWidth?: number;
      storyHeight?: number;
      isShowMockup?: boolean;
      isStatusBarActive?: boolean;
      autoplay?: boolean;
      groupId?: string;
      startStoryId?: string;
      forbidClose?: boolean;
      openInExternalModal?: boolean;
      devMode?: 'staging' | 'development';
    }
  ) {
    this.token = token;
    this.options = {};

    if (this.options) {
      this.options.groupImageWidth = options?.groupImageWidth;
      this.options.groupImageHeight = options?.groupImageHeight;
      this.options.groupTitleSize = options?.groupTitleSize;
      this.options.groupClassName = options?.groupClassName;
      this.options.groupsClassName = options?.groupsClassName;
      this.options.autoplay = options?.autoplay;
      this.options.groupId = options?.groupId;
      this.options.isShowMockup = options?.isShowMockup;
      this.options.isStatusBarActive = options?.isStatusBarActive;
      this.options.storyWidth = options?.storyWidth;
      this.options.storyHeight = options?.storyHeight;
      this.options.forbidClose = options?.forbidClose;
      this.options.startStoryId = options?.startStoryId;
      this.options.openInExternalModal = options?.openInExternalModal;
      this.options.devMode = options?.devMode;
    }

    let reqUrl = 'https://api.storysdk.com/sdk/v1';

    if (options?.devMode === 'staging') {
      reqUrl = 'https://api.diffapp.link/sdk/v1';
    } else if (options?.devMode === 'development') {
      reqUrl = 'http://localhost:8080/sdk/v1';
    }

    axios.defaults.baseURL = reqUrl;

    if (token) {
      axios.defaults.headers.common = { Authorization: `SDK ${token}` };
    }
  }

  renderGroups(element?: Element | HTMLDivElement | null) {
    if (!this.token) {
      if (element) {
        ReactDOM.render(<p>StorySDK has not been initialized.</p>, element);
      } else {
        console.warn('StorySDK has not been initialized.');
      }

      return;
    }

    const Groups = withGroupsData(GroupsList, this.options);

    if (element) {
      ReactDOM.render(<Groups />, element);
    }
  }
}

export const init = () => {
  if (!window) return;

  window.onload = () => {
    const container = document.querySelector('[data-storysdk-token]');
    if (container) {
      const token = container.getAttribute('data-storysdk-token');

      if (token) {
        const groupImageWidth = container.getAttribute('data-storysdk-group-image-width');
        const groupImageHeight = container.getAttribute('data-storysdk-group-image-height');
        const groupTitleSize = container.getAttribute('data-storysdk-group-title-size');
        const groupClassName = container.getAttribute('data-storysdk-group-class-name');
        const groupsClassName = container.getAttribute('data-storysdk-groups-class-name');
        const autoplay = container.getAttribute('data-storysdk-autoplay');
        const groupId = container.getAttribute('data-storysdk-group-id');
        const startStoryId = container.getAttribute('data-storysdk-start-story-id');
        const forbidClose = container.getAttribute('data-storysdk-forbid-close');
        const storyWidth = container.getAttribute('data-storysdk-story-width');
        const storyHeight = container.getAttribute('data-storysdk-story-height');
        const isShowMockup = container.getAttribute('data-storysdk-is-show-mockup');
        const isStatusBarActive = container.getAttribute('data-storysdk-is-status-bar-active');
        const devMode = container.getAttribute('data-storysdk-dev-mode');
        const openInExternalModal = container.getAttribute('data-storysdk-open-in-external-modal');

        const story = new Story(token, {
          groupImageWidth: groupImageWidth ? parseInt(groupImageWidth, 10) : undefined,
          groupImageHeight: groupImageHeight ? parseInt(groupImageHeight, 10) : undefined,
          groupTitleSize: groupTitleSize ? parseInt(groupTitleSize, 10) : undefined,
          groupClassName: groupClassName ?? undefined,
          groupsClassName: groupsClassName ?? undefined,
          autoplay: autoplay === 'true',
          groupId: groupId ?? undefined,
          startStoryId: startStoryId ?? undefined,
          forbidClose: forbidClose === 'true',
          devMode: devMode as 'staging' | 'development',
          storyWidth: storyWidth ? parseInt(storyWidth, 10) : undefined,
          storyHeight: storyHeight ? parseInt(storyHeight, 10) : undefined,
          isShowMockup: isShowMockup === 'true',
          isStatusBarActive: isStatusBarActive === 'true',
          openInExternalModal: openInExternalModal === 'true'
        });
        story.renderGroups(container);
      } else {
        console.warn('StorySDK: wrong app token');
      }
    } else {
      console.warn('StorySDK: container not found.');
    }
  };
};
