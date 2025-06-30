import axios from 'axios';
import { writeToDebug } from './writeToDebug';

export interface AxiosConfigOptions {
  devMode?: 'staging' | 'development';
  isDebugMode?: boolean;
  token?: string;
}

/**
 * Ensures axios is properly configured with baseURL and Authorization header
 */
export const ensureAxiosConfig = (options: AxiosConfigOptions = {}) => {
  const { devMode, isDebugMode, token } = options;

  // Check and set baseURL if needed
  if (!axios.defaults.baseURL || axios.defaults.baseURL === 'undefined') {
    let reqUrl = 'https://api.storysdk.com/sdk/v1';

    if (devMode === 'staging') {
      reqUrl = 'https://api.diffapp.link/sdk/v1';
    } else if (devMode === 'development') {
      reqUrl = 'http://localhost:8080/sdk/v1';
    }

    axios.defaults.baseURL = reqUrl;

    if (isDebugMode) {
      writeToDebug(`StorySDK - axios baseURL configured: ${reqUrl}`);
    }
  }

  // Check and set Authorization header if needed
  if (token && (!axios.defaults.headers.common?.Authorization || axios.defaults.headers.common.Authorization === 'SDK undefined')) {
    axios.defaults.headers.common = {
      ...axios.defaults.headers.common,
      Authorization: `SDK ${token}`
    };

    if (isDebugMode) {
      writeToDebug(`StorySDK - Authorization header configured for token: ${token.substring(0, 8)}...`);
    }
  }

  // Validate final configuration
  const isValid = axios.defaults.baseURL &&
    axios.defaults.baseURL !== 'undefined' &&
    axios.defaults.headers.common?.Authorization;

  if (!isValid) {
    const errorMsg = `StorySDK - Invalid axios configuration detected:
      baseURL: ${axios.defaults.baseURL}
      Authorization: ${axios.defaults.headers.common?.Authorization}`;

    if (isDebugMode) {
      writeToDebug(errorMsg);
    }
    console.warn(errorMsg);
    return false;
  }

  return true;
};

/**
 * Gets current axios configuration for debugging
 */
export const getAxiosConfigDebugInfo = () => {
  return {
    baseURL: axios.defaults.baseURL,
    hasAuthorization: !!axios.defaults.headers.common?.Authorization,
    authorizationPrefix: axios.defaults.headers.common?.Authorization?.substring(0, 10),
  };
}; 