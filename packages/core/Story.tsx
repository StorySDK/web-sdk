/* eslint-disable prettier/prettier */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { GroupsList } from '@storysdk/react';
import EventEmitter from './EventEmitter';
import withGroupsData from './hocs/withGroupsData';
import { StoryEventTypes } from './types';

declare global {
  interface Window {
    storysdk?: Story;
    Story?: typeof Story;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * Main Story class for StorySDK
 */
export class Story extends EventEmitter {
  token: string;

  isInReactNativeWebView: boolean;

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
    isForceCloseAvailable?: boolean;
    autoplay?: boolean;
    groupId?: string;
    isDebugMode?: boolean;
    startStoryId?: string;
    forbidClose?: boolean;
    activeGroupOutlineColor?: string;
    groupsOutlineColor?: string;
    openInExternalModal?: boolean;
    devMode?: 'staging' | 'development';
    isInReactNativeWebView?: boolean;
    preventCloseOnGroupClick?: boolean;
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
      isForceCloseAvailable?: boolean;
      isStatusBarActive?: boolean;
      autoplay?: boolean;
      groupId?: string;
      startStoryId?: string;
      forbidClose?: boolean;
      openInExternalModal?: boolean;
      devMode?: 'staging' | 'development';
      isInReactNativeWebView?: boolean;
      preventCloseOnGroupClick?: boolean;
    }
  ) {
    super();
    this.token = token;
    this.options = {};
    this.container = null;
    this.eventHandlers = {};

    this.isInReactNativeWebView = !!options?.isInReactNativeWebView ||
      (typeof window !== 'undefined' && window.ReactNativeWebView !== undefined);

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
      this.options.isInReactNativeWebView = this.isInReactNativeWebView;
      this.options.preventCloseOnGroupClick = options?.preventCloseOnGroupClick;
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

        if (this.options?.isDebugMode && this.isInReactNativeWebView) {
          this.sendDebugInfoToReactNative('Starting Request', {
            url: request.url,
            headers: request.headers
          });
        }

        if (debugContainer) {
          const debugElement = document.createElement('pre');
          debugElement.innerHTML = `Starting Request to: ${request.url
            }\nRequest Headers: ${JSON.stringify(request.headers, null, 2)}`;
          debugContainer.appendChild(debugElement);
        }

        return request;
      });

      axios.interceptors.response.use(
        (response) => {
          console.log('StorySDK - Response Status:', response.status);
          console.log('StorySDK - Response Headers:', response.headers);

          if (this.options?.isDebugMode && this.isInReactNativeWebView) {
            this.sendDebugInfoToReactNative('Response Received', {
              status: response.status,
              headers: response.headers
            });
          }

          if (debugContainer) {
            const debugElement = document.createElement('pre');
            debugElement.innerHTML = `Response Status: ${response.status
              }\nResponse Headers: ${JSON.stringify(response.headers, null, 2)}`;
            debugContainer.appendChild(debugElement);
          }
          return response;
        },
        (error) => {
          console.error('StorySDK - Response Error:', error);

          if (this.options?.isDebugMode && this.isInReactNativeWebView) {
            this.sendDebugInfoToReactNative('Response Error', { error: String(error) });
          }

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

    // Set up message listener for React Native WebView
    if (this.isInReactNativeWebView && typeof window !== 'undefined') {
      window.addEventListener('message', this.handleReactNativeMessage);
    }
  }

  private handleReactNativeMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);

      if (message && message.type && message.type.startsWith('storysdk:')) {
        this.emit(message.type, message.data);
      }
    } catch (e) {
      if (this.options?.isDebugMode) {
        console.warn('StorySDK - Failed to parse message from React Native WebView:', e);
        this.sendDebugInfoToReactNative('Failed to parse message from React Native WebView', { error: String(e) });
      }
    }
  };

  private sendMessageToReactNative(type: string, data: any) {
    if (this.isInReactNativeWebView &&
      typeof window !== 'undefined' &&
      window.ReactNativeWebView &&
      typeof window.ReactNativeWebView.postMessage === 'function') {

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type,
        data
      }));

      if (this.options?.isDebugMode) {
        console.log('StorySDK - Sent message to React Native:', { type, data });
        this.sendDebugInfoToReactNative('Sent message to React Native', { type, data });
      }
    }
  }

  /**
   * Отправляет отладочные сообщения в React Native WebView, если isInReactNativeWebView и isDebugMode = true
   */
  private sendDebugInfoToReactNative(message: string, data?: any) {
    if (this.isInReactNativeWebView && this.options?.isDebugMode) {
      this.sendMessageToReactNative('storysdk:debug:info', {
        message,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  emit(eventName: StoryEventTypes, data: any) {
    super.emit(eventName, data);

    if (this.isInReactNativeWebView) {
      this.sendMessageToReactNative(eventName, data);
    }
  }

  // * Set up event listeners for story interactions
  // * @private
  // * @param element Container element
  // */
  private setupEventListeners(element: Element | HTMLDivElement): void {
    element.addEventListener('storysdk:widget:click', (event) => {
      this.emit(StoryEventTypes.WIDGET_CLICK, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:widget:answer', (event) => {
      this.emit(StoryEventTypes.WINDGET_ANSWER, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:group:open', (event) => {
      this.emit(StoryEventTypes.GROUP_OPEN, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:group:close', (event) => {
      this.emit(StoryEventTypes.GROUP_CLOSE, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:story:open', (event) => {
      this.emit(StoryEventTypes.STORY_OPEN, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:story:close', (event) => {
      this.emit(StoryEventTypes.STORY_CLOSE, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:story:next', (event) => {
      this.emit(StoryEventTypes.STORY_NEXT, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:story:prev', (event) => {
      this.emit(StoryEventTypes.STORY_PREV, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:modal:open', (event) => {
      this.emit(StoryEventTypes.MODAL_OPEN, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:modal:close', (event) => {
      this.emit(StoryEventTypes.MODAL_CLOSE, (event as CustomEvent).detail || {});
    });

    element.addEventListener('storysdk:group:click', (event) => {
      this.emit(StoryEventTypes.GROUP_CLICK, (event as CustomEvent).detail || {});
    });
  }

  renderGroups(container?: Element | HTMLDivElement | null) {
    if (container) {
      this.container = container;
      if (!container.classList.contains('storysdk-container')) {
        container.classList.add('storysdk-container');
      }
    }

    if (!this.token) {
      if (container && !this.isInReactNativeWebView) {
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

    if (this.isInReactNativeWebView && typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleReactNativeMessage);
    }
  }
}

export const init = () => {
  const initStorySDK = () => {
    if (!window) return;

    const isInReactNativeWebView = typeof window !== 'undefined' && window.ReactNativeWebView !== undefined;
    let tokenFromUrl;
    let optionsFromUrl = {};

    if (isInReactNativeWebView) {
      // Try to get token and options from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      tokenFromUrl = urlParams.get('storysdk-token');

      // Parse options from URL if available
      const optionsParam = urlParams.get('storysdk-options');
      if (optionsParam) {
        try {
          optionsFromUrl = JSON.parse(decodeURIComponent(optionsParam));
        } catch (e) {
          console.warn('StorySDK: Failed to parse options from URL', e);
        }
      }
    }

    // First check for container with data attribute
    const container = document.querySelector('[data-storysdk-token]');

    if (container || tokenFromUrl) {
      const token = container?.getAttribute('data-storysdk-token') || tokenFromUrl;

      if (token) {
        // If in container mode, extract attributes
        let storyOptions: any = { isInReactNativeWebView };

        if (container) {
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
          const preventCloseOnGroupClick = container.getAttribute('data-storysdk-prevent-close-on-group-click');
          const isForceCloseAvailable = container.getAttribute('data-storysdk-is-force-close-available');
          storyOptions = {
            ...storyOptions,
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
            backgroundColor: backgroundColor ?? undefined,
            preventCloseOnGroupClick: preventCloseOnGroupClick === 'true',
            isForceCloseAvailable: isForceCloseAvailable === 'true'
          };
        }

        // Merge with options from URL if in WebView mode
        if (isInReactNativeWebView) {
          storyOptions = { ...storyOptions, ...optionsFromUrl };
        }

        const story = new Story(token, storyOptions);

        // If in React Native WebView and no container, create one
        if (isInReactNativeWebView && !container) {
          const newContainer = document.createElement('div');
          newContainer.id = 'storysdk-container';
          newContainer.classList.add('storysdk-container');
          document.body.appendChild(newContainer);
          story.renderGroups(newContainer);
        } else if (container) {
          if (!container.classList.contains('storysdk-container')) {
            container.classList.add('storysdk-container');
          }
          story.renderGroups(container as HTMLDivElement);
        }

        window.storysdk = story;
      } else {
        console.warn('StorySDK: wrong app token');
      }
    } else {
      console.warn('StorySDK: container not found.');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initStorySDK();
    if (window) {
      window.Story = Story;
    }
  });
};