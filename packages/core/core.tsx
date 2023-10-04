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
    autoplay?: boolean;
    groupId?: string;
    startStoryId?: string;
    forbidClose?: boolean;
    storyWidth?: number;
    storyHeight?: number;
    devMode?: boolean;
  };

  constructor(
    token: string,
    options?: {
      groupImageWidth?: number;
      groupImageHeight?: number;
      groupTitleSize?: number;
      groupClassName?: string;
      groupsClassName?: string;
      autoplay?: boolean;
      groupId?: string;
      startStoryId?: string;
      forbidClose?: boolean;
      storyWidth?: number;
      storyHeight?: number;
      devMode?: boolean;
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
      this.options.forbidClose = options?.forbidClose;
      this.options.startStoryId = options?.startStoryId;
      this.options.storyWidth = options?.storyWidth;
      this.options.storyHeight = options?.storyHeight;
      this.options.devMode = options?.devMode;
    }

    axios.defaults.baseURL = options?.devMode
      ? 'https://api.diffapp.link/sdk/v1'
      : 'https://api.storysdk.com/sdk/v1';

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
        const devMode = container.getAttribute('data-storysdk-dev-mode');
        const storyWidth = container.getAttribute('data-storysdk-story-width');
        const storyHeight = container.getAttribute('data-storysdk-story-height');

        const story = new Story(token, {
          groupImageWidth: groupImageWidth ? parseInt(groupImageWidth, 10) : undefined,
          groupImageHeight: groupImageHeight ? parseInt(groupImageHeight, 10) : undefined,
          groupTitleSize: groupTitleSize ? parseInt(groupTitleSize, 10) : undefined,
          groupClassName: groupClassName ?? undefined,
          groupsClassName: groupsClassName ?? undefined,
          autoplay: autoplay === 'true',
          groupId: groupId ?? undefined,
          startStoryId: startStoryId ?? undefined,
          storyWidth: storyWidth ? parseInt(storyWidth, 10) : undefined,
          storyHeight: storyHeight ? parseInt(storyHeight, 10) : undefined,
          forbidClose: forbidClose === 'true',
          devMode: devMode === 'true'
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
