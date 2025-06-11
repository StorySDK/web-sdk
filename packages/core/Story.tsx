import React from 'react';
import axios from 'axios';
import { GroupsList, renderElement, unmountComponent } from '@storysdk/react';
import EventEmitter from './EventEmitter';
import withGroupsData from './hocs/withGroupsData';
import { StoryEventTypes } from './types';
import { writeToDebug } from './utils/writeToDebug';

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
    isOnboarding?: boolean;
    isDebugMode?: boolean;
    startStoryId?: string;
    forbidClose?: boolean;
    activeGroupOutlineColor?: string;
    groupsOutlineColor?: string;
    openInExternalModal?: boolean;
    isOnlyGroups?: boolean;
    devMode?: 'staging' | 'development';
    isInReactNativeWebView?: boolean;
    preventCloseOnGroupClick?: boolean;
    disableCache?: boolean;
  };

  container?: Element | HTMLDivElement | null;

  root: any = null; // For storing reference to root in React 18

  eventHandlers: { [key: string]: ((data: any) => void)[] };

  private listenersSetup: boolean = false; // Флаг для предотвращения дублирования обработчиков

  private isDestroying: boolean = false; // Flag for preventing multiple destroy calls

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
      isOnboarding?: boolean;
      openInExternalModal?: boolean;
      devMode?: 'staging' | 'development';
      isInReactNativeWebView?: boolean;
      preventCloseOnGroupClick?: boolean;
      isOnlyGroups?: boolean;
      disableCache?: boolean;
    },
  ) {
    super();
    this.token = token;
    this.options = {};
    this.container = null;
    this.eventHandlers = {};
    this.eventListeners = [];

    // Reset destroying flag on new instance
    this.isDestroying = false;

    this.isInReactNativeWebView = !!options?.isInReactNativeWebView
      || (typeof window !== 'undefined' && window.ReactNativeWebView !== undefined);

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
      this.options.isOnboarding = options?.isOnboarding;
      this.options.isOnlyGroups = options?.isOnlyGroups;
      this.options.disableCache = options?.disableCache;
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
        if (this.options?.isDebugMode) {
          writeToDebug(`Starting Request to: ${request.url}`);
          writeToDebug(`Request Headers: ${JSON.stringify(request.headers, null, 2)}`);
        }

        if (this.options?.isDebugMode && this.isInReactNativeWebView) {
          this.sendDebugInfoToReactNative('Starting Request', {
            url: request.url,
            headers: request.headers,
          });
        }

        if (debugContainer) {
          const debugElement = document.createElement('pre');
          debugElement.innerHTML = `Starting Request to: ${request.url}
Request Headers: ${JSON.stringify(request.headers, null, 2)}`;
          debugContainer.appendChild(debugElement);
        }

        return request;
      });

      axios.interceptors.response.use(
        (response) => {
          if (this.options?.isDebugMode) {
            writeToDebug(`Response Status: ${response.status}`);
            writeToDebug(`Response Headers: ${JSON.stringify(response.headers, null, 2)}`);
          }

          if (this.options?.isDebugMode && this.isInReactNativeWebView) {
            this.sendDebugInfoToReactNative('Response Received', {
              status: response.status,
              headers: response.headers,
            });
          }

          if (debugContainer) {
            const debugElement = document.createElement('pre');
            debugElement.innerHTML = `Response Status: ${response.status}
Response Headers: ${JSON.stringify(response.headers, null, 2)}`;
            debugContainer.appendChild(debugElement);
          }
          return response;
        },
        (error) => {
          if (this.options?.isDebugMode) {
            writeToDebug(`Response Error: ${error}`);
          }

          if (this.options?.isDebugMode && this.isInReactNativeWebView) {
            this.sendDebugInfoToReactNative('Response Error', { error: String(error) });
          }

          if (debugContainer) {
            const debugElement = document.createElement('pre');
            debugElement.innerHTML = `Response Error: ${error}`;
            debugContainer.appendChild(debugElement);
          }
          return Promise.reject(error);
        },
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
        writeToDebug(`Failed to parse message from React Native WebView: ${e}`);
        this.sendDebugInfoToReactNative('Failed to parse message from React Native WebView', { error: String(e) });
      }
    }
  };

  private sendMessageToReactNative(type: string, data: any) {
    if (this.isInReactNativeWebView
      && typeof window !== 'undefined'
      && window.ReactNativeWebView
      && typeof window.ReactNativeWebView.postMessage === 'function') {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type,
        data,
      }));

      if (this.options?.isDebugMode && type !== 'storysdk:debug:info') {
        writeToDebug(`Sent message to React Native: ${JSON.stringify({ type, data })}`);
        this.sendDebugInfoToReactNative('Sent message to React Native', { type, data });
      }
    }
  }

  /**
   * Sends debug messages to React Native WebView if isInReactNativeWebView and isDebugMode = true
   */
  private sendDebugInfoToReactNative(message: string, data?: any) {
    if (this.isInReactNativeWebView && this.options?.isDebugMode) {
      this.sendMessageToReactNative('storysdk:debug:info', {
        message,
        data,
        timestamp: new Date().toISOString(),
      });
    }
  }

  emit(eventName: StoryEventTypes, data: any) {
    super.emit(eventName, data);

    if (this.isInReactNativeWebView) {
      this.sendMessageToReactNative(eventName, data);
    }
  }

  /**
   * Updates the token and axios headers
   */
  updateToken(newToken: string) {
    if (this.token !== newToken) {
      this.token = newToken;
      if (newToken) {
        axios.defaults.headers.common = { Authorization: `SDK ${newToken}` };
      }
      if (this.options?.isDebugMode) {
        writeToDebug(`Token updated to: ${newToken}`);
        this.sendDebugInfoToReactNative('Token updated', { newToken });
      }
    }
  }

  // * Set up event listeners for story interactions
  // * @private
  // * @param element Container element
  // */
  // Store event listeners for proper cleanup
  private eventListeners: Array<{
    element: Element | HTMLDivElement;
    type: string;
    listener: EventListener;
  }> = [];

  private setupEventListeners(element: Element | HTMLDivElement): void {
    // Предотвращаем дублирование обработчиков событий
    if (this.listenersSetup) {
      return;
    }

    const createListener = (eventType: string, storyEventType: StoryEventTypes) => {
      const listener = (event: Event) => {
        this.emit(storyEventType, (event as CustomEvent).detail || {});
      };
      element.addEventListener(eventType, listener);
      this.eventListeners.push({ element, type: eventType, listener });
    };

    createListener('storysdk:widget:click', StoryEventTypes.WIDGET_CLICK);
    createListener('storysdk:widget:answer', StoryEventTypes.WIDGET_ANSWER);
    createListener('storysdk:group:open', StoryEventTypes.GROUP_OPEN);
    createListener('storysdk:group:close', StoryEventTypes.GROUP_CLOSE);
    createListener('storysdk:story:open', StoryEventTypes.STORY_OPEN);
    createListener('storysdk:story:close', StoryEventTypes.STORY_CLOSE);
    createListener('storysdk:story:next', StoryEventTypes.STORY_NEXT);
    createListener('storysdk:story:prev', StoryEventTypes.STORY_PREV);
    createListener('storysdk:modal:open', StoryEventTypes.MODAL_OPEN);
    createListener('storysdk:modal:close', StoryEventTypes.MODAL_CLOSE);
    createListener('storysdk:group:click', StoryEventTypes.GROUP_CLICK);
    createListener('storysdk:data:loaded', StoryEventTypes.DATA_LOADED);

    this.listenersSetup = true;
  }

  private cleanupEventListeners(): void {
    this.eventListeners.forEach(({ element, type, listener }) => {
      try {
        element.removeEventListener(type, listener);
      } catch (error) {
        if (this.options?.isDebugMode) {
          writeToDebug(`Error removing event listener: ${error}`);
        }
        console.warn('StorySDK: Error removing event listener:', error);
      }
    });
    this.eventListeners = [];
    this.listenersSetup = false;
  }

  renderGroups(container?: Element | HTMLDivElement | null) {
    // Prevent rendering if component is being destroyed
    if (this.isDestroying) {
      return;
    }

    if (container) {
      // If we're switching to a new container, clean up the old one first
      if (this.container && this.container !== container && this.root) {
        try {
          unmountComponent(this.container, this.root);
          this.root = null;
        } catch (error) {
          if (this.options?.isDebugMode) {
            writeToDebug(`Error cleaning up old container: ${error}`);
          }
          console.warn('StorySDK: Error cleaning up old container:', error);
        }
      }

      this.container = container;
      if (!container.classList.contains('storysdk-container')) {
        container.classList.add('storysdk-container');
      }
    }

    // If we already have a root for the same container, no need to create a new one
    // The renderElement function will handle reusing the existing root
    const currentContainer = container || this.container;

    // Additional safety check - ensure container is still in DOM
    if (currentContainer && !document.contains(currentContainer)) {
      if (this.options?.isDebugMode) {
        writeToDebug('Container is no longer in DOM, skipping render');
      }
      return;
    }

    if (!this.token) {
      if (currentContainer && !this.isInReactNativeWebView) {
        this.root = renderElement(<p>StorySDK has not been initialized.</p>, currentContainer);
      } else if (this.options?.isDebugMode) {
        writeToDebug('StorySDK has not been initialized');
      } else {
        console.warn('StorySDK has not been initialized.');
      }

      return;
    }

    const Groups = withGroupsData(
      GroupsList,
      { ...this.options, token: this.token },
      currentContainer,
    );

    if (currentContainer) {
      // Additional check before rendering
      if (this.isDestroying) {
        return;
      }

      this.setupEventListeners(currentContainer);

      try {
        this.root = renderElement(<Groups />, currentContainer);
      } catch (error) {
        if (this.options?.isDebugMode) {
          writeToDebug(`Error during render: ${error}`);
        }
        console.error('StorySDK: Error during render:', error);
      }
    }
  }

  destroy() {
    // Prevent multiple destroy calls
    if (this.isDestroying) {
      return;
    }
    this.isDestroying = true;

    // First, stop rendering if it's in progress
    if (this.container && this.root) {
      try {
        unmountComponent(this.container, this.root);
      } catch (error) {
        if (this.options?.isDebugMode) {
          writeToDebug(`Error during unmount: ${error}`);
        }
        console.warn('StorySDK: Error during unmount:', error);
      }

      // Clear root reference after attempting unmount
      this.root = null;
    }

    // Handle modal root separately
    const modalRoot = document.getElementById('storysdk-modal-root');
    if (modalRoot) {
      try {
        unmountComponent(modalRoot, null);
      } catch (error) {
        if (this.options?.isDebugMode) {
          writeToDebug(`Error during modal unmount: ${error}`);
        }
        console.warn('StorySDK: Error during modal unmount:', error);
      }
    }

    // Remove all event listeners
    this.cleanupEventListeners();

    // Remove React Native WebView event listener
    if (this.isInReactNativeWebView && typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleReactNativeMessage);
    }

    // Clear container reference
    this.container = null;

    // Reset the destroying flag immediately since we're now synchronous
    this.isDestroying = false;
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
          if (typeof writeToDebug === 'function') {
            writeToDebug(`Failed to parse options from URL: ${e}`);
          } else {
            console.warn('StorySDK: Failed to parse options from URL', e);
          }
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
            'data-storysdk-active-group-outline-color',
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
          const isOnboarding = container.getAttribute('data-storysdk-is-onboarding');
          const isOnlyGroups = container.getAttribute('data-storysdk-is-only-groups');
          const disableCache = container.getAttribute('data-storysdk-disable-cache');

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
            isForceCloseAvailable: isForceCloseAvailable === 'true',
            isOnboarding: isOnboarding === 'true',
            isOnlyGroups: isOnlyGroups === 'true',
            disableCache: disableCache === 'true',
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
      } else if (typeof writeToDebug === 'function') {
        writeToDebug('Wrong app token');
      } else {
        console.warn('StorySDK: wrong app token');
      }
    } else if (typeof writeToDebug === 'function') {
      writeToDebug('Container not found');
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
