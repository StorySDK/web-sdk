import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
import sdkHtml from './sdk.html';
import { StorageHandler } from './StorageHandler';

interface StoryGroupsProps {
  token: string;
  onGroupClick?: (groupId: string) => void;
  groupImageWidth?: number;
  groupImageHeight?: number;
  groupTitleSize?: number;
  groupClassName?: string;
  groupsClassName?: string;
  activeGroupOutlineColor?: string;
  groupsOutlineColor?: string;
  arrowsColor?: string;
  backgroundColor?: string;
  isDebugMode?: boolean;
  devMode?: 'staging' | 'development';
  onError?: (error: { message: string, details?: string }) => void;
  onEvent?: (event: string, data: any) => void;
}

/**
 * Component for displaying a list of story groups
 * Uses WebView to render the groups and handles group click events
 */
export const StoryGroups: React.FC<StoryGroupsProps> = ({
  token,
  onGroupClick,
  groupImageWidth,
  groupImageHeight,
  groupTitleSize,
  groupClassName,
  groupsClassName,
  activeGroupOutlineColor,
  groupsOutlineColor,
  arrowsColor,
  backgroundColor,
  isDebugMode,
  devMode,
  onError,
  onEvent,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (webViewRef.current && isReady) {
      const options = {
        token,
        groupImageWidth,
        groupImageHeight,
        groupTitleSize,
        groupClassName,
        groupsClassName,
        activeGroupOutlineColor,
        groupsOutlineColor,
        arrowsColor,
        backgroundColor,
        isDebugMode,
        preventCloseOnGroupClick: true,
        isInReactNativeWebView: true,
        devMode
      };

      const message = {
        type: 'init',
        options: JSON.stringify(options),
      };

      webViewRef.current.postMessage(JSON.stringify(message));
    }
  }, [token, groupImageWidth, groupImageHeight, groupTitleSize, groupClassName, groupsClassName, activeGroupOutlineColor, groupsOutlineColor, arrowsColor, backgroundColor, isDebugMode, devMode, isReady]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (onEvent) {
        onEvent(data.type, data.data);
      }

      // Processing storage messages
      if (data.type === 'storysdk:storage:get' || data.type === 'storysdk:storage:set') {
        StorageHandler.handleMessage(data, (response) => {
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`
              (function() {
                window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(response)} }));
                true;
              })();
            `);
          }
        });
        return;
      }

      // Processing story group click
      if (data.type === 'groupClick' && onGroupClick) {
        onGroupClick(data.data.groupId);
      } else if (data.type === 'webview:ready') {
        setIsReady(true);
      } else if (data.type === 'error') {
        if (onError) {
          onError(data);
        }
      }
    } catch (error) {
      if (onError) {
        onError({ message: 'Error parsing message' });
      }
    }
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    if (onError) {
      onError({ message: 'WebView error', details: nativeEvent.description });
    }
  };

  return (
    <View style={[styles.container, backgroundColor ? { backgroundColor } : null]}>
      <WebView
        ref={webViewRef}
        source={{ html: sdkHtml }}
        onMessage={handleMessage}
        onError={handleWebViewError}
        style={styles.webview}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 120,
  },
  webview: {
    flex: 1,
  },

}); 