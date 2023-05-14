import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { GroupsList } from '@storysdk/react';
import withGroupsData from './hocs/withGroupsData';
import '@storysdk/react/dist/bundle.css';

export class Story {
  token: string;

  groupImageWidth?: number;

  groupImageHeight?: number;

  groupTitleSize?: number;

  groupClassName?: string;

  groupsClassName?: string;

  devMode?: boolean;

  constructor(
    token: string,
    groupImageWidth?: number,
    groupImageHeight?: number,
    groupTitleSize?: number,
    groupClassName?: string,
    groupsClassName?: string,
    devMode?: boolean
  ) {
    this.token = token;
    this.groupImageWidth = groupImageWidth;
    this.groupImageHeight = groupImageHeight;
    this.groupTitleSize = groupTitleSize;
    this.groupClassName = groupClassName;
    this.groupsClassName = groupsClassName;
    this.devMode = devMode;

    axios.defaults.baseURL = devMode
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

    const Groups = withGroupsData(
      GroupsList,
      this.groupImageWidth,
      this.groupImageHeight,
      this.groupTitleSize,
      this.groupClassName,
      this.groupsClassName
    );

    if (element) {
      ReactDOM.render(<Groups />, element);
    }
  }
}
