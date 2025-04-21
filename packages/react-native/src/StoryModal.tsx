import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Modal } from 'react-native';
import sdkHtml from './sdk.html';
import { StorageHandler } from './StorageHandler';

interface StoryModalProps {
  token: string;
  groupId?: string;
  onClose?: () => void;
  storyWidth?: number;
  storyHeight?: number;
  isShowMockup?: boolean;
  isShowLabel?: boolean;
  isStatusBarActive?: boolean;
  arrowsColor?: string;
  backgroundColor?: string;
  isDebugMode?: boolean;
  devMode?: 'staging' | 'development';
  groupImageWidth?: number;
  groupImageHeight?: number;
  groupTitleSize?: number;
  groupClassName?: string;
  groupsClassName?: string;
  forbidClose?: boolean;
  autoplay?: boolean;
  onError?: (error: { message: string, details?: string }) => void;
  onEvent?: (event: string, data: any) => void;
}

/**
 * Component for displaying stories in a modal window
 * Uses WebView to render stories and handles modal close events
 */
export const StoryModal: React.FC<StoryModalProps> = ({
  token,
  groupId,
  onClose,
  storyWidth,
  storyHeight,
  isShowMockup,
  isShowLabel,
  isStatusBarActive,
  arrowsColor,
  backgroundColor,
  isDebugMode,
  devMode,
  autoplay = true,
  onError,
  onEvent,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      setIsReady(false);
      setIsLoading(true);
    }
  }, [groupId]);

  useEffect(() => {
    if (webViewRef.current && groupId && isReady) {
      const options = {
        token,
        groupId,
        storyWidth,
        storyHeight,
        isShowMockup,
        isShowLabel,
        isStatusBarActive,
        autoplay,
        arrowsColor,
        backgroundColor,
        isDebugMode,
        devMode,
        isInReactNativeWebView: true
      };

      const message = {
        type: 'init',
        options: JSON.stringify(options),
      };

      webViewRef.current.postMessage(JSON.stringify(message));
    }
  }, [token, groupId, storyWidth, storyHeight, isShowMockup, isShowLabel, isStatusBarActive, arrowsColor, backgroundColor, isDebugMode, devMode, isReady]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

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

      // Processing events
      if (onEvent) {
        onEvent(data.type, data.data);
      }

      if (data.type === 'webview:ready') {
        setIsReady(true);
      } else if (data.type === 'storyModalClose' && onClose) {
        onClose();
      } else if (data.type === 'error') {
        setIsLoading(false);
        if (onError) {
          onError(data);
        }
      } else if (data.type === 'init:success') {
        setIsLoading(false);
      }
    } catch (error) {
      if (onError) {
        onError({ message: 'Error parsing message' });
      }
    }
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setIsLoading(false);

    if (onError) {
      onError({ message: 'WebView error', details: nativeEvent.description });
    }
  };

  if (!groupId) {
    return null;
  }

  return (
    <Modal
      visible={!!groupId}
      transparent={true}
      animationType="fade"
      onRequestClose={() => { }}
      style={{ backgroundColor: backgroundColor }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.webviewContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: sdkHtml }}
            onMessage={handleMessage}
            onError={handleWebViewError}
            style={[styles.webview, isLoading && styles.hiddenWebView]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            mixedContentMode="always"
            onContentProcessDidTerminate={() => {
              webViewRef.current?.reload();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
  },
  hiddenWebView: {
    opacity: 0,
  },
}); 