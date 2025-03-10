import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { GroupsList } from '@storysdk/react';
import EventEmitter from './EventEmitter';
import withGroupsData from './hocs/withGroupsData';
import '@storysdk/react/dist/bundle.css';
import { StoryEventTypes } from './types';

declare global {
  interface Window {
    storysdk?: Story;
  }
}

/**
 * Main Story class for StorySDK
 */
export class Story extends EventEmitter {
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
    isShowLabel?: boolean;
    arrowsColor?: string;
    backgroundColor?: string;
    isStatusBarActive?: boolean;
    autoplay?: boolean;
    groupId?: string;
    isDebugMode?: boolean;
    startStoryId?: string;
    forbidClose?: boolean;
    activeGroupOutlineColor?: string;
    groupsOutlineColor?: string;
    openInExternalModal?: boolean;
    devMode?: 'staging' | 'development';
  };

  container?: Element | HTMLDivElement | null;

  eventHandlers: { [key: string]: ((data: any) => void)[] };

  constructor(
    token: string,
    options?: {
      isDebugMode?: boolean;
      groupImageWidth?: number;
      groupImageHeight?: number;
      activeGroupOutlineColor?: string;
      groupsOutlineColor?: string;
      groupTitleSize?: number;
      groupClassName?: string;
      groupsClassName?: string;
      arrowsColor?: string;
      backgroundColor?: string;
      storyWidth?: number;
      storyHeight?: number;
      isShowMockup?: boolean;
      isShowLabel?: boolean;
      isStatusBarActive?: boolean;
      autoplay?: boolean;
      groupId?: string;
      startStoryId?: string;
      forbidClose?: boolean;
      openInExternalModal?: boolean;
      devMode?: 'staging' | 'development';
    }
  ) {
    super();
    this.token = token;
    this.options = {};
    this.container = null;
    this.eventHandlers = {};

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
      this.options.isShowLabel = options?.isShowLabel;
      this.options.isDebugMode = options?.isDebugMode;
      this.options.activeGroupOutlineColor = options?.activeGroupOutlineColor;
      this.options.groupsOutlineColor = options?.groupsOutlineColor;
      this.options.arrowsColor = options?.arrowsColor;
      this.options.backgroundColor = options?.backgroundColor;
    }

    let reqUrl = 'https://api.storysdk.com/sdk/v1';

    if (options?.devMode === 'staging') {
      reqUrl = 'https://api.diffapp.link/sdk/v1';
    } else if (options?.devMode === 'development') {
      reqUrl = 'http://localhost:8080/sdk/v1';
    }

    axios.defaults.baseURL = reqUrl;

    if (options?.isDebugMode) {
      const debugContainer = document.querySelector('#storysdk-debug');

      axios.interceptors.request.use((request) => {
        console.log('StorySDK - Starting Request to', request.url);
        console.log('StorySDK - Request Headers:', request.headers);

        if (debugContainer) {
          const debugElement = document.createElement('pre');
          debugElement.innerHTML = `Starting Request to: ${
            request.url
          }\nRequest Headers: ${JSON.stringify(request.headers, null, 2)}`;
          debugContainer.appendChild(debugElement);
        }

        return request;
      });

      axios.interceptors.response.use(
        (response) => {
          console.log('StorySDK - Response Status:', response.status);
          console.log('StorySDK - Response Headers:', response.headers);

          if (debugContainer) {
            const debugElement = document.createElement('pre');
            debugElement.innerHTML = `Response Status: ${
              response.status
            }\nResponse Headers: ${JSON.stringify(response.headers, null, 2)}`;
            debugContainer.appendChild(debugElement);
          }
          return response;
        },
        (error) => {
          console.error('StorySDK - Response Error:', error);

          if (debugContainer) {
            const debugElement = document.createElement('pre');
            debugElement.innerHTML = `Response Error: ${error}`;
            debugContainer.appendChild(debugElement);
          }
          return Promise.reject(error);
        }
      );
    }

    if (token) {
      axios.defaults.headers.common = { Authorization: `SDK ${token}` };
    }
  }

  // * Set up event listeners for story interactions
  // * @private
  // * @param element Container element
  // */
  private setupEventListeners(element: Element | HTMLDivElement): void {
    element.addEventListener('storysdk:widget:click', (event) => {
      this.emit(StoryEventTypes.WIDGET_CLICK, event);
    });

    element.addEventListener('storysdk:widget:answer', (event) => {
      this.emit(StoryEventTypes.WINDGET_ANSWER, event);
    });

    element.addEventListener('storysdk:group:open', (event) => {
      this.emit(StoryEventTypes.GROUP_OPEN, event);
    });

    element.addEventListener('storysdk:group:close', (event) => {
      this.emit(StoryEventTypes.GROUP_CLOSE, event);
    });

    element.addEventListener('storysdk:story:open', (event) => {
      this.emit(StoryEventTypes.STORY_OPEN, event);
    });

    element.addEventListener('storysdk:story:close', (event) => {
      this.emit(StoryEventTypes.STORY_CLOSE, event);
    });

    element.addEventListener('storysdk:story:next', (event) => {
      this.emit(StoryEventTypes.STORY_NEXT, event);
    });

    element.addEventListener('storysdk:story:prev', (event) => {
      this.emit(StoryEventTypes.STORY_PREV, event);
    });
  }

  renderGroups(container?: Element | HTMLDivElement | null) {
    if (container) {
      this.container = container;
    }

    if (!this.token) {
      if (container) {
        ReactDOM.render(<p>StorySDK has not been initialized.</p>, container);
      } else {
        console.warn('StorySDK has not been initialized.');
      }

      return;
    }

    const Groups = withGroupsData(GroupsList, this.options, container);

    if (container) {
      ReactDOM.render(<Groups />, container);
      this.setupEventListeners(container);
    }
  }

  destroy() {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
      const modalRoot = document.getElementById('storysdk-modal-root');

      if (modalRoot) {
        ReactDOM.unmountComponentAtNode(modalRoot);
      }
    }
  }
}

export const init = () => {
  if (!window) return;

  const initStorySDK = () => {
    const container = document.querySelector('[data-storysdk-token]');
    if (container) {
      const token = container.getAttribute('data-storysdk-token');

      if (token) {
        const groupImageWidth = container.getAttribute('data-storysdk-group-image-width');
        const groupImageHeight = container.getAttribute('data-storysdk-group-image-height');
        const groupTitleSize = container.getAttribute('data-storysdk-group-title-size');
        const groupClassName = container.getAttribute('data-storysdk-group-class-name');
        const activeGroupOutlineColor = container.getAttribute(
          'data-storysdk-active-group-outline-color'
        );
        const groupsOutlineColor = container.getAttribute('data-storysdk-groups-outline-color');
        const groupsClassName = container.getAttribute('data-storysdk-groups-class-name');
        const autoplay = container.getAttribute('data-storysdk-autoplay');
        const groupId = container.getAttribute('data-storysdk-group-id');
        const startStoryId = container.getAttribute('data-storysdk-start-story-id');
        const forbidClose = container.getAttribute('data-storysdk-forbid-close');
        const storyWidth = container.getAttribute('data-storysdk-story-width');
        const storyHeight = container.getAttribute('data-storysdk-story-height');
        const isShowMockup = container.getAttribute('data-storysdk-is-show-mockup');
        const isShowLabel = container.getAttribute('data-storysdk-is-show-label');
        const isStatusBarActive = container.getAttribute('data-storysdk-is-status-bar-active');
        const devMode = container.getAttribute('data-storysdk-dev-mode');
        const openInExternalModal = container.getAttribute('data-storysdk-open-in-external-modal');
        const isDebugMode = container.getAttribute('data-storysdk-is-debug-mode');
        const arrowsColor = container.getAttribute('data-storysdk-arrows-color');
        const backgroundColor = container.getAttribute('data-storysdk-background-color');

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
          isShowLabel: isShowLabel === 'true',
          isStatusBarActive: isStatusBarActive === 'true',
          openInExternalModal: openInExternalModal === 'true',
          isDebugMode: isDebugMode === 'true',
          activeGroupOutlineColor: activeGroupOutlineColor ?? undefined,
          groupsOutlineColor: groupsOutlineColor ?? undefined,
          arrowsColor: arrowsColor ?? undefined,
          backgroundColor: backgroundColor ?? undefined
        });
        story.renderGroups(container);
        window.storysdk = story;
      } else {
        console.warn('StorySDK: wrong app token');
      }
    } else {
      console.warn('StorySDK: container not found.');
    }
  };

  window.onload = () => {
    initStorySDK();
  };
};
