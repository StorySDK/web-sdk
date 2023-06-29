import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { GroupsList } from '@storysdk/react';
import withGroupsData from './hocs/withGroupsData';
import '@storysdk/react/dist/bundle.css';

export class Story {
  token: string;

  viewOptions?: {
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupTitleSize?: number;
    groupClassName?: string;
    groupsClassName?: string;
  };

  playOptions?: {
    autoplay?: boolean;
    groupId?: string;
    startStoryId?: string;
    forbidClose?: boolean;
    devMode?: boolean;
  };

  constructor(
    token: string,
    viewOptions?: {
      groupImageWidth?: number;
      groupImageHeight?: number;
      groupTitleSize?: number;
      groupClassName?: string;
      groupsClassName?: string;
    },
    playOptions?: {
      autoplay?: boolean;
      groupId?: string;
      startStoryId?: string;
      forbidClose?: boolean;
      devMode?: boolean;
    }
  ) {
    this.token = token;
    this.viewOptions = {};
    this.playOptions = {};

    if (this.viewOptions) {
      this.viewOptions.groupImageWidth = viewOptions?.groupImageWidth;
      this.viewOptions.groupImageHeight = viewOptions?.groupImageHeight;
      this.viewOptions.groupTitleSize = viewOptions?.groupTitleSize;
      this.viewOptions.groupClassName = viewOptions?.groupClassName;
      this.viewOptions.groupsClassName = viewOptions?.groupsClassName;
    }

    if (this.playOptions) {
      this.playOptions.autoplay = playOptions?.autoplay;
      this.playOptions.groupId = playOptions?.groupId;
      this.playOptions.forbidClose = playOptions?.forbidClose;
      this.playOptions.startStoryId = playOptions?.startStoryId;
      this.playOptions.devMode = playOptions?.devMode;
    }

    axios.defaults.baseURL = playOptions?.devMode
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

    const Groups = withGroupsData(GroupsList, this.viewOptions, this.playOptions);

    if (element) {
      ReactDOM.render(<Groups />, element);
    }
  }
}
