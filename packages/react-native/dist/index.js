'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactNativeWebview = require('react-native-webview');
var reactNative = require('react-native');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var sdkHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\">\n  <meta http-equiv=\"Content-Security-Policy\" content=\"default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: https://ssl.gstatic.com; script-src * 'self' 'unsafe-inline' 'unsafe-eval'; style-src * 'self' 'unsafe-inline'; media-src * blob: 'self' 'unsafe-inline'; img-src * 'self' data: blob:;\">\n  <title>StorySDK</title>\n  <script src=\"https://unpkg.com/react@17/umd/react.production.min.js\" crossorigin></script>\n  <script src=\"https://unpkg.com/react-dom@17/umd/react-dom.production.min.js\" crossorigin></script>\n  <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.css\" />\n  \n  <style>\n    html, body {\n      margin: 0;\n      padding: 0;\n      width: 100%;\n      height: 100%;\n      overflow: hidden;\n      background-color: #f0f0f0;\n    }\n    #storysdk-container {\n      width: 100%;\n      height: 100%;\n    }\n  </style>\n</head>\n<body>\n  <div id=\"storysdk-container\"></div>\n\n  <script>\n    function checkBrowserCompatibility() {\n      const requiredFeatures = {\n        'Promise': typeof Promise !== 'undefined',\n        'fetch': typeof fetch !== 'undefined',\n        'JSON': typeof JSON !== 'undefined',\n        'postMessage': typeof window.postMessage !== 'undefined'\n      };\n\n      const missingFeatures = Object.entries(requiredFeatures)\n        .filter(([_, supported]) => !supported)\n        .map(([feature]) => feature);\n\n      if (missingFeatures.length > 0) {\n        throw new Error(`Browser does not support required features: ${missingFeatures.join(', ')}`);\n      }\n    }\n\n    function debug(message, data) {\n      if (window.STORYSDK_DEBUG) {\n        console.log(message, data);\n      }\n    }\n\n    function postMessageToReactNative(type, data) {\n      if (window.ReactNativeWebView) {\n        const message = {\n          type,\n          data: data || {}\n        };\n        try {\n          window.ReactNativeWebView.postMessage(JSON.stringify(message));\n          debug('Message sent to React Native:', message);\n        } catch (error) {\n          debug('Error sending message to React Native:', error);\n        }\n      }\n    }\n\n    function loadSDKScript(mode) {\n      return new Promise((resolve, reject) => {\n        if (typeof window.Story === 'function') {\n          debug('SDK already loaded');\n          resolve(true);\n          return;\n        }\n\n        let scriptUrl = 'https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.umd.js';\n        \n        if (mode === 'development') {\n          scriptUrl = 'http://localhost:3003/bundle.umd.js';\n        } \n\n        debug('Loading SDK script from:', scriptUrl);\n        \n        const script = document.createElement('script');\n        script.onerror = (error) => {\n          const errorDetails = {\n            message: 'Failed to load SDK script',\n            details: error.message || 'Unknown error'\n          };\n          postMessageToReactNative('error', errorDetails);\n          reject(error);\n        };\n        \n        script.onload = () => {\n          if (typeof window.Story === 'function') {\n            resolve(true);\n          } else {\n            const errorDetails = {\n              message: 'Story constructor not available after script load'\n            };\n            postMessageToReactNative('error', errorDetails);\n            reject(new Error('Story constructor not available after script load'));\n          }\n        };\n        \n        script.crossOrigin = 'anonymous';\n        script.src = scriptUrl;\n        document.head.appendChild(script);\n      });\n    }\n\n    async function initSDK(options) {\n      try {\n        window.STORYSDK_DEBUG = options.isDebugMode || false;\n        debug('Starting SDK initialization');\n        \n        checkBrowserCompatibility();\n\n        if (!options || !options.token) {\n          throw new Error('SDK token not specified');\n        }\n\n        const loaded = await loadSDKScript(options.devMode);\n        if (!loaded) {\n          throw new Error('Failed to load SDK');\n        }\n        \n        const safeOptions = {\n          token: options.token,\n          ...options,\n          isInReactNativeWebView: true,\n          devMode: 'production'\n        };\n\n        postMessageToReactNative('init', safeOptions);\n\n        if (typeof window.Story !== 'function') {\n          throw new Error('Story constructor not available');\n        }\n        \n        const storySDK = new window.Story(safeOptions.token, safeOptions);\n\n        const container = document.getElementById('storysdk-container');\n        if (!container) {\n          throw new Error('Container not found');\n        }\n\n        storySDK.renderGroups(container);\n    \n        const events = [\n          'groupClose',\n          'groupOpen',\n          'storyClose',\n          'storyOpen',\n          'storyNext',\n          'storyPrev',\n          'widgetAnswer',\n          'widgetClick',\n          'storyModalOpen',\n          'storyModalClose',\n          'groupClick'\n        ];\n\n        events.forEach(eventName => {\n          storySDK.on(eventName, (data) => {\n            debug(`Event ${eventName}:`, data);\n            postMessageToReactNative(eventName, data);\n          });\n        });\n\n        postMessageToReactNative('init:success', { \n          message: 'StorySDK initialized successfully'\n        });\n      } catch (error) {\n        debug('SDK initialization error:', error);\n        \n        postMessageToReactNative('error', { \n          message: 'Failed to initialize SDK',\n          details: error.message\n        });\n      }\n    }\n\n    window.addEventListener('message', function(event) {\n      try {\n        const message = JSON.parse(event.data);\n        debug('Message received:', message);\n        \n        if (message.type === 'init') {\n          const options = JSON.parse(message.options);\n        \n          initSDK(options);\n        }\n      } catch (error) {\n        debug('Error processing message:', error);\n        postMessageToReactNative('error', { \n          message: 'Error processing message',\n          details: error.message\n        });\n      }\n    });\n\n    window.addEventListener('DOMContentLoaded', function() {\n      postMessageToReactNative('webview:ready', {\n        protocol: window.location.protocol,\n        userAgent: navigator.userAgent\n      });\n    });\n    \n    if (document.readyState === 'interactive' || document.readyState === 'complete') {\n      postMessageToReactNative('webview:ready', {\n        protocol: window.location.protocol,\n        userAgent: navigator.userAgent\n      });\n    }\n  </script>\n</body>\n</html> ";

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var isPlainObj = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};

const isOptionObject = isPlainObj;

const {hasOwnProperty} = Object.prototype;
const {propertyIsEnumerable} = Object;
const defineProperty = (object, name, value) => Object.defineProperty(object, name, {
	value,
	writable: true,
	enumerable: true,
	configurable: true
});

const globalThis$1 = commonjsGlobal;
const defaultMergeOptions = {
	concatArrays: false,
	ignoreUndefined: false
};

const getEnumerableOwnPropertyKeys = value => {
	const keys = [];

	for (const key in value) {
		if (hasOwnProperty.call(value, key)) {
			keys.push(key);
		}
	}

	/* istanbul ignore else  */
	if (Object.getOwnPropertySymbols) {
		const symbols = Object.getOwnPropertySymbols(value);

		for (const symbol of symbols) {
			if (propertyIsEnumerable.call(value, symbol)) {
				keys.push(symbol);
			}
		}
	}

	return keys;
};

function clone(value) {
	if (Array.isArray(value)) {
		return cloneArray(value);
	}

	if (isOptionObject(value)) {
		return cloneOptionObject(value);
	}

	return value;
}

function cloneArray(array) {
	const result = array.slice(0, 0);

	getEnumerableOwnPropertyKeys(array).forEach(key => {
		defineProperty(result, key, clone(array[key]));
	});

	return result;
}

function cloneOptionObject(object) {
	const result = Object.getPrototypeOf(object) === null ? Object.create(null) : {};

	getEnumerableOwnPropertyKeys(object).forEach(key => {
		defineProperty(result, key, clone(object[key]));
	});

	return result;
}

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {string[]} keys keys to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 */
const mergeKeys = (merged, source, keys, config) => {
	keys.forEach(key => {
		if (typeof source[key] === 'undefined' && config.ignoreUndefined) {
			return;
		}

		// Do not recurse into prototype chain of merged
		if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
			defineProperty(merged, key, merge$1(merged[key], source[key], config));
		} else {
			defineProperty(merged, key, clone(source[key]));
		}
	});

	return merged;
};

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 *
 * see [Array.prototype.concat ( ...arguments )](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat)
 */
const concatArrays = (merged, source, config) => {
	let result = merged.slice(0, 0);
	let resultIndex = 0;

	[merged, source].forEach(array => {
		const indices = [];

		// `result.concat(array)` with cloning
		for (let k = 0; k < array.length; k++) {
			if (!hasOwnProperty.call(array, k)) {
				continue;
			}

			indices.push(String(k));

			if (array === merged) {
				// Already cloned
				defineProperty(result, resultIndex++, array[k]);
			} else {
				defineProperty(result, resultIndex++, clone(array[k]));
			}
		}

		// Merge non-index keys
		result = mergeKeys(result, array, getEnumerableOwnPropertyKeys(array).filter(key => !indices.includes(key)), config);
	});

	return result;
};

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 */
function merge$1(merged, source, config) {
	if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
		return concatArrays(merged, source, config);
	}

	if (!isOptionObject(source) || !isOptionObject(merged)) {
		return clone(source);
	}

	return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
}

var mergeOptions = function (...options) {
	const config = merge$1(clone(defaultMergeOptions), (this !== globalThis$1 && this) || {}, defaultMergeOptions);
	let merged = {_: {}};

	for (const option of options) {
		if (option === undefined) {
			continue;
		}

		if (!isOptionObject(option)) {
			throw new TypeError('`' + option + '` is not an Option Object');
		}

		merged = merge$1(merged, {_: option}, config);
	}

	return merged._;
};

// eslint-disable-next-line @typescript-eslint/ban-types

// eslint-disable-next-line @typescript-eslint/ban-types

const merge = mergeOptions.bind({
  concatArrays: true,
  ignoreUndefined: true
});
function mergeLocalStorageItem(key, value) {
  const oldValue = window.localStorage.getItem(key);
  if (oldValue) {
    const oldObject = JSON.parse(oldValue);
    const newObject = JSON.parse(value);
    const nextValue = JSON.stringify(merge(oldObject, newObject));
    window.localStorage.setItem(key, nextValue);
  } else {
    window.localStorage.setItem(key, value);
  }
}
function createPromise(getValue, callback) {
  return new Promise((resolve, reject) => {
    try {
      const value = getValue();
      callback?.(null, value);
      resolve(value);
    } catch (err) {
      callback?.(err);
      reject(err);
    }
  });
}
function createPromiseAll(promises, callback, processResult) {
  return Promise.all(promises).then(result => {
    const value = processResult?.(result) ?? null;
    callback?.(null, value);
    return Promise.resolve(value);
  }, errors => {
    callback?.(errors);
    return Promise.reject(errors);
  });
}
const AsyncStorage = {
  /**
   * Fetches `key` value.
   */
  getItem: (key, callback) => {
    return createPromise(() => window.localStorage.getItem(key), callback);
  },
  /**
   * Sets `value` for `key`.
   */
  setItem: (key, value, callback) => {
    return createPromise(() => window.localStorage.setItem(key, value), callback);
  },
  /**
   * Removes a `key`
   */
  removeItem: (key, callback) => {
    return createPromise(() => window.localStorage.removeItem(key), callback);
  },
  /**
   * Merges existing value with input value, assuming they are stringified JSON.
   */
  mergeItem: (key, value, callback) => {
    return createPromise(() => mergeLocalStorageItem(key, value), callback);
  },
  /**
   * Erases *all* AsyncStorage for the domain.
   */
  clear: callback => {
    return createPromise(() => window.localStorage.clear(), callback);
  },
  /**
   * Gets *all* keys known to the app, for all callers, libraries, etc.
   */
  getAllKeys: callback => {
    return createPromise(() => {
      const numberOfKeys = window.localStorage.length;
      const keys = [];
      for (let i = 0; i < numberOfKeys; i += 1) {
        const key = window.localStorage.key(i) || "";
        keys.push(key);
      }
      return keys;
    }, callback);
  },
  /**
   * (stub) Flushes any pending requests using a single batch call to get the data.
   */
  flushGetRequests: () => undefined,
  /**
   * multiGet resolves to an array of key-value pair arrays that matches the
   * input format of multiSet.
   *
   *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
   */
  multiGet: (keys, callback) => {
    const promises = keys.map(key => AsyncStorage.getItem(key));
    const processResult = result => result.map((value, i) => [keys[i], value]);
    return createPromiseAll(promises, callback, processResult);
  },
  /**
   * Takes an array of key-value array pairs.
   *   multiSet([['k1', 'val1'], ['k2', 'val2']])
   */
  multiSet: (keyValuePairs, callback) => {
    const promises = keyValuePairs.map(item => AsyncStorage.setItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  },
  /**
   * Delete all the keys in the `keys` array.
   */
  multiRemove: (keys, callback) => {
    const promises = keys.map(key => AsyncStorage.removeItem(key));
    return createPromiseAll(promises, callback);
  },
  /**
   * Takes an array of key-value array pairs and merges them with existing
   * values, assuming they are stringified JSON.
   *
   *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
   */
  multiMerge: (keyValuePairs, callback) => {
    const promises = keyValuePairs.map(item => AsyncStorage.mergeItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  }
};

// In-memory fallback storage when AsyncStorage is not available
var memoryStorage = {};
// Safe AsyncStorage wrapper
var SafeStorage = {
    getItem: function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!AsyncStorage) {
                            return [2 /*return*/, memoryStorage[key] || null];
                        }
                        if (typeof AsyncStorage.getItem !== 'function') {
                            return [2 /*return*/, memoryStorage[key] || null];
                        }
                        return [4 /*yield*/, AsyncStorage.getItem(key)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, memoryStorage[key] || null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    setItem: function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!AsyncStorage) {
                            memoryStorage[key] = value;
                            return [2 /*return*/, true];
                        }
                        if (typeof AsyncStorage.setItem !== 'function') {
                            memoryStorage[key] = value;
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, AsyncStorage.setItem(key, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        _a.sent();
                        memoryStorage[key] = value;
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
/**
 * Class for handling storage messages between WebView and React Native
 */
var StorageHandler = /** @class */ (function () {
    function StorageHandler() {
    }
    /**
     * Safe get item - uses AsyncStorage if available, falls back to memory storage
     */
    StorageHandler.safeGetItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var safeKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        safeKey = key.includes('[object Promise]')
                            ? key.replace('[object Promise]', 'UnresolvedPromise')
                            : key;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, SafeStorage.getItem(safeKey)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, memoryStorage[safeKey] || null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Safe set item - uses AsyncStorage if available, falls back to memory storage
     */
    StorageHandler.safeSetItem = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var safeKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        safeKey = key.includes('[object Promise]')
                            ? key.replace('[object Promise]', 'UnresolvedPromise')
                            : key;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, SafeStorage.setItem(safeKey, value)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        _a.sent();
                        // Try to fall back to memory storage
                        try {
                            memoryStorage[safeKey] = value;
                        }
                        catch (memoryError) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handles incoming messages from WebView related to storage
     * @param message Message from WebView
     * @param sendResponse Function to send a response back to WebView
     * @returns true if the message was handled, false otherwise
     */
    StorageHandler.handleMessage = function (message, sendResponse) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedMessage, key, value, parsedValue, error_5, _a, key, value, stringValue, success, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
                        if (!(parsedMessage.type === 'storysdk:storage:get')) return [3 /*break*/, 4];
                        key = parsedMessage.data.key;
                        if (!key) {
                            return [2 /*return*/, false];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.safeGetItem(key)];
                    case 2:
                        value = _b.sent();
                        parsedValue = null;
                        if (value !== null) {
                            try {
                                parsedValue = JSON.parse(value);
                            }
                            catch (_c) {
                                // If failed to parse JSON, use the value as is
                                parsedValue = value;
                            }
                        }
                        sendResponse(JSON.stringify({
                            type: 'storysdk:storage:response',
                            data: {
                                key: key,
                                value: parsedValue
                            }
                        }));
                        return [2 /*return*/, true];
                    case 3:
                        error_5 = _b.sent();
                        sendResponse(JSON.stringify({
                            type: 'storysdk:storage:response',
                            data: {
                                key: key,
                                value: null,
                                error: error_5 instanceof Error ? error_5.message : 'Unknown error'
                            }
                        }));
                        return [2 /*return*/, true];
                    case 4:
                        if (!(parsedMessage.type === 'storysdk:storage:set')) return [3 /*break*/, 8];
                        _a = parsedMessage.data, key = _a.key, value = _a.value;
                        if (!key) {
                            return [2 /*return*/, false];
                        }
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                        return [4 /*yield*/, this.safeSetItem(key, stringValue)];
                    case 6:
                        success = _b.sent();
                        sendResponse(JSON.stringify({
                            type: 'storysdk:storage:response',
                            data: {
                                key: key,
                                success: success
                            }
                        }));
                        return [2 /*return*/, true];
                    case 7:
                        error_6 = _b.sent();
                        sendResponse(JSON.stringify({
                            type: 'storysdk:storage:response',
                            data: {
                                key: key,
                                success: false,
                                error: error_6 instanceof Error ? error_6.message : 'Unknown error'
                            }
                        }));
                        return [2 /*return*/, true];
                    case 8: return [2 /*return*/, false];
                    case 9:
                        _b.sent();
                        return [2 /*return*/, false];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return StorageHandler;
}());

/**
 * Component for displaying a list of story groups
 * Uses WebView to render the groups and handles group click events
 */
var StoryGroups = function (_a) {
    var token = _a.token, onGroupClick = _a.onGroupClick, groupImageWidth = _a.groupImageWidth, groupImageHeight = _a.groupImageHeight, groupTitleSize = _a.groupTitleSize, groupClassName = _a.groupClassName, groupsClassName = _a.groupsClassName, activeGroupOutlineColor = _a.activeGroupOutlineColor, groupsOutlineColor = _a.groupsOutlineColor, arrowsColor = _a.arrowsColor, backgroundColor = _a.backgroundColor, isDebugMode = _a.isDebugMode, devMode = _a.devMode, onError = _a.onError, onEvent = _a.onEvent;
    var webViewRef = React.useRef(null);
    var _b = React.useState(false), isReady = _b[0], setIsReady = _b[1];
    React.useEffect(function () {
        if (webViewRef.current && isReady) {
            var options = {
                token: token,
                groupImageWidth: groupImageWidth,
                groupImageHeight: groupImageHeight,
                groupTitleSize: groupTitleSize,
                groupClassName: groupClassName,
                groupsClassName: groupsClassName,
                activeGroupOutlineColor: activeGroupOutlineColor,
                groupsOutlineColor: groupsOutlineColor,
                arrowsColor: arrowsColor,
                backgroundColor: backgroundColor,
                isDebugMode: isDebugMode,
                preventCloseOnGroupClick: true,
                isInReactNativeWebView: true,
                devMode: devMode
            };
            var message = {
                type: 'init',
                options: JSON.stringify(options),
            };
            webViewRef.current.postMessage(JSON.stringify(message));
        }
    }, [token, groupImageWidth, groupImageHeight, groupTitleSize, groupClassName, groupsClassName, activeGroupOutlineColor, groupsOutlineColor, arrowsColor, backgroundColor, isDebugMode, devMode, isReady]);
    var handleMessage = function (event) {
        try {
            var data = JSON.parse(event.nativeEvent.data);
            if (onEvent) {
                onEvent(data.type, data.data);
            }
            // Processing storage messages
            if (data.type === 'storysdk:storage:get' || data.type === 'storysdk:storage:set') {
                StorageHandler.handleMessage(data, function (response) {
                    if (webViewRef.current) {
                        webViewRef.current.injectJavaScript("\n              (function() {\n                window.dispatchEvent(new MessageEvent('message', { data: ".concat(JSON.stringify(response), " }));\n                true;\n              })();\n            "));
                    }
                });
                return;
            }
            // Processing story group click
            if (data.type === 'groupClick' && onGroupClick) {
                onGroupClick(data.data.groupId);
            }
            else if (data.type === 'webview:ready') {
                setIsReady(true);
            }
            else if (data.type === 'error') {
                if (onError) {
                    onError(data);
                }
            }
        }
        catch (error) {
            if (onError) {
                onError({ message: 'Error parsing message' });
            }
        }
    };
    var handleWebViewError = function (syntheticEvent) {
        var nativeEvent = syntheticEvent.nativeEvent;
        if (onError) {
            onError({ message: 'WebView error', details: nativeEvent.description });
        }
    };
    return (React__default["default"].createElement(reactNative.View, { style: [styles$1.container, backgroundColor ? { backgroundColor: backgroundColor } : null] },
        React__default["default"].createElement(reactNativeWebview.WebView, { ref: webViewRef, source: { html: sdkHtml }, onMessage: handleMessage, onError: handleWebViewError, style: styles$1.webview, allowsInlineMediaPlayback: true })));
};
var styles$1 = reactNative.StyleSheet.create({
    container: {
        flex: 1,
        height: 120,
    },
    webview: {
        flex: 1,
    },
});

/**
 * Component for displaying stories in a modal window
 * Uses WebView to render stories and handles modal close events
 */
var StoryModal = function (_a) {
    var token = _a.token, groupId = _a.groupId, onClose = _a.onClose, storyWidth = _a.storyWidth, storyHeight = _a.storyHeight, isShowMockup = _a.isShowMockup, isShowLabel = _a.isShowLabel, isStatusBarActive = _a.isStatusBarActive, arrowsColor = _a.arrowsColor, backgroundColor = _a.backgroundColor, isDebugMode = _a.isDebugMode, devMode = _a.devMode, _b = _a.autoplay, autoplay = _b === void 0 ? true : _b, onError = _a.onError, onEvent = _a.onEvent;
    var webViewRef = React.useRef(null);
    var _c = React.useState(false), isReady = _c[0], setIsReady = _c[1];
    var _d = React.useState(true), isLoading = _d[0], setIsLoading = _d[1];
    React.useEffect(function () {
        if (groupId) {
            setIsReady(false);
            setIsLoading(true);
        }
    }, [groupId]);
    React.useEffect(function () {
        if (webViewRef.current && groupId && isReady) {
            var options = {
                token: token,
                groupId: groupId,
                storyWidth: storyWidth,
                storyHeight: storyHeight,
                isShowMockup: isShowMockup,
                isShowLabel: isShowLabel,
                isStatusBarActive: isStatusBarActive,
                autoplay: autoplay,
                arrowsColor: arrowsColor,
                backgroundColor: backgroundColor,
                isDebugMode: isDebugMode,
                devMode: devMode,
                isInReactNativeWebView: true
            };
            var message = {
                type: 'init',
                options: JSON.stringify(options),
            };
            webViewRef.current.postMessage(JSON.stringify(message));
        }
    }, [token, groupId, storyWidth, storyHeight, isShowMockup, isShowLabel, isStatusBarActive, arrowsColor, backgroundColor, isDebugMode, devMode, isReady]);
    var handleMessage = function (event) {
        try {
            var data = JSON.parse(event.nativeEvent.data);
            // Processing storage messages
            if (data.type === 'storysdk:storage:get' || data.type === 'storysdk:storage:set') {
                StorageHandler.handleMessage(data, function (response) {
                    if (webViewRef.current) {
                        webViewRef.current.injectJavaScript("\n              (function() {\n                window.dispatchEvent(new MessageEvent('message', { data: ".concat(JSON.stringify(response), " }));\n                true;\n              })();\n            "));
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
            }
            else if (data.type === 'storyModalClose' && onClose) {
                onClose();
            }
            else if (data.type === 'error') {
                setIsLoading(false);
                if (onError) {
                    onError(data);
                }
            }
            else if (data.type === 'init:success') {
                setIsLoading(false);
            }
        }
        catch (error) {
            if (onError) {
                onError({ message: 'Error parsing message' });
            }
        }
    };
    var handleWebViewError = function (syntheticEvent) {
        var nativeEvent = syntheticEvent.nativeEvent;
        setIsLoading(false);
        if (onError) {
            onError({ message: 'WebView error', details: nativeEvent.description });
        }
    };
    if (!groupId) {
        return null;
    }
    return (React__default["default"].createElement(reactNative.Modal, { visible: !!groupId, transparent: true, animationType: "fade", onRequestClose: function () { }, style: { backgroundColor: backgroundColor } },
        React__default["default"].createElement(reactNative.View, { style: styles.modalContainer },
            React__default["default"].createElement(reactNative.View, { style: styles.webviewContainer },
                React__default["default"].createElement(reactNativeWebview.WebView, { ref: webViewRef, source: { html: sdkHtml }, onMessage: handleMessage, onError: handleWebViewError, style: [styles.webview, isLoading && styles.hiddenWebView], javaScriptEnabled: true, domStorageEnabled: true, allowsInlineMediaPlayback: true, mediaPlaybackRequiresUserAction: false, originWhitelist: ['*'], mixedContentMode: "always", onContentProcessDidTerminate: function () {
                        var _a;
                        (_a = webViewRef.current) === null || _a === void 0 ? void 0 : _a.reload();
                    } })))));
};
var styles = reactNative.StyleSheet.create({
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

exports.StorageHandler = StorageHandler;
exports.StoryGroups = StoryGroups;
exports.StoryModal = StoryModal;
//# sourceMappingURL=index.js.map
