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
