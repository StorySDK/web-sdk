import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { GroupsList } from '@storysdk/react';
import withGroupsData from './hocs/withGroupsData';
import '@storysdk/react/dist/bundle.css';

export class Story {
  token: string;

  groupClassName?: string;

  groupsClassName?: string;

  constructor(token: string, groupClassName?: string, groupsClassName?: string) {
    this.token = token;
    this.groupClassName = groupClassName;
    this.groupsClassName = groupsClassName;

    axios.defaults.baseURL = 'https://api.diffapp.link/api/v1';

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
      this.token,
      this.groupClassName,
      this.groupsClassName
    );

    if (element) {
      ReactDOM.render(<Groups />, element);
    }
  }
}
