import React, { memo, useMemo, useState, useRef, useCallback, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import require$$1$1 from 'http';
import require$$2 from 'https';
import require$$0$2 from 'url';
import require$$3 from 'stream';
import require$$4 from 'assert';
import require$$0$1 from 'tty';
import require$$1 from 'util';
import require$$0 from 'os';
import require$$8 from 'zlib';
import crypto from 'crypto';

var axios$2 = {exports: {}};

var bind$2 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

var bind$1 = bind$2;

// utils is a library of generic helper functions non-specific to axios

var toString$2 = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray$2(val) {
  return toString$2.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer$2(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString$2.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString$2.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString$2.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString$2.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString$2.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString$2.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray$2(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray$2(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

var utils$e = {
  isArray: isArray$2,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer$2,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

var utils$d = utils$e;

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL$3 = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils$d.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils$d.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils$d.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils$d.forEach(val, function parseValue(v) {
        if (utils$d.isDate(v)) {
          v = v.toISOString();
        } else if (utils$d.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

var utils$c = utils$e;

function InterceptorManager$1() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager$1.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager$1.prototype.forEach = function forEach(fn) {
  utils$c.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager$1;

var global$2 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$2.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$2.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser$1 = true;
var env$1 = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop$1() {}

var on = noop$1;
var addListener = noop$1;
var once = noop$1;
var off = noop$1;
var removeListener = noop$1;
var removeAllListeners = noop$1;
var emit = noop$1;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance$1 = global$2.performance || {};
var performanceNow =
  performance$1.now        ||
  performance$1.mozNow     ||
  performance$1.msNow      ||
  performance$1.oNow       ||
  performance$1.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance$1)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser$1,
  env: env$1,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var utils$b = utils$e;

var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
  utils$b.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError$3 = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};

var enhanceError$2 = enhanceError$3;

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError$3 = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError$2(error, config, code, request, response);
};

var createError$2 = createError$3;

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle$2 = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError$2(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

var utils$a = utils$e;

var cookies$1 = (
  utils$a.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils$a.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils$a.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils$a.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL$1 = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

var isAbsoluteURL = isAbsoluteURL$1;
var combineURLs = combineURLs$1;

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
var buildFullPath$2 = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

var utils$9 = utils$e;

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders$1 = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils$9.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils$9.trim(line.substr(0, i)).toLowerCase();
    val = utils$9.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var utils$8 = utils$e;

var isURLSameOrigin$1 = (
  utils$8.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils$8.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel$4(message) {
  this.message = message;
}

Cancel$4.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel$4.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel$4;

var utils$7 = utils$e;
var settle$1 = settle$2;
var cookies = cookies$1;
var buildURL$2 = buildURL$3;
var buildFullPath$1 = buildFullPath$2;
var parseHeaders = parseHeaders$1;
var isURLSameOrigin = isURLSameOrigin$1;
var createError$1 = createError$3;
var defaults$6 = defaults_1;
var Cancel$3 = Cancel_1;

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils$7.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath$1(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL$2(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle$1(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError$1('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError$1('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || defaults$6.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError$1(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils$7.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$7.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils$7.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel$3('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

var lookup$1 = [];
var revLookup$1 = [];
var Arr$1 = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited$1 = false;
function init$2 () {
  inited$1 = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup$1[i] = code[i];
    revLookup$1[code.charCodeAt(i)] = i;
  }

  revLookup$1['-'.charCodeAt(0)] = 62;
  revLookup$1['_'.charCodeAt(0)] = 63;
}

function toByteArray$1 (b64) {
  if (!inited$1) {
    init$2();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr$1(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup$1[b64.charCodeAt(i)] << 18) | (revLookup$1[b64.charCodeAt(i + 1)] << 12) | (revLookup$1[b64.charCodeAt(i + 2)] << 6) | revLookup$1[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup$1[b64.charCodeAt(i)] << 2) | (revLookup$1[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup$1[b64.charCodeAt(i)] << 10) | (revLookup$1[b64.charCodeAt(i + 1)] << 4) | (revLookup$1[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64$1 (num) {
  return lookup$1[num >> 18 & 0x3F] + lookup$1[num >> 12 & 0x3F] + lookup$1[num >> 6 & 0x3F] + lookup$1[num & 0x3F]
}

function encodeChunk$1 (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64$1(tmp));
  }
  return output.join('')
}

function fromByteArray$1 (uint8) {
  if (!inited$1) {
    init$2();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk$1(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup$1[tmp >> 2];
    output += lookup$1[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup$1[tmp >> 10];
    output += lookup$1[(tmp >> 4) & 0x3F];
    output += lookup$1[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read$1 (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write$1 (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString$1 = {}.toString;

var isArray$1 = Array.isArray || function (arr) {
  return toString$1.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var INSPECT_MAX_BYTES$1 = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer$1.TYPED_ARRAY_SUPPORT = global$2.TYPED_ARRAY_SUPPORT !== undefined
  ? global$2.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength$1 () {
  return Buffer$1.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer$1 (that, length) {
  if (kMaxLength$1() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer$1.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer$1(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer$1 (arg, encodingOrOffset, length) {
  if (!Buffer$1.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$1)) {
    return new Buffer$1(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe$1(this, arg)
  }
  return from$2(this, arg, encodingOrOffset, length)
}

Buffer$1.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer$1._augment = function (arr) {
  arr.__proto__ = Buffer$1.prototype;
  return arr
};

function from$2 (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer$1(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString$1(that, value, encodingOrOffset)
  }

  return fromObject$1(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer$1.from = function (value, encodingOrOffset, length) {
  return from$2(null, value, encodingOrOffset, length)
};

if (Buffer$1.TYPED_ARRAY_SUPPORT) {
  Buffer$1.prototype.__proto__ = Uint8Array.prototype;
  Buffer$1.__proto__ = Uint8Array;
}

function assertSize$1 (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc$1 (that, size, fill, encoding) {
  assertSize$1(size);
  if (size <= 0) {
    return createBuffer$1(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer$1(that, size).fill(fill, encoding)
      : createBuffer$1(that, size).fill(fill)
  }
  return createBuffer$1(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer$1.alloc = function (size, fill, encoding) {
  return alloc$1(null, size, fill, encoding)
};

function allocUnsafe$1 (that, size) {
  assertSize$1(size);
  that = createBuffer$1(that, size < 0 ? 0 : checked$1(size) | 0);
  if (!Buffer$1.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer$1.allocUnsafe = function (size) {
  return allocUnsafe$1(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer$1.allocUnsafeSlow = function (size) {
  return allocUnsafe$1(null, size)
};

function fromString$1 (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer$1.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength$1(string, encoding) | 0;
  that = createBuffer$1(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike$1 (that, array) {
  var length = array.length < 0 ? 0 : checked$1(array.length) | 0;
  that = createBuffer$1(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer$1 (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer$1.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike$1(that, array);
  }
  return that
}

function fromObject$1 (that, obj) {
  if (internalIsBuffer$1(obj)) {
    var len = checked$1(obj.length) | 0;
    that = createBuffer$1(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan$1(obj.length)) {
        return createBuffer$1(that, 0)
      }
      return fromArrayLike$1(that, obj)
    }

    if (obj.type === 'Buffer' && isArray$1(obj.data)) {
      return fromArrayLike$1(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked$1 (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength$1()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength$1().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer$1.isBuffer = isBuffer$1;
function internalIsBuffer$1 (b) {
  return !!(b != null && b._isBuffer)
}

Buffer$1.compare = function compare (a, b) {
  if (!internalIsBuffer$1(a) || !internalIsBuffer$1(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer$1.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer$1.concat = function concat (list, length) {
  if (!isArray$1(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer$1.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer$1.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer$1(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength$1 (string, encoding) {
  if (internalIsBuffer$1(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes$1(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes$1(string).length
      default:
        if (loweredCase) return utf8ToBytes$1(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer$1.byteLength = byteLength$1;

function slowToString$1 (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice$1(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice$1(this, start, end)

      case 'ascii':
        return asciiSlice$1(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice$1(this, start, end)

      case 'base64':
        return base64Slice$1(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice$1(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer$1.prototype._isBuffer = true;

function swap$1 (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer$1.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap$1(this, i, i + 1);
  }
  return this
};

Buffer$1.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap$1(this, i, i + 3);
    swap$1(this, i + 1, i + 2);
  }
  return this
};

Buffer$1.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap$1(this, i, i + 7);
    swap$1(this, i + 1, i + 6);
    swap$1(this, i + 2, i + 5);
    swap$1(this, i + 3, i + 4);
  }
  return this
};

Buffer$1.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice$1(this, 0, length)
  return slowToString$1.apply(this, arguments)
};

Buffer$1.prototype.equals = function equals (b) {
  if (!internalIsBuffer$1(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer$1.compare(this, b) === 0
};

Buffer$1.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES$1;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer$1.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer$1(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf$1 (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer$1.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer$1(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf$1(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer$1.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf$1(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf$1 (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer$1.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer$1.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf$1(this, val, byteOffset, encoding, true)
};

Buffer$1.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf$1(this, val, byteOffset, encoding, false)
};

function hexWrite$1 (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write$1 (buf, string, offset, length) {
  return blitBuffer$1(utf8ToBytes$1(string, buf.length - offset), buf, offset, length)
}

function asciiWrite$1 (buf, string, offset, length) {
  return blitBuffer$1(asciiToBytes$1(string), buf, offset, length)
}

function latin1Write$1 (buf, string, offset, length) {
  return asciiWrite$1(buf, string, offset, length)
}

function base64Write$1 (buf, string, offset, length) {
  return blitBuffer$1(base64ToBytes$1(string), buf, offset, length)
}

function ucs2Write$1 (buf, string, offset, length) {
  return blitBuffer$1(utf16leToBytes$1(string, buf.length - offset), buf, offset, length)
}

Buffer$1.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite$1(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write$1(this, string, offset, length)

      case 'ascii':
        return asciiWrite$1(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write$1(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write$1(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write$1(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer$1.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice$1 (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray$1(buf)
  } else {
    return fromByteArray$1(buf.slice(start, end))
  }
}

function utf8Slice$1 (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray$1(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH$1 = 0x1000;

function decodeCodePointsArray$1 (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH$1) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH$1)
    );
  }
  return res
}

function asciiSlice$1 (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice$1 (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice$1 (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex$1(buf[i]);
  }
  return out
}

function utf16leSlice$1 (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer$1.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer$1.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer$1(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset$1 (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer$1.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset$1(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer$1.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset$1(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer$1.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 1, this.length);
  return this[offset]
};

Buffer$1.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer$1.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer$1.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer$1.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer$1.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset$1(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer$1.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset$1(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer$1.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer$1.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer$1.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer$1.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer$1.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer$1.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 4, this.length);
  return read$1(this, offset, true, 23, 4)
};

Buffer$1.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 4, this.length);
  return read$1(this, offset, false, 23, 4)
};

Buffer$1.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 8, this.length);
  return read$1(this, offset, true, 52, 8)
};

Buffer$1.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset$1(offset, 8, this.length);
  return read$1(this, offset, false, 52, 8)
};

function checkInt$1 (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer$1(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer$1.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt$1(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer$1.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt$1(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer$1.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 1, 0xff, 0);
  if (!Buffer$1.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16$1 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer$1.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 2, 0xffff, 0);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16$1(this, value, offset, true);
  }
  return offset + 2
};

Buffer$1.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 2, 0xffff, 0);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16$1(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32$1 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer$1.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32$1(this, value, offset, true);
  }
  return offset + 4
};

Buffer$1.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32$1(this, value, offset, false);
  }
  return offset + 4
};

Buffer$1.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt$1(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer$1.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt$1(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer$1.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer$1.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer$1.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16$1(this, value, offset, true);
  }
  return offset + 2
};

Buffer$1.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16$1(this, value, offset, false);
  }
  return offset + 2
};

Buffer$1.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32$1(this, value, offset, true);
  }
  return offset + 4
};

Buffer$1.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt$1(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer$1.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32$1(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754$1 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat$1 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754$1(buf, value, offset, 4);
  }
  write$1(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer$1.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat$1(this, value, offset, true, noAssert)
};

Buffer$1.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat$1(this, value, offset, false, noAssert)
};

function writeDouble$1 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754$1(buf, value, offset, 8);
  }
  write$1(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer$1.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble$1(this, value, offset, true, noAssert)
};

Buffer$1.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble$1(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer$1.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer$1.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer$1.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer$1.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer$1(val)
      ? val
      : utf8ToBytes$1(new Buffer$1(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE$1 = /[^+\/0-9A-Za-z-_]/g;

function base64clean$1 (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim$1(str).replace(INVALID_BASE64_RE$1, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim$1 (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex$1 (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes$1 (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes$1 (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes$1 (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes$1 (str) {
  return toByteArray$1(base64clean$1(str))
}

function blitBuffer$1 (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan$1 (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer$1(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer$1(obj) || isSlowBuffer$1(obj))
}

function isFastBuffer$1 (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer$1 (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer$1(obj.slice(0, 0))
}

var followRedirects = {exports: {}};

var src = {exports: {}};

var browser = {exports: {}};

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = ms;
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof browser$1$1 !== 'undefined' && 'env' in browser$1$1) {
		r = browser$1$1.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};
}(browser, browser.exports));

var node = {exports: {}};

var hasFlag$1 = (flag, argv) => {
	argv = argv || browser$1$1.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

const os = require$$0;
const hasFlag = hasFlag$1;

const env = browser$1$1.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (browser$1$1.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(browser$1$1.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(browser$1$1.stdout),
	stderr: getSupportLevel(browser$1$1.stderr)
};

(function (module, exports) {
const tty = require$$0$1;
const util = require$$1;

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = supportsColor_1;

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(browser$1$1.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = browser$1$1.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(browser$1$1.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return browser$1$1.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		browser$1$1.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete browser$1$1.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return browser$1$1.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};
}(node, node.exports));

if (typeof browser$1$1 === 'undefined' || browser$1$1.type === 'renderer' || browser$1$1.browser === true || browser$1$1.__nwjs) {
	src.exports = browser.exports;
} else {
	src.exports = node.exports;
}

var debug$1;

var debug_1 = function () {
  if (!debug$1) {
    try {
      /* eslint global-require: off */
      debug$1 = src.exports("follow-redirects");
    }
    catch (error) { /* */ }
    if (typeof debug$1 !== "function") {
      debug$1 = function () { /* */ };
    }
  }
  debug$1.apply(null, arguments);
};

var url$1 = require$$0$2;
var URL = url$1.URL;
var http$1 = require$$1$1;
var https$1 = require$$2;
var Writable = require$$3.Writable;
var assert = require$$4;
var debug = debug_1;

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  // Destroys the socket on timeout
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Stops a timeout from triggering
  function clearTimer() {
    // Clear the timeout
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }

    // Clean up all attached listeners
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Attach callback if passed
  if (callback) {
    this.on("timeout", callback);
  }

  // Start the timer if or when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  // Clean up on events
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url$1.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var e = 0; e < events.length; e++) {
    request.on(events[e], eventHandlers[events[e]]);
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      statusCode >= 300 && statusCode < 400) {
    // Abort the current request
    abortRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();

    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
        // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }

    // Drop the Host header, as the redirect might lead to a different host
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

    // If the redirect is relative, carry over the host of the last request
    var currentUrlParts = url$1.parse(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
      url$1.format(Object.assign(currentUrlParts, { host: currentHost }));

    // Determine the URL of the redirection
    var redirectUrl;
    try {
      redirectUrl = url$1.resolve(currentUrl, location);
    }
    catch (cause) {
      this.emit("error", new RedirectionError(cause));
      return;
    }

    // Create the redirected request
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url$1.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts);

    // Drop the Authorization header if redirecting to another domain
    if (!(redirectUrlParts.host === currentHost || isSubdomainOf(redirectUrlParts.host, currentHost))) {
      removeMatchingHeaders(/^authorization$/i, this._options.headers);
    }

    // Evaluate the beforeRedirect callback
    if (typeof this._options.beforeRedirect === "function") {
      var responseDetails = { headers: response.headers };
      try {
        this._options.beforeRedirect.call(null, this._options, responseDetails);
      }
      catch (err) {
        this.emit("error", err);
        return;
      }
      this._sanitizeOptions(this._options);
    }

    // Perform the redirected request
    try {
      this._performRequest();
    }
    catch (cause) {
      this.emit("error", new RedirectionError(cause));
    }
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (typeof input === "string") {
        var urlStr = input;
        try {
          input = urlToOptions(new URL(urlStr));
        }
        catch (err) {
          /* istanbul ignore next */
          input = url$1.parse(urlStr);
        }
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (typeof options === "function") {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return (lastValue === null || typeof lastValue === "undefined") ?
    undefined : String(lastValue).trim();
}

function createErrorType(code, defaultMessage) {
  function CustomError(cause) {
    Error.captureStackTrace(this, this.constructor);
    if (!cause) {
      this.message = defaultMessage;
    }
    else {
      this.message = defaultMessage + ": " + cause.message;
      this.cause = cause;
    }
  }
  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

function abortRequest(request) {
  for (var e = 0; e < events.length; e++) {
    request.removeListener(events[e], eventHandlers[events[e]]);
  }
  request.on("error", noop);
  request.abort();
}

function isSubdomainOf(subdomain, domain) {
  const dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}

// Exports
followRedirects.exports = wrap({ http: http$1, https: https$1 });
followRedirects.exports.wrap = wrap;

var data$1 = {
  "version": "0.24.0"
};

var utils$6 = utils$e;
var settle = settle$2;
var buildFullPath = buildFullPath$2;
var buildURL$1 = buildURL$3;
var http = require$$1$1;
var https = require$$2;
var httpFollow = followRedirects.exports.http;
var httpsFollow = followRedirects.exports.https;
var url = require$$0$2;
var zlib = require$$8;
var VERSION$1 = data$1.version;
var createError = createError$3;
var enhanceError$1 = enhanceError$3;
var defaults$5 = defaults_1;
var Cancel$2 = Cancel_1;

var isHttps = /https:?/;

/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */
function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location;

  // Basic proxy authorization
  if (proxy.auth) {
    var base64 = Buffer$1.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  }

  // If a proxy is used, any redirects must also pass through the proxy
  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}

/*eslint consistent-return:0*/
var http_1 = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }
    var resolve = function resolve(value) {
      done();
      resolvePromise(value);
    };
    var reject = function reject(value) {
      done();
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;
    var headerNames = {};

    Object.keys(headers).forEach(function storeLowerName(name) {
      headerNames[name.toLowerCase()] = name;
    });

    // Set User-Agent (required by some servers)
    // See https://github.com/axios/axios/issues/69
    if ('user-agent' in headerNames) {
      // User-Agent is specified; handle case where no UA header is desired
      if (!headers[headerNames['user-agent']]) {
        delete headers[headerNames['user-agent']];
      }
      // Otherwise, use specified value
    } else {
      // Only set header if it hasn't been set in config
      headers['User-Agent'] = 'axios/' + VERSION$1;
    }

    if (data && !utils$6.isStream(data)) {
      if (Buffer$1.isBuffer(data)) ; else if (utils$6.isArrayBuffer(data)) {
        data = Buffer$1.from(new Uint8Array(data));
      } else if (utils$6.isString(data)) {
        data = Buffer$1.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      if (!headerNames['content-length']) {
        headers['Content-Length'] = data.length;
      }
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth && headerNames.authorization) {
      delete headers[headerNames.authorization];
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL$1(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = browser$1$1.env[proxyEnv] || browser$1$1.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = browser$1$1.env.no_proxy || browser$1$1.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    if (config.insecureHTTPParser) {
      options.insecureHTTPParser = config.insecureHTTPParser;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        var totalResponseBytes = 0;
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError$1(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer$1.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils$6.stripBOM(responseData);
            }
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError$1(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      var timeout = parseInt(config.timeout, 10);

      if (isNaN(timeout)) {
        reject(createError(
          'error trying to parse `config.timeout` to int',
          config,
          'ERR_PARSE_TIMEOUT',
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        req.abort();
        var transitional = config.transitional || defaults$5.transitional;
        reject(createError(
          'timeout of ' + timeout + 'ms exceeded',
          config,
          transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          req
        ));
      });
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(!cancel || (cancel && cancel.type) ? new Cancel$2('canceled') : cancel);
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }


    // Send the request
    if (utils$6.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError$1(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};

var utils$5 = utils$e;
var normalizeHeaderName = normalizeHeaderName$1;
var enhanceError = enhanceError$3;

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils$5.isUndefined(headers) && utils$5.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  } else if (typeof browser$1$1 !== 'undefined' && Object.prototype.toString.call(browser$1$1) === '[object process]') {
    // For node use HTTP adapter
    adapter = http_1;
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils$5.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$5.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults$4 = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils$5.isFormData(data) ||
      utils$5.isArrayBuffer(data) ||
      utils$5.isBuffer(data) ||
      utils$5.isStream(data) ||
      utils$5.isFile(data) ||
      utils$5.isBlob(data)
    ) {
      return data;
    }
    if (utils$5.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$5.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils$5.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults$4.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils$5.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils$5.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults$4.headers[method] = {};
});

utils$5.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults$4.headers[method] = utils$5.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults$4;

var utils$4 = utils$e;
var defaults$3 = defaults_1;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData$1 = function transformData(data, headers, fns) {
  var context = this || defaults$3;
  /*eslint no-param-reassign:0*/
  utils$4.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

var isCancel$1 = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var utils$3 = utils$e;
var transformData = transformData$1;
var isCancel = isCancel$1;
var defaults$2 = defaults_1;
var Cancel$1 = Cancel_1;

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel$1('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest$1 = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils$3.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils$3.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults$2.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

var utils$2 = utils$e;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig$2 = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
      return utils$2.merge(target, source);
    } else if (utils$2.isPlainObject(source)) {
      return utils$2.merge({}, source);
    } else if (utils$2.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$2.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils$2.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils$2.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};

var VERSION = data$1.version;

var validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

var validator$1 = {
  assertOptions: assertOptions,
  validators: validators$1
};

var utils$1 = utils$e;
var buildURL = buildURL$3;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
var validator = validator$1;

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios$1(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios$1.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig$1(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios$1.prototype.getUri = function getUri(config) {
  config = mergeConfig$1(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig$1(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var Axios_1 = Axios$1;

var Cancel = Cancel_1;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
var isAxiosError = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

var utils = utils$e;
var bind = bind$2;
var Axios = Axios_1;
var mergeConfig = mergeConfig$2;
var defaults$1 = defaults_1;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios$1 = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios$1.Axios = Axios;

// Expose Cancel & CancelToken
axios$1.Cancel = Cancel_1;
axios$1.CancelToken = CancelToken_1;
axios$1.isCancel = isCancel$1;
axios$1.VERSION = data$1.version;

// Expose all/spread
axios$1.all = function all(promises) {
  return Promise.all(promises);
};
axios$1.spread = spread;

// Expose isAxiosError
axios$1.isAxiosError = isAxiosError;

axios$2.exports = axios$1;

// Allow use of default import syntax in TypeScript
axios$2.exports.default = axios$1;

var axios = axios$2.exports;

// eslint-disable-next-line no-shadow
var WidgetsTypes;
(function (WidgetsTypes) {
    WidgetsTypes["RECTANGLE"] = "rectangle";
    WidgetsTypes["ELLIPSE"] = "ellipse";
    WidgetsTypes["TEXT"] = "text";
    WidgetsTypes["SWIPE_UP"] = "swipe_up";
    WidgetsTypes["SLIDER"] = "slider";
    WidgetsTypes["QUESTION"] = "question";
    WidgetsTypes["CLICK_ME"] = "click_me";
    WidgetsTypes["TALK_ABOUT"] = "talk_about";
    WidgetsTypes["EMOJI_REACTION"] = "emoji_reaction";
    WidgetsTypes["TIMER"] = "timer";
    WidgetsTypes["CHOOSE_ANSWER"] = "choose_answer";
    WidgetsTypes["GIPHY"] = "giphy";
})(WidgetsTypes || (WidgetsTypes = {}));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var lib = {exports: {}};

/*!
 * bem-cn v3.0.1
 * Friendly BEM class names generator, greate for React
 * @author Alexander Burtsev, https://github.com/albburtsev
 */

(function (module, exports) {
!function(n,t){module.exports=t();}(commonjsGlobal,function(){return function(n){var t={};function e(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=n,e.c=t,e.d=function(n,t,r){e.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:r});},e.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0});},e.t=function(n,t){if(1&t&&(n=e(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var o in n)e.d(r,o,function(t){return n[t]}.bind(null,o));return r},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},e.p="",e(e.s=0)}([function(n,t,e){Object.defineProperty(t,"__esModule",{value:!0});var r=e(1);t.ERROR_BLOCK_NAME_TYPE="Block name should be a string",t.ERROR_BLOCK_NAME_EMPTY="Block name should be non-empty";var o={ns:"",el:"__",mod:"_",modValue:"_"},i=function(n){return "string"==typeof n},u=function(n){return "string"!=typeof n},s=function(n,t){for(var e=[],o=2;o<arguments.length;o++)e[o-2]=arguments[o];var i=r.assign({},t);return i.mixes=i.mixes.concat(e),c(i,n)},a=function(n,t,e){for(var o=[],i=3;i<arguments.length;i++)o[i-3]=arguments[i];var u=r.assign({},t),s=r.assign({},u.states||{});return s[e]=r.assign.apply(void 0,[{},s[e]||{}].concat(o)),u.states=s,c(u,n)},l=function(n,t,e,r){return String.prototype.split.call(f(n,t),e,r)},f=function(n,t){var e=t.name,r=t.mods,o=t.mixes,i=t.states,u=[e];if(r&&(u=u.concat(Object.keys(r).filter(function(n){return r[n]}).map(function(t){var o=r[t];return !0===o?e+n.mod+t:e+n.mod+t+n.modValue+o}))),i&&Object.keys(i).forEach(function(n){var t=i[n];u=u.concat(Object.keys(t).filter(function(n){return t[n]}).map(function(t){return n+t}));}),n.ns&&(u=u.map(function(t){return n.ns+t})),o&&(u=u.concat(function(n){return void 0===n&&(n=[]),n.map(function(n){return Array.isArray(n)?n.join(" "):"object"==typeof n&&null!==n?n.toString():"function"==typeof n?n.toString():"string"==typeof n?n:""}).filter(function(n){return !!n})}(o))),n.classMap){var s=n.classMap;u=u.map(function(n){return s[n]||n});}return u.join(" ")},c=function(n,t){return {mix:s.bind(null,t,n),split:l.bind(null,t,n),is:a.bind(null,t,n,"is-"),has:a.bind(null,t,n,"has-"),state:a.bind(null,t,n,"is-"),toString:f.bind(null,t,n)}},d=function(n,t){var e={name:n,mods:{},mixes:[],states:{"is-":{},"has-":{}}},o=function(n,t){for(var e=[],o=2;o<arguments.length;o++)e[o-2]=arguments[o];if(!e.length)return f(n,t);var s=r.assign({},t),a=e.filter(i).reduce(function(t,e){return t+n.el+e},"");a&&(s.name=s.name+a);var l=e.filter(u).reduce(function(n,t){return r.assign(n,t)},{});return s.mods=r.assign({},s.mods,l),c(s,n)}.bind(null,t,e);return o.mix=s.bind(null,t,e),o.split=l.bind(null,t,e),o.is=a.bind(null,t,e,"is-"),o.has=a.bind(null,t,e,"has-"),o.state=a.bind(null,t,e,"is-"),o.toString=f.bind(null,t,e),o};t.setup=function(n){return void 0===n&&(n={}),function(e){if("string"!=typeof e)throw new Error(t.ERROR_BLOCK_NAME_TYPE);var i=e.trim();if(!i)throw new Error(t.ERROR_BLOCK_NAME_EMPTY);return d(i,r.assign({},o,n))}},t.block=t.setup(),t.default=t.block;},function(n,t,e){Object.defineProperty(t,"__esModule",{value:!0}),t.assign=function(n){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e];for(var r=0;r<t.length;r++){var o=t[r];for(var i in o)o.hasOwnProperty(i)&&(n[i]=o[i]);}return n};}])});
}(lib));

var block = /*@__PURE__*/getDefaultExportFromCjs(lib.exports);

const b$i = block('GroupItem');
const GroupItem = (props) => {
    const { imageUrl, size, title, theme, rounded, onClick } = props;
    return (React.createElement("button", { className: b$i(), onClick: onClick },
        React.createElement("div", { className: b$i('imgWrapper') },
            React.createElement("img", { alt: "group", className: b$i('img', { size, rounded }), src: imageUrl })),
        React.createElement("div", { className: b$i('title', { theme }) }, title)));
};

const b$h = block('GroupsList');
const GroupsList = (props) => {
    const { groups, onOpenGroup, onCloseGroup, onNextStory, onPrevStory, onCloseStory, onOpenStory } = props;
    const [currentGroup, setCurrentGroup] = React.useState(0);
    const [modalShow, setModalShow] = React.useState(false);
    const handleSelectGroup = (groupIndex) => () => {
        setCurrentGroup(groupIndex);
        setModalShow(true);
        if (onOpenGroup) {
            onOpenGroup(groups[groupIndex].id);
        }
    };
    const handlePrevGroup = () => {
        if (currentGroup > 0) {
            setCurrentGroup(currentGroup - 1);
            if (onOpenGroup && onCloseGroup) {
                onCloseGroup(groups[currentGroup].id);
                setTimeout(() => {
                    onOpenGroup(groups[currentGroup - 1].id);
                }, 0);
            }
        }
    };
    const handleNextGroup = () => {
        if (currentGroup < groups.length) {
            setCurrentGroup(currentGroup + 1);
            if (onOpenGroup && onCloseGroup) {
                onCloseGroup(groups[currentGroup].id);
                setTimeout(() => {
                    onOpenGroup(groups[currentGroup + 1].id);
                }, 0);
            }
        }
    };
    const handleCloseModal = () => {
        if (onCloseGroup) {
            onCloseGroup(groups[currentGroup].id);
        }
        setModalShow(false);
    };
    return (React.createElement(React.Fragment, null, groups.length ? (React.createElement(React.Fragment, null,
        React.createElement("div", { className: b$h() },
            React.createElement("div", { className: b$h('carousel') }, groups.map((group, index) => {
                if (group.stories.length) {
                    return (React.createElement(GroupItem, { imageUrl: group.imageUrl, key: group.id, rounded: true, size: "lg", theme: "light", title: group.title, onClick: handleSelectGroup(index) }));
                }
                return null;
            }))),
        React.createElement(StoryModal, { currentGroup: groups[currentGroup], isFirstGroup: currentGroup === 0, isLastGroup: currentGroup === groups.length - 1, showed: modalShow, stories: groups[currentGroup].stories, onClose: handleCloseModal, onCloseStory: onCloseStory, onNextGroup: handleNextGroup, onNextStory: onNextStory, onOpenStory: onOpenStory, onPrevGroup: handlePrevGroup, onPrevStory: onPrevStory }))) : (React.createElement("p", null, "No groups to display"))));
};

var u = e=>{var a=useRef(e);return useEffect(()=>{a.current=e;}),a};

var o$1=function(n,o,c){function i(){l.current&&clearTimeout(l.current),l.current=void 0;}function a(){l.current=void 0;}void 0===o&&(o=100),void 0===c&&(c=0);var v=u(n),l=useRef(),m=[o,c,v];return useEffect(()=>i,m),useCallback((function(){var r=arguments,{current:t}=l;if(void 0===t&&c)return l.current=setTimeout(a,o),v.current.apply(null,r);t&&clearTimeout(t),l.current=setTimeout(()=>{l.current=void 0,v.current.apply(null,r);},o);}),m)},c$2=(r,t,e)=>{var u=useState(r);return [u[0],o$1(u[1],t,e)]};

function t$1(t,n,a,u){var c=useRef(a),i=useRef(u);useEffect(()=>{c.current=a,i.current=u;}),useEffect(()=>{function r(){if(!a){for(var r=arguments.length,e=new Array(r),t=0;r>t;t++)e[t]=arguments[t];c.current.apply(this,e);}}var e=t&&"current"in t?t.current:t;if(e){var a=0;e.addEventListener(n,r);var u=i.current;return ()=>{a=1,e.removeEventListener(n,r),u&&u();}}},[t,n]);}

var n$1={},i="undefined"==typeof window?null:window,o=()=>[document.documentElement.clientWidth,document.documentElement.clientHeight],d$1=function(d){void 0===d&&(d=n$1);var{wait:r,leading:c,initialWidth:m=0,initialHeight:u=0}=d,[a,l]=c$2("undefined"==typeof document?[m,u]:o,r,c),f=()=>l(o);return t$1(i,"resize",f),t$1(i,"orientationchange",f),a},c$1=e=>d$1(e)[0];

const b$g = block('StoryModal');
const CloseIcon = () => (React.createElement("svg", { fill: "none", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18.0002 6.00079L6.00024 18.0008", stroke: "#FAFAFA", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.72796" }),
    React.createElement("path", { d: "M6.00024 6.00079L18.0002 18.0008", stroke: "#FAFAFA", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.72796" })));
const LeftArrowIcon = () => (React.createElement("svg", { fill: "none", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M19 12H5", stroke: "#FAFAFA", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" }),
    React.createElement("path", { d: "M12 19L5 12L12 4.99997", stroke: "#FAFAFA", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" })));
const RightArrowIcon = () => (React.createElement("svg", { fill: "none", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M5 12H19", stroke: "#FAFAFA", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" }),
    React.createElement("path", { d: "M12 4.99997L19 12L12 19", stroke: "#FAFAFA", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" })));
const CurrentStoryContext = React.createContext('');
const StoryModal = (props) => {
    const { stories, showed, isLastGroup, isFirstGroup, onClose, onNextGroup, onPrevGroup, onNextStory, onPrevStory, onOpenStory, onCloseStory, currentGroup } = props;
    const [currentStory, setCurrentStory] = React.useState(0);
    const [currentStoryId, setCurrentStoryId] = React.useState(stories[0].id);
    const width = c$1();
    React.useEffect(() => {
        setCurrentStory(0);
        if (onOpenStory && showed) {
            onOpenStory(currentGroup.id, stories[0].id);
        }
    }, [stories.length, onOpenStory, stories, currentGroup, showed]);
    const handleClose = () => {
        onClose();
        if (onCloseStory) {
            onCloseStory(currentGroup.id, stories[currentStory].id);
        }
    };
    const handleAnimationEnd = () => {
        handleNext();
    };
    const handleNext = () => {
        if (currentStory === stories.length - 1) {
            isLastGroup ? handleClose() : onNextGroup();
        }
        else {
            setCurrentStory(currentStory + 1);
            setCurrentStoryId(stories[currentStory + 1].id);
            if (onCloseStory) {
                onCloseStory(currentGroup.id, stories[currentStory].id);
            }
            if (onOpenStory) {
                setTimeout(() => {
                    onOpenStory(currentGroup.id, stories[currentStory + 1].id);
                }, 0);
            }
            if (onNextStory) {
                onNextStory(currentGroup.id, stories[currentStory].id);
            }
        }
    };
    const handlePrev = () => {
        if (currentStory === 0) {
            isFirstGroup ? handleClose() : onPrevGroup();
        }
        else {
            setCurrentStory(currentStory - 1);
            setCurrentStoryId(stories[currentStory - 1].id);
            if (onCloseStory) {
                onCloseStory(currentGroup.id, stories[currentStory].id);
            }
            if (onOpenStory) {
                setTimeout(() => {
                    onOpenStory(currentGroup.id, stories[currentStory - 1].id);
                }, 0);
            }
            if (onPrevStory) {
                onPrevStory(currentGroup.id, stories[currentStory].id);
            }
        }
    };
    return (React.createElement(CurrentStoryContext.Provider, { value: currentStoryId },
        React.createElement("div", { className: b$g({ showed }), style: { height: width < 768 ? Math.round(694 * (width / 390)) : '100%' } },
            React.createElement("div", { className: b$g('body') },
                React.createElement("button", { className: b$g('arrowButton', { left: true }), onClick: handlePrev },
                    React.createElement(LeftArrowIcon, null)),
                React.createElement("div", { className: b$g('swiper') },
                    React.createElement("div", { className: b$g('swiperContent') }, stories.map((story, index) => (React.createElement("div", { className: b$g('story', { current: index === currentStory }), key: story.id },
                        React.createElement(StoryContent, { story: story }))))),
                    React.createElement("div", { className: b$g('controls') },
                        React.createElement("div", { className: b$g('indicators') }, stories.map((story, index) => (React.createElement("div", { className: b$g('indicator', {
                                filled: index < currentStory,
                                current: index === currentStory
                            }), key: story.id, onAnimationEnd: handleAnimationEnd })))),
                        React.createElement("div", { className: b$g('group') },
                            React.createElement("div", { className: b$g('groupImgWrapper') },
                                React.createElement("img", { alt: "", className: b$g('groupImg'), src: currentGroup.imageUrl })),
                            React.createElement("p", { className: b$g('groupTitle') }, currentGroup.title)),
                        React.createElement("button", { className: b$g('close'), onClick: handleClose },
                            React.createElement(CloseIcon, null)))),
                React.createElement("button", { className: b$g('arrowButton', { right: true }), onClick: handleNext },
                    React.createElement(RightArrowIcon, null))))));
};

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  return Constructor;
}

function normalizeComputedStyleValue(string) {
  // "250px" --> 250
  return +string.replace(/px/, '');
}

function fixDPR(canvas) {
  var dpr = window.devicePixelRatio;
  var computedStyles = getComputedStyle(canvas);
  var width = normalizeComputedStyleValue(computedStyles.getPropertyValue('width'));
  var height = normalizeComputedStyleValue(computedStyles.getPropertyValue('height'));
  canvas.setAttribute('width', (width * dpr).toString());
  canvas.setAttribute('height', (height * dpr).toString());
}

function generateRandomNumber(min, max) {
  var fractionDigits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var randomNumber = Math.random() * (max - min) + min;
  return Math.floor(randomNumber * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
}

function generateRandomArrayElement(arr) {
  return arr[generateRandomNumber(0, arr.length)];
}

var FREE_FALLING_OBJECT_ACCELERATION = 0.00125;
var MIN_DRAG_FORCE_COEFFICIENT = 0.0005;
var MAX_DRAG_FORCE_COEFFICIENT = 0.0009;
var ROTATION_SLOWDOWN_ACCELERATION = 0.00001;
var INITIAL_SHAPE_RADIUS = 6;
var INITIAL_EMOJI_SIZE = 80;
var MIN_INITIAL_CONFETTI_SPEED = 0.9;
var MAX_INITIAL_CONFETTI_SPEED = 1.7;
var MIN_FINAL_X_CONFETTI_SPEED = 0.2;
var MAX_FINAL_X_CONFETTI_SPEED = 0.6;
var MIN_INITIAL_ROTATION_SPEED = 0.03;
var MAX_INITIAL_ROTATION_SPEED = 0.07;
var MIN_CONFETTI_ANGLE = 15;
var MAX_CONFETTI_ANGLE = 82;
var MAX_CONFETTI_POSITION_SHIFT = 150;
var SHAPE_VISIBILITY_TRESHOLD = 100;
var DEFAULT_CONFETTI_NUMBER = 250;
var DEFAULT_EMOJIS_NUMBER = 40;
var DEFAULT_CONFETTI_COLORS = ['#fcf403', '#62fc03', '#f4fc03', '#03e7fc', '#03fca5', '#a503fc', '#fc03ad', '#fc03c2'];

function getWindowWidthCoefficient(canvasWidth) {
  var HD_SCREEN_WIDTH = 1920;
  return Math.log(canvasWidth) / Math.log(HD_SCREEN_WIDTH);
}

var ConfettiShape = /*#__PURE__*/function () {
  function ConfettiShape(args) {
    _classCallCheck$1(this, ConfettiShape);

    var initialPosition = args.initialPosition,
        direction = args.direction,
        confettiRadius = args.confettiRadius,
        confettiColors = args.confettiColors,
        emojis = args.emojis,
        emojiSize = args.emojiSize,
        canvasWidth = args.canvasWidth;
    var randomConfettiSpeed = generateRandomNumber(MIN_INITIAL_CONFETTI_SPEED, MAX_INITIAL_CONFETTI_SPEED, 3);
    var initialSpeed = randomConfettiSpeed * getWindowWidthCoefficient(canvasWidth);
    this.confettiSpeed = {
      x: initialSpeed,
      y: initialSpeed
    };
    this.finalConfettiSpeedX = generateRandomNumber(MIN_FINAL_X_CONFETTI_SPEED, MAX_FINAL_X_CONFETTI_SPEED, 3);
    this.rotationSpeed = emojis.length ? 0.01 : generateRandomNumber(MIN_INITIAL_ROTATION_SPEED, MAX_INITIAL_ROTATION_SPEED, 3) * getWindowWidthCoefficient(canvasWidth);
    this.dragForceCoefficient = generateRandomNumber(MIN_DRAG_FORCE_COEFFICIENT, MAX_DRAG_FORCE_COEFFICIENT, 6);
    this.radius = {
      x: confettiRadius,
      y: confettiRadius
    };
    this.initialRadius = confettiRadius;
    this.rotationAngle = direction === 'left' ? generateRandomNumber(0, 0.2, 3) : generateRandomNumber(-0.2, 0, 3);
    this.emojiSize = emojiSize;
    this.emojiRotationAngle = generateRandomNumber(0, 2 * Math.PI);
    this.radiusYUpdateDirection = 'down';
    var angle = direction === 'left' ? generateRandomNumber(MAX_CONFETTI_ANGLE, MIN_CONFETTI_ANGLE) * Math.PI / 180 : generateRandomNumber(-MIN_CONFETTI_ANGLE, -MAX_CONFETTI_ANGLE) * Math.PI / 180;
    this.absCos = Math.abs(Math.cos(angle));
    this.absSin = Math.abs(Math.sin(angle));
    var positionShift = generateRandomNumber(-MAX_CONFETTI_POSITION_SHIFT, 0);
    var shiftedInitialPosition = {
      x: initialPosition.x + (direction === 'left' ? -positionShift : positionShift) * this.absCos,
      y: initialPosition.y - positionShift * this.absSin
    };
    this.currentPosition = Object.assign({}, shiftedInitialPosition);
    this.initialPosition = Object.assign({}, shiftedInitialPosition);
    this.color = emojis.length ? null : generateRandomArrayElement(confettiColors);
    this.emoji = emojis.length ? generateRandomArrayElement(emojis) : null;
    this.createdAt = new Date().getTime();
    this.direction = direction;
  }

  _createClass$1(ConfettiShape, [{
    key: "draw",
    value: function draw(canvasContext) {
      var currentPosition = this.currentPosition,
          radius = this.radius,
          color = this.color,
          emoji = this.emoji,
          rotationAngle = this.rotationAngle,
          emojiRotationAngle = this.emojiRotationAngle,
          emojiSize = this.emojiSize;
      var dpr = window.devicePixelRatio;

      if (color) {
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.ellipse(currentPosition.x * dpr, currentPosition.y * dpr, radius.x * dpr, radius.y * dpr, rotationAngle, 0, 2 * Math.PI);
        canvasContext.fill();
      } else if (emoji) {
        canvasContext.font = "".concat(emojiSize, "px serif");
        canvasContext.save();
        canvasContext.translate(dpr * currentPosition.x, dpr * currentPosition.y);
        canvasContext.rotate(emojiRotationAngle);
        canvasContext.textAlign = 'center';
        canvasContext.fillText(emoji, 0, 0);
        canvasContext.restore();
      }
    }
  }, {
    key: "updatePosition",
    value: function updatePosition(iterationTimeDelta, currentTime) {
      var confettiSpeed = this.confettiSpeed,
          dragForceCoefficient = this.dragForceCoefficient,
          finalConfettiSpeedX = this.finalConfettiSpeedX,
          radiusYUpdateDirection = this.radiusYUpdateDirection,
          rotationSpeed = this.rotationSpeed,
          createdAt = this.createdAt,
          direction = this.direction;
      var timeDeltaSinceCreation = currentTime - createdAt;
      if (confettiSpeed.x > finalConfettiSpeedX) this.confettiSpeed.x -= dragForceCoefficient * iterationTimeDelta;
      this.currentPosition.x += confettiSpeed.x * (direction === 'left' ? -this.absCos : this.absCos) * iterationTimeDelta;
      this.currentPosition.y = this.initialPosition.y - confettiSpeed.y * this.absSin * timeDeltaSinceCreation + FREE_FALLING_OBJECT_ACCELERATION * Math.pow(timeDeltaSinceCreation, 2) / 2;
      this.rotationSpeed -= this.emoji ? 0.0001 : ROTATION_SLOWDOWN_ACCELERATION * iterationTimeDelta;
      if (this.rotationSpeed < 0) this.rotationSpeed = 0; // no need to update rotation radius for emoji

      if (this.emoji) {
        this.emojiRotationAngle += this.rotationSpeed * iterationTimeDelta % (2 * Math.PI);
        return;
      }

      if (radiusYUpdateDirection === 'down') {
        this.radius.y -= iterationTimeDelta * rotationSpeed;

        if (this.radius.y <= 0) {
          this.radius.y = 0;
          this.radiusYUpdateDirection = 'up';
        }
      } else {
        this.radius.y += iterationTimeDelta * rotationSpeed;

        if (this.radius.y >= this.initialRadius) {
          this.radius.y = this.initialRadius;
          this.radiusYUpdateDirection = 'down';
        }
      }
    }
  }, {
    key: "getIsVisibleOnCanvas",
    value: function getIsVisibleOnCanvas(canvasHeight) {
      return this.currentPosition.y < canvasHeight + SHAPE_VISIBILITY_TRESHOLD;
    }
  }]);

  return ConfettiShape;
}();

function createCanvas() {
  var canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1000';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);
  return canvas;
}

function normalizeConfettiConfig(confettiConfig) {
  var _confettiConfig$confe = confettiConfig.confettiRadius,
      confettiRadius = _confettiConfig$confe === void 0 ? INITIAL_SHAPE_RADIUS : _confettiConfig$confe,
      _confettiConfig$confe2 = confettiConfig.confettiNumber,
      confettiNumber = _confettiConfig$confe2 === void 0 ? confettiConfig.confettiesNumber || (confettiConfig.emojis ? DEFAULT_EMOJIS_NUMBER : DEFAULT_CONFETTI_NUMBER) : _confettiConfig$confe2,
      _confettiConfig$confe3 = confettiConfig.confettiColors,
      confettiColors = _confettiConfig$confe3 === void 0 ? DEFAULT_CONFETTI_COLORS : _confettiConfig$confe3,
      _confettiConfig$emoji = confettiConfig.emojis,
      emojis = _confettiConfig$emoji === void 0 ? confettiConfig.emojies || [] : _confettiConfig$emoji,
      _confettiConfig$emoji2 = confettiConfig.emojiSize,
      emojiSize = _confettiConfig$emoji2 === void 0 ? INITIAL_EMOJI_SIZE : _confettiConfig$emoji2; // deprecate wrong plural forms, used in early releases

  if (confettiConfig.emojies) console.error("emojies argument is deprecated, please use emojis instead");
  if (confettiConfig.confettiesNumber) console.error("confettiesNumber argument is deprecated, please use confettiNumber instead");
  return {
    confettiRadius: confettiRadius,
    confettiNumber: confettiNumber,
    confettiColors: confettiColors,
    emojis: emojis,
    emojiSize: emojiSize
  };
}

var ConfettiBatch = /*#__PURE__*/function () {
  function ConfettiBatch(canvasContext) {
    var _this = this;

    _classCallCheck$1(this, ConfettiBatch);

    this.canvasContext = canvasContext;
    this.shapes = [];
    this.promise = new Promise(function (completionCallback) {
      return _this.resolvePromise = completionCallback;
    });
  }

  _createClass$1(ConfettiBatch, [{
    key: "getBatchCompletePromise",
    value: function getBatchCompletePromise() {
      return this.promise;
    }
  }, {
    key: "addShapes",
    value: function addShapes() {
      var _this$shapes;

      (_this$shapes = this.shapes).push.apply(_this$shapes, arguments);
    }
  }, {
    key: "complete",
    value: function complete() {
      var _a;

      if (this.shapes.length) {
        return false;
      }

      (_a = this.resolvePromise) === null || _a === void 0 ? void 0 : _a.call(this);
      return true;
    }
  }, {
    key: "processShapes",
    value: function processShapes(time, canvasHeight, cleanupInvisibleShapes) {
      var _this2 = this;

      var timeDelta = time.timeDelta,
          currentTime = time.currentTime;
      this.shapes = this.shapes.filter(function (shape) {
        // Render the shapes in this batch
        shape.updatePosition(timeDelta, currentTime);
        shape.draw(_this2.canvasContext); // Only cleanup the shapes if we're being asked to

        if (!cleanupInvisibleShapes) {
          return true;
        }

        return shape.getIsVisibleOnCanvas(canvasHeight);
      });
    }
  }]);

  return ConfettiBatch;
}();

var JSConfetti = /*#__PURE__*/function () {
  function JSConfetti() {
    var jsConfettiConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck$1(this, JSConfetti);

    this.activeConfettiBatches = [];
    this.canvas = jsConfettiConfig.canvas || createCanvas();
    this.canvasContext = this.canvas.getContext('2d');
    this.requestAnimationFrameRequested = false;
    this.lastUpdated = new Date().getTime();
    this.iterationIndex = 0;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  _createClass$1(JSConfetti, [{
    key: "loop",
    value: function loop() {
      this.requestAnimationFrameRequested = false;
      fixDPR(this.canvas);
      var currentTime = new Date().getTime();
      var timeDelta = currentTime - this.lastUpdated;
      var canvasHeight = this.canvas.offsetHeight;
      var cleanupInvisibleShapes = this.iterationIndex % 10 === 0;
      this.activeConfettiBatches = this.activeConfettiBatches.filter(function (batch) {
        batch.processShapes({
          timeDelta: timeDelta,
          currentTime: currentTime
        }, canvasHeight, cleanupInvisibleShapes); // Do not remove invisible shapes on every iteration

        if (!cleanupInvisibleShapes) {
          return true;
        }

        return !batch.complete();
      });
      this.iterationIndex++;
      this.queueAnimationFrameIfNeeded(currentTime);
    }
  }, {
    key: "queueAnimationFrameIfNeeded",
    value: function queueAnimationFrameIfNeeded(currentTime) {
      if (this.requestAnimationFrameRequested) {
        // We already have a pended animation frame, so there is no more work
        return;
      }

      if (this.activeConfettiBatches.length < 1) {
        // No shapes to animate, so don't queue another frame
        return;
      }

      this.requestAnimationFrameRequested = true; // Capture the last updated time for animation

      this.lastUpdated = currentTime || new Date().getTime();
      requestAnimationFrame(this.loop);
    }
  }, {
    key: "addConfetti",
    value: function addConfetti() {
      var confettiConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _normalizeConfettiCon = normalizeConfettiConfig(confettiConfig),
          confettiRadius = _normalizeConfettiCon.confettiRadius,
          confettiNumber = _normalizeConfettiCon.confettiNumber,
          confettiColors = _normalizeConfettiCon.confettiColors,
          emojis = _normalizeConfettiCon.emojis,
          emojiSize = _normalizeConfettiCon.emojiSize; // Use the bounding rect rather tahn the canvas width / height, because
      // .width / .height are unset until a layout pass has been completed. Upon
      // confetti being immediately queued on a page load, this hasn't happened so
      // the default of 300x150 will be returned, causing an improper source point
      // for the confetti animation.


      var canvasRect = this.canvas.getBoundingClientRect();
      var canvasWidth = canvasRect.width;
      var canvasHeight = canvasRect.height;
      var yPosition = canvasHeight * 5 / 7;
      var leftConfettiPosition = {
        x: 0,
        y: yPosition
      };
      var rightConfettiPosition = {
        x: canvasWidth,
        y: yPosition
      };
      var confettiGroup = new ConfettiBatch(this.canvasContext);

      for (var i = 0; i < confettiNumber / 2; i++) {
        var confettiOnTheRight = new ConfettiShape({
          initialPosition: leftConfettiPosition,
          direction: 'right',
          confettiRadius: confettiRadius,
          confettiColors: confettiColors,
          confettiNumber: confettiNumber,
          emojis: emojis,
          emojiSize: emojiSize,
          canvasWidth: canvasWidth
        });
        var confettiOnTheLeft = new ConfettiShape({
          initialPosition: rightConfettiPosition,
          direction: 'left',
          confettiRadius: confettiRadius,
          confettiColors: confettiColors,
          confettiNumber: confettiNumber,
          emojis: emojis,
          emojiSize: emojiSize,
          canvasWidth: canvasWidth
        });
        confettiGroup.addShapes(confettiOnTheRight, confettiOnTheLeft);
      }

      this.activeConfettiBatches.push(confettiGroup);
      this.queueAnimationFrameIfNeeded();
      return confettiGroup.getBatchCompletePromise();
    }
  }]);

  return JSConfetti;
}();

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init$1 () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init$1();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init$1();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from$1(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from$1 (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from$1(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

let urlAlphabet$1 =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

const POOL_SIZE_MULTIPLIER$1 = 128;
let pool$1, poolOffset$1;
let fillPool$1 = bytes => {
  if (!pool$1 || pool$1.length < bytes) {
    pool$1 = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER$1);
    crypto.randomFillSync(pool$1);
    poolOffset$1 = 0;
  } else if (poolOffset$1 + bytes > pool$1.length) {
    crypto.randomFillSync(pool$1);
    poolOffset$1 = 0;
  }
  poolOffset$1 += bytes;
};
let nanoid$1 = (size = 21) => {
  fillPool$1(size);
  let id = '';
  for (let i = poolOffset$1 - size; i < poolOffset$1; i++) {
    id += urlAlphabet$1[pool$1[i] & 63];
  }
  return id
};

const IconLogoCircle = ({ className }) => {
    const gradientId = useMemo(() => nanoid$1(), []);
    return (React.createElement("svg", { className: className, fill: "none", height: "34", viewBox: "0 0 34 34", width: "34", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("circle", { cx: "17", cy: "17", fill: "white", r: "17" }),
        React.createElement("path", { d: "M17 0C7.59621 0 0 7.59887 0 17C0 26.4038 7.59887 34 17 34C26.4038 34 34 26.4011 34 17C34 7.59621 26.4011 0 17 0ZM6.44938 24.5006C5.3198 22.9161 4.55215 21.068 4.23074 19.1575L6.19504 18.8268C6.4673 20.4418 7.11609 22.0037 8.07168 23.3445L6.44938 24.5006ZM6.19504 15.1732L4.23074 14.8425C4.55215 12.932 5.3198 11.0839 6.44938 9.49941L8.07168 10.6555C7.11609 11.9963 6.4673 13.5582 6.19504 15.1732ZM14.8425 29.7693C12.932 29.4479 11.0839 28.6802 9.49941 27.5506L10.6555 25.9283C11.9963 26.8839 13.5582 27.5327 15.1732 27.805L14.8425 29.7693ZM10.6555 8.07168L9.49941 6.44938C11.0839 5.3198 12.932 4.55215 14.8425 4.23074L15.1732 6.19504C13.5582 6.4673 11.9963 7.11609 10.6555 8.07168ZM27.5506 9.49941C28.6802 11.0839 29.4479 12.9313 29.7693 14.8425L27.805 15.1732C27.5327 13.5582 26.8839 11.9963 25.929 10.6555L27.5506 9.49941ZM19.1575 29.7693L18.8268 27.805C20.4418 27.5327 22.0037 26.8839 23.3445 25.9283L24.5006 27.5506C22.9161 28.6802 21.068 29.4479 19.1575 29.7693ZM23.3445 8.07168C22.0037 7.11609 20.4418 6.4673 18.8268 6.19504L19.1575 4.23074C21.068 4.55215 22.9161 5.3198 24.5006 6.44938L23.3445 8.07168ZM27.5506 24.5006L25.929 23.3445C26.8839 22.0037 27.5327 20.4418 27.805 18.8268L29.7693 19.1575C29.4479 21.0687 28.6802 22.9161 27.5506 24.5006Z", fill: `url(#${gradientId})` }),
        React.createElement("circle", { cx: "17", cy: "17", fill: "white", opacity: "0.6", r: "5" }),
        React.createElement("defs", null,
            React.createElement("linearGradient", { gradientUnits: "userSpaceOnUse", id: gradientId, x1: "7.5", x2: "22", y1: "3.5", y2: "32.5" },
                React.createElement("stop", { stopColor: "#FF0198" }),
                React.createElement("stop", { offset: "1", stopColor: "#B90AE0" })))));
};

const IconConfirm = ({ className }) => (React.createElement("svg", { className: className, fill: "none", height: "20", stroke: "black", viewBox: "0 0 20 20", width: "20", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M1.5 9.5C3.66667 11.6667 9 17 9 17L18.5 3", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" })));

const IconDecline = ({ className }) => (React.createElement("svg", { className: className, fill: "none", height: "20", stroke: "black", viewBox: "0 0 20 20", width: "20", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M17 3L10 10M3 17L10 10M10 10L3 3M10 10L17 17", strokeLinecap: "round", strokeWidth: "1.5" })));

var removeHash = function removeHash(hex) {
  return hex.charAt(0) === '#' ? hex.slice(1) : hex;
};

var parseHex = function parseHex(nakedHex) {
  var isShort = nakedHex.length === 3 || nakedHex.length === 4;
  var twoDigitHexR = isShort ? "".concat(nakedHex.slice(0, 1)).concat(nakedHex.slice(0, 1)) : nakedHex.slice(0, 2);
  var twoDigitHexG = isShort ? "".concat(nakedHex.slice(1, 2)).concat(nakedHex.slice(1, 2)) : nakedHex.slice(2, 4);
  var twoDigitHexB = isShort ? "".concat(nakedHex.slice(2, 3)).concat(nakedHex.slice(2, 3)) : nakedHex.slice(4, 6);
  var twoDigitHexA = (isShort ? "".concat(nakedHex.slice(3, 4)).concat(nakedHex.slice(3, 4)) : nakedHex.slice(6, 8)) || 'ff'; // const numericA = +((parseInt(a, 16) / 255).toFixed(2));

  return {
    r: twoDigitHexR,
    g: twoDigitHexG,
    b: twoDigitHexB,
    a: twoDigitHexA
  };
};

var hexToDecimal = function hexToDecimal(hex) {
  return parseInt(hex, 16);
};

var hexesToDecimals = function hexesToDecimals(_ref) {
  var r = _ref.r,
      g = _ref.g,
      b = _ref.b,
      a = _ref.a;
  return {
    r: hexToDecimal(r),
    g: hexToDecimal(g),
    b: hexToDecimal(b),
    a: +(hexToDecimal(a) / 255).toFixed(2)
  };
};

var isNumeric = function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}; // eslint-disable-line no-restricted-globals, max-len


var formatRgb = function formatRgb(decimalObject, parameterA) {
  var r = decimalObject.r,
      g = decimalObject.g,
      b = decimalObject.b,
      parsedA = decimalObject.a;
  var a = isNumeric(parameterA) ? parameterA : parsedA;
  return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
};
/**
 * Turns an old-fashioned css hex color value into a rgb color value.
 *
 * If you specify an alpha value, you'll get a rgba() value instead.
 *
 * @param The hex value to convert. ('123456'. '#123456', ''123', '#123')
 * @param An alpha value to apply. (optional) ('0.5', '0.25')
 * @return An rgb or rgba value. ('rgb(11, 22, 33)'. 'rgba(11, 22, 33, 0.5)')
 */


var hexToRgba = function hexToRgba(hex, a) {
  var hashlessHex = removeHash(hex);
  var hexObject = parseHex(hashlessHex);
  var decimalObject = hexesToDecimals(hexObject);
  return formatRgb(decimalObject, a);
};

var build = hexToRgba;

/* MIT license */

var conversions$1 = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
};


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;

  if(l === 0) {
      // no need to do calc on black
      // also avoids divide by 0 error
      return [0, 0, 0];
  }

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

var conversions = conversions$1;

var convert$1 = function() {
   return new Converter();
};

for (var func in conversions) {
  // export Raw versions
  convert$1[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert$1[from] = convert$1[from] || {};

  convert$1[from][to] = convert$1[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert$1[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   };
});

var colorConvert = convert$1;

var convert = colorConvert;

var parseColor = function (cstr) {
    var m, conv, parts, alpha;
    if (m = /^((?:rgb|hs[lv]|cmyk|xyz|lab)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
        var name = m[1];
        var base = name.replace(/a$/, '');
        var size = base === 'cmyk' ? 4 : 3;
        conv = convert[base];
        
        parts = m[2].replace(/^\s+|\s+$/g, '')
            .split(/\s*,\s*/)
            .map(function (x, i) {
                if (/%$/.test(x) && i === size) {
                    return parseFloat(x) / 100;
                }
                else if (/%$/.test(x)) {
                    return parseFloat(x);
                }
                return parseFloat(x);
            })
        ;
        if (name === base) parts.push(1);
        alpha = parts[size] === undefined ? 1 : parts[size];
        parts = parts.slice(0, size);
        
        conv[base] = function () { return parts };
    }
    else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
        var base = cstr.replace(/^#/,'');
        var size = base.length;
        conv = convert.rgb;
        parts = base.split(size === 3 ? /(.)/ : /(..)/);
        parts = parts.filter(Boolean)
            .map(function (x) {
                if (size === 3) {
                    return parseInt(x + x, 16);
                }
                else {
                    return parseInt(x, 16)
                }
            })
        ;
        alpha = 1;
        conv.rgb = function () { return parts };
        if (!parts[0]) parts[0] = 0;
        if (!parts[1]) parts[1] = 0;
        if (!parts[2]) parts[2] = 0;
    }
    else {
        conv = convert.keyword;
        conv.keyword = function () { return cstr };
        parts = cstr;
        alpha = 1;
    }
    
    var res = {
        rgb: undefined,
        hsl: undefined,
        hsv: undefined,
        cmyk: undefined,
        keyword: undefined,
        hex: undefined
    };
    try { res.rgb = conv.rgb(parts); } catch (e) {}
    try { res.hsl = conv.hsl(parts); } catch (e) {}
    try { res.hsv = conv.hsv(parts); } catch (e) {}
    try { res.cmyk = conv.cmyk(parts); } catch (e) {}
    try { res.keyword = conv.keyword(parts); } catch (e) {}
    
    if (res.rgb) res.hex = '#' + res.rgb.map(function (x) {
        var s = x.toString(16);
        if (s.length === 1) return '0' + s;
        return s;
    }).join('');
    
    if (res.rgb) res.rgba = res.rgb.concat(alpha);
    if (res.hsl) res.hsla = res.hsl.concat(alpha);
    if (res.hsv) res.hsva = res.hsv.concat(alpha);
    if (res.cmyk) res.cmyka = res.cmyk.concat(alpha);
    
    return res;
};

const renderColor = (color, opacity) => {
    if (color.includes('#') && opacity) {
        color = build(color, opacity / 100);
    }
    return color;
};
const renderGradient = (colors, opacity) => {
    const first = renderColor(colors[0], opacity);
    const second = renderColor(colors[1], opacity);
    return `linear-gradient(180deg, ${first} 0%, ${second} 100%)`;
};
const renderBackgroundStyles = (background, opacity) => {
    let color = background.value;
    switch (background.type) {
        case 'color':
            if (color.includes('#') && opacity !== undefined) {
                color = build(background.value, opacity / 100);
            }
            else if (opacity !== undefined) {
                const parsed = parseColor(background.value);
                return `rgba(${parsed.rgb[0]}, ${parsed.rgb[1]}, ${parsed.rgb[2]}, ${opacity / 100})`;
            }
            return color;
        case 'gradient':
            return `linear-gradient(180deg, ${background.value[0]} 0%, ${background.value[1]} 100%)`;
        case 'image':
            return `center / cover url("${background.value}")`;
        default:
            return 'transparent';
    }
};
const renderTextBackgroundStyles = ({ color, opacity }) => {
    switch (color.type) {
        case 'color':
            return {
                color: color.value
            };
        case 'gradient':
            return {
                background: renderGradient(color.value, opacity)
            };
        default:
            return {
                background: 'transparent'
            };
    }
};
const renderPosition = (position, positionLimits, zIndex) => ({
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: positionLimits.isAutoWidth ? 'auto' : `${position.width}px`,
    height: positionLimits.isAutoHeight ? 'auto' : `${position.height}px`,
    zIndex,
    transform: `rotate(${position.rotate}deg)`
});
const calculateElementSize = (position, positionLimits, elementSize) => positionLimits.minWidth
    ? Math.round((elementSize * +position.width) / (positionLimits === null || positionLimits === void 0 ? void 0 : positionLimits.minWidth))
    : elementSize;
const calculateElementSizeByHeight = (position, positionLimits, elementSize) => positionLimits.minHeight
    ? Math.round((elementSize * position.height) / (positionLimits === null || positionLimits === void 0 ? void 0 : positionLimits.minHeight))
    : elementSize;

const b$f = block('ChooseAnswerWidget');
const INIT_ELEMENT_STYLES$5 = {
    widget: {
        borderRadius: 10
    },
    header: {
        fontSize: 12,
        paddingTop: 13,
        paddingBottom: 13
    },
    answers: {
        padding: 12
    },
    answer: {
        padding: 8,
        marginBottom: 6
    },
    answerId: {
        width: 18,
        height: 18,
        marginRight: 8,
        fontSize: 10
    },
    answerTitle: {
        fontSize: 10
    }
};
const ChooseAnswerWidget = (props) => {
    const { params, position, positionLimits, onAnswer } = props;
    const [userAnswer, setUserAnswer] = useState(null);
    const jsConfetti = useRef(new JSConfetti());
    const calculate = useCallback((size) => {
        if (position && positionLimits) {
            return calculateElementSize(position, positionLimits, size);
        }
        return size;
    }, [position, positionLimits]);
    const elementSizes = useMemo(() => ({
        widget: {
            borderRadius: calculate(INIT_ELEMENT_STYLES$5.widget.borderRadius)
        },
        header: {
            fontSize: calculate(INIT_ELEMENT_STYLES$5.header.fontSize),
            paddingTop: calculate(INIT_ELEMENT_STYLES$5.header.paddingTop),
            paddingBottom: calculate(INIT_ELEMENT_STYLES$5.header.paddingBottom)
        },
        answers: {
            padding: calculate(INIT_ELEMENT_STYLES$5.answers.padding)
        },
        answer: {
            padding: calculate(INIT_ELEMENT_STYLES$5.answer.padding),
            marginBottom: calculate(INIT_ELEMENT_STYLES$5.answer.marginBottom)
        },
        answerId: {
            width: calculate(INIT_ELEMENT_STYLES$5.answerId.width),
            height: calculate(INIT_ELEMENT_STYLES$5.answerId.height),
            marginRight: calculate(INIT_ELEMENT_STYLES$5.answerId.marginRight),
            fontSize: calculate(INIT_ELEMENT_STYLES$5.answerId.fontSize)
        },
        answerTitle: {
            fontSize: calculate(INIT_ELEMENT_STYLES$5.answerTitle.fontSize)
        }
    }), [calculate]);
    const handleMarkAnswer = useCallback((answerId) => {
        if (onAnswer) {
            onAnswer(answerId);
        }
        setUserAnswer(answerId);
    }, [onAnswer]);
    const renderAnswer = useCallback((answer) => {
        if (userAnswer) {
            return (React.createElement("div", { className: b$f('answer', {
                    correct: answer.id === params.correct,
                    incorrect: answer.id !== params.correct,
                    choosen: userAnswer === answer.id
                }), key: `answer-${answer.id}`, style: elementSizes.answer },
                React.createElement("div", { className: b$f('answerCircle', {
                        correct: answer.id === params.correct,
                        incorrect: answer.id !== params.correct,
                        choosen: userAnswer === answer.id
                    }), style: elementSizes.answerId }, answer.id === params.correct ? (React.createElement(IconConfirm, { className: b$f('answerIcon', {
                        correct: answer.id === params.correct,
                        incorrect: answer.id !== params.correct,
                        choosen: userAnswer === answer.id
                    }) })) : (React.createElement(IconDecline, { className: b$f('answerIcon', {
                        correct: answer.id === params.correct,
                        incorrect: answer.id !== params.correct,
                        choosen: userAnswer === answer.id
                    }) }))),
                React.createElement("div", { className: b$f('answerTitle', {
                        choosen: userAnswer === answer.id,
                        correct: answer.id === params.correct,
                        incorrect: answer.id !== params.correct
                    }), style: elementSizes.answerTitle }, answer.title)));
        }
        return (React.createElement("div", { className: b$f('answer'), key: answer.id, style: elementSizes.answer },
            React.createElement("button", { className: b$f('answerId'), style: elementSizes.answerId, onClick: !userAnswer ? () => handleMarkAnswer(answer.id) : undefined }, `${answer.id}`),
            React.createElement("div", { className: b$f('answerTitle'), style: elementSizes.answerTitle }, answer.title)));
    }, [
        userAnswer,
        handleMarkAnswer,
        params.correct,
        elementSizes.answer,
        elementSizes.answerTitle,
        elementSizes.answerId
    ]);
    useEffect(() => {
        if (userAnswer && userAnswer === params.correct) {
            jsConfetti.current.addConfetti();
        }
    }, [userAnswer, params.correct]);
    return (React.createElement("div", { className: b$f({
            color: params.color,
            shake: userAnswer && userAnswer !== params.correct,
            celebrate: userAnswer && userAnswer === params.correct
        }), style: elementSizes.widget },
        React.createElement("div", { className: b$f('header'), style: elementSizes.header }, params.text),
        React.createElement("div", { className: b$f('answers'), style: elementSizes.answers }, params.answers.map((answer) => renderAnswer(answer)))));
};

var classnames = {exports: {}};

/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

(function (module) {
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if (module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}
}());
}(classnames));

var cn = classnames.exports;

const ArrowCircleUpOutlineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { fill: "none", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("g", { "data-name": "Layer 2" },
        React.createElement("g", { "data-name": "arrow-circle-up" },
            React.createElement("rect", { height: "24", width: "24" }),
            React.createElement("path", { d: "M12.71 7.29a1 1 0 0 0-.32-.21A1 1 0 0 0 12 7h-.1a.82.82 0 0 0-.27.06.72.72 0 0 0-.19.11 1 1 0 0 0-.13.09l-3 2.86a1 1 0 0 0 1.38 1.45L11 10.34V16a1 1 0 0 0 2 0v-5.59l1.29 1.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z", fill: gradient ? `url(#${gradientId})` : color }),
            React.createElement("path", { d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z", fill: gradient ? `url(#${gradientId})` : color })))));

const ArrowheadUpOutlineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("g", { "data-name": "Layer 2" },
        React.createElement("g", { "data-name": "arrowhead-up" },
            React.createElement("rect", { height: "24", opacity: "0", transform: "rotate(180 12 12)", width: "24" }),
            React.createElement("path", { d: "M6.63 11.61L12 7.29l5.37 4.48A1 1 0 0 0 18 12a1 1 0 0 0 .77-.36 1 1 0 0 0-.13-1.41l-6-5a1 1 0 0 0-1.27 0l-6 4.83a1 1 0 0 0-.15 1.41 1 1 0 0 0 1.41.14z", fill: gradient ? `url(#${gradientId})` : color }),
            React.createElement("path", { d: "M12.64 12.23a1 1 0 0 0-1.27 0l-6 4.83a1 1 0 0 0-.15 1.41 1 1 0 0 0 1.41.15L12 14.29l5.37 4.48A1 1 0 0 0 18 19a1 1 0 0 0 .77-.36 1 1 0 0 0-.13-1.41z", fill: gradient ? `url(#${gradientId})` : color })))));

const ArrowUpIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { className: "feather feather-arrow-up", fill: "none", height: "24", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("line", { stroke: gradient ? `url(#${gradientId})` : color, x1: "12", x2: "12", y1: "19", y2: "5" }),
    React.createElement("polyline", { points: "5 12 12 5 19 12", stroke: gradient ? `url(#${gradientId})` : color })));

const ArrowUpCircleIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { className: "feather feather-arrow-up-circle", fill: "none", height: "24", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("circle", { cx: "12", cy: "12", r: "10", stroke: gradient ? `url(#${gradientId})` : color }),
    React.createElement("polyline", { points: "16 12 12 8 8 12", stroke: gradient ? `url(#${gradientId})` : color }),
    React.createElement("line", { stroke: gradient ? `url(#${gradientId})` : color, x1: "12", x2: "12", y1: "16", y2: "8" })));

const ArrowUpCircleFillIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm1 10h3l-4-4-4 4h3v4h2v-4z", fill: gradient ? `url(#${gradientId})` : color })));

const ArrowUpCircleLineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zm1-8v4h-2v-4H8l4-4 4 4h-3z", fill: gradient ? `url(#${gradientId})` : color })));

const ArrowUpFillIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M13 12v8h-2v-8H4l8-8 8 8z", fill: gradient ? `url(#${gradientId})` : color })));

const ArrowUpLineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z", fill: gradient ? `url(#${gradientId})` : color })));

const ArrowUpOutlineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("g", { "data-name": "Layer 2" },
        React.createElement("g", { "data-name": "arrow-up" },
            React.createElement("rect", { height: "24", opacity: "0", transform: "rotate(90 12 12)", width: "24" }),
            React.createElement("path", { d: "M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1 2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1zM8 14h7.9L12 9.18z", fill: gradient ? `url(#${gradientId})` : color })))));

const ArrowUpsFillIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M12 8l6 6H6z", fill: gradient ? `url(#${gradientId})` : color })));

const ArrowUpsLineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z", fill: gradient ? `url(#${gradientId})` : color })));

const LinkIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z", fill: gradient ? `url(#${gradientId})` : color })));

const LinksLineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M13.06 8.11l1.415 1.415a7 7 0 0 1 0 9.9l-.354.353a7 7 0 0 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415 1.415-1.414zm6.718 6.011l-1.414-1.414a5 5 0 1 0-7.071-7.071l-.354.354a5 5 0 0 0 0 7.07l1.415 1.415-1.415 1.414-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 0 1 9.9 9.9z", fill: gradient ? `url(#${gradientId})` : color })));

const ShareLineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement("path", { d: "M13.12 17.023l-4.199-2.29a4 4 0 1 1 0-5.465l4.2-2.29a4 4 0 1 1 .959 1.755l-4.2 2.29a4.008 4.008 0 0 1 0 1.954l4.199 2.29a4 4 0 1 1-.959 1.755zM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm11-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", fill: gradient ? `url(#${gradientId})` : color })));

const UploadOutlineIcon = ({ color = '#fff', gradient, gradientId }) => (React.createElement("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("g", { "data-name": "Layer 2" },
        React.createElement("g", { "data-name": "upload" },
            React.createElement("rect", { fill: gradient ? `url(#${gradientId})` : color, height: "24", opacity: "0", transform: "rotate(180 12 12)", width: "24" }),
            React.createElement("rect", { fill: gradient ? `url(#${gradientId})` : color, height: "2", rx: "1", ry: "1", transform: "rotate(180 12 5)", width: "16", x: "4", y: "4" }),
            React.createElement("rect", { fill: gradient ? `url(#${gradientId})` : color, height: "2", rx: "1", ry: "1", transform: "rotate(90 19 6)", width: "4", x: "17", y: "5" }),
            React.createElement("rect", { fill: gradient ? `url(#${gradientId})` : color, height: "2", rx: "1", ry: "1", transform: "rotate(90 5 6)", width: "4", x: "3", y: "5" }),
            React.createElement("path", { d: "M8 14a1 1 0 0 1-.8-.4 1 1 0 0 1 .2-1.4l4-3a1 1 0 0 1 1.18 0l4 2.82a1 1 0 0 1 .24 1.39 1 1 0 0 1-1.4.24L12 11.24 8.6 13.8a1 1 0 0 1-.6.2z", fill: gradient ? `url(#${gradientId})` : color }),
            React.createElement("path", { d: "M12 21a1 1 0 0 1-1-1v-8a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z", fill: gradient ? `url(#${gradientId})` : color })))));

const IconChevronCircleUp = ({ className, color = '#fff', gradient, gradientId }) => (React.createElement("svg", { className: cn(className, 'stroke-current'), fill: "none", height: 18, viewBox: "0 0 18 18", width: 18, xmlns: "http://www.w3.org/2000/svg" },
    gradient && React.createElement("defs", null, gradient),
    React.createElement("circle", { cx: 9, cy: 9, r: 8.5, stroke: gradient ? `url(#${gradientId})` : color }),
    React.createElement("path", { d: "M12 10L9 7l-3 3", stroke: gradient ? `url(#${gradientId})` : color, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.2 })));

const MATERIAL_ICONS = {
    IconChevronCircleUp,
    ArrowCircleUpOutlineIcon,
    ArrowheadUpOutlineIcon,
    ArrowUpIcon,
    ArrowUpCircleIcon,
    ArrowUpCircleFillIcon,
    ArrowUpCircleLineIcon,
    ArrowUpFillIcon,
    ArrowUpLineIcon,
    ArrowUpOutlineIcon,
    ArrowUpsFillIcon,
    ArrowUpsLineIcon,
    // ArrowUpwardOutlineIcon,
    // ChevronUpOutlineIcon,
    LinkIcon,
    LinksLineIcon,
    ShareLineIcon,
    UploadOutlineIcon,
};

const CLASS_NAME = 'MaterialIcon';
const MaterialIcon = memo(({ name = 'ArrowCircleUpOutlineIcon', className, color, background, size = 'auto' }) => {
    const Icon = useMemo(() => MATERIAL_ICONS[name], [name]);
    let gradient;
    const gradientId = useMemo(() => nanoid$1(), []);
    if ((background === null || background === void 0 ? void 0 : background.type) === 'gradient') {
        gradient = (React.createElement("linearGradient", { id: gradientId, x1: "0", x2: "0", y1: "0", y2: "1" },
            React.createElement("stop", { offset: "0%", stopColor: background.value[0] }),
            React.createElement("stop", { offset: "100%", stopColor: background.value[1] })));
    }
    if (Icon) {
        return (React.createElement("span", { className: cn(`${CLASS_NAME}`, className), style: { width: size, height: size } },
            React.createElement(Icon, { color: color, gradient: gradient, gradientId: gradientId })));
    }
    return null;
});

const b$e = block('ClickMeWidget');
const ClickMeWidget = (props) => {
    const { fontFamily, fontParams, opacity, fontSize, iconSize, color, text, icon, borderRadius, backgroundColor, borderWidth, borderColor, hasBorder, hasIcon, url } = props.params;
    // const border = hasBorder ? `${borderWidth}px solid ${borderColor}` : 'none';
    const handleWidgetClick = () => {
        if (props.onClick) {
            props.onClick();
        }
        const tab = window.open(url, '_blank');
        if (tab) {
            tab.focus();
        }
    };
    return (React.createElement("div", { className: b$e(), role: "button", style: {
            borderRadius,
            borderStyle: 'solid',
            borderWidth: `${hasBorder ? borderWidth : 0}px`,
            borderColor: renderBackgroundStyles(borderColor)
        }, tabIndex: 0, onClick: handleWidgetClick, onKeyDown: handleWidgetClick },
        React.createElement("div", { className: b$e('container', { gradient: color.type === 'gradient' }), style: Object.assign({ fontStyle: fontParams.style, fontWeight: fontParams.weight, fontFamily,
                fontSize }, renderTextBackgroundStyles({ color })) },
            hasIcon ? (React.createElement(MaterialIcon, { background: color, className: b$e('icon').toString(), color: renderBackgroundStyles(color), name: icon.name, size: iconSize })) : null,
            React.createElement("span", { className: b$e('text'), style: { opacity: opacity ? +opacity / 100 : 1 } }, text)),
        React.createElement("div", { className: b$e('background'), style: {
                background: renderBackgroundStyles(backgroundColor)
            } })));
};

const EllipseWidget = (props) => {
    const { fillColor, strokeThickness, strokeColor, widgetOpacity, hasBorder } = props.params;
    const styles = {
        opacity: widgetOpacity / 100,
        borderStyle: 'solid',
        borderWidth: `${hasBorder ? strokeThickness : 0}px`,
        borderColor: renderBackgroundStyles(strokeColor)
    };
    const backgroundStyles = {
        background: renderBackgroundStyles(fillColor)
    };
    return (React.createElement("div", { className: "EllipseWidget", style: styles },
        React.createElement("div", { className: "EllipseWidget__background", style: backgroundStyles })));
};

var compressed = true;
var categories$1 = [
	{
		id: "people",
		name: "Smileys & People",
		emojis: [
			"grinning",
			"smiley",
			"smile",
			"grin",
			"laughing",
			"sweat_smile",
			"rolling_on_the_floor_laughing",
			"joy",
			"slightly_smiling_face",
			"upside_down_face",
			"wink",
			"blush",
			"innocent",
			"smiling_face_with_3_hearts",
			"heart_eyes",
			"star-struck",
			"kissing_heart",
			"kissing",
			"relaxed",
			"kissing_closed_eyes",
			"kissing_smiling_eyes",
			"yum",
			"stuck_out_tongue",
			"stuck_out_tongue_winking_eye",
			"zany_face",
			"stuck_out_tongue_closed_eyes",
			"money_mouth_face",
			"hugging_face",
			"face_with_hand_over_mouth",
			"shushing_face",
			"thinking_face",
			"zipper_mouth_face",
			"face_with_raised_eyebrow",
			"neutral_face",
			"expressionless",
			"no_mouth",
			"smirk",
			"unamused",
			"face_with_rolling_eyes",
			"grimacing",
			"lying_face",
			"relieved",
			"pensive",
			"sleepy",
			"drooling_face",
			"sleeping",
			"mask",
			"face_with_thermometer",
			"face_with_head_bandage",
			"nauseated_face",
			"face_vomiting",
			"sneezing_face",
			"hot_face",
			"cold_face",
			"woozy_face",
			"dizzy_face",
			"exploding_head",
			"face_with_cowboy_hat",
			"partying_face",
			"sunglasses",
			"nerd_face",
			"face_with_monocle",
			"confused",
			"worried",
			"slightly_frowning_face",
			"white_frowning_face",
			"open_mouth",
			"hushed",
			"astonished",
			"flushed",
			"pleading_face",
			"frowning",
			"anguished",
			"fearful",
			"cold_sweat",
			"disappointed_relieved",
			"cry",
			"sob",
			"scream",
			"confounded",
			"persevere",
			"disappointed",
			"sweat",
			"weary",
			"tired_face",
			"yawning_face",
			"triumph",
			"rage",
			"angry",
			"face_with_symbols_on_mouth",
			"smiling_imp",
			"imp",
			"skull",
			"skull_and_crossbones",
			"hankey",
			"clown_face",
			"japanese_ogre",
			"japanese_goblin",
			"ghost",
			"alien",
			"space_invader",
			"robot_face",
			"smiley_cat",
			"smile_cat",
			"joy_cat",
			"heart_eyes_cat",
			"smirk_cat",
			"kissing_cat",
			"scream_cat",
			"crying_cat_face",
			"pouting_cat",
			"see_no_evil",
			"hear_no_evil",
			"speak_no_evil",
			"wave",
			"raised_back_of_hand",
			"raised_hand_with_fingers_splayed",
			"hand",
			"spock-hand",
			"ok_hand",
			"pinching_hand",
			"v",
			"crossed_fingers",
			"i_love_you_hand_sign",
			"the_horns",
			"call_me_hand",
			"point_left",
			"point_right",
			"point_up_2",
			"middle_finger",
			"point_down",
			"point_up",
			"+1",
			"-1",
			"fist",
			"facepunch",
			"left-facing_fist",
			"right-facing_fist",
			"clap",
			"raised_hands",
			"open_hands",
			"palms_up_together",
			"handshake",
			"pray",
			"writing_hand",
			"nail_care",
			"selfie",
			"muscle",
			"mechanical_arm",
			"mechanical_leg",
			"leg",
			"foot",
			"ear",
			"ear_with_hearing_aid",
			"nose",
			"brain",
			"tooth",
			"bone",
			"eyes",
			"eye",
			"tongue",
			"lips",
			"baby",
			"child",
			"boy",
			"girl",
			"adult",
			"person_with_blond_hair",
			"man",
			"bearded_person",
			"red_haired_man",
			"curly_haired_man",
			"white_haired_man",
			"bald_man",
			"woman",
			"red_haired_woman",
			"red_haired_person",
			"curly_haired_woman",
			"curly_haired_person",
			"white_haired_woman",
			"white_haired_person",
			"bald_woman",
			"bald_person",
			"blond-haired-woman",
			"blond-haired-man",
			"older_adult",
			"older_man",
			"older_woman",
			"person_frowning",
			"man-frowning",
			"woman-frowning",
			"person_with_pouting_face",
			"man-pouting",
			"woman-pouting",
			"no_good",
			"man-gesturing-no",
			"woman-gesturing-no",
			"ok_woman",
			"man-gesturing-ok",
			"woman-gesturing-ok",
			"information_desk_person",
			"man-tipping-hand",
			"woman-tipping-hand",
			"raising_hand",
			"man-raising-hand",
			"woman-raising-hand",
			"deaf_person",
			"deaf_man",
			"deaf_woman",
			"bow",
			"man-bowing",
			"woman-bowing",
			"face_palm",
			"man-facepalming",
			"woman-facepalming",
			"shrug",
			"man-shrugging",
			"woman-shrugging",
			"health_worker",
			"male-doctor",
			"female-doctor",
			"student",
			"male-student",
			"female-student",
			"teacher",
			"male-teacher",
			"female-teacher",
			"judge",
			"male-judge",
			"female-judge",
			"farmer",
			"male-farmer",
			"female-farmer",
			"cook",
			"male-cook",
			"female-cook",
			"mechanic",
			"male-mechanic",
			"female-mechanic",
			"factory_worker",
			"male-factory-worker",
			"female-factory-worker",
			"office_worker",
			"male-office-worker",
			"female-office-worker",
			"scientist",
			"male-scientist",
			"female-scientist",
			"technologist",
			"male-technologist",
			"female-technologist",
			"singer",
			"male-singer",
			"female-singer",
			"artist",
			"male-artist",
			"female-artist",
			"pilot",
			"male-pilot",
			"female-pilot",
			"astronaut",
			"male-astronaut",
			"female-astronaut",
			"firefighter",
			"male-firefighter",
			"female-firefighter",
			"cop",
			"male-police-officer",
			"female-police-officer",
			"sleuth_or_spy",
			"male-detective",
			"female-detective",
			"guardsman",
			"male-guard",
			"female-guard",
			"construction_worker",
			"male-construction-worker",
			"female-construction-worker",
			"prince",
			"princess",
			"man_with_turban",
			"man-wearing-turban",
			"woman-wearing-turban",
			"man_with_gua_pi_mao",
			"person_with_headscarf",
			"man_in_tuxedo",
			"bride_with_veil",
			"pregnant_woman",
			"breast-feeding",
			"angel",
			"santa",
			"mrs_claus",
			"superhero",
			"male_superhero",
			"female_superhero",
			"supervillain",
			"male_supervillain",
			"female_supervillain",
			"mage",
			"male_mage",
			"female_mage",
			"fairy",
			"male_fairy",
			"female_fairy",
			"vampire",
			"male_vampire",
			"female_vampire",
			"merperson",
			"merman",
			"mermaid",
			"elf",
			"male_elf",
			"female_elf",
			"genie",
			"male_genie",
			"female_genie",
			"zombie",
			"male_zombie",
			"female_zombie",
			"massage",
			"man-getting-massage",
			"woman-getting-massage",
			"haircut",
			"man-getting-haircut",
			"woman-getting-haircut",
			"walking",
			"man-walking",
			"woman-walking",
			"standing_person",
			"man_standing",
			"woman_standing",
			"kneeling_person",
			"man_kneeling",
			"woman_kneeling",
			"person_with_probing_cane",
			"man_with_probing_cane",
			"woman_with_probing_cane",
			"person_in_motorized_wheelchair",
			"man_in_motorized_wheelchair",
			"woman_in_motorized_wheelchair",
			"person_in_manual_wheelchair",
			"man_in_manual_wheelchair",
			"woman_in_manual_wheelchair",
			"runner",
			"man-running",
			"woman-running",
			"dancer",
			"man_dancing",
			"man_in_business_suit_levitating",
			"dancers",
			"man-with-bunny-ears-partying",
			"woman-with-bunny-ears-partying",
			"person_in_steamy_room",
			"man_in_steamy_room",
			"woman_in_steamy_room",
			"person_climbing",
			"man_climbing",
			"woman_climbing",
			"fencer",
			"horse_racing",
			"skier",
			"snowboarder",
			"golfer",
			"man-golfing",
			"woman-golfing",
			"surfer",
			"man-surfing",
			"woman-surfing",
			"rowboat",
			"man-rowing-boat",
			"woman-rowing-boat",
			"swimmer",
			"man-swimming",
			"woman-swimming",
			"person_with_ball",
			"man-bouncing-ball",
			"woman-bouncing-ball",
			"weight_lifter",
			"man-lifting-weights",
			"woman-lifting-weights",
			"bicyclist",
			"man-biking",
			"woman-biking",
			"mountain_bicyclist",
			"man-mountain-biking",
			"woman-mountain-biking",
			"person_doing_cartwheel",
			"man-cartwheeling",
			"woman-cartwheeling",
			"wrestlers",
			"man-wrestling",
			"woman-wrestling",
			"water_polo",
			"man-playing-water-polo",
			"woman-playing-water-polo",
			"handball",
			"man-playing-handball",
			"woman-playing-handball",
			"juggling",
			"man-juggling",
			"woman-juggling",
			"person_in_lotus_position",
			"man_in_lotus_position",
			"woman_in_lotus_position",
			"bath",
			"sleeping_accommodation",
			"people_holding_hands",
			"two_women_holding_hands",
			"couple",
			"two_men_holding_hands",
			"couplekiss",
			"woman-kiss-man",
			"man-kiss-man",
			"woman-kiss-woman",
			"couple_with_heart",
			"woman-heart-man",
			"man-heart-man",
			"woman-heart-woman",
			"family",
			"man-woman-boy",
			"man-woman-girl",
			"man-woman-girl-boy",
			"man-woman-boy-boy",
			"man-woman-girl-girl",
			"man-man-boy",
			"man-man-girl",
			"man-man-girl-boy",
			"man-man-boy-boy",
			"man-man-girl-girl",
			"woman-woman-boy",
			"woman-woman-girl",
			"woman-woman-girl-boy",
			"woman-woman-boy-boy",
			"woman-woman-girl-girl",
			"man-boy",
			"man-boy-boy",
			"man-girl",
			"man-girl-boy",
			"man-girl-girl",
			"woman-boy",
			"woman-boy-boy",
			"woman-girl",
			"woman-girl-boy",
			"woman-girl-girl",
			"speaking_head_in_silhouette",
			"bust_in_silhouette",
			"busts_in_silhouette",
			"footprints",
			"kiss",
			"love_letter",
			"cupid",
			"gift_heart",
			"sparkling_heart",
			"heartpulse",
			"heartbeat",
			"revolving_hearts",
			"two_hearts",
			"heart_decoration",
			"heavy_heart_exclamation_mark_ornament",
			"broken_heart",
			"heart",
			"orange_heart",
			"yellow_heart",
			"green_heart",
			"blue_heart",
			"purple_heart",
			"brown_heart",
			"black_heart",
			"white_heart",
			"100",
			"anger",
			"boom",
			"dizzy",
			"sweat_drops",
			"dash",
			"hole",
			"bomb",
			"speech_balloon",
			"eye-in-speech-bubble",
			"left_speech_bubble",
			"right_anger_bubble",
			"thought_balloon",
			"zzz"
		]
	},
	{
		id: "nature",
		name: "Animals & Nature",
		emojis: [
			"monkey_face",
			"monkey",
			"gorilla",
			"orangutan",
			"dog",
			"dog2",
			"guide_dog",
			"service_dog",
			"poodle",
			"wolf",
			"fox_face",
			"raccoon",
			"cat",
			"cat2",
			"lion_face",
			"tiger",
			"tiger2",
			"leopard",
			"horse",
			"racehorse",
			"unicorn_face",
			"zebra_face",
			"deer",
			"cow",
			"ox",
			"water_buffalo",
			"cow2",
			"pig",
			"pig2",
			"boar",
			"pig_nose",
			"ram",
			"sheep",
			"goat",
			"dromedary_camel",
			"camel",
			"llama",
			"giraffe_face",
			"elephant",
			"rhinoceros",
			"hippopotamus",
			"mouse",
			"mouse2",
			"rat",
			"hamster",
			"rabbit",
			"rabbit2",
			"chipmunk",
			"hedgehog",
			"bat",
			"bear",
			"koala",
			"panda_face",
			"sloth",
			"otter",
			"skunk",
			"kangaroo",
			"badger",
			"feet",
			"turkey",
			"chicken",
			"rooster",
			"hatching_chick",
			"baby_chick",
			"hatched_chick",
			"bird",
			"penguin",
			"dove_of_peace",
			"eagle",
			"duck",
			"swan",
			"owl",
			"flamingo",
			"peacock",
			"parrot",
			"frog",
			"crocodile",
			"turtle",
			"lizard",
			"snake",
			"dragon_face",
			"dragon",
			"sauropod",
			"t-rex",
			"whale",
			"whale2",
			"dolphin",
			"fish",
			"tropical_fish",
			"blowfish",
			"shark",
			"octopus",
			"shell",
			"snail",
			"butterfly",
			"bug",
			"ant",
			"bee",
			"beetle",
			"cricket",
			"spider",
			"spider_web",
			"scorpion",
			"mosquito",
			"microbe",
			"bouquet",
			"cherry_blossom",
			"white_flower",
			"rosette",
			"rose",
			"wilted_flower",
			"hibiscus",
			"sunflower",
			"blossom",
			"tulip",
			"seedling",
			"evergreen_tree",
			"deciduous_tree",
			"palm_tree",
			"cactus",
			"ear_of_rice",
			"herb",
			"shamrock",
			"four_leaf_clover",
			"maple_leaf",
			"fallen_leaf",
			"leaves"
		]
	},
	{
		id: "foods",
		name: "Food & Drink",
		emojis: [
			"grapes",
			"melon",
			"watermelon",
			"tangerine",
			"lemon",
			"banana",
			"pineapple",
			"mango",
			"apple",
			"green_apple",
			"pear",
			"peach",
			"cherries",
			"strawberry",
			"kiwifruit",
			"tomato",
			"coconut",
			"avocado",
			"eggplant",
			"potato",
			"carrot",
			"corn",
			"hot_pepper",
			"cucumber",
			"leafy_green",
			"broccoli",
			"garlic",
			"onion",
			"mushroom",
			"peanuts",
			"chestnut",
			"bread",
			"croissant",
			"baguette_bread",
			"pretzel",
			"bagel",
			"pancakes",
			"waffle",
			"cheese_wedge",
			"meat_on_bone",
			"poultry_leg",
			"cut_of_meat",
			"bacon",
			"hamburger",
			"fries",
			"pizza",
			"hotdog",
			"sandwich",
			"taco",
			"burrito",
			"stuffed_flatbread",
			"falafel",
			"egg",
			"fried_egg",
			"shallow_pan_of_food",
			"stew",
			"bowl_with_spoon",
			"green_salad",
			"popcorn",
			"butter",
			"salt",
			"canned_food",
			"bento",
			"rice_cracker",
			"rice_ball",
			"rice",
			"curry",
			"ramen",
			"spaghetti",
			"sweet_potato",
			"oden",
			"sushi",
			"fried_shrimp",
			"fish_cake",
			"moon_cake",
			"dango",
			"dumpling",
			"fortune_cookie",
			"takeout_box",
			"crab",
			"lobster",
			"shrimp",
			"squid",
			"oyster",
			"icecream",
			"shaved_ice",
			"ice_cream",
			"doughnut",
			"cookie",
			"birthday",
			"cake",
			"cupcake",
			"pie",
			"chocolate_bar",
			"candy",
			"lollipop",
			"custard",
			"honey_pot",
			"baby_bottle",
			"glass_of_milk",
			"coffee",
			"tea",
			"sake",
			"champagne",
			"wine_glass",
			"cocktail",
			"tropical_drink",
			"beer",
			"beers",
			"clinking_glasses",
			"tumbler_glass",
			"cup_with_straw",
			"beverage_box",
			"mate_drink",
			"ice_cube",
			"chopsticks",
			"knife_fork_plate",
			"fork_and_knife",
			"spoon",
			"hocho",
			"amphora"
		]
	},
	{
		id: "activity",
		name: "Activities",
		emojis: [
			"jack_o_lantern",
			"christmas_tree",
			"fireworks",
			"sparkler",
			"firecracker",
			"sparkles",
			"balloon",
			"tada",
			"confetti_ball",
			"tanabata_tree",
			"bamboo",
			"dolls",
			"flags",
			"wind_chime",
			"rice_scene",
			"red_envelope",
			"ribbon",
			"gift",
			"reminder_ribbon",
			"admission_tickets",
			"ticket",
			"medal",
			"trophy",
			"sports_medal",
			"first_place_medal",
			"second_place_medal",
			"third_place_medal",
			"soccer",
			"baseball",
			"softball",
			"basketball",
			"volleyball",
			"football",
			"rugby_football",
			"tennis",
			"flying_disc",
			"bowling",
			"cricket_bat_and_ball",
			"field_hockey_stick_and_ball",
			"ice_hockey_stick_and_puck",
			"lacrosse",
			"table_tennis_paddle_and_ball",
			"badminton_racquet_and_shuttlecock",
			"boxing_glove",
			"martial_arts_uniform",
			"goal_net",
			"golf",
			"ice_skate",
			"fishing_pole_and_fish",
			"diving_mask",
			"running_shirt_with_sash",
			"ski",
			"sled",
			"curling_stone",
			"dart",
			"yo-yo",
			"kite",
			"8ball",
			"crystal_ball",
			"nazar_amulet",
			"video_game",
			"joystick",
			"slot_machine",
			"game_die",
			"jigsaw",
			"teddy_bear",
			"spades",
			"hearts",
			"diamonds",
			"clubs",
			"chess_pawn",
			"black_joker",
			"mahjong",
			"flower_playing_cards",
			"performing_arts",
			"frame_with_picture",
			"art",
			"thread",
			"yarn"
		]
	},
	{
		id: "places",
		name: "Travel & Places",
		emojis: [
			"earth_africa",
			"earth_americas",
			"earth_asia",
			"globe_with_meridians",
			"world_map",
			"japan",
			"compass",
			"snow_capped_mountain",
			"mountain",
			"volcano",
			"mount_fuji",
			"camping",
			"beach_with_umbrella",
			"desert",
			"desert_island",
			"national_park",
			"stadium",
			"classical_building",
			"building_construction",
			"bricks",
			"house_buildings",
			"derelict_house_building",
			"house",
			"house_with_garden",
			"office",
			"post_office",
			"european_post_office",
			"hospital",
			"bank",
			"hotel",
			"love_hotel",
			"convenience_store",
			"school",
			"department_store",
			"factory",
			"japanese_castle",
			"european_castle",
			"wedding",
			"tokyo_tower",
			"statue_of_liberty",
			"church",
			"mosque",
			"hindu_temple",
			"synagogue",
			"shinto_shrine",
			"kaaba",
			"fountain",
			"tent",
			"foggy",
			"night_with_stars",
			"cityscape",
			"sunrise_over_mountains",
			"sunrise",
			"city_sunset",
			"city_sunrise",
			"bridge_at_night",
			"hotsprings",
			"carousel_horse",
			"ferris_wheel",
			"roller_coaster",
			"barber",
			"circus_tent",
			"steam_locomotive",
			"railway_car",
			"bullettrain_side",
			"bullettrain_front",
			"train2",
			"metro",
			"light_rail",
			"station",
			"tram",
			"monorail",
			"mountain_railway",
			"train",
			"bus",
			"oncoming_bus",
			"trolleybus",
			"minibus",
			"ambulance",
			"fire_engine",
			"police_car",
			"oncoming_police_car",
			"taxi",
			"oncoming_taxi",
			"car",
			"oncoming_automobile",
			"blue_car",
			"truck",
			"articulated_lorry",
			"tractor",
			"racing_car",
			"racing_motorcycle",
			"motor_scooter",
			"manual_wheelchair",
			"motorized_wheelchair",
			"auto_rickshaw",
			"bike",
			"scooter",
			"skateboard",
			"busstop",
			"motorway",
			"railway_track",
			"oil_drum",
			"fuelpump",
			"rotating_light",
			"traffic_light",
			"vertical_traffic_light",
			"octagonal_sign",
			"construction",
			"anchor",
			"boat",
			"canoe",
			"speedboat",
			"passenger_ship",
			"ferry",
			"motor_boat",
			"ship",
			"airplane",
			"small_airplane",
			"airplane_departure",
			"airplane_arriving",
			"parachute",
			"seat",
			"helicopter",
			"suspension_railway",
			"mountain_cableway",
			"aerial_tramway",
			"satellite",
			"rocket",
			"flying_saucer",
			"bellhop_bell",
			"luggage",
			"hourglass",
			"hourglass_flowing_sand",
			"watch",
			"alarm_clock",
			"stopwatch",
			"timer_clock",
			"mantelpiece_clock",
			"clock12",
			"clock1230",
			"clock1",
			"clock130",
			"clock2",
			"clock230",
			"clock3",
			"clock330",
			"clock4",
			"clock430",
			"clock5",
			"clock530",
			"clock6",
			"clock630",
			"clock7",
			"clock730",
			"clock8",
			"clock830",
			"clock9",
			"clock930",
			"clock10",
			"clock1030",
			"clock11",
			"clock1130",
			"new_moon",
			"waxing_crescent_moon",
			"first_quarter_moon",
			"moon",
			"full_moon",
			"waning_gibbous_moon",
			"last_quarter_moon",
			"waning_crescent_moon",
			"crescent_moon",
			"new_moon_with_face",
			"first_quarter_moon_with_face",
			"last_quarter_moon_with_face",
			"thermometer",
			"sunny",
			"full_moon_with_face",
			"sun_with_face",
			"ringed_planet",
			"star",
			"star2",
			"stars",
			"milky_way",
			"cloud",
			"partly_sunny",
			"thunder_cloud_and_rain",
			"mostly_sunny",
			"barely_sunny",
			"partly_sunny_rain",
			"rain_cloud",
			"snow_cloud",
			"lightning",
			"tornado",
			"fog",
			"wind_blowing_face",
			"cyclone",
			"rainbow",
			"closed_umbrella",
			"umbrella",
			"umbrella_with_rain_drops",
			"umbrella_on_ground",
			"zap",
			"snowflake",
			"snowman",
			"snowman_without_snow",
			"comet",
			"fire",
			"droplet",
			"ocean"
		]
	},
	{
		id: "objects",
		name: "Objects",
		emojis: [
			"eyeglasses",
			"dark_sunglasses",
			"goggles",
			"lab_coat",
			"safety_vest",
			"necktie",
			"shirt",
			"jeans",
			"scarf",
			"gloves",
			"coat",
			"socks",
			"dress",
			"kimono",
			"sari",
			"one-piece_swimsuit",
			"briefs",
			"shorts",
			"bikini",
			"womans_clothes",
			"purse",
			"handbag",
			"pouch",
			"shopping_bags",
			"school_satchel",
			"mans_shoe",
			"athletic_shoe",
			"hiking_boot",
			"womans_flat_shoe",
			"high_heel",
			"sandal",
			"ballet_shoes",
			"boot",
			"crown",
			"womans_hat",
			"tophat",
			"mortar_board",
			"billed_cap",
			"helmet_with_white_cross",
			"prayer_beads",
			"lipstick",
			"ring",
			"gem",
			"mute",
			"speaker",
			"sound",
			"loud_sound",
			"loudspeaker",
			"mega",
			"postal_horn",
			"bell",
			"no_bell",
			"musical_score",
			"musical_note",
			"notes",
			"studio_microphone",
			"level_slider",
			"control_knobs",
			"microphone",
			"headphones",
			"radio",
			"saxophone",
			"guitar",
			"musical_keyboard",
			"trumpet",
			"violin",
			"banjo",
			"drum_with_drumsticks",
			"iphone",
			"calling",
			"phone",
			"telephone_receiver",
			"pager",
			"fax",
			"battery",
			"electric_plug",
			"computer",
			"desktop_computer",
			"printer",
			"keyboard",
			"three_button_mouse",
			"trackball",
			"minidisc",
			"floppy_disk",
			"cd",
			"dvd",
			"abacus",
			"movie_camera",
			"film_frames",
			"film_projector",
			"clapper",
			"tv",
			"camera",
			"camera_with_flash",
			"video_camera",
			"vhs",
			"mag",
			"mag_right",
			"candle",
			"bulb",
			"flashlight",
			"izakaya_lantern",
			"diya_lamp",
			"notebook_with_decorative_cover",
			"closed_book",
			"book",
			"green_book",
			"blue_book",
			"orange_book",
			"books",
			"notebook",
			"ledger",
			"page_with_curl",
			"scroll",
			"page_facing_up",
			"newspaper",
			"rolled_up_newspaper",
			"bookmark_tabs",
			"bookmark",
			"label",
			"moneybag",
			"yen",
			"dollar",
			"euro",
			"pound",
			"money_with_wings",
			"credit_card",
			"receipt",
			"chart",
			"currency_exchange",
			"heavy_dollar_sign",
			"email",
			"e-mail",
			"incoming_envelope",
			"envelope_with_arrow",
			"outbox_tray",
			"inbox_tray",
			"package",
			"mailbox",
			"mailbox_closed",
			"mailbox_with_mail",
			"mailbox_with_no_mail",
			"postbox",
			"ballot_box_with_ballot",
			"pencil2",
			"black_nib",
			"lower_left_fountain_pen",
			"lower_left_ballpoint_pen",
			"lower_left_paintbrush",
			"lower_left_crayon",
			"memo",
			"briefcase",
			"file_folder",
			"open_file_folder",
			"card_index_dividers",
			"date",
			"calendar",
			"spiral_note_pad",
			"spiral_calendar_pad",
			"card_index",
			"chart_with_upwards_trend",
			"chart_with_downwards_trend",
			"bar_chart",
			"clipboard",
			"pushpin",
			"round_pushpin",
			"paperclip",
			"linked_paperclips",
			"straight_ruler",
			"triangular_ruler",
			"scissors",
			"card_file_box",
			"file_cabinet",
			"wastebasket",
			"lock",
			"unlock",
			"lock_with_ink_pen",
			"closed_lock_with_key",
			"key",
			"old_key",
			"hammer",
			"axe",
			"pick",
			"hammer_and_pick",
			"hammer_and_wrench",
			"dagger_knife",
			"crossed_swords",
			"gun",
			"bow_and_arrow",
			"shield",
			"wrench",
			"nut_and_bolt",
			"gear",
			"compression",
			"scales",
			"probing_cane",
			"link",
			"chains",
			"toolbox",
			"magnet",
			"alembic",
			"test_tube",
			"petri_dish",
			"dna",
			"microscope",
			"telescope",
			"satellite_antenna",
			"syringe",
			"drop_of_blood",
			"pill",
			"adhesive_bandage",
			"stethoscope",
			"door",
			"bed",
			"couch_and_lamp",
			"chair",
			"toilet",
			"shower",
			"bathtub",
			"razor",
			"lotion_bottle",
			"safety_pin",
			"broom",
			"basket",
			"roll_of_paper",
			"soap",
			"sponge",
			"fire_extinguisher",
			"shopping_trolley",
			"smoking",
			"coffin",
			"funeral_urn",
			"moyai"
		]
	},
	{
		id: "symbols",
		name: "Symbols",
		emojis: [
			"atm",
			"put_litter_in_its_place",
			"potable_water",
			"wheelchair",
			"mens",
			"womens",
			"restroom",
			"baby_symbol",
			"wc",
			"passport_control",
			"customs",
			"baggage_claim",
			"left_luggage",
			"warning",
			"children_crossing",
			"no_entry",
			"no_entry_sign",
			"no_bicycles",
			"no_smoking",
			"do_not_litter",
			"non-potable_water",
			"no_pedestrians",
			"no_mobile_phones",
			"underage",
			"radioactive_sign",
			"biohazard_sign",
			"arrow_up",
			"arrow_upper_right",
			"arrow_right",
			"arrow_lower_right",
			"arrow_down",
			"arrow_lower_left",
			"arrow_left",
			"arrow_upper_left",
			"arrow_up_down",
			"left_right_arrow",
			"leftwards_arrow_with_hook",
			"arrow_right_hook",
			"arrow_heading_up",
			"arrow_heading_down",
			"arrows_clockwise",
			"arrows_counterclockwise",
			"back",
			"end",
			"on",
			"soon",
			"top",
			"place_of_worship",
			"atom_symbol",
			"om_symbol",
			"star_of_david",
			"wheel_of_dharma",
			"yin_yang",
			"latin_cross",
			"orthodox_cross",
			"star_and_crescent",
			"peace_symbol",
			"menorah_with_nine_branches",
			"six_pointed_star",
			"aries",
			"taurus",
			"gemini",
			"cancer",
			"leo",
			"virgo",
			"libra",
			"scorpius",
			"sagittarius",
			"capricorn",
			"aquarius",
			"pisces",
			"ophiuchus",
			"twisted_rightwards_arrows",
			"repeat",
			"repeat_one",
			"arrow_forward",
			"fast_forward",
			"black_right_pointing_double_triangle_with_vertical_bar",
			"black_right_pointing_triangle_with_double_vertical_bar",
			"arrow_backward",
			"rewind",
			"black_left_pointing_double_triangle_with_vertical_bar",
			"arrow_up_small",
			"arrow_double_up",
			"arrow_down_small",
			"arrow_double_down",
			"double_vertical_bar",
			"black_square_for_stop",
			"black_circle_for_record",
			"eject",
			"cinema",
			"low_brightness",
			"high_brightness",
			"signal_strength",
			"vibration_mode",
			"mobile_phone_off",
			"female_sign",
			"male_sign",
			"medical_symbol",
			"infinity",
			"recycle",
			"fleur_de_lis",
			"trident",
			"name_badge",
			"beginner",
			"o",
			"white_check_mark",
			"ballot_box_with_check",
			"heavy_check_mark",
			"heavy_multiplication_x",
			"x",
			"negative_squared_cross_mark",
			"heavy_plus_sign",
			"heavy_minus_sign",
			"heavy_division_sign",
			"curly_loop",
			"loop",
			"part_alternation_mark",
			"eight_spoked_asterisk",
			"eight_pointed_black_star",
			"sparkle",
			"bangbang",
			"interrobang",
			"question",
			"grey_question",
			"grey_exclamation",
			"exclamation",
			"wavy_dash",
			"copyright",
			"registered",
			"tm",
			"hash",
			"keycap_star",
			"zero",
			"one",
			"two",
			"three",
			"four",
			"five",
			"six",
			"seven",
			"eight",
			"nine",
			"keycap_ten",
			"capital_abcd",
			"abcd",
			"1234",
			"symbols",
			"abc",
			"a",
			"ab",
			"b",
			"cl",
			"cool",
			"free",
			"information_source",
			"id",
			"m",
			"new",
			"ng",
			"o2",
			"ok",
			"parking",
			"sos",
			"up",
			"vs",
			"koko",
			"sa",
			"u6708",
			"u6709",
			"u6307",
			"ideograph_advantage",
			"u5272",
			"u7121",
			"u7981",
			"accept",
			"u7533",
			"u5408",
			"u7a7a",
			"congratulations",
			"secret",
			"u55b6",
			"u6e80",
			"red_circle",
			"large_orange_circle",
			"large_yellow_circle",
			"large_green_circle",
			"large_blue_circle",
			"large_purple_circle",
			"large_brown_circle",
			"black_circle",
			"white_circle",
			"large_red_square",
			"large_orange_square",
			"large_yellow_square",
			"large_green_square",
			"large_blue_square",
			"large_purple_square",
			"large_brown_square",
			"black_large_square",
			"white_large_square",
			"black_medium_square",
			"white_medium_square",
			"black_medium_small_square",
			"white_medium_small_square",
			"black_small_square",
			"white_small_square",
			"large_orange_diamond",
			"large_blue_diamond",
			"small_orange_diamond",
			"small_blue_diamond",
			"small_red_triangle",
			"small_red_triangle_down",
			"diamond_shape_with_a_dot_inside",
			"radio_button",
			"white_square_button",
			"black_square_button"
		]
	},
	{
		id: "flags",
		name: "Flags",
		emojis: [
			"checkered_flag",
			"cn",
			"crossed_flags",
			"de",
			"es",
			"flag-ac",
			"flag-ad",
			"flag-ae",
			"flag-af",
			"flag-ag",
			"flag-ai",
			"flag-al",
			"flag-am",
			"flag-ao",
			"flag-aq",
			"flag-ar",
			"flag-as",
			"flag-at",
			"flag-au",
			"flag-aw",
			"flag-ax",
			"flag-az",
			"flag-ba",
			"flag-bb",
			"flag-bd",
			"flag-be",
			"flag-bf",
			"flag-bg",
			"flag-bh",
			"flag-bi",
			"flag-bj",
			"flag-bl",
			"flag-bm",
			"flag-bn",
			"flag-bo",
			"flag-bq",
			"flag-br",
			"flag-bs",
			"flag-bt",
			"flag-bv",
			"flag-bw",
			"flag-by",
			"flag-bz",
			"flag-ca",
			"flag-cc",
			"flag-cd",
			"flag-cf",
			"flag-cg",
			"flag-ch",
			"flag-ci",
			"flag-ck",
			"flag-cl",
			"flag-cm",
			"flag-co",
			"flag-cp",
			"flag-cr",
			"flag-cu",
			"flag-cv",
			"flag-cw",
			"flag-cx",
			"flag-cy",
			"flag-cz",
			"flag-dg",
			"flag-dj",
			"flag-dk",
			"flag-dm",
			"flag-do",
			"flag-dz",
			"flag-ea",
			"flag-ec",
			"flag-ee",
			"flag-eg",
			"flag-eh",
			"flag-england",
			"flag-er",
			"flag-et",
			"flag-eu",
			"flag-fi",
			"flag-fj",
			"flag-fk",
			"flag-fm",
			"flag-fo",
			"flag-ga",
			"flag-gd",
			"flag-ge",
			"flag-gf",
			"flag-gg",
			"flag-gh",
			"flag-gi",
			"flag-gl",
			"flag-gm",
			"flag-gn",
			"flag-gp",
			"flag-gq",
			"flag-gr",
			"flag-gs",
			"flag-gt",
			"flag-gu",
			"flag-gw",
			"flag-gy",
			"flag-hk",
			"flag-hm",
			"flag-hn",
			"flag-hr",
			"flag-ht",
			"flag-hu",
			"flag-ic",
			"flag-id",
			"flag-ie",
			"flag-il",
			"flag-im",
			"flag-in",
			"flag-io",
			"flag-iq",
			"flag-ir",
			"flag-is",
			"flag-je",
			"flag-jm",
			"flag-jo",
			"flag-ke",
			"flag-kg",
			"flag-kh",
			"flag-ki",
			"flag-km",
			"flag-kn",
			"flag-kp",
			"flag-kw",
			"flag-ky",
			"flag-kz",
			"flag-la",
			"flag-lb",
			"flag-lc",
			"flag-li",
			"flag-lk",
			"flag-lr",
			"flag-ls",
			"flag-lt",
			"flag-lu",
			"flag-lv",
			"flag-ly",
			"flag-ma",
			"flag-mc",
			"flag-md",
			"flag-me",
			"flag-mf",
			"flag-mg",
			"flag-mh",
			"flag-mk",
			"flag-ml",
			"flag-mm",
			"flag-mn",
			"flag-mo",
			"flag-mp",
			"flag-mq",
			"flag-mr",
			"flag-ms",
			"flag-mt",
			"flag-mu",
			"flag-mv",
			"flag-mw",
			"flag-mx",
			"flag-my",
			"flag-mz",
			"flag-na",
			"flag-nc",
			"flag-ne",
			"flag-nf",
			"flag-ng",
			"flag-ni",
			"flag-nl",
			"flag-no",
			"flag-np",
			"flag-nr",
			"flag-nu",
			"flag-nz",
			"flag-om",
			"flag-pa",
			"flag-pe",
			"flag-pf",
			"flag-pg",
			"flag-ph",
			"flag-pk",
			"flag-pl",
			"flag-pm",
			"flag-pn",
			"flag-pr",
			"flag-ps",
			"flag-pt",
			"flag-pw",
			"flag-py",
			"flag-qa",
			"flag-re",
			"flag-ro",
			"flag-rs",
			"flag-rw",
			"flag-sa",
			"flag-sb",
			"flag-sc",
			"flag-scotland",
			"flag-sd",
			"flag-se",
			"flag-sg",
			"flag-sh",
			"flag-si",
			"flag-sj",
			"flag-sk",
			"flag-sl",
			"flag-sm",
			"flag-sn",
			"flag-so",
			"flag-sr",
			"flag-ss",
			"flag-st",
			"flag-sv",
			"flag-sx",
			"flag-sy",
			"flag-sz",
			"flag-ta",
			"flag-tc",
			"flag-td",
			"flag-tf",
			"flag-tg",
			"flag-th",
			"flag-tj",
			"flag-tk",
			"flag-tl",
			"flag-tm",
			"flag-tn",
			"flag-to",
			"flag-tr",
			"flag-tt",
			"flag-tv",
			"flag-tw",
			"flag-tz",
			"flag-ua",
			"flag-ug",
			"flag-um",
			"flag-uy",
			"flag-uz",
			"flag-va",
			"flag-vc",
			"flag-ve",
			"flag-vg",
			"flag-vi",
			"flag-vn",
			"flag-vu",
			"flag-wales",
			"flag-wf",
			"flag-ws",
			"flag-xk",
			"flag-ye",
			"flag-yt",
			"flag-za",
			"flag-zm",
			"flag-zw",
			"fr",
			"gb",
			"it",
			"jp",
			"kr",
			"pirate_flag",
			"rainbow-flag",
			"ru",
			"triangular_flag_on_post",
			"us",
			"waving_black_flag",
			"waving_white_flag"
		]
	}
];
var emojis = {
	"100": {
		a: "Hundred Points Symbol",
		b: "1F4AF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"score",
			"perfect",
			"numbers",
			"century",
			"exam",
			"quiz",
			"test",
			"pass",
			"hundred"
		],
		k: [
			26,
			5
		],
		o: 2
	},
	"1234": {
		a: "Input Symbol for Numbers",
		b: "1F522",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"numbers",
			"blue-square"
		],
		k: [
			28,
			5
		],
		o: 2
	},
	grinning: {
		a: "Grinning Face",
		b: "1F600",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"smile",
			"happy",
			"joy",
			":D",
			"grin"
		],
		k: [
			30,
			35
		],
		m: ":D",
		o: 2
	},
	monkey_face: {
		a: "Monkey Face",
		b: "1F435",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"circus"
		],
		k: [
			12,
			25
		],
		l: [
			":o)"
		],
		o: 2
	},
	grapes: {
		a: "Grapes",
		b: "1F347",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"food",
			"wine"
		],
		k: [
			6,
			31
		],
		o: 2
	},
	eyeglasses: {
		a: "Eyeglasses",
		b: "1F453",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fashion",
			"accessories",
			"eyesight",
			"nerdy",
			"dork",
			"geek"
		],
		k: [
			14,
			7
		],
		o: 2
	},
	checkered_flag: {
		a: "Chequered Flag",
		b: "1F3C1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"contest",
			"finishline",
			"race",
			"gokart"
		],
		k: [
			8,
			39
		],
		o: 2
	},
	jack_o_lantern: {
		a: "Jack-O-Lantern",
		b: "1F383",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"halloween",
			"light",
			"pumpkin",
			"creepy",
			"fall"
		],
		k: [
			7,
			34
		],
		o: 2
	},
	wave: {
		skin_variations: {
			"1F3FB": {
				unified: "1F44B-1F3FB",
				non_qualified: null,
				image: "1f44b-1f3fb.png",
				sheet_x: 13,
				sheet_y: 27,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F44B-1F3FC",
				non_qualified: null,
				image: "1f44b-1f3fc.png",
				sheet_x: 13,
				sheet_y: 28,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F44B-1F3FD",
				non_qualified: null,
				image: "1f44b-1f3fd.png",
				sheet_x: 13,
				sheet_y: 29,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F44B-1F3FE",
				non_qualified: null,
				image: "1f44b-1f3fe.png",
				sheet_x: 13,
				sheet_y: 30,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F44B-1F3FF",
				non_qualified: null,
				image: "1f44b-1f3ff.png",
				sheet_x: 13,
				sheet_y: 31,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Waving Hand Sign",
		b: "1F44B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hands",
			"gesture",
			"goodbye",
			"solong",
			"farewell",
			"hello",
			"hi",
			"palm"
		],
		k: [
			13,
			26
		],
		o: 2
	},
	earth_africa: {
		a: "Earth Globe Europe-Africa",
		b: "1F30D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"globe",
			"world",
			"international"
		],
		k: [
			5,
			32
		],
		o: 2
	},
	atm: {
		a: "Automated Teller Machine",
		b: "1F3E7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"money",
			"sales",
			"cash",
			"blue-square",
			"payment",
			"bank"
		],
		k: [
			11,
			1
		],
		o: 2
	},
	melon: {
		a: "Melon",
		b: "1F348",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"nature",
			"food"
		],
		k: [
			6,
			32
		],
		o: 2
	},
	triangular_flag_on_post: {
		a: "Triangular Flag on Post",
		b: "1F6A9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"mark",
			"milestone",
			"place"
		],
		k: [
			35,
			0
		],
		o: 2
	},
	put_litter_in_its_place: {
		a: "Put Litter in Its Place Symbol",
		b: "1F6AE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"sign",
			"human",
			"info"
		],
		k: [
			35,
			5
		],
		o: 2
	},
	christmas_tree: {
		a: "Christmas Tree",
		b: "1F384",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"festival",
			"vacation",
			"december",
			"xmas",
			"celebration"
		],
		k: [
			7,
			35
		],
		o: 2
	},
	monkey: {
		a: "Monkey",
		b: "1F412",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"banana",
			"circus"
		],
		k: [
			11,
			46
		],
		o: 2
	},
	earth_americas: {
		a: "Earth Globe Americas",
		b: "1F30E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"globe",
			"world",
			"USA",
			"international"
		],
		k: [
			5,
			33
		],
		o: 2
	},
	dark_sunglasses: {
		a: "Dark Sunglasses",
		b: "1F576-FE0F",
		c: "1F576",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"cool",
			"accessories"
		],
		k: [
			29,
			33
		],
		o: 2
	},
	raised_back_of_hand: {
		skin_variations: {
			"1F3FB": {
				unified: "1F91A-1F3FB",
				non_qualified: null,
				image: "1f91a-1f3fb.png",
				sheet_x: 37,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F91A-1F3FC",
				non_qualified: null,
				image: "1f91a-1f3fc.png",
				sheet_x: 37,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F91A-1F3FD",
				non_qualified: null,
				image: "1f91a-1f3fd.png",
				sheet_x: 37,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F91A-1F3FE",
				non_qualified: null,
				image: "1f91a-1f3fe.png",
				sheet_x: 37,
				sheet_y: 47,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F91A-1F3FF",
				non_qualified: null,
				image: "1f91a-1f3ff.png",
				sheet_x: 37,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Raised Back of Hand",
		b: "1F91A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fingers",
			"raised",
			"backhand"
		],
		k: [
			37,
			43
		],
		o: 4
	},
	smiley: {
		a: "Smiling Face with Open Mouth",
		b: "1F603",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"happy",
			"joy",
			"haha",
			":D",
			":)",
			"smile",
			"funny"
		],
		k: [
			30,
			38
		],
		l: [
			"=)",
			"=-)"
		],
		m: ":)",
		o: 2
	},
	earth_asia: {
		a: "Earth Globe Asia-Australia",
		b: "1F30F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"globe",
			"world",
			"east",
			"international"
		],
		k: [
			5,
			34
		],
		o: 2
	},
	crossed_flags: {
		a: "Crossed Flags",
		b: "1F38C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"japanese",
			"nation",
			"country",
			"border"
		],
		k: [
			7,
			48
		],
		o: 2
	},
	watermelon: {
		a: "Watermelon",
		b: "1F349",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"food",
			"picnic",
			"summer"
		],
		k: [
			6,
			33
		],
		o: 2
	},
	goggles: {
		a: "Goggles",
		b: "1F97D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			15
		],
		o: 11
	},
	raised_hand_with_fingers_splayed: {
		skin_variations: {
			"1F3FB": {
				unified: "1F590-1F3FB",
				non_qualified: null,
				image: "1f590-1f3fb.png",
				sheet_x: 29,
				sheet_y: 49,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F590-1F3FC",
				non_qualified: null,
				image: "1f590-1f3fc.png",
				sheet_x: 29,
				sheet_y: 50,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F590-1F3FD",
				non_qualified: null,
				image: "1f590-1f3fd.png",
				sheet_x: 29,
				sheet_y: 51,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F590-1F3FE",
				non_qualified: null,
				image: "1f590-1f3fe.png",
				sheet_x: 29,
				sheet_y: 52,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F590-1F3FF",
				non_qualified: null,
				image: "1f590-1f3ff.png",
				sheet_x: 29,
				sheet_y: 53,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Raised Hand with Fingers Splayed",
		b: "1F590-FE0F",
		c: "1F590",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hand",
			"fingers",
			"palm"
		],
		k: [
			29,
			48
		],
		o: 2
	},
	smile: {
		a: "Smiling Face with Open Mouth and Smiling Eyes",
		b: "1F604",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"happy",
			"joy",
			"funny",
			"haha",
			"laugh",
			"like",
			":D",
			":)"
		],
		k: [
			30,
			39
		],
		l: [
			"C:",
			"c:",
			":D",
			":-D"
		],
		m: ":)",
		o: 2
	},
	potable_water: {
		a: "Potable Water Symbol",
		b: "1F6B0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"liquid",
			"restroom",
			"cleaning",
			"faucet"
		],
		k: [
			35,
			7
		],
		o: 2
	},
	fireworks: {
		a: "Fireworks",
		b: "1F386",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"festival",
			"carnival",
			"congratulations"
		],
		k: [
			7,
			42
		],
		o: 2
	},
	gorilla: {
		a: "Gorilla",
		b: "1F98D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"circus"
		],
		k: [
			42,
			31
		],
		o: 4
	},
	lab_coat: {
		a: "Lab Coat",
		b: "1F97C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			14
		],
		o: 11
	},
	tangerine: {
		a: "Tangerine",
		b: "1F34A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"fruit",
			"nature",
			"orange"
		],
		k: [
			6,
			34
		],
		o: 2
	},
	wheelchair: {
		a: "Wheelchair Symbol",
		b: "267F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"disabled",
			"a11y",
			"accessibility"
		],
		k: [
			53,
			40
		],
		o: 2
	},
	waving_black_flag: {
		a: "Waving Black Flag",
		b: "1F3F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			17
		],
		o: 2
	},
	orangutan: {
		a: "Orangutan",
		b: "1F9A7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			55
		],
		o: 12
	},
	sparkler: {
		a: "Firework Sparkler",
		b: "1F387",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stars",
			"night",
			"shine"
		],
		k: [
			7,
			43
		],
		o: 2
	},
	globe_with_meridians: {
		a: "Globe with Meridians",
		b: "1F310",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"earth",
			"international",
			"world",
			"internet",
			"interweb",
			"i18n"
		],
		k: [
			5,
			35
		],
		o: 2
	},
	grin: {
		a: "Grinning Face with Smiling Eyes",
		b: "1F601",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"happy",
			"smile",
			"joy",
			"kawaii"
		],
		k: [
			30,
			36
		],
		o: 2
	},
	hand: {
		skin_variations: {
			"1F3FB": {
				unified: "270B-1F3FB",
				non_qualified: null,
				image: "270b-1f3fb.png",
				sheet_x: 54,
				sheet_y: 50,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "270B-1F3FC",
				non_qualified: null,
				image: "270b-1f3fc.png",
				sheet_x: 54,
				sheet_y: 51,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "270B-1F3FD",
				non_qualified: null,
				image: "270b-1f3fd.png",
				sheet_x: 54,
				sheet_y: 52,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "270B-1F3FE",
				non_qualified: null,
				image: "270b-1f3fe.png",
				sheet_x: 54,
				sheet_y: 53,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "270B-1F3FF",
				non_qualified: null,
				image: "270b-1f3ff.png",
				sheet_x: 54,
				sheet_y: 54,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Raised Hand",
		b: "270B",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			54,
			49
		],
		n: [
			"raised_hand"
		],
		o: 2
	},
	firecracker: {
		a: "Firecracker",
		b: "1F9E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			27
		],
		o: 11
	},
	lemon: {
		a: "Lemon",
		b: "1F34B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"nature"
		],
		k: [
			6,
			35
		],
		o: 2
	},
	dog: {
		a: "Dog Face",
		b: "1F436",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"friend",
			"nature",
			"woof",
			"puppy",
			"pet",
			"faithful"
		],
		k: [
			12,
			26
		],
		o: 2
	},
	mens: {
		a: "Mens Symbol",
		b: "1F6B9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"toilet",
			"restroom",
			"wc",
			"blue-square",
			"gender",
			"male"
		],
		k: [
			36,
			10
		],
		o: 2
	},
	"spock-hand": {
		skin_variations: {
			"1F3FB": {
				unified: "1F596-1F3FB",
				non_qualified: null,
				image: "1f596-1f3fb.png",
				sheet_x: 30,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F596-1F3FC",
				non_qualified: null,
				image: "1f596-1f3fc.png",
				sheet_x: 30,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F596-1F3FD",
				non_qualified: null,
				image: "1f596-1f3fd.png",
				sheet_x: 30,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F596-1F3FE",
				non_qualified: null,
				image: "1f596-1f3fe.png",
				sheet_x: 30,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F596-1F3FF",
				non_qualified: null,
				image: "1f596-1f3ff.png",
				sheet_x: 30,
				sheet_y: 8,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Raised Hand with Part Between Middle and Ring Fingers",
		b: "1F596",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			3
		],
		o: 2
	},
	world_map: {
		a: "World Map",
		b: "1F5FA-FE0F",
		c: "1F5FA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"location",
			"direction"
		],
		k: [
			30,
			29
		],
		o: 2
	},
	laughing: {
		a: "Smiling Face with Open Mouth and Tightly-Closed Eyes",
		b: "1F606",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"happy",
			"joy",
			"lol",
			"satisfied",
			"haha",
			"face",
			"glad",
			"XD",
			"laugh"
		],
		k: [
			30,
			41
		],
		l: [
			":>",
			":->"
		],
		n: [
			"satisfied"
		],
		o: 2
	},
	waving_white_flag: {
		a: "Waving White Flag",
		b: "1F3F3-FE0F",
		c: "1F3F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			12
		],
		o: 2
	},
	safety_vest: {
		a: "Safety Vest",
		b: "1F9BA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			54
		],
		o: 12
	},
	sweat_smile: {
		a: "Smiling Face with Open Mouth and Cold Sweat",
		b: "1F605",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"hot",
			"happy",
			"laugh",
			"sweat",
			"smile",
			"relief"
		],
		k: [
			30,
			40
		],
		o: 2
	},
	sparkles: {
		a: "Sparkles",
		b: "2728",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stars",
			"shine",
			"shiny",
			"cool",
			"awesome",
			"good",
			"magic"
		],
		k: [
			55,
			16
		],
		o: 2
	},
	banana: {
		a: "Banana",
		b: "1F34C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"food",
			"monkey"
		],
		k: [
			6,
			36
		],
		o: 2
	},
	"rainbow-flag": {
		a: "Rainbow Flag",
		b: "1F3F3-FE0F-200D-1F308",
		c: "1F3F3-200D-1F308",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			11
		],
		o: 4
	},
	ok_hand: {
		skin_variations: {
			"1F3FB": {
				unified: "1F44C-1F3FB",
				non_qualified: null,
				image: "1f44c-1f3fb.png",
				sheet_x: 13,
				sheet_y: 33,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F44C-1F3FC",
				non_qualified: null,
				image: "1f44c-1f3fc.png",
				sheet_x: 13,
				sheet_y: 34,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F44C-1F3FD",
				non_qualified: null,
				image: "1f44c-1f3fd.png",
				sheet_x: 13,
				sheet_y: 35,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F44C-1F3FE",
				non_qualified: null,
				image: "1f44c-1f3fe.png",
				sheet_x: 13,
				sheet_y: 36,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F44C-1F3FF",
				non_qualified: null,
				image: "1f44c-1f3ff.png",
				sheet_x: 13,
				sheet_y: 37,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Ok Hand Sign",
		b: "1F44C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fingers",
			"limbs",
			"perfect",
			"ok",
			"okay"
		],
		k: [
			13,
			32
		],
		o: 2
	},
	japan: {
		a: "Silhouette of Japan",
		b: "1F5FE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nation",
			"country",
			"japanese",
			"asia"
		],
		k: [
			30,
			33
		],
		o: 2
	},
	dog2: {
		a: "Dog",
		b: "1F415",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"friend",
			"doge",
			"pet",
			"faithful"
		],
		k: [
			11,
			50
		],
		o: 2
	},
	womens: {
		a: "Womens Symbol",
		b: "1F6BA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"purple-square",
			"woman",
			"female",
			"toilet",
			"loo",
			"restroom",
			"gender"
		],
		k: [
			36,
			11
		],
		o: 2
	},
	necktie: {
		a: "Necktie",
		b: "1F454",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shirt",
			"suitup",
			"formal",
			"fashion",
			"cloth",
			"business"
		],
		k: [
			14,
			8
		],
		o: 2
	},
	pirate_flag: {
		a: "Pirate Flag",
		b: "1F3F4-200D-2620-FE0F",
		c: "1F3F4-200D-2620",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			13
		],
		o: 11
	},
	guide_dog: {
		a: "Guide Dog",
		b: "1F9AE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			2
		],
		o: 12
	},
	restroom: {
		a: "Restroom",
		b: "1F6BB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"toilet",
			"refresh",
			"wc",
			"gender"
		],
		k: [
			36,
			12
		],
		o: 2
	},
	compass: {
		a: "Compass",
		b: "1F9ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			32
		],
		o: 11
	},
	rolling_on_the_floor_laughing: {
		a: "Rolling on the Floor Laughing",
		b: "1F923",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			20
		],
		o: 4
	},
	balloon: {
		a: "Balloon",
		b: "1F388",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"party",
			"celebration",
			"birthday",
			"circus"
		],
		k: [
			7,
			44
		],
		o: 2
	},
	pinching_hand: {
		skin_variations: {
			"1F3FB": {
				unified: "1F90F-1F3FB",
				non_qualified: null,
				image: "1f90f-1f3fb.png",
				sheet_x: 37,
				sheet_y: 18,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F90F-1F3FC",
				non_qualified: null,
				image: "1f90f-1f3fc.png",
				sheet_x: 37,
				sheet_y: 19,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F90F-1F3FD",
				non_qualified: null,
				image: "1f90f-1f3fd.png",
				sheet_x: 37,
				sheet_y: 20,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F90F-1F3FE",
				non_qualified: null,
				image: "1f90f-1f3fe.png",
				sheet_x: 37,
				sheet_y: 21,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F90F-1F3FF",
				non_qualified: null,
				image: "1f90f-1f3ff.png",
				sheet_x: 37,
				sheet_y: 22,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Pinching Hand",
		b: "1F90F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			17
		],
		o: 12
	},
	pineapple: {
		a: "Pineapple",
		b: "1F34D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"nature",
			"food"
		],
		k: [
			6,
			37
		],
		o: 2
	},
	shirt: {
		a: "T-Shirt",
		b: "1F455",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			14,
			9
		],
		n: [
			"tshirt"
		],
		o: 2
	},
	service_dog: {
		a: "Service Dog",
		b: "1F415-200D-1F9BA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			49
		],
		o: 12
	},
	baby_symbol: {
		a: "Baby Symbol",
		b: "1F6BC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"orange-square",
			"child"
		],
		k: [
			36,
			13
		],
		o: 2
	},
	joy: {
		a: "Face with Tears of Joy",
		b: "1F602",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"cry",
			"tears",
			"weep",
			"happy",
			"happytears",
			"haha"
		],
		k: [
			30,
			37
		],
		o: 2
	},
	tada: {
		a: "Party Popper",
		b: "1F389",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"party",
			"congratulations",
			"birthday",
			"magic",
			"circus",
			"celebration"
		],
		k: [
			7,
			45
		],
		o: 2
	},
	mango: {
		a: "Mango",
		b: "1F96D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			3
		],
		o: 11
	},
	v: {
		skin_variations: {
			"1F3FB": {
				unified: "270C-1F3FB",
				non_qualified: null,
				image: "270c-1f3fb.png",
				sheet_x: 54,
				sheet_y: 56,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "270C-1F3FC",
				non_qualified: null,
				image: "270c-1f3fc.png",
				sheet_x: 55,
				sheet_y: 0,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "270C-1F3FD",
				non_qualified: null,
				image: "270c-1f3fd.png",
				sheet_x: 55,
				sheet_y: 1,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "270C-1F3FE",
				non_qualified: null,
				image: "270c-1f3fe.png",
				sheet_x: 55,
				sheet_y: 2,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "270C-1F3FF",
				non_qualified: null,
				image: "270c-1f3ff.png",
				sheet_x: 55,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Victory Hand",
		b: "270C-FE0F",
		c: "270C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fingers",
			"ohyeah",
			"hand",
			"peace",
			"victory",
			"two"
		],
		k: [
			54,
			55
		],
		o: 2
	},
	snow_capped_mountain: {
		a: "Snow Capped Mountain",
		b: "1F3D4-FE0F",
		c: "1F3D4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			39
		],
		o: 2
	},
	"flag-ac": {
		a: "Ascension Island Flag",
		b: "1F1E6-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			31
		],
		o: 2
	},
	jeans: {
		a: "Jeans",
		b: "1F456",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fashion",
			"shopping"
		],
		k: [
			14,
			10
		],
		o: 2
	},
	poodle: {
		a: "Poodle",
		b: "1F429",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dog",
			"animal",
			"101",
			"nature",
			"pet"
		],
		k: [
			12,
			13
		],
		o: 2
	},
	crossed_fingers: {
		skin_variations: {
			"1F3FB": {
				unified: "1F91E-1F3FB",
				non_qualified: null,
				image: "1f91e-1f3fb.png",
				sheet_x: 38,
				sheet_y: 6,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F91E-1F3FC",
				non_qualified: null,
				image: "1f91e-1f3fc.png",
				sheet_x: 38,
				sheet_y: 7,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F91E-1F3FD",
				non_qualified: null,
				image: "1f91e-1f3fd.png",
				sheet_x: 38,
				sheet_y: 8,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F91E-1F3FE",
				non_qualified: null,
				image: "1f91e-1f3fe.png",
				sheet_x: 38,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F91E-1F3FF",
				non_qualified: null,
				image: "1f91e-1f3ff.png",
				sheet_x: 38,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Hand with Index and Middle Fingers Crossed",
		b: "1F91E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"good",
			"lucky"
		],
		k: [
			38,
			5
		],
		n: [
			"hand_with_index_and_middle_fingers_crossed"
		],
		o: 4
	},
	"flag-ad": {
		a: "Andorra Flag",
		b: "1F1E6-1F1E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			32
		],
		o: 2
	},
	slightly_smiling_face: {
		a: "Slightly Smiling Face",
		b: "1F642",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"smile"
		],
		k: [
			31,
			44
		],
		l: [
			":)",
			"(:",
			":-)"
		],
		o: 2
	},
	apple: {
		a: "Red Apple",
		b: "1F34E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"mac",
			"school"
		],
		k: [
			6,
			38
		],
		o: 2
	},
	wc: {
		a: "Water Closet",
		b: "1F6BE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"toilet",
			"restroom",
			"blue-square"
		],
		k: [
			36,
			15
		],
		o: 2
	},
	scarf: {
		a: "Scarf",
		b: "1F9E3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			22
		],
		o: 5
	},
	mountain: {
		a: "Mountain",
		b: "26F0-FE0F",
		c: "26F0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"nature",
			"environment"
		],
		k: [
			54,
			11
		],
		o: 2
	},
	confetti_ball: {
		a: "Confetti Ball",
		b: "1F38A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"festival",
			"party",
			"birthday",
			"circus"
		],
		k: [
			7,
			46
		],
		o: 2
	},
	i_love_you_hand_sign: {
		skin_variations: {
			"1F3FB": {
				unified: "1F91F-1F3FB",
				non_qualified: null,
				image: "1f91f-1f3fb.png",
				sheet_x: 38,
				sheet_y: 12,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F91F-1F3FC",
				non_qualified: null,
				image: "1f91f-1f3fc.png",
				sheet_x: 38,
				sheet_y: 13,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F91F-1F3FD",
				non_qualified: null,
				image: "1f91f-1f3fd.png",
				sheet_x: 38,
				sheet_y: 14,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F91F-1F3FE",
				non_qualified: null,
				image: "1f91f-1f3fe.png",
				sheet_x: 38,
				sheet_y: 15,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F91F-1F3FF",
				non_qualified: null,
				image: "1f91f-1f3ff.png",
				sheet_x: 38,
				sheet_y: 16,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "I Love You Hand Sign",
		b: "1F91F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			11
		],
		o: 5
	},
	wolf: {
		a: "Wolf Face",
		b: "1F43A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"wild"
		],
		k: [
			12,
			30
		],
		o: 2
	},
	gloves: {
		a: "Gloves",
		b: "1F9E4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			23
		],
		o: 5
	},
	"flag-ae": {
		a: "United Arab Emirates Flag",
		b: "1F1E6-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			33
		],
		o: 2
	},
	upside_down_face: {
		a: "Upside-Down Face",
		b: "1F643",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"flipped",
			"silly",
			"smile"
		],
		k: [
			31,
			45
		],
		o: 2
	},
	green_apple: {
		a: "Green Apple",
		b: "1F34F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"nature"
		],
		k: [
			6,
			39
		],
		o: 2
	},
	passport_control: {
		a: "Passport Control",
		b: "1F6C2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"custom",
			"blue-square"
		],
		k: [
			36,
			24
		],
		o: 2
	},
	volcano: {
		a: "Volcano",
		b: "1F30B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"nature",
			"disaster"
		],
		k: [
			5,
			30
		],
		o: 2
	},
	tanabata_tree: {
		a: "Tanabata Tree",
		b: "1F38B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"nature",
			"branch",
			"summer"
		],
		k: [
			7,
			47
		],
		o: 2
	},
	customs: {
		a: "Customs",
		b: "1F6C3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"passport",
			"border",
			"blue-square"
		],
		k: [
			36,
			25
		],
		o: 2
	},
	coat: {
		a: "Coat",
		b: "1F9E5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			24
		],
		o: 5
	},
	wink: {
		a: "Winking Face",
		b: "1F609",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"happy",
			"mischievous",
			"secret",
			";)",
			"smile",
			"eye"
		],
		k: [
			30,
			44
		],
		l: [
			";)",
			";-)"
		],
		m: ";)",
		o: 2
	},
	bamboo: {
		a: "Pine Decoration",
		b: "1F38D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"nature",
			"vegetable",
			"panda",
			"pine_decoration"
		],
		k: [
			7,
			49
		],
		o: 2
	},
	"flag-af": {
		a: "Afghanistan Flag",
		b: "1F1E6-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			34
		],
		o: 2
	},
	fox_face: {
		a: "Fox Face",
		b: "1F98A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"face"
		],
		k: [
			42,
			28
		],
		o: 4
	},
	pear: {
		a: "Pear",
		b: "1F350",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"nature",
			"food"
		],
		k: [
			6,
			40
		],
		o: 2
	},
	mount_fuji: {
		a: "Mount Fuji",
		b: "1F5FB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"mountain",
			"nature",
			"japanese"
		],
		k: [
			30,
			30
		],
		o: 2
	},
	the_horns: {
		skin_variations: {
			"1F3FB": {
				unified: "1F918-1F3FB",
				non_qualified: null,
				image: "1f918-1f3fb.png",
				sheet_x: 37,
				sheet_y: 32,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F918-1F3FC",
				non_qualified: null,
				image: "1f918-1f3fc.png",
				sheet_x: 37,
				sheet_y: 33,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F918-1F3FD",
				non_qualified: null,
				image: "1f918-1f3fd.png",
				sheet_x: 37,
				sheet_y: 34,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F918-1F3FE",
				non_qualified: null,
				image: "1f918-1f3fe.png",
				sheet_x: 37,
				sheet_y: 35,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F918-1F3FF",
				non_qualified: null,
				image: "1f918-1f3ff.png",
				sheet_x: 37,
				sheet_y: 36,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Sign of the Horns",
		b: "1F918",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			31
		],
		n: [
			"sign_of_the_horns"
		],
		o: 2
	},
	call_me_hand: {
		skin_variations: {
			"1F3FB": {
				unified: "1F919-1F3FB",
				non_qualified: null,
				image: "1f919-1f3fb.png",
				sheet_x: 37,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F919-1F3FC",
				non_qualified: null,
				image: "1f919-1f3fc.png",
				sheet_x: 37,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F919-1F3FD",
				non_qualified: null,
				image: "1f919-1f3fd.png",
				sheet_x: 37,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F919-1F3FE",
				non_qualified: null,
				image: "1f919-1f3fe.png",
				sheet_x: 37,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F919-1F3FF",
				non_qualified: null,
				image: "1f919-1f3ff.png",
				sheet_x: 37,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Call Me Hand",
		b: "1F919",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hands",
			"gesture"
		],
		k: [
			37,
			37
		],
		o: 4
	},
	"flag-ag": {
		a: "Antigua & Barbuda Flag",
		b: "1F1E6-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			35
		],
		o: 2
	},
	raccoon: {
		a: "Raccoon",
		b: "1F99D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			47
		],
		o: 11
	},
	dolls: {
		a: "Japanese Dolls",
		b: "1F38E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"japanese",
			"toy",
			"kimono"
		],
		k: [
			7,
			50
		],
		o: 2
	},
	blush: {
		a: "Smiling Face with Smiling Eyes",
		b: "1F60A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"smile",
			"happy",
			"flushed",
			"crush",
			"embarrassed",
			"shy",
			"joy"
		],
		k: [
			30,
			45
		],
		m: ":)",
		o: 2
	},
	peach: {
		a: "Peach",
		b: "1F351",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"nature",
			"food"
		],
		k: [
			6,
			41
		],
		o: 2
	},
	baggage_claim: {
		a: "Baggage Claim",
		b: "1F6C4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"airport",
			"transport"
		],
		k: [
			36,
			26
		],
		o: 2
	},
	socks: {
		a: "Socks",
		b: "1F9E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			25
		],
		o: 5
	},
	camping: {
		a: "Camping",
		b: "1F3D5-FE0F",
		c: "1F3D5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"outdoors",
			"tent"
		],
		k: [
			10,
			40
		],
		o: 2
	},
	dress: {
		a: "Dress",
		b: "1F457",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"clothes",
			"fashion",
			"shopping"
		],
		k: [
			14,
			11
		],
		o: 2
	},
	beach_with_umbrella: {
		a: "Beach with Umbrella",
		b: "1F3D6-FE0F",
		c: "1F3D6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			41
		],
		o: 2
	},
	cherries: {
		a: "Cherries",
		b: "1F352",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"fruit"
		],
		k: [
			6,
			42
		],
		o: 2
	},
	cat: {
		a: "Cat Face",
		b: "1F431",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"meow",
			"nature",
			"pet",
			"kitten"
		],
		k: [
			12,
			21
		],
		o: 2
	},
	point_left: {
		skin_variations: {
			"1F3FB": {
				unified: "1F448-1F3FB",
				non_qualified: null,
				image: "1f448-1f3fb.png",
				sheet_x: 13,
				sheet_y: 9,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F448-1F3FC",
				non_qualified: null,
				image: "1f448-1f3fc.png",
				sheet_x: 13,
				sheet_y: 10,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F448-1F3FD",
				non_qualified: null,
				image: "1f448-1f3fd.png",
				sheet_x: 13,
				sheet_y: 11,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F448-1F3FE",
				non_qualified: null,
				image: "1f448-1f3fe.png",
				sheet_x: 13,
				sheet_y: 12,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F448-1F3FF",
				non_qualified: null,
				image: "1f448-1f3ff.png",
				sheet_x: 13,
				sheet_y: 13,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "White Left Pointing Backhand Index",
		b: "1F448",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"direction",
			"fingers",
			"hand",
			"left"
		],
		k: [
			13,
			8
		],
		o: 2
	},
	left_luggage: {
		a: "Left Luggage",
		b: "1F6C5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"travel"
		],
		k: [
			36,
			27
		],
		o: 2
	},
	"flag-ai": {
		a: "Anguilla Flag",
		b: "1F1E6-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			36
		],
		o: 2
	},
	innocent: {
		a: "Smiling Face with Halo",
		b: "1F607",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"angel",
			"heaven",
			"halo"
		],
		k: [
			30,
			42
		],
		o: 2
	},
	flags: {
		a: "Carp Streamer",
		b: "1F38F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fish",
			"japanese",
			"koinobori",
			"carp",
			"banner"
		],
		k: [
			7,
			51
		],
		o: 2
	},
	warning: {
		a: "Warning Sign",
		b: "26A0-FE0F",
		c: "26A0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"exclamation",
			"wip",
			"alert",
			"error",
			"problem",
			"issue"
		],
		k: [
			53,
			50
		],
		o: 2
	},
	strawberry: {
		a: "Strawberry",
		b: "1F353",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"food",
			"nature"
		],
		k: [
			6,
			43
		],
		o: 2
	},
	point_right: {
		skin_variations: {
			"1F3FB": {
				unified: "1F449-1F3FB",
				non_qualified: null,
				image: "1f449-1f3fb.png",
				sheet_x: 13,
				sheet_y: 15,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F449-1F3FC",
				non_qualified: null,
				image: "1f449-1f3fc.png",
				sheet_x: 13,
				sheet_y: 16,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F449-1F3FD",
				non_qualified: null,
				image: "1f449-1f3fd.png",
				sheet_x: 13,
				sheet_y: 17,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F449-1F3FE",
				non_qualified: null,
				image: "1f449-1f3fe.png",
				sheet_x: 13,
				sheet_y: 18,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F449-1F3FF",
				non_qualified: null,
				image: "1f449-1f3ff.png",
				sheet_x: 13,
				sheet_y: 19,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "White Right Pointing Backhand Index",
		b: "1F449",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fingers",
			"hand",
			"direction",
			"right"
		],
		k: [
			13,
			14
		],
		o: 2
	},
	desert: {
		a: "Desert",
		b: "1F3DC-FE0F",
		c: "1F3DC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"warm",
			"saharah"
		],
		k: [
			10,
			47
		],
		o: 2
	},
	kimono: {
		a: "Kimono",
		b: "1F458",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dress",
			"fashion",
			"women",
			"female",
			"japanese"
		],
		k: [
			14,
			12
		],
		o: 2
	},
	"flag-al": {
		a: "Albania Flag",
		b: "1F1E6-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			37
		],
		o: 2
	},
	wind_chime: {
		a: "Wind Chime",
		b: "1F390",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"ding",
			"spring",
			"bell"
		],
		k: [
			7,
			52
		],
		o: 2
	},
	smiling_face_with_3_hearts: {
		a: "Smiling Face with Smiling Eyes and Three Hearts",
		b: "1F970",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			6
		],
		o: 11
	},
	cat2: {
		a: "Cat",
		b: "1F408",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"meow",
			"pet",
			"cats"
		],
		k: [
			11,
			36
		],
		o: 2
	},
	rice_scene: {
		a: "Moon Viewing Ceremony",
		b: "1F391",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"japan",
			"asia",
			"tsukimi"
		],
		k: [
			7,
			53
		],
		o: 2
	},
	heart_eyes: {
		a: "Smiling Face with Heart-Shaped Eyes",
		b: "1F60D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"love",
			"like",
			"affection",
			"valentines",
			"infatuation",
			"crush",
			"heart"
		],
		k: [
			30,
			48
		],
		o: 2
	},
	sari: {
		a: "Sari",
		b: "1F97B",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			13
		],
		o: 12
	},
	"flag-am": {
		a: "Armenia Flag",
		b: "1F1E6-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			38
		],
		o: 2
	},
	lion_face: {
		a: "Lion Face",
		b: "1F981",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			19
		],
		o: 2
	},
	desert_island: {
		a: "Desert Island",
		b: "1F3DD-FE0F",
		c: "1F3DD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"tropical",
			"mojito"
		],
		k: [
			10,
			48
		],
		o: 2
	},
	point_up_2: {
		skin_variations: {
			"1F3FB": {
				unified: "1F446-1F3FB",
				non_qualified: null,
				image: "1f446-1f3fb.png",
				sheet_x: 12,
				sheet_y: 54,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F446-1F3FC",
				non_qualified: null,
				image: "1f446-1f3fc.png",
				sheet_x: 12,
				sheet_y: 55,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F446-1F3FD",
				non_qualified: null,
				image: "1f446-1f3fd.png",
				sheet_x: 12,
				sheet_y: 56,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F446-1F3FE",
				non_qualified: null,
				image: "1f446-1f3fe.png",
				sheet_x: 13,
				sheet_y: 0,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F446-1F3FF",
				non_qualified: null,
				image: "1f446-1f3ff.png",
				sheet_x: 13,
				sheet_y: 1,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "White Up Pointing Backhand Index",
		b: "1F446",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fingers",
			"hand",
			"direction",
			"up"
		],
		k: [
			12,
			53
		],
		o: 2
	},
	kiwifruit: {
		a: "Kiwifruit",
		b: "1F95D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			44
		],
		o: 4
	},
	children_crossing: {
		a: "Children Crossing",
		b: "1F6B8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"school",
			"warning",
			"danger",
			"sign",
			"driving",
			"yellow-diamond"
		],
		k: [
			36,
			9
		],
		o: 2
	},
	national_park: {
		a: "National Park",
		b: "1F3DE-FE0F",
		c: "1F3DE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"environment",
			"nature"
		],
		k: [
			10,
			49
		],
		o: 2
	},
	no_entry: {
		a: "No Entry",
		b: "26D4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"limit",
			"security",
			"privacy",
			"bad",
			"denied",
			"stop",
			"circle"
		],
		k: [
			54,
			8
		],
		o: 2
	},
	"one-piece_swimsuit": {
		a: "One-Piece Swimsuit",
		b: "1FA71",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			52
		],
		o: 12
	},
	tiger: {
		a: "Tiger Face",
		b: "1F42F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cat",
			"danger",
			"wild",
			"nature",
			"roar"
		],
		k: [
			12,
			19
		],
		o: 2
	},
	red_envelope: {
		a: "Red Gift Envelope",
		b: "1F9E7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			26
		],
		o: 11
	},
	"star-struck": {
		a: "Grinning Face with Star Eyes",
		b: "1F929",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			43
		],
		n: [
			"grinning_face_with_star_eyes"
		],
		o: 5
	},
	middle_finger: {
		skin_variations: {
			"1F3FB": {
				unified: "1F595-1F3FB",
				non_qualified: null,
				image: "1f595-1f3fb.png",
				sheet_x: 29,
				sheet_y: 55,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F595-1F3FC",
				non_qualified: null,
				image: "1f595-1f3fc.png",
				sheet_x: 29,
				sheet_y: 56,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F595-1F3FD",
				non_qualified: null,
				image: "1f595-1f3fd.png",
				sheet_x: 30,
				sheet_y: 0,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F595-1F3FE",
				non_qualified: null,
				image: "1f595-1f3fe.png",
				sheet_x: 30,
				sheet_y: 1,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F595-1F3FF",
				non_qualified: null,
				image: "1f595-1f3ff.png",
				sheet_x: 30,
				sheet_y: 2,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Reversed Hand with Middle Finger Extended",
		b: "1F595",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			29,
			54
		],
		n: [
			"reversed_hand_with_middle_finger_extended"
		],
		o: 2
	},
	"flag-ao": {
		a: "Angola Flag",
		b: "1F1E6-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			39
		],
		o: 2
	},
	tomato: {
		a: "Tomato",
		b: "1F345",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"vegetable",
			"nature",
			"food"
		],
		k: [
			6,
			29
		],
		o: 2
	},
	coconut: {
		a: "Coconut",
		b: "1F965",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			52
		],
		o: 5
	},
	ribbon: {
		a: "Ribbon",
		b: "1F380",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"decoration",
			"pink",
			"girl",
			"bowtie"
		],
		k: [
			7,
			31
		],
		o: 2
	},
	no_entry_sign: {
		a: "No Entry Sign",
		b: "1F6AB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"forbid",
			"stop",
			"limit",
			"denied",
			"disallow",
			"circle"
		],
		k: [
			35,
			2
		],
		o: 2
	},
	point_down: {
		skin_variations: {
			"1F3FB": {
				unified: "1F447-1F3FB",
				non_qualified: null,
				image: "1f447-1f3fb.png",
				sheet_x: 13,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F447-1F3FC",
				non_qualified: null,
				image: "1f447-1f3fc.png",
				sheet_x: 13,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F447-1F3FD",
				non_qualified: null,
				image: "1f447-1f3fd.png",
				sheet_x: 13,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F447-1F3FE",
				non_qualified: null,
				image: "1f447-1f3fe.png",
				sheet_x: 13,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F447-1F3FF",
				non_qualified: null,
				image: "1f447-1f3ff.png",
				sheet_x: 13,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "White Down Pointing Backhand Index",
		b: "1F447",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fingers",
			"hand",
			"direction",
			"down"
		],
		k: [
			13,
			2
		],
		o: 2
	},
	"flag-aq": {
		a: "Antarctica Flag",
		b: "1F1E6-1F1F6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			40
		],
		o: 2
	},
	briefs: {
		a: "Briefs",
		b: "1FA72",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			53
		],
		o: 12
	},
	kissing_heart: {
		a: "Face Throwing a Kiss",
		b: "1F618",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"love",
			"like",
			"affection",
			"valentines",
			"infatuation",
			"kiss"
		],
		k: [
			31,
			2
		],
		l: [
			":*",
			":-*"
		],
		o: 2
	},
	tiger2: {
		a: "Tiger",
		b: "1F405",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"roar"
		],
		k: [
			11,
			33
		],
		o: 2
	},
	stadium: {
		a: "Stadium",
		b: "1F3DF-FE0F",
		c: "1F3DF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"place",
			"sports",
			"concert",
			"venue"
		],
		k: [
			10,
			50
		],
		o: 2
	},
	leopard: {
		a: "Leopard",
		b: "1F406",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature"
		],
		k: [
			11,
			34
		],
		o: 2
	},
	no_bicycles: {
		a: "No Bicycles",
		b: "1F6B3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cyclist",
			"prohibited",
			"circle"
		],
		k: [
			35,
			10
		],
		o: 2
	},
	kissing: {
		a: "Kissing Face",
		b: "1F617",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"face",
			"3",
			"valentines",
			"infatuation",
			"kiss"
		],
		k: [
			31,
			1
		],
		o: 2
	},
	"flag-ar": {
		a: "Argentina Flag",
		b: "1F1E6-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			41
		],
		o: 2
	},
	avocado: {
		a: "Avocado",
		b: "1F951",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"food"
		],
		k: [
			41,
			32
		],
		o: 4
	},
	point_up: {
		skin_variations: {
			"1F3FB": {
				unified: "261D-1F3FB",
				non_qualified: null,
				image: "261d-1f3fb.png",
				sheet_x: 53,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "261D-1F3FC",
				non_qualified: null,
				image: "261d-1f3fc.png",
				sheet_x: 53,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "261D-1F3FD",
				non_qualified: null,
				image: "261d-1f3fd.png",
				sheet_x: 53,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "261D-1F3FE",
				non_qualified: null,
				image: "261d-1f3fe.png",
				sheet_x: 53,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "261D-1F3FF",
				non_qualified: null,
				image: "261d-1f3ff.png",
				sheet_x: 53,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "White Up Pointing Index",
		b: "261D-FE0F",
		c: "261D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hand",
			"fingers",
			"direction",
			"up"
		],
		k: [
			53,
			2
		],
		o: 2
	},
	gift: {
		a: "Wrapped Present",
		b: "1F381",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"present",
			"birthday",
			"christmas",
			"xmas"
		],
		k: [
			7,
			32
		],
		o: 2
	},
	classical_building: {
		a: "Classical Building",
		b: "1F3DB-FE0F",
		c: "1F3DB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"art",
			"culture",
			"history"
		],
		k: [
			10,
			46
		],
		o: 2
	},
	shorts: {
		a: "Shorts",
		b: "1FA73",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			54
		],
		o: 12
	},
	"+1": {
		skin_variations: {
			"1F3FB": {
				unified: "1F44D-1F3FB",
				non_qualified: null,
				image: "1f44d-1f3fb.png",
				sheet_x: 13,
				sheet_y: 39,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F44D-1F3FC",
				non_qualified: null,
				image: "1f44d-1f3fc.png",
				sheet_x: 13,
				sheet_y: 40,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F44D-1F3FD",
				non_qualified: null,
				image: "1f44d-1f3fd.png",
				sheet_x: 13,
				sheet_y: 41,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F44D-1F3FE",
				non_qualified: null,
				image: "1f44d-1f3fe.png",
				sheet_x: 13,
				sheet_y: 42,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F44D-1F3FF",
				non_qualified: null,
				image: "1f44d-1f3ff.png",
				sheet_x: 13,
				sheet_y: 43,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Thumbs Up Sign",
		b: "1F44D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"thumbsup",
			"yes",
			"awesome",
			"good",
			"agree",
			"accept",
			"cool",
			"hand",
			"like"
		],
		k: [
			13,
			38
		],
		n: [
			"thumbsup"
		],
		o: 2
	},
	horse: {
		a: "Horse Face",
		b: "1F434",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"brown",
			"nature"
		],
		k: [
			12,
			24
		],
		o: 2
	},
	bikini: {
		a: "Bikini",
		b: "1F459",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"swimming",
			"female",
			"woman",
			"girl",
			"fashion",
			"beach",
			"summer"
		],
		k: [
			14,
			13
		],
		o: 2
	},
	no_smoking: {
		a: "No Smoking Symbol",
		b: "1F6AD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cigarette",
			"blue-square",
			"smell",
			"smoke"
		],
		k: [
			35,
			4
		],
		o: 2
	},
	eggplant: {
		a: "Aubergine",
		b: "1F346",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vegetable",
			"nature",
			"food",
			"aubergine"
		],
		k: [
			6,
			30
		],
		o: 2
	},
	"flag-as": {
		a: "American Samoa Flag",
		b: "1F1E6-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			42
		],
		o: 2
	},
	reminder_ribbon: {
		a: "Reminder Ribbon",
		b: "1F397-FE0F",
		c: "1F397",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"cause",
			"support",
			"awareness"
		],
		k: [
			8,
			0
		],
		o: 2
	},
	building_construction: {
		a: "Building Construction",
		b: "1F3D7-FE0F",
		c: "1F3D7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"wip",
			"working",
			"progress"
		],
		k: [
			10,
			42
		],
		o: 2
	},
	relaxed: {
		a: "White Smiling Face",
		b: "263A-FE0F",
		c: "263A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"blush",
			"massage",
			"happiness"
		],
		k: [
			53,
			17
		],
		o: 2
	},
	kissing_closed_eyes: {
		a: "Kissing Face with Closed Eyes",
		b: "1F61A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"love",
			"like",
			"affection",
			"valentines",
			"infatuation",
			"kiss"
		],
		k: [
			31,
			4
		],
		o: 2
	},
	"-1": {
		skin_variations: {
			"1F3FB": {
				unified: "1F44E-1F3FB",
				non_qualified: null,
				image: "1f44e-1f3fb.png",
				sheet_x: 13,
				sheet_y: 45,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F44E-1F3FC",
				non_qualified: null,
				image: "1f44e-1f3fc.png",
				sheet_x: 13,
				sheet_y: 46,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F44E-1F3FD",
				non_qualified: null,
				image: "1f44e-1f3fd.png",
				sheet_x: 13,
				sheet_y: 47,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F44E-1F3FE",
				non_qualified: null,
				image: "1f44e-1f3fe.png",
				sheet_x: 13,
				sheet_y: 48,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F44E-1F3FF",
				non_qualified: null,
				image: "1f44e-1f3ff.png",
				sheet_x: 13,
				sheet_y: 49,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Thumbs Down Sign",
		b: "1F44E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"thumbsdown",
			"no",
			"dislike",
			"hand"
		],
		k: [
			13,
			44
		],
		n: [
			"thumbsdown"
		],
		o: 2
	},
	admission_tickets: {
		a: "Admission Tickets",
		b: "1F39F-FE0F",
		c: "1F39F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			8,
			5
		],
		o: 2
	},
	"flag-at": {
		a: "Austria Flag",
		b: "1F1E6-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			43
		],
		o: 2
	},
	womans_clothes: {
		a: "Womans Clothes",
		b: "1F45A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fashion",
			"shopping_bags",
			"female"
		],
		k: [
			14,
			14
		],
		o: 2
	},
	do_not_litter: {
		a: "Do Not Litter Symbol",
		b: "1F6AF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"trash",
			"bin",
			"garbage",
			"circle"
		],
		k: [
			35,
			6
		],
		o: 2
	},
	potato: {
		a: "Potato",
		b: "1F954",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"tuber",
			"vegatable",
			"starch"
		],
		k: [
			41,
			35
		],
		o: 4
	},
	racehorse: {
		a: "Horse",
		b: "1F40E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"gamble",
			"luck"
		],
		k: [
			11,
			42
		],
		o: 2
	},
	bricks: {
		a: "Brick",
		b: "1F9F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			36
		],
		o: 11
	},
	fist: {
		skin_variations: {
			"1F3FB": {
				unified: "270A-1F3FB",
				non_qualified: null,
				image: "270a-1f3fb.png",
				sheet_x: 54,
				sheet_y: 44,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "270A-1F3FC",
				non_qualified: null,
				image: "270a-1f3fc.png",
				sheet_x: 54,
				sheet_y: 45,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "270A-1F3FD",
				non_qualified: null,
				image: "270a-1f3fd.png",
				sheet_x: 54,
				sheet_y: 46,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "270A-1F3FE",
				non_qualified: null,
				image: "270a-1f3fe.png",
				sheet_x: 54,
				sheet_y: 47,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "270A-1F3FF",
				non_qualified: null,
				image: "270a-1f3ff.png",
				sheet_x: 54,
				sheet_y: 48,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Raised Fist",
		b: "270A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fingers",
			"hand",
			"grasp"
		],
		k: [
			54,
			43
		],
		o: 2
	},
	house_buildings: {
		a: "House Buildings",
		b: "1F3D8-FE0F",
		c: "1F3D8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			43
		],
		o: 2
	},
	carrot: {
		a: "Carrot",
		b: "1F955",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vegetable",
			"food",
			"orange"
		],
		k: [
			41,
			36
		],
		o: 4
	},
	ticket: {
		a: "Ticket",
		b: "1F3AB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"event",
			"concert",
			"pass"
		],
		k: [
			8,
			17
		],
		o: 2
	},
	"flag-au": {
		a: "Australia Flag",
		b: "1F1E6-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			44
		],
		o: 2
	},
	"non-potable_water": {
		a: "Non-Potable Water Symbol",
		b: "1F6B1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"drink",
			"faucet",
			"tap",
			"circle"
		],
		k: [
			35,
			8
		],
		o: 2
	},
	purse: {
		a: "Purse",
		b: "1F45B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fashion",
			"accessories",
			"money",
			"sales",
			"shopping"
		],
		k: [
			14,
			15
		],
		o: 2
	},
	unicorn_face: {
		a: "Unicorn Face",
		b: "1F984",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			22
		],
		o: 2
	},
	kissing_smiling_eyes: {
		a: "Kissing Face with Smiling Eyes",
		b: "1F619",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"affection",
			"valentines",
			"infatuation",
			"kiss"
		],
		k: [
			31,
			3
		],
		o: 2
	},
	facepunch: {
		skin_variations: {
			"1F3FB": {
				unified: "1F44A-1F3FB",
				non_qualified: null,
				image: "1f44a-1f3fb.png",
				sheet_x: 13,
				sheet_y: 21,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F44A-1F3FC",
				non_qualified: null,
				image: "1f44a-1f3fc.png",
				sheet_x: 13,
				sheet_y: 22,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F44A-1F3FD",
				non_qualified: null,
				image: "1f44a-1f3fd.png",
				sheet_x: 13,
				sheet_y: 23,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F44A-1F3FE",
				non_qualified: null,
				image: "1f44a-1f3fe.png",
				sheet_x: 13,
				sheet_y: 24,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F44A-1F3FF",
				non_qualified: null,
				image: "1f44a-1f3ff.png",
				sheet_x: 13,
				sheet_y: 25,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Fisted Hand Sign",
		b: "1F44A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"angry",
			"violence",
			"fist",
			"hit",
			"attack",
			"hand"
		],
		k: [
			13,
			20
		],
		n: [
			"punch"
		],
		o: 2
	},
	medal: {
		a: "Medal",
		b: "1F396-FE0F",
		c: "1F396",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			7,
			56
		],
		o: 2
	},
	zebra_face: {
		a: "Zebra Face",
		b: "1F993",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			37
		],
		o: 5
	},
	handbag: {
		a: "Handbag",
		b: "1F45C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fashion",
			"accessory",
			"accessories",
			"shopping"
		],
		k: [
			14,
			16
		],
		o: 2
	},
	derelict_house_building: {
		a: "Derelict House Building",
		b: "1F3DA-FE0F",
		c: "1F3DA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			45
		],
		o: 2
	},
	yum: {
		a: "Face Savouring Delicious Food",
		b: "1F60B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"happy",
			"joy",
			"tongue",
			"smile",
			"face",
			"silly",
			"yummy",
			"nom",
			"delicious",
			"savouring"
		],
		k: [
			30,
			46
		],
		o: 2
	},
	corn: {
		a: "Ear of Maize",
		b: "1F33D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"vegetable",
			"plant"
		],
		k: [
			6,
			21
		],
		o: 2
	},
	"flag-aw": {
		a: "Aruba Flag",
		b: "1F1E6-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			45
		],
		o: 2
	},
	no_pedestrians: {
		a: "No Pedestrians",
		b: "1F6B7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"rules",
			"crossing",
			"walking",
			"circle"
		],
		k: [
			36,
			8
		],
		o: 2
	},
	house: {
		a: "House Building",
		b: "1F3E0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"home"
		],
		k: [
			10,
			51
		],
		o: 2
	},
	hot_pepper: {
		a: "Hot Pepper",
		b: "1F336-FE0F",
		c: "1F336",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"spicy",
			"chilli",
			"chili"
		],
		k: [
			6,
			14
		],
		o: 2
	},
	"flag-ax": {
		a: "Åland Islands Flag",
		b: "1F1E6-1F1FD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			46
		],
		o: 2
	},
	trophy: {
		a: "Trophy",
		b: "1F3C6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"win",
			"award",
			"contest",
			"place",
			"ftw",
			"ceremony"
		],
		k: [
			9,
			26
		],
		o: 2
	},
	deer: {
		a: "Deer",
		b: "1F98C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"horns",
			"venison"
		],
		k: [
			42,
			30
		],
		o: 4
	},
	"left-facing_fist": {
		skin_variations: {
			"1F3FB": {
				unified: "1F91B-1F3FB",
				non_qualified: null,
				image: "1f91b-1f3fb.png",
				sheet_x: 37,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F91B-1F3FC",
				non_qualified: null,
				image: "1f91b-1f3fc.png",
				sheet_x: 37,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F91B-1F3FD",
				non_qualified: null,
				image: "1f91b-1f3fd.png",
				sheet_x: 37,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F91B-1F3FE",
				non_qualified: null,
				image: "1f91b-1f3fe.png",
				sheet_x: 37,
				sheet_y: 53,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F91B-1F3FF",
				non_qualified: null,
				image: "1f91b-1f3ff.png",
				sheet_x: 37,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Left-Facing Fist",
		b: "1F91B",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			49
		],
		o: 4
	},
	stuck_out_tongue: {
		a: "Face with Stuck-out Tongue",
		b: "1F61B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"prank",
			"childish",
			"playful",
			"mischievous",
			"smile",
			"tongue"
		],
		k: [
			31,
			5
		],
		l: [
			":p",
			":-p",
			":P",
			":-P",
			":b",
			":-b"
		],
		m: ":p",
		o: 2
	},
	pouch: {
		a: "Pouch",
		b: "1F45D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bag",
			"accessories",
			"shopping"
		],
		k: [
			14,
			17
		],
		o: 2
	},
	no_mobile_phones: {
		a: "No Mobile Phones",
		b: "1F4F5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"iphone",
			"mute",
			"circle"
		],
		k: [
			27,
			18
		],
		o: 2
	},
	stuck_out_tongue_winking_eye: {
		a: "Face with Stuck-out Tongue and Winking Eye",
		b: "1F61C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"prank",
			"childish",
			"playful",
			"mischievous",
			"smile",
			"wink",
			"tongue"
		],
		k: [
			31,
			6
		],
		l: [
			";p",
			";-p",
			";b",
			";-b",
			";P",
			";-P"
		],
		m: ";p",
		o: 2
	},
	sports_medal: {
		a: "Sports Medal",
		b: "1F3C5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			9,
			25
		],
		o: 2
	},
	cucumber: {
		a: "Cucumber",
		b: "1F952",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fruit",
			"food",
			"pickle"
		],
		k: [
			41,
			33
		],
		o: 4
	},
	cow: {
		a: "Cow Face",
		b: "1F42E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"beef",
			"ox",
			"animal",
			"nature",
			"moo",
			"milk"
		],
		k: [
			12,
			18
		],
		o: 2
	},
	underage: {
		a: "No One Under Eighteen Symbol",
		b: "1F51E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"18",
			"drink",
			"pub",
			"night",
			"minor",
			"circle"
		],
		k: [
			28,
			1
		],
		o: 2
	},
	"flag-az": {
		a: "Azerbaijan Flag",
		b: "1F1E6-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			47
		],
		o: 2
	},
	shopping_bags: {
		a: "Shopping Bags",
		b: "1F6CD-FE0F",
		c: "1F6CD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			36,
			35
		],
		o: 2
	},
	"right-facing_fist": {
		skin_variations: {
			"1F3FB": {
				unified: "1F91C-1F3FB",
				non_qualified: null,
				image: "1f91c-1f3fb.png",
				sheet_x: 37,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F91C-1F3FC",
				non_qualified: null,
				image: "1f91c-1f3fc.png",
				sheet_x: 38,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F91C-1F3FD",
				non_qualified: null,
				image: "1f91c-1f3fd.png",
				sheet_x: 38,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F91C-1F3FE",
				non_qualified: null,
				image: "1f91c-1f3fe.png",
				sheet_x: 38,
				sheet_y: 2,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F91C-1F3FF",
				non_qualified: null,
				image: "1f91c-1f3ff.png",
				sheet_x: 38,
				sheet_y: 3,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Right-Facing Fist",
		b: "1F91C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			55
		],
		o: 4
	},
	house_with_garden: {
		a: "House with Garden",
		b: "1F3E1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"home",
			"plant",
			"nature"
		],
		k: [
			10,
			52
		],
		o: 2
	},
	clap: {
		skin_variations: {
			"1F3FB": {
				unified: "1F44F-1F3FB",
				non_qualified: null,
				image: "1f44f-1f3fb.png",
				sheet_x: 13,
				sheet_y: 51,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F44F-1F3FC",
				non_qualified: null,
				image: "1f44f-1f3fc.png",
				sheet_x: 13,
				sheet_y: 52,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F44F-1F3FD",
				non_qualified: null,
				image: "1f44f-1f3fd.png",
				sheet_x: 13,
				sheet_y: 53,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F44F-1F3FE",
				non_qualified: null,
				image: "1f44f-1f3fe.png",
				sheet_x: 13,
				sheet_y: 54,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F44F-1F3FF",
				non_qualified: null,
				image: "1f44f-1f3ff.png",
				sheet_x: 13,
				sheet_y: 55,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Clapping Hands Sign",
		b: "1F44F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hands",
			"praise",
			"applause",
			"congrats",
			"yay"
		],
		k: [
			13,
			50
		],
		o: 2
	},
	leafy_green: {
		a: "Leafy Green",
		b: "1F96C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			2
		],
		o: 11
	},
	office: {
		a: "Office Building",
		b: "1F3E2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"bureau",
			"work"
		],
		k: [
			10,
			53
		],
		o: 2
	},
	"flag-ba": {
		a: "Bosnia & Herzegovina Flag",
		b: "1F1E7-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			48
		],
		o: 2
	},
	zany_face: {
		a: "Grinning Face with One Large and One Small Eye",
		b: "1F92A",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			44
		],
		n: [
			"grinning_face_with_one_large_and_one_small_eye"
		],
		o: 5
	},
	first_place_medal: {
		a: "First Place Medal",
		b: "1F947",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			22
		],
		o: 4
	},
	ox: {
		a: "Ox",
		b: "1F402",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cow",
			"beef"
		],
		k: [
			11,
			30
		],
		o: 2
	},
	school_satchel: {
		a: "School Satchel",
		b: "1F392",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"student",
			"education",
			"bag",
			"backpack"
		],
		k: [
			7,
			54
		],
		o: 2
	},
	radioactive_sign: {
		a: "Radioactive Sign",
		b: "2622-FE0F",
		c: "2622",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			9
		],
		o: 2
	},
	second_place_medal: {
		a: "Second Place Medal",
		b: "1F948",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			23
		],
		o: 4
	},
	stuck_out_tongue_closed_eyes: {
		a: "Face with Stuck-out Tongue and Tightly-Closed Eyes",
		b: "1F61D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"prank",
			"playful",
			"mischievous",
			"smile",
			"tongue"
		],
		k: [
			31,
			7
		],
		o: 2
	},
	broccoli: {
		a: "Broccoli",
		b: "1F966",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			53
		],
		o: 5
	},
	biohazard_sign: {
		a: "Biohazard Sign",
		b: "2623-FE0F",
		c: "2623",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			10
		],
		o: 2
	},
	mans_shoe: {
		a: "Mans Shoe",
		b: "1F45E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fashion",
			"male"
		],
		k: [
			14,
			18
		],
		n: [
			"shoe"
		],
		o: 2
	},
	raised_hands: {
		skin_variations: {
			"1F3FB": {
				unified: "1F64C-1F3FB",
				non_qualified: null,
				image: "1f64c-1f3fb.png",
				sheet_x: 33,
				sheet_y: 9,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F64C-1F3FC",
				non_qualified: null,
				image: "1f64c-1f3fc.png",
				sheet_x: 33,
				sheet_y: 10,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F64C-1F3FD",
				non_qualified: null,
				image: "1f64c-1f3fd.png",
				sheet_x: 33,
				sheet_y: 11,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F64C-1F3FE",
				non_qualified: null,
				image: "1f64c-1f3fe.png",
				sheet_x: 33,
				sheet_y: 12,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F64C-1F3FF",
				non_qualified: null,
				image: "1f64c-1f3ff.png",
				sheet_x: 33,
				sheet_y: 13,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Person Raising Both Hands in Celebration",
		b: "1F64C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"gesture",
			"hooray",
			"yea",
			"celebration",
			"hands"
		],
		k: [
			33,
			8
		],
		o: 2
	},
	post_office: {
		a: "Japanese Post Office",
		b: "1F3E3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"envelope",
			"communication"
		],
		k: [
			10,
			54
		],
		o: 2
	},
	"flag-bb": {
		a: "Barbados Flag",
		b: "1F1E7-1F1E7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			49
		],
		o: 2
	},
	water_buffalo: {
		a: "Water Buffalo",
		b: "1F403",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"ox",
			"cow"
		],
		k: [
			11,
			31
		],
		o: 2
	},
	third_place_medal: {
		a: "Third Place Medal",
		b: "1F949",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			24
		],
		o: 4
	},
	european_post_office: {
		a: "European Post Office",
		b: "1F3E4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"email"
		],
		k: [
			10,
			55
		],
		o: 2
	},
	athletic_shoe: {
		a: "Athletic Shoe",
		b: "1F45F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shoes",
			"sports",
			"sneakers"
		],
		k: [
			14,
			19
		],
		o: 2
	},
	arrow_up: {
		a: "Upwards Black Arrow",
		b: "2B06-FE0F",
		c: "2B06",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"continue",
			"top",
			"direction"
		],
		k: [
			55,
			38
		],
		o: 2
	},
	cow2: {
		a: "Cow",
		b: "1F404",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"beef",
			"ox",
			"animal",
			"nature",
			"moo",
			"milk"
		],
		k: [
			11,
			32
		],
		o: 2
	},
	open_hands: {
		skin_variations: {
			"1F3FB": {
				unified: "1F450-1F3FB",
				non_qualified: null,
				image: "1f450-1f3fb.png",
				sheet_x: 14,
				sheet_y: 0,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F450-1F3FC",
				non_qualified: null,
				image: "1f450-1f3fc.png",
				sheet_x: 14,
				sheet_y: 1,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F450-1F3FD",
				non_qualified: null,
				image: "1f450-1f3fd.png",
				sheet_x: 14,
				sheet_y: 2,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F450-1F3FE",
				non_qualified: null,
				image: "1f450-1f3fe.png",
				sheet_x: 14,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F450-1F3FF",
				non_qualified: null,
				image: "1f450-1f3ff.png",
				sheet_x: 14,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Open Hands Sign",
		b: "1F450",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fingers",
			"butterfly",
			"hands",
			"open"
		],
		k: [
			13,
			56
		],
		o: 2
	},
	garlic: {
		a: "Garlic",
		b: "1F9C4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			12
		],
		o: 12
	},
	money_mouth_face: {
		a: "Money-Mouth Face",
		b: "1F911",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"rich",
			"dollar",
			"money"
		],
		k: [
			37,
			24
		],
		o: 2
	},
	"flag-bd": {
		a: "Bangladesh Flag",
		b: "1F1E7-1F1E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			50
		],
		o: 2
	},
	soccer: {
		a: "Soccer Ball",
		b: "26BD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"football"
		],
		k: [
			53,
			56
		],
		o: 2
	},
	hugging_face: {
		a: "Hugging Face",
		b: "1F917",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			30
		],
		o: 2
	},
	onion: {
		a: "Onion",
		b: "1F9C5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			13
		],
		o: 12
	},
	arrow_upper_right: {
		a: "North East Arrow",
		b: "2197-FE0F",
		c: "2197",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"point",
			"direction",
			"diagonal",
			"northeast"
		],
		k: [
			52,
			17
		],
		o: 2
	},
	palms_up_together: {
		skin_variations: {
			"1F3FB": {
				unified: "1F932-1F3FB",
				non_qualified: null,
				image: "1f932-1f3fb.png",
				sheet_x: 39,
				sheet_y: 6,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F932-1F3FC",
				non_qualified: null,
				image: "1f932-1f3fc.png",
				sheet_x: 39,
				sheet_y: 7,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F932-1F3FD",
				non_qualified: null,
				image: "1f932-1f3fd.png",
				sheet_x: 39,
				sheet_y: 8,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F932-1F3FE",
				non_qualified: null,
				image: "1f932-1f3fe.png",
				sheet_x: 39,
				sheet_y: 9,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F932-1F3FF",
				non_qualified: null,
				image: "1f932-1f3ff.png",
				sheet_x: 39,
				sheet_y: 10,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Palms Up Together",
		b: "1F932",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			39,
			5
		],
		o: 5
	},
	pig: {
		a: "Pig Face",
		b: "1F437",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"oink",
			"nature"
		],
		k: [
			12,
			27
		],
		o: 2
	},
	hospital: {
		a: "Hospital",
		b: "1F3E5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"health",
			"surgery",
			"doctor"
		],
		k: [
			10,
			56
		],
		o: 2
	},
	hiking_boot: {
		a: "Hiking Boot",
		b: "1F97E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			16
		],
		o: 11
	},
	"flag-be": {
		a: "Belgium Flag",
		b: "1F1E7-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			51
		],
		o: 2
	},
	"flag-bf": {
		a: "Burkina Faso Flag",
		b: "1F1E7-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			52
		],
		o: 2
	},
	mushroom: {
		a: "Mushroom",
		b: "1F344",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"vegetable"
		],
		k: [
			6,
			28
		],
		o: 2
	},
	pig2: {
		a: "Pig",
		b: "1F416",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature"
		],
		k: [
			11,
			51
		],
		o: 2
	},
	baseball: {
		a: "Baseball",
		b: "26BE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"balls"
		],
		k: [
			54,
			0
		],
		o: 2
	},
	face_with_hand_over_mouth: {
		a: "Smiling Face with Smiling Eyes and Hand Covering Mouth",
		b: "1F92D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			47
		],
		n: [
			"smiling_face_with_smiling_eyes_and_hand_covering_mouth"
		],
		o: 5
	},
	handshake: {
		a: "Handshake",
		b: "1F91D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"agreement",
			"shake"
		],
		k: [
			38,
			4
		],
		o: 4
	},
	womans_flat_shoe: {
		a: "Flat Shoe",
		b: "1F97F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			17
		],
		o: 11
	},
	bank: {
		a: "Bank",
		b: "1F3E6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"money",
			"sales",
			"cash",
			"business",
			"enterprise"
		],
		k: [
			11,
			0
		],
		o: 2
	},
	arrow_right: {
		a: "Black Rightwards Arrow",
		b: "27A1-FE0F",
		c: "27A1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"next"
		],
		k: [
			55,
			32
		],
		o: 2
	},
	peanuts: {
		a: "Peanuts",
		b: "1F95C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"nut"
		],
		k: [
			41,
			43
		],
		o: 4
	},
	shushing_face: {
		a: "Face with Finger Covering Closed Lips",
		b: "1F92B",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			45
		],
		n: [
			"face_with_finger_covering_closed_lips"
		],
		o: 5
	},
	pray: {
		skin_variations: {
			"1F3FB": {
				unified: "1F64F-1F3FB",
				non_qualified: null,
				image: "1f64f-1f3fb.png",
				sheet_x: 33,
				sheet_y: 51,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F64F-1F3FC",
				non_qualified: null,
				image: "1f64f-1f3fc.png",
				sheet_x: 33,
				sheet_y: 52,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F64F-1F3FD",
				non_qualified: null,
				image: "1f64f-1f3fd.png",
				sheet_x: 33,
				sheet_y: 53,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F64F-1F3FE",
				non_qualified: null,
				image: "1f64f-1f3fe.png",
				sheet_x: 33,
				sheet_y: 54,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F64F-1F3FF",
				non_qualified: null,
				image: "1f64f-1f3ff.png",
				sheet_x: 33,
				sheet_y: 55,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Person with Folded Hands",
		b: "1F64F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"please",
			"hope",
			"wish",
			"namaste",
			"highfive"
		],
		k: [
			33,
			50
		],
		o: 2
	},
	softball: {
		a: "Softball",
		b: "1F94E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			29
		],
		o: 11
	},
	high_heel: {
		a: "High-Heeled Shoe",
		b: "1F460",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fashion",
			"shoes",
			"female",
			"pumps",
			"stiletto"
		],
		k: [
			14,
			20
		],
		o: 2
	},
	"flag-bg": {
		a: "Bulgaria Flag",
		b: "1F1E7-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			53
		],
		o: 2
	},
	arrow_lower_right: {
		a: "South East Arrow",
		b: "2198-FE0F",
		c: "2198",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"diagonal",
			"southeast"
		],
		k: [
			52,
			18
		],
		o: 2
	},
	hotel: {
		a: "Hotel",
		b: "1F3E8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"accomodation",
			"checkin"
		],
		k: [
			11,
			2
		],
		o: 2
	},
	boar: {
		a: "Boar",
		b: "1F417",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature"
		],
		k: [
			11,
			52
		],
		o: 2
	},
	sandal: {
		a: "Womans Sandal",
		b: "1F461",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shoes",
			"fashion",
			"flip flops"
		],
		k: [
			14,
			21
		],
		o: 2
	},
	"flag-bh": {
		a: "Bahrain Flag",
		b: "1F1E7-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			54
		],
		o: 2
	},
	arrow_down: {
		a: "Downwards Black Arrow",
		b: "2B07-FE0F",
		c: "2B07",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"bottom"
		],
		k: [
			55,
			39
		],
		o: 2
	},
	thinking_face: {
		a: "Thinking Face",
		b: "1F914",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			27
		],
		o: 2
	},
	writing_hand: {
		skin_variations: {
			"1F3FB": {
				unified: "270D-1F3FB",
				non_qualified: null,
				image: "270d-1f3fb.png",
				sheet_x: 55,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "270D-1F3FC",
				non_qualified: null,
				image: "270d-1f3fc.png",
				sheet_x: 55,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "270D-1F3FD",
				non_qualified: null,
				image: "270d-1f3fd.png",
				sheet_x: 55,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "270D-1F3FE",
				non_qualified: null,
				image: "270d-1f3fe.png",
				sheet_x: 55,
				sheet_y: 8,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "270D-1F3FF",
				non_qualified: null,
				image: "270d-1f3ff.png",
				sheet_x: 55,
				sheet_y: 9,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Writing Hand",
		b: "270D-FE0F",
		c: "270D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"lower_left_ballpoint_pen",
			"stationery",
			"write",
			"compose"
		],
		k: [
			55,
			4
		],
		o: 2
	},
	chestnut: {
		a: "Chestnut",
		b: "1F330",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"squirrel"
		],
		k: [
			6,
			8
		],
		o: 2
	},
	basketball: {
		a: "Basketball and Hoop",
		b: "1F3C0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"balls",
			"NBA"
		],
		k: [
			8,
			38
		],
		o: 2
	},
	pig_nose: {
		a: "Pig Nose",
		b: "1F43D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"oink"
		],
		k: [
			12,
			33
		],
		o: 2
	},
	love_hotel: {
		a: "Love Hotel",
		b: "1F3E9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"like",
			"affection",
			"dating"
		],
		k: [
			11,
			3
		],
		o: 2
	},
	nail_care: {
		skin_variations: {
			"1F3FB": {
				unified: "1F485-1F3FB",
				non_qualified: null,
				image: "1f485-1f3fb.png",
				sheet_x: 24,
				sheet_y: 34,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F485-1F3FC",
				non_qualified: null,
				image: "1f485-1f3fc.png",
				sheet_x: 24,
				sheet_y: 35,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F485-1F3FD",
				non_qualified: null,
				image: "1f485-1f3fd.png",
				sheet_x: 24,
				sheet_y: 36,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F485-1F3FE",
				non_qualified: null,
				image: "1f485-1f3fe.png",
				sheet_x: 24,
				sheet_y: 37,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F485-1F3FF",
				non_qualified: null,
				image: "1f485-1f3ff.png",
				sheet_x: 24,
				sheet_y: 38,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Nail Polish",
		b: "1F485",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"beauty",
			"manicure",
			"finger",
			"fashion",
			"nail"
		],
		k: [
			24,
			33
		],
		o: 2
	},
	volleyball: {
		a: "Volleyball",
		b: "1F3D0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"balls"
		],
		k: [
			10,
			35
		],
		o: 2
	},
	"flag-bi": {
		a: "Burundi Flag",
		b: "1F1E7-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			55
		],
		o: 2
	},
	arrow_lower_left: {
		a: "South West Arrow",
		b: "2199-FE0F",
		c: "2199",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"diagonal",
			"southwest"
		],
		k: [
			52,
			19
		],
		o: 2
	},
	ram: {
		a: "Ram",
		b: "1F40F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"sheep",
			"nature"
		],
		k: [
			11,
			43
		],
		o: 2
	},
	ballet_shoes: {
		a: "Ballet Shoes",
		b: "1FA70",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			51
		],
		o: 12
	},
	zipper_mouth_face: {
		a: "Zipper-Mouth Face",
		b: "1F910",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"sealed",
			"zipper",
			"secret"
		],
		k: [
			37,
			23
		],
		o: 2
	},
	bread: {
		a: "Bread",
		b: "1F35E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"wheat",
			"breakfast",
			"toast"
		],
		k: [
			6,
			54
		],
		o: 2
	},
	convenience_store: {
		a: "Convenience Store",
		b: "1F3EA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"shopping",
			"groceries"
		],
		k: [
			11,
			4
		],
		o: 2
	},
	boot: {
		a: "Womans Boots",
		b: "1F462",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shoes",
			"fashion"
		],
		k: [
			14,
			22
		],
		o: 2
	},
	sheep: {
		a: "Sheep",
		b: "1F411",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"wool",
			"shipit"
		],
		k: [
			11,
			45
		],
		o: 2
	},
	face_with_raised_eyebrow: {
		a: "Face with One Eyebrow Raised",
		b: "1F928",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			42
		],
		n: [
			"face_with_one_eyebrow_raised"
		],
		o: 5
	},
	"flag-bj": {
		a: "Benin Flag",
		b: "1F1E7-1F1EF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			0,
			56
		],
		o: 2
	},
	arrow_left: {
		a: "Leftwards Black Arrow",
		b: "2B05-FE0F",
		c: "2B05",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"previous",
			"back"
		],
		k: [
			55,
			37
		],
		o: 2
	},
	selfie: {
		skin_variations: {
			"1F3FB": {
				unified: "1F933-1F3FB",
				non_qualified: null,
				image: "1f933-1f3fb.png",
				sheet_x: 39,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F933-1F3FC",
				non_qualified: null,
				image: "1f933-1f3fc.png",
				sheet_x: 39,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F933-1F3FD",
				non_qualified: null,
				image: "1f933-1f3fd.png",
				sheet_x: 39,
				sheet_y: 14,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F933-1F3FE",
				non_qualified: null,
				image: "1f933-1f3fe.png",
				sheet_x: 39,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F933-1F3FF",
				non_qualified: null,
				image: "1f933-1f3ff.png",
				sheet_x: 39,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Selfie",
		b: "1F933",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"camera",
			"phone"
		],
		k: [
			39,
			11
		],
		o: 4
	},
	croissant: {
		a: "Croissant",
		b: "1F950",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"bread",
			"french"
		],
		k: [
			41,
			31
		],
		o: 4
	},
	school: {
		a: "School",
		b: "1F3EB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"student",
			"education",
			"learn",
			"teach"
		],
		k: [
			11,
			5
		],
		o: 2
	},
	football: {
		a: "American Football",
		b: "1F3C8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"balls",
			"NFL"
		],
		k: [
			9,
			33
		],
		o: 2
	},
	goat: {
		a: "Goat",
		b: "1F410",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature"
		],
		k: [
			11,
			44
		],
		o: 2
	},
	department_store: {
		a: "Department Store",
		b: "1F3EC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"shopping",
			"mall"
		],
		k: [
			11,
			6
		],
		o: 2
	},
	"flag-bl": {
		a: "St. Barthélemy Flag",
		b: "1F1E7-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			0
		],
		o: 2
	},
	crown: {
		a: "Crown",
		b: "1F451",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"king",
			"kod",
			"leader",
			"royalty",
			"lord"
		],
		k: [
			14,
			5
		],
		o: 2
	},
	arrow_upper_left: {
		a: "North West Arrow",
		b: "2196-FE0F",
		c: "2196",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"point",
			"direction",
			"diagonal",
			"northwest"
		],
		k: [
			52,
			16
		],
		o: 2
	},
	neutral_face: {
		a: "Neutral Face",
		b: "1F610",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"indifference",
			"meh",
			":|",
			"neutral"
		],
		k: [
			30,
			51
		],
		l: [
			":|",
			":-|"
		],
		o: 2
	},
	rugby_football: {
		a: "Rugby Football",
		b: "1F3C9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"team"
		],
		k: [
			9,
			34
		],
		o: 2
	},
	muscle: {
		skin_variations: {
			"1F3FB": {
				unified: "1F4AA-1F3FB",
				non_qualified: null,
				image: "1f4aa-1f3fb.png",
				sheet_x: 25,
				sheet_y: 53,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F4AA-1F3FC",
				non_qualified: null,
				image: "1f4aa-1f3fc.png",
				sheet_x: 25,
				sheet_y: 54,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F4AA-1F3FD",
				non_qualified: null,
				image: "1f4aa-1f3fd.png",
				sheet_x: 25,
				sheet_y: 55,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F4AA-1F3FE",
				non_qualified: null,
				image: "1f4aa-1f3fe.png",
				sheet_x: 25,
				sheet_y: 56,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F4AA-1F3FF",
				non_qualified: null,
				image: "1f4aa-1f3ff.png",
				sheet_x: 26,
				sheet_y: 0,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Flexed Biceps",
		b: "1F4AA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"arm",
			"flex",
			"hand",
			"summer",
			"strong",
			"biceps"
		],
		k: [
			25,
			52
		],
		o: 2
	},
	baguette_bread: {
		a: "Baguette Bread",
		b: "1F956",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"bread",
			"french"
		],
		k: [
			41,
			37
		],
		o: 4
	},
	expressionless: {
		a: "Expressionless Face",
		b: "1F611",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"indifferent",
			"-_-",
			"meh",
			"deadpan"
		],
		k: [
			30,
			52
		],
		o: 2
	},
	womans_hat: {
		a: "Womans Hat",
		b: "1F452",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fashion",
			"accessories",
			"female",
			"lady",
			"spring"
		],
		k: [
			14,
			6
		],
		o: 2
	},
	pretzel: {
		a: "Pretzel",
		b: "1F968",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			55
		],
		o: 5
	},
	mechanical_arm: {
		a: "Mechanical Arm",
		b: "1F9BE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			6
		],
		o: 12
	},
	arrow_up_down: {
		a: "Up Down Arrow",
		b: "2195-FE0F",
		c: "2195",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"way",
			"vertical"
		],
		k: [
			52,
			15
		],
		o: 2
	},
	dromedary_camel: {
		a: "Dromedary Camel",
		b: "1F42A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"hot",
			"desert",
			"hump"
		],
		k: [
			12,
			14
		],
		o: 2
	},
	tennis: {
		a: "Tennis Racquet and Ball",
		b: "1F3BE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"balls",
			"green"
		],
		k: [
			8,
			36
		],
		o: 2
	},
	"flag-bm": {
		a: "Bermuda Flag",
		b: "1F1E7-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			1
		],
		o: 2
	},
	factory: {
		a: "Factory",
		b: "1F3ED",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"industry",
			"pollution",
			"smoke"
		],
		k: [
			11,
			7
		],
		o: 2
	},
	japanese_castle: {
		a: "Japanese Castle",
		b: "1F3EF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"building"
		],
		k: [
			11,
			9
		],
		o: 2
	},
	no_mouth: {
		a: "Face Without Mouth",
		b: "1F636",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"hellokitty"
		],
		k: [
			31,
			32
		],
		o: 2
	},
	mechanical_leg: {
		a: "Mechanical Leg",
		b: "1F9BF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			7
		],
		o: 12
	},
	bagel: {
		a: "Bagel",
		b: "1F96F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			5
		],
		o: 11
	},
	camel: {
		a: "Bactrian Camel",
		b: "1F42B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"hot",
			"desert",
			"hump"
		],
		k: [
			12,
			15
		],
		o: 2
	},
	tophat: {
		a: "Top Hat",
		b: "1F3A9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"magic",
			"gentleman",
			"classy",
			"circus"
		],
		k: [
			8,
			15
		],
		o: 2
	},
	left_right_arrow: {
		a: "Left Right Arrow",
		b: "2194-FE0F",
		c: "2194",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"direction",
			"horizontal",
			"sideways"
		],
		k: [
			52,
			14
		],
		o: 2
	},
	"flag-bn": {
		a: "Brunei Flag",
		b: "1F1E7-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			2
		],
		o: 2
	},
	flying_disc: {
		a: "Flying Disc",
		b: "1F94F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			30
		],
		o: 11
	},
	smirk: {
		a: "Smirking Face",
		b: "1F60F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"smile",
			"mean",
			"prank",
			"smug",
			"sarcasm"
		],
		k: [
			30,
			50
		],
		o: 2
	},
	mortar_board: {
		a: "Graduation Cap",
		b: "1F393",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"school",
			"college",
			"degree",
			"university",
			"graduation",
			"cap",
			"hat",
			"legal",
			"learn",
			"education"
		],
		k: [
			7,
			55
		],
		o: 2
	},
	european_castle: {
		a: "European Castle",
		b: "1F3F0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"royalty",
			"history"
		],
		k: [
			11,
			10
		],
		o: 2
	},
	leg: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9B5-1F3FB",
				non_qualified: null,
				image: "1f9b5-1f3fb.png",
				sheet_x: 43,
				sheet_y: 6,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9B5-1F3FC",
				non_qualified: null,
				image: "1f9b5-1f3fc.png",
				sheet_x: 43,
				sheet_y: 7,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9B5-1F3FD",
				non_qualified: null,
				image: "1f9b5-1f3fd.png",
				sheet_x: 43,
				sheet_y: 8,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9B5-1F3FE",
				non_qualified: null,
				image: "1f9b5-1f3fe.png",
				sheet_x: 43,
				sheet_y: 9,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9B5-1F3FF",
				non_qualified: null,
				image: "1f9b5-1f3ff.png",
				sheet_x: 43,
				sheet_y: 10,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Leg",
		b: "1F9B5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			5
		],
		o: 11
	},
	pancakes: {
		a: "Pancakes",
		b: "1F95E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"breakfast",
			"flapjacks",
			"hotcakes"
		],
		k: [
			41,
			45
		],
		o: 4
	},
	leftwards_arrow_with_hook: {
		a: "Leftwards Arrow with Hook",
		b: "21A9-FE0F",
		c: "21A9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"back",
			"return",
			"blue-square",
			"undo",
			"enter"
		],
		k: [
			52,
			20
		],
		o: 2
	},
	"flag-bo": {
		a: "Bolivia Flag",
		b: "1F1E7-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			3
		],
		o: 2
	},
	bowling: {
		a: "Bowling",
		b: "1F3B3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"fun",
			"play"
		],
		k: [
			8,
			25
		],
		o: 2
	},
	llama: {
		a: "Llama",
		b: "1F999",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			43
		],
		o: 11
	},
	arrow_right_hook: {
		a: "Rightwards Arrow with Hook",
		b: "21AA-FE0F",
		c: "21AA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"return",
			"rotate",
			"direction"
		],
		k: [
			52,
			21
		],
		o: 2
	},
	wedding: {
		a: "Wedding",
		b: "1F492",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"couple",
			"marriage",
			"bride",
			"groom"
		],
		k: [
			25,
			28
		],
		o: 2
	},
	"flag-bq": {
		a: "Caribbean Netherlands Flag",
		b: "1F1E7-1F1F6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			4
		],
		o: 2
	},
	foot: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9B6-1F3FB",
				non_qualified: null,
				image: "1f9b6-1f3fb.png",
				sheet_x: 43,
				sheet_y: 12,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9B6-1F3FC",
				non_qualified: null,
				image: "1f9b6-1f3fc.png",
				sheet_x: 43,
				sheet_y: 13,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9B6-1F3FD",
				non_qualified: null,
				image: "1f9b6-1f3fd.png",
				sheet_x: 43,
				sheet_y: 14,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9B6-1F3FE",
				non_qualified: null,
				image: "1f9b6-1f3fe.png",
				sheet_x: 43,
				sheet_y: 15,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9B6-1F3FF",
				non_qualified: null,
				image: "1f9b6-1f3ff.png",
				sheet_x: 43,
				sheet_y: 16,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Foot",
		b: "1F9B6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			11
		],
		o: 11
	},
	giraffe_face: {
		a: "Giraffe Face",
		b: "1F992",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			36
		],
		o: 5
	},
	unamused: {
		a: "Unamused Face",
		b: "1F612",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"indifference",
			"bored",
			"straight face",
			"serious",
			"sarcasm"
		],
		k: [
			30,
			53
		],
		m: ":(",
		o: 2
	},
	billed_cap: {
		a: "Billed Cap",
		b: "1F9E2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			21
		],
		o: 5
	},
	waffle: {
		a: "Waffle",
		b: "1F9C7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			15
		],
		o: 12
	},
	cricket_bat_and_ball: {
		a: "Cricket Bat and Ball",
		b: "1F3CF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			34
		],
		o: 2
	},
	helmet_with_white_cross: {
		a: "Helmet with White Cross",
		b: "26D1-FE0F",
		c: "26D1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			54,
			6
		],
		o: 2
	},
	ear: {
		skin_variations: {
			"1F3FB": {
				unified: "1F442-1F3FB",
				non_qualified: null,
				image: "1f442-1f3fb.png",
				sheet_x: 12,
				sheet_y: 40,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F442-1F3FC",
				non_qualified: null,
				image: "1f442-1f3fc.png",
				sheet_x: 12,
				sheet_y: 41,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F442-1F3FD",
				non_qualified: null,
				image: "1f442-1f3fd.png",
				sheet_x: 12,
				sheet_y: 42,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F442-1F3FE",
				non_qualified: null,
				image: "1f442-1f3fe.png",
				sheet_x: 12,
				sheet_y: 43,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F442-1F3FF",
				non_qualified: null,
				image: "1f442-1f3ff.png",
				sheet_x: 12,
				sheet_y: 44,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Ear",
		b: "1F442",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"hear",
			"sound",
			"listen"
		],
		k: [
			12,
			39
		],
		o: 2
	},
	elephant: {
		a: "Elephant",
		b: "1F418",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"nose",
			"th",
			"circus"
		],
		k: [
			11,
			53
		],
		o: 2
	},
	cheese_wedge: {
		a: "Cheese Wedge",
		b: "1F9C0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			8
		],
		o: 2
	},
	tokyo_tower: {
		a: "Tokyo Tower",
		b: "1F5FC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"japanese"
		],
		k: [
			30,
			31
		],
		o: 2
	},
	arrow_heading_up: {
		a: "Arrow Pointing Rightwards Then Curving Upwards",
		b: "2934-FE0F",
		c: "2934",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"top"
		],
		k: [
			55,
			35
		],
		o: 2
	},
	field_hockey_stick_and_ball: {
		a: "Field Hockey Stick and Ball",
		b: "1F3D1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			36
		],
		o: 2
	},
	"flag-br": {
		a: "Brazil Flag",
		b: "1F1E7-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			5
		],
		o: 2
	},
	face_with_rolling_eyes: {
		a: "Face with Rolling Eyes",
		b: "1F644",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			31,
			46
		],
		o: 2
	},
	ear_with_hearing_aid: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9BB-1F3FB",
				non_qualified: null,
				image: "1f9bb-1f3fb.png",
				sheet_x: 43,
				sheet_y: 56,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9BB-1F3FC",
				non_qualified: null,
				image: "1f9bb-1f3fc.png",
				sheet_x: 44,
				sheet_y: 0,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9BB-1F3FD",
				non_qualified: null,
				image: "1f9bb-1f3fd.png",
				sheet_x: 44,
				sheet_y: 1,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9BB-1F3FE",
				non_qualified: null,
				image: "1f9bb-1f3fe.png",
				sheet_x: 44,
				sheet_y: 2,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9BB-1F3FF",
				non_qualified: null,
				image: "1f9bb-1f3ff.png",
				sheet_x: 44,
				sheet_y: 3,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Ear with Hearing Aid",
		b: "1F9BB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			55
		],
		o: 12
	},
	arrow_heading_down: {
		a: "Arrow Pointing Rightwards Then Curving Downwards",
		b: "2935-FE0F",
		c: "2935",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"bottom"
		],
		k: [
			55,
			36
		],
		o: 2
	},
	ice_hockey_stick_and_puck: {
		a: "Ice Hockey Stick and Puck",
		b: "1F3D2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			37
		],
		o: 2
	},
	meat_on_bone: {
		a: "Meat on Bone",
		b: "1F356",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"good",
			"food",
			"drumstick"
		],
		k: [
			6,
			46
		],
		o: 2
	},
	prayer_beads: {
		a: "Prayer Beads",
		b: "1F4FF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dhikr",
			"religious"
		],
		k: [
			27,
			27
		],
		o: 2
	},
	statue_of_liberty: {
		a: "Statue of Liberty",
		b: "1F5FD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"american",
			"newyork"
		],
		k: [
			30,
			32
		],
		o: 2
	},
	grimacing: {
		a: "Grimacing Face",
		b: "1F62C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"grimace",
			"teeth"
		],
		k: [
			31,
			22
		],
		o: 2
	},
	"flag-bs": {
		a: "Bahamas Flag",
		b: "1F1E7-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			6
		],
		o: 2
	},
	rhinoceros: {
		a: "Rhinoceros",
		b: "1F98F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"horn"
		],
		k: [
			42,
			33
		],
		o: 4
	},
	lacrosse: {
		a: "Lacrosse Stick and Ball",
		b: "1F94D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			28
		],
		o: 11
	},
	poultry_leg: {
		a: "Poultry Leg",
		b: "1F357",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"meat",
			"drumstick",
			"bird",
			"chicken",
			"turkey"
		],
		k: [
			6,
			47
		],
		o: 2
	},
	hippopotamus: {
		a: "Hippopotamus",
		b: "1F99B",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			45
		],
		o: 11
	},
	nose: {
		skin_variations: {
			"1F3FB": {
				unified: "1F443-1F3FB",
				non_qualified: null,
				image: "1f443-1f3fb.png",
				sheet_x: 12,
				sheet_y: 46,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F443-1F3FC",
				non_qualified: null,
				image: "1f443-1f3fc.png",
				sheet_x: 12,
				sheet_y: 47,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F443-1F3FD",
				non_qualified: null,
				image: "1f443-1f3fd.png",
				sheet_x: 12,
				sheet_y: 48,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F443-1F3FE",
				non_qualified: null,
				image: "1f443-1f3fe.png",
				sheet_x: 12,
				sheet_y: 49,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F443-1F3FF",
				non_qualified: null,
				image: "1f443-1f3ff.png",
				sheet_x: 12,
				sheet_y: 50,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Nose",
		b: "1F443",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"smell",
			"sniff"
		],
		k: [
			12,
			45
		],
		o: 2
	},
	arrows_clockwise: {
		a: "Clockwise Downwards and Upwards Open Circle Arrows",
		b: "1F503",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sync",
			"cycle",
			"round",
			"repeat"
		],
		k: [
			27,
			31
		],
		o: 2
	},
	"flag-bt": {
		a: "Bhutan Flag",
		b: "1F1E7-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			7
		],
		o: 2
	},
	church: {
		a: "Church",
		b: "26EA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"building",
			"religion",
			"christ"
		],
		k: [
			54,
			10
		],
		o: 2
	},
	lipstick: {
		a: "Lipstick",
		b: "1F484",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"female",
			"girl",
			"fashion",
			"woman"
		],
		k: [
			24,
			32
		],
		o: 2
	},
	lying_face: {
		a: "Lying Face",
		b: "1F925",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"lie",
			"pinocchio"
		],
		k: [
			38,
			22
		],
		o: 4
	},
	arrows_counterclockwise: {
		a: "Anticlockwise Downwards and Upwards Open Circle Arrows",
		b: "1F504",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"sync",
			"cycle"
		],
		k: [
			27,
			32
		],
		o: 2
	},
	"flag-bv": {
		a: "Bouvet Island Flag",
		b: "1F1E7-1F1FB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			8
		],
		o: 2
	},
	cut_of_meat: {
		a: "Cut of Meat",
		b: "1F969",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			56
		],
		o: 5
	},
	mosque: {
		a: "Mosque",
		b: "1F54C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"islam",
			"worship",
			"minaret"
		],
		k: [
			28,
			36
		],
		o: 2
	},
	ring: {
		a: "Ring",
		b: "1F48D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"wedding",
			"propose",
			"marriage",
			"valentines",
			"diamond",
			"fashion",
			"jewelry",
			"gem",
			"engagement"
		],
		k: [
			25,
			23
		],
		o: 2
	},
	brain: {
		a: "Brain",
		b: "1F9E0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			19
		],
		o: 5
	},
	table_tennis_paddle_and_ball: {
		a: "Table Tennis Paddle and Ball",
		b: "1F3D3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			38
		],
		o: 2
	},
	relieved: {
		a: "Relieved Face",
		b: "1F60C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"relaxed",
			"phew",
			"massage",
			"happiness"
		],
		k: [
			30,
			47
		],
		o: 2
	},
	mouse: {
		a: "Mouse Face",
		b: "1F42D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"cheese_wedge",
			"rodent"
		],
		k: [
			12,
			17
		],
		o: 2
	},
	hindu_temple: {
		a: "Hindu Temple",
		b: "1F6D5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			36,
			41
		],
		o: 12
	},
	back: {
		a: "Back with Leftwards Arrow Above",
		b: "1F519",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"arrow",
			"words",
			"return"
		],
		k: [
			27,
			53
		],
		o: 2
	},
	gem: {
		a: "Gem Stone",
		b: "1F48E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue",
			"ruby",
			"diamond",
			"jewelry"
		],
		k: [
			25,
			24
		],
		o: 2
	},
	pensive: {
		a: "Pensive Face",
		b: "1F614",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"sad",
			"depressed",
			"upset"
		],
		k: [
			30,
			55
		],
		o: 2
	},
	"flag-bw": {
		a: "Botswana Flag",
		b: "1F1E7-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			9
		],
		o: 2
	},
	mouse2: {
		a: "Mouse",
		b: "1F401",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"rodent"
		],
		k: [
			11,
			29
		],
		o: 2
	},
	bacon: {
		a: "Bacon",
		b: "1F953",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"breakfast",
			"pork",
			"pig",
			"meat"
		],
		k: [
			41,
			34
		],
		o: 4
	},
	tooth: {
		a: "Tooth",
		b: "1F9B7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			17
		],
		o: 11
	},
	badminton_racquet_and_shuttlecock: {
		a: "Badminton Racquet and Shuttlecock",
		b: "1F3F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			20
		],
		o: 2
	},
	rat: {
		a: "Rat",
		b: "1F400",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"mouse",
			"rodent"
		],
		k: [
			11,
			28
		],
		o: 2
	},
	synagogue: {
		a: "Synagogue",
		b: "1F54D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"judaism",
			"worship",
			"temple",
			"jewish"
		],
		k: [
			28,
			37
		],
		o: 2
	},
	end: {
		a: "End with Leftwards Arrow Above",
		b: "1F51A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"words",
			"arrow"
		],
		k: [
			27,
			54
		],
		o: 2
	},
	bone: {
		a: "Bone",
		b: "1F9B4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			4
		],
		o: 11
	},
	boxing_glove: {
		a: "Boxing Glove",
		b: "1F94A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"fighting"
		],
		k: [
			41,
			25
		],
		o: 4
	},
	mute: {
		a: "Speaker with Cancellation Stroke",
		b: "1F507",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sound",
			"volume",
			"silence",
			"quiet"
		],
		k: [
			27,
			35
		],
		o: 2
	},
	hamburger: {
		a: "Hamburger",
		b: "1F354",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"meat",
			"fast food",
			"beef",
			"cheeseburger",
			"mcdonalds",
			"burger king"
		],
		k: [
			6,
			44
		],
		o: 2
	},
	"flag-by": {
		a: "Belarus Flag",
		b: "1F1E7-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			10
		],
		o: 2
	},
	sleepy: {
		a: "Sleepy Face",
		b: "1F62A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"tired",
			"rest",
			"nap"
		],
		k: [
			31,
			20
		],
		o: 2
	},
	on: {
		a: "On with Exclamation Mark with Left Right Arrow Above",
		b: "1F51B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"arrow",
			"words"
		],
		k: [
			27,
			55
		],
		o: 2
	},
	martial_arts_uniform: {
		a: "Martial Arts Uniform",
		b: "1F94B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"judo",
			"karate",
			"taekwondo"
		],
		k: [
			41,
			26
		],
		o: 4
	},
	speaker: {
		a: "Speaker",
		b: "1F508",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sound",
			"volume",
			"silence",
			"broadcast"
		],
		k: [
			27,
			36
		],
		o: 2
	},
	drooling_face: {
		a: "Drooling Face",
		b: "1F924",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face"
		],
		k: [
			38,
			21
		],
		o: 4
	},
	eyes: {
		a: "Eyes",
		b: "1F440",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"look",
			"watch",
			"stalk",
			"peek",
			"see"
		],
		k: [
			12,
			36
		],
		o: 2
	},
	"flag-bz": {
		a: "Belize Flag",
		b: "1F1E7-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			11
		],
		o: 2
	},
	hamster: {
		a: "Hamster Face",
		b: "1F439",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature"
		],
		k: [
			12,
			29
		],
		o: 2
	},
	shinto_shrine: {
		a: "Shinto Shrine",
		b: "26E9-FE0F",
		c: "26E9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"temple",
			"japan",
			"kyoto"
		],
		k: [
			54,
			9
		],
		o: 2
	},
	fries: {
		a: "French Fries",
		b: "1F35F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"chips",
			"snack",
			"fast food"
		],
		k: [
			6,
			55
		],
		o: 2
	},
	goal_net: {
		a: "Goal Net",
		b: "1F945",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports"
		],
		k: [
			41,
			21
		],
		o: 4
	},
	kaaba: {
		a: "Kaaba",
		b: "1F54B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"mecca",
			"mosque",
			"islam"
		],
		k: [
			28,
			35
		],
		o: 2
	},
	soon: {
		a: "Soon with Rightwards Arrow Above",
		b: "1F51C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"arrow",
			"words"
		],
		k: [
			27,
			56
		],
		o: 2
	},
	"flag-ca": {
		a: "Canada Flag",
		b: "1F1E8-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			12
		],
		o: 2
	},
	rabbit: {
		a: "Rabbit Face",
		b: "1F430",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"pet",
			"spring",
			"magic",
			"bunny"
		],
		k: [
			12,
			20
		],
		o: 2
	},
	eye: {
		a: "Eye",
		b: "1F441-FE0F",
		c: "1F441",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"look",
			"see",
			"watch",
			"stare"
		],
		k: [
			12,
			38
		],
		o: 2
	},
	sleeping: {
		a: "Sleeping Face",
		b: "1F634",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"tired",
			"sleepy",
			"night",
			"zzz"
		],
		k: [
			31,
			30
		],
		o: 2
	},
	pizza: {
		a: "Slice of Pizza",
		b: "1F355",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"party"
		],
		k: [
			6,
			45
		],
		o: 2
	},
	sound: {
		a: "Speaker with One Sound Wave",
		b: "1F509",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"volume",
			"speaker",
			"broadcast"
		],
		k: [
			27,
			37
		],
		o: 2
	},
	rabbit2: {
		a: "Rabbit",
		b: "1F407",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"pet",
			"magic",
			"spring"
		],
		k: [
			11,
			35
		],
		o: 2
	},
	fountain: {
		a: "Fountain",
		b: "26F2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"summer",
			"water",
			"fresh"
		],
		k: [
			54,
			13
		],
		o: 2
	},
	golf: {
		a: "Flag in Hole",
		b: "26F3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"business",
			"flag",
			"hole",
			"summer"
		],
		k: [
			54,
			14
		],
		o: 2
	},
	top: {
		a: "Top with Upwards Arrow Above",
		b: "1F51D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"words",
			"blue-square"
		],
		k: [
			28,
			0
		],
		o: 2
	},
	mask: {
		a: "Face with Medical Mask",
		b: "1F637",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"sick",
			"ill",
			"disease"
		],
		k: [
			31,
			33
		],
		o: 2
	},
	"flag-cc": {
		a: "Cocos (keeling) Islands Flag",
		b: "1F1E8-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			13
		],
		o: 2
	},
	hotdog: {
		a: "Hot Dog",
		b: "1F32D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"frankfurter"
		],
		k: [
			6,
			5
		],
		o: 2
	},
	loud_sound: {
		a: "Speaker with Three Sound Waves",
		b: "1F50A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"volume",
			"noise",
			"noisy",
			"speaker",
			"broadcast"
		],
		k: [
			27,
			38
		],
		o: 2
	},
	tongue: {
		a: "Tongue",
		b: "1F445",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"mouth",
			"playful"
		],
		k: [
			12,
			52
		],
		o: 2
	},
	place_of_worship: {
		a: "Place of Worship",
		b: "1F6D0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"religion",
			"church",
			"temple",
			"prayer"
		],
		k: [
			36,
			38
		],
		o: 2
	},
	ice_skate: {
		a: "Ice Skate",
		b: "26F8-FE0F",
		c: "26F8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports"
		],
		k: [
			54,
			18
		],
		o: 2
	},
	sandwich: {
		a: "Sandwich",
		b: "1F96A",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			0
		],
		o: 5
	},
	chipmunk: {
		a: "Chipmunk",
		b: "1F43F-FE0F",
		c: "1F43F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"rodent",
			"squirrel"
		],
		k: [
			12,
			35
		],
		o: 2
	},
	loudspeaker: {
		a: "Public Address Loudspeaker",
		b: "1F4E2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"volume",
			"sound"
		],
		k: [
			26,
			56
		],
		o: 2
	},
	lips: {
		a: "Mouth",
		b: "1F444",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"mouth",
			"kiss"
		],
		k: [
			12,
			51
		],
		o: 2
	},
	"flag-cd": {
		a: "Congo - Kinshasa Flag",
		b: "1F1E8-1F1E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			14
		],
		o: 2
	},
	tent: {
		a: "Tent",
		b: "26FA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"camping",
			"outdoors"
		],
		k: [
			54,
			37
		],
		o: 2
	},
	face_with_thermometer: {
		a: "Face with Thermometer",
		b: "1F912",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sick",
			"temperature",
			"thermometer",
			"cold",
			"fever"
		],
		k: [
			37,
			25
		],
		o: 2
	},
	taco: {
		a: "Taco",
		b: "1F32E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"mexican"
		],
		k: [
			6,
			6
		],
		o: 2
	},
	foggy: {
		a: "Foggy",
		b: "1F301",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"mountain"
		],
		k: [
			5,
			20
		],
		o: 2
	},
	"flag-cf": {
		a: "Central African Republic Flag",
		b: "1F1E8-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			15
		],
		o: 2
	},
	baby: {
		skin_variations: {
			"1F3FB": {
				unified: "1F476-1F3FB",
				non_qualified: null,
				image: "1f476-1f3fb.png",
				sheet_x: 23,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F476-1F3FC",
				non_qualified: null,
				image: "1f476-1f3fc.png",
				sheet_x: 23,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F476-1F3FD",
				non_qualified: null,
				image: "1f476-1f3fd.png",
				sheet_x: 23,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F476-1F3FE",
				non_qualified: null,
				image: "1f476-1f3fe.png",
				sheet_x: 23,
				sheet_y: 8,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F476-1F3FF",
				non_qualified: null,
				image: "1f476-1f3ff.png",
				sheet_x: 23,
				sheet_y: 9,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Baby",
		b: "1F476",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"child",
			"boy",
			"girl",
			"toddler"
		],
		k: [
			23,
			4
		],
		o: 2
	},
	atom_symbol: {
		a: "Atom Symbol",
		b: "269B-FE0F",
		c: "269B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"science",
			"physics",
			"chemistry"
		],
		k: [
			53,
			48
		],
		o: 2
	},
	fishing_pole_and_fish: {
		a: "Fishing Pole and Fish",
		b: "1F3A3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"hobby",
			"summer"
		],
		k: [
			8,
			9
		],
		o: 2
	},
	hedgehog: {
		a: "Hedgehog",
		b: "1F994",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			38
		],
		o: 5
	},
	face_with_head_bandage: {
		a: "Face with Head-Bandage",
		b: "1F915",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"injured",
			"clumsy",
			"bandage",
			"hurt"
		],
		k: [
			37,
			28
		],
		o: 2
	},
	mega: {
		a: "Cheering Megaphone",
		b: "1F4E3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sound",
			"speaker",
			"volume"
		],
		k: [
			27,
			0
		],
		o: 2
	},
	nauseated_face: {
		a: "Nauseated Face",
		b: "1F922",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"vomit",
			"gross",
			"green",
			"sick",
			"throw up",
			"ill"
		],
		k: [
			38,
			19
		],
		o: 4
	},
	child: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D2-1F3FB",
				non_qualified: null,
				image: "1f9d2-1f3fb.png",
				sheet_x: 48,
				sheet_y: 17,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9D2-1F3FC",
				non_qualified: null,
				image: "1f9d2-1f3fc.png",
				sheet_x: 48,
				sheet_y: 18,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9D2-1F3FD",
				non_qualified: null,
				image: "1f9d2-1f3fd.png",
				sheet_x: 48,
				sheet_y: 19,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9D2-1F3FE",
				non_qualified: null,
				image: "1f9d2-1f3fe.png",
				sheet_x: 48,
				sheet_y: 20,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9D2-1F3FF",
				non_qualified: null,
				image: "1f9d2-1f3ff.png",
				sheet_x: 48,
				sheet_y: 21,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Child",
		b: "1F9D2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			48,
			16
		],
		o: 5
	},
	"flag-cg": {
		a: "Congo - Brazzaville Flag",
		b: "1F1E8-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			16
		],
		o: 2
	},
	bat: {
		a: "Bat",
		b: "1F987",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"blind",
			"vampire"
		],
		k: [
			42,
			25
		],
		o: 4
	},
	diving_mask: {
		a: "Diving Mask",
		b: "1F93F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			15
		],
		o: 12
	},
	burrito: {
		a: "Burrito",
		b: "1F32F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"mexican"
		],
		k: [
			6,
			7
		],
		o: 2
	},
	postal_horn: {
		a: "Postal Horn",
		b: "1F4EF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"instrument",
			"music"
		],
		k: [
			27,
			12
		],
		o: 2
	},
	night_with_stars: {
		a: "Night with Stars",
		b: "1F303",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"evening",
			"city",
			"downtown"
		],
		k: [
			5,
			22
		],
		o: 2
	},
	om_symbol: {
		a: "Om Symbol",
		b: "1F549-FE0F",
		c: "1F549",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			28,
			33
		],
		o: 2
	},
	star_of_david: {
		a: "Star of David",
		b: "2721-FE0F",
		c: "2721",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"judaism"
		],
		k: [
			55,
			15
		],
		o: 2
	},
	boy: {
		skin_variations: {
			"1F3FB": {
				unified: "1F466-1F3FB",
				non_qualified: null,
				image: "1f466-1f3fb.png",
				sheet_x: 14,
				sheet_y: 27,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F466-1F3FC",
				non_qualified: null,
				image: "1f466-1f3fc.png",
				sheet_x: 14,
				sheet_y: 28,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F466-1F3FD",
				non_qualified: null,
				image: "1f466-1f3fd.png",
				sheet_x: 14,
				sheet_y: 29,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F466-1F3FE",
				non_qualified: null,
				image: "1f466-1f3fe.png",
				sheet_x: 14,
				sheet_y: 30,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F466-1F3FF",
				non_qualified: null,
				image: "1f466-1f3ff.png",
				sheet_x: 14,
				sheet_y: 31,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Boy",
		b: "1F466",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"man",
			"male",
			"guy",
			"teenager"
		],
		k: [
			14,
			26
		],
		o: 2
	},
	bell: {
		a: "Bell",
		b: "1F514",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sound",
			"notification",
			"christmas",
			"xmas",
			"chime"
		],
		k: [
			27,
			48
		],
		o: 2
	},
	"flag-ch": {
		a: "Switzerland Flag",
		b: "1F1E8-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			17
		],
		o: 2
	},
	running_shirt_with_sash: {
		a: "Running Shirt with Sash",
		b: "1F3BD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"play",
			"pageant"
		],
		k: [
			8,
			35
		],
		o: 2
	},
	stuffed_flatbread: {
		a: "Stuffed Flatbread",
		b: "1F959",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"flatbread",
			"stuffed",
			"gyro"
		],
		k: [
			41,
			40
		],
		o: 4
	},
	bear: {
		a: "Bear Face",
		b: "1F43B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"wild"
		],
		k: [
			12,
			31
		],
		o: 2
	},
	cityscape: {
		a: "Cityscape",
		b: "1F3D9-FE0F",
		c: "1F3D9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"night life",
			"urban"
		],
		k: [
			10,
			44
		],
		o: 2
	},
	face_vomiting: {
		a: "Face with Open Mouth Vomiting",
		b: "1F92E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			48
		],
		n: [
			"face_with_open_mouth_vomiting"
		],
		o: 5
	},
	wheel_of_dharma: {
		a: "Wheel of Dharma",
		b: "2638-FE0F",
		c: "2638",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hinduism",
			"buddhism",
			"sikhism",
			"jainism"
		],
		k: [
			53,
			15
		],
		o: 2
	},
	ski: {
		a: "Ski and Ski Boot",
		b: "1F3BF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"winter",
			"cold",
			"snow"
		],
		k: [
			8,
			37
		],
		o: 2
	},
	girl: {
		skin_variations: {
			"1F3FB": {
				unified: "1F467-1F3FB",
				non_qualified: null,
				image: "1f467-1f3fb.png",
				sheet_x: 14,
				sheet_y: 33,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F467-1F3FC",
				non_qualified: null,
				image: "1f467-1f3fc.png",
				sheet_x: 14,
				sheet_y: 34,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F467-1F3FD",
				non_qualified: null,
				image: "1f467-1f3fd.png",
				sheet_x: 14,
				sheet_y: 35,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F467-1F3FE",
				non_qualified: null,
				image: "1f467-1f3fe.png",
				sheet_x: 14,
				sheet_y: 36,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F467-1F3FF",
				non_qualified: null,
				image: "1f467-1f3ff.png",
				sheet_x: 14,
				sheet_y: 37,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Girl",
		b: "1F467",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"female",
			"woman",
			"teenager"
		],
		k: [
			14,
			32
		],
		o: 2
	},
	falafel: {
		a: "Falafel",
		b: "1F9C6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			14
		],
		o: 12
	},
	sneezing_face: {
		a: "Sneezing Face",
		b: "1F927",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"gesundheit",
			"sneeze",
			"sick",
			"allergy"
		],
		k: [
			38,
			41
		],
		o: 4
	},
	no_bell: {
		a: "Bell with Cancellation Stroke",
		b: "1F515",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sound",
			"volume",
			"mute",
			"quiet",
			"silent"
		],
		k: [
			27,
			49
		],
		o: 2
	},
	koala: {
		a: "Koala",
		b: "1F428",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature"
		],
		k: [
			12,
			12
		],
		o: 2
	},
	sunrise_over_mountains: {
		a: "Sunrise over Mountains",
		b: "1F304",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"view",
			"vacation",
			"photo"
		],
		k: [
			5,
			23
		],
		o: 2
	},
	"flag-ci": {
		a: "Côte D’ivoire Flag",
		b: "1F1E8-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			18
		],
		o: 2
	},
	sunrise: {
		a: "Sunrise",
		b: "1F305",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"morning",
			"view",
			"vacation",
			"photo"
		],
		k: [
			5,
			24
		],
		o: 2
	},
	yin_yang: {
		a: "Yin Yang",
		b: "262F-FE0F",
		c: "262F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"balance"
		],
		k: [
			53,
			14
		],
		o: 2
	},
	adult: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB",
				non_qualified: null,
				image: "1f9d1-1f3fb.png",
				sheet_x: 48,
				sheet_y: 11,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC",
				non_qualified: null,
				image: "1f9d1-1f3fc.png",
				sheet_x: 48,
				sheet_y: 12,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD",
				non_qualified: null,
				image: "1f9d1-1f3fd.png",
				sheet_x: 48,
				sheet_y: 13,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE",
				non_qualified: null,
				image: "1f9d1-1f3fe.png",
				sheet_x: 48,
				sheet_y: 14,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF",
				non_qualified: null,
				image: "1f9d1-1f3ff.png",
				sheet_x: 48,
				sheet_y: 15,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Adult",
		b: "1F9D1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			48,
			10
		],
		o: 5
	},
	hot_face: {
		a: "Overheated Face",
		b: "1F975",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			10
		],
		o: 11
	},
	musical_score: {
		a: "Musical Score",
		b: "1F3BC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"treble",
			"clef",
			"compose"
		],
		k: [
			8,
			34
		],
		o: 2
	},
	sled: {
		a: "Sled",
		b: "1F6F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			36,
			56
		],
		o: 5
	},
	egg: {
		a: "Egg",
		b: "1F95A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"chicken",
			"breakfast"
		],
		k: [
			41,
			41
		],
		o: 4
	},
	panda_face: {
		a: "Panda Face",
		b: "1F43C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"panda"
		],
		k: [
			12,
			32
		],
		o: 2
	},
	"flag-ck": {
		a: "Cook Islands Flag",
		b: "1F1E8-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			19
		],
		o: 2
	},
	"flag-cl": {
		a: "Chile Flag",
		b: "1F1E8-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			20
		],
		o: 2
	},
	person_with_blond_hair: {
		skin_variations: {
			"1F3FB": {
				unified: "1F471-1F3FB",
				non_qualified: null,
				image: "1f471-1f3fb.png",
				sheet_x: 22,
				sheet_y: 20,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F471-1F3FC",
				non_qualified: null,
				image: "1f471-1f3fc.png",
				sheet_x: 22,
				sheet_y: 21,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F471-1F3FD",
				non_qualified: null,
				image: "1f471-1f3fd.png",
				sheet_x: 22,
				sheet_y: 22,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F471-1F3FE",
				non_qualified: null,
				image: "1f471-1f3fe.png",
				sheet_x: 22,
				sheet_y: 23,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F471-1F3FF",
				non_qualified: null,
				image: "1f471-1f3ff.png",
				sheet_x: 22,
				sheet_y: 24,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F471-200D-2642-FE0F",
		a: "Person with Blond Hair",
		b: "1F471",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			22,
			19
		],
		o: 2
	},
	sloth: {
		a: "Sloth",
		b: "1F9A5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			53
		],
		o: 12
	},
	latin_cross: {
		a: "Latin Cross",
		b: "271D-FE0F",
		c: "271D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"christianity"
		],
		k: [
			55,
			14
		],
		o: 2
	},
	curling_stone: {
		a: "Curling Stone",
		b: "1F94C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			27
		],
		o: 5
	},
	cold_face: {
		a: "Freezing Face",
		b: "1F976",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			11
		],
		o: 11
	},
	fried_egg: {
		a: "Cooking",
		b: "1F373",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"breakfast",
			"kitchen",
			"egg"
		],
		k: [
			7,
			18
		],
		n: [
			"cooking"
		],
		o: 2
	},
	city_sunset: {
		a: "Cityscape at Dusk",
		b: "1F306",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"evening",
			"sky",
			"buildings"
		],
		k: [
			5,
			25
		],
		o: 2
	},
	musical_note: {
		a: "Musical Note",
		b: "1F3B5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"score",
			"tone",
			"sound"
		],
		k: [
			8,
			27
		],
		o: 2
	},
	"flag-cm": {
		a: "Cameroon Flag",
		b: "1F1E8-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			21
		],
		o: 2
	},
	notes: {
		a: "Multiple Musical Notes",
		b: "1F3B6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"music",
			"score"
		],
		k: [
			8,
			28
		],
		o: 2
	},
	woozy_face: {
		a: "Face with Uneven Eyes and Wavy Mouth",
		b: "1F974",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			9
		],
		o: 11
	},
	dart: {
		a: "Direct Hit",
		b: "1F3AF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"game",
			"play",
			"bar"
		],
		k: [
			8,
			21
		],
		o: 2
	},
	orthodox_cross: {
		a: "Orthodox Cross",
		b: "2626-FE0F",
		c: "2626",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"suppedaneum",
			"religion"
		],
		k: [
			53,
			11
		],
		o: 2
	},
	shallow_pan_of_food: {
		a: "Shallow Pan of Food",
		b: "1F958",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"cooking",
			"casserole",
			"paella"
		],
		k: [
			41,
			39
		],
		o: 4
	},
	otter: {
		a: "Otter",
		b: "1F9A6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			54
		],
		o: 12
	},
	man: {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB",
				non_qualified: null,
				image: "1f468-1f3fb.png",
				sheet_x: 17,
				sheet_y: 23,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC",
				non_qualified: null,
				image: "1f468-1f3fc.png",
				sheet_x: 17,
				sheet_y: 24,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD",
				non_qualified: null,
				image: "1f468-1f3fd.png",
				sheet_x: 17,
				sheet_y: 25,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE",
				non_qualified: null,
				image: "1f468-1f3fe.png",
				sheet_x: 17,
				sheet_y: 26,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF",
				non_qualified: null,
				image: "1f468-1f3ff.png",
				sheet_x: 17,
				sheet_y: 27,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man",
		b: "1F468",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"mustache",
			"father",
			"dad",
			"guy",
			"classy",
			"sir",
			"moustache"
		],
		k: [
			17,
			22
		],
		o: 2
	},
	city_sunrise: {
		a: "Sunset over Buildings",
		b: "1F307",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"good morning",
			"dawn"
		],
		k: [
			5,
			26
		],
		o: 2
	},
	bearded_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D4-1F3FB",
				non_qualified: null,
				image: "1f9d4-1f3fb.png",
				sheet_x: 48,
				sheet_y: 29,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9D4-1F3FC",
				non_qualified: null,
				image: "1f9d4-1f3fc.png",
				sheet_x: 48,
				sheet_y: 30,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9D4-1F3FD",
				non_qualified: null,
				image: "1f9d4-1f3fd.png",
				sheet_x: 48,
				sheet_y: 31,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9D4-1F3FE",
				non_qualified: null,
				image: "1f9d4-1f3fe.png",
				sheet_x: 48,
				sheet_y: 32,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9D4-1F3FF",
				non_qualified: null,
				image: "1f9d4-1f3ff.png",
				sheet_x: 48,
				sheet_y: 33,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Bearded Person",
		b: "1F9D4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			48,
			28
		],
		o: 5
	},
	skunk: {
		a: "Skunk",
		b: "1F9A8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			56
		],
		o: 12
	},
	stew: {
		a: "Pot of Food",
		b: "1F372",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"meat",
			"soup"
		],
		k: [
			7,
			17
		],
		o: 2
	},
	cn: {
		a: "China Flag",
		b: "1F1E8-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"china",
			"chinese",
			"prc",
			"flag",
			"country",
			"nation",
			"banner"
		],
		k: [
			1,
			22
		],
		n: [
			"flag-cn"
		],
		o: 2
	},
	studio_microphone: {
		a: "Studio Microphone",
		b: "1F399-FE0F",
		c: "1F399",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sing",
			"recording",
			"artist",
			"talkshow"
		],
		k: [
			8,
			1
		],
		o: 2
	},
	star_and_crescent: {
		a: "Star and Crescent",
		b: "262A-FE0F",
		c: "262A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"islam"
		],
		k: [
			53,
			12
		],
		o: 2
	},
	"yo-yo": {
		a: "Yo-Yo",
		b: "1FA80",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			1
		],
		o: 12
	},
	bridge_at_night: {
		a: "Bridge at Night",
		b: "1F309",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"sanfrancisco"
		],
		k: [
			5,
			28
		],
		o: 2
	},
	dizzy_face: {
		a: "Dizzy Face",
		b: "1F635",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"spent",
			"unconscious",
			"xox",
			"dizzy"
		],
		k: [
			31,
			31
		],
		o: 2
	},
	red_haired_man: {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F9B0",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f9b0.png",
				sheet_x: 16,
				sheet_y: 24,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F9B0",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f9b0.png",
				sheet_x: 16,
				sheet_y: 25,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F9B0",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f9b0.png",
				sheet_x: 16,
				sheet_y: 26,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F9B0",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f9b0.png",
				sheet_x: 16,
				sheet_y: 27,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F9B0",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f9b0.png",
				sheet_x: 16,
				sheet_y: 28,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Red Haired Man",
		b: "1F468-200D-1F9B0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			23
		],
		o: 11
	},
	kite: {
		a: "Kite",
		b: "1FA81",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			2
		],
		o: 12
	},
	bowl_with_spoon: {
		a: "Bowl with Spoon",
		b: "1F963",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			50
		],
		o: 5
	},
	"flag-co": {
		a: "Colombia Flag",
		b: "1F1E8-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			23
		],
		o: 2
	},
	peace_symbol: {
		a: "Peace Symbol",
		b: "262E-FE0F",
		c: "262E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hippie"
		],
		k: [
			53,
			13
		],
		o: 2
	},
	kangaroo: {
		a: "Kangaroo",
		b: "1F998",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			42
		],
		o: 11
	},
	hotsprings: {
		a: "Hot Springs",
		b: "2668-FE0F",
		c: "2668",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bath",
			"warm",
			"relax"
		],
		k: [
			53,
			37
		],
		o: 2
	},
	exploding_head: {
		a: "Shocked Face with Exploding Head",
		b: "1F92F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			49
		],
		n: [
			"shocked_face_with_exploding_head"
		],
		o: 5
	},
	level_slider: {
		a: "Level Slider",
		b: "1F39A-FE0F",
		c: "1F39A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"scale"
		],
		k: [
			8,
			2
		],
		o: 2
	},
	badger: {
		a: "Badger",
		b: "1F9A1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			51
		],
		o: 11
	},
	"8ball": {
		a: "Billiards",
		b: "1F3B1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"pool",
			"hobby",
			"game",
			"luck",
			"magic"
		],
		k: [
			8,
			23
		],
		o: 2
	},
	curly_haired_man: {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F9B1",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f9b1.png",
				sheet_x: 16,
				sheet_y: 30,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F9B1",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f9b1.png",
				sheet_x: 16,
				sheet_y: 31,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F9B1",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f9b1.png",
				sheet_x: 16,
				sheet_y: 32,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F9B1",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f9b1.png",
				sheet_x: 16,
				sheet_y: 33,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F9B1",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f9b1.png",
				sheet_x: 16,
				sheet_y: 34,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Curly Haired Man",
		b: "1F468-200D-1F9B1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			29
		],
		o: 11
	},
	"flag-cp": {
		a: "Clipperton Island Flag",
		b: "1F1E8-1F1F5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			24
		],
		o: 2
	},
	carousel_horse: {
		a: "Carousel Horse",
		b: "1F3A0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"carnival"
		],
		k: [
			8,
			6
		],
		o: 2
	},
	face_with_cowboy_hat: {
		a: "Face with Cowboy Hat",
		b: "1F920",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			17
		],
		o: 4
	},
	menorah_with_nine_branches: {
		a: "Menorah with Nine Branches",
		b: "1F54E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			28,
			38
		],
		o: 2
	},
	green_salad: {
		a: "Green Salad",
		b: "1F957",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"healthy",
			"lettuce"
		],
		k: [
			41,
			38
		],
		o: 4
	},
	control_knobs: {
		a: "Control Knobs",
		b: "1F39B-FE0F",
		c: "1F39B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dial"
		],
		k: [
			8,
			3
		],
		o: 2
	},
	popcorn: {
		a: "Popcorn",
		b: "1F37F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"movie theater",
			"films",
			"snack"
		],
		k: [
			7,
			30
		],
		o: 2
	},
	six_pointed_star: {
		a: "Six Pointed Star with Middle Dot",
		b: "1F52F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"purple-square",
			"religion",
			"jewish",
			"hexagram"
		],
		k: [
			28,
			18
		],
		o: 2
	},
	feet: {
		a: "Paw Prints",
		b: "1F43E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			12,
			34
		],
		n: [
			"paw_prints"
		],
		o: 2
	},
	ferris_wheel: {
		a: "Ferris Wheel",
		b: "1F3A1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"carnival",
			"londoneye"
		],
		k: [
			8,
			7
		],
		o: 2
	},
	microphone: {
		a: "Microphone",
		b: "1F3A4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sound",
			"music",
			"PA",
			"sing",
			"talkshow"
		],
		k: [
			8,
			10
		],
		o: 2
	},
	crystal_ball: {
		a: "Crystal Ball",
		b: "1F52E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"disco",
			"party",
			"magic",
			"circus",
			"fortune_teller"
		],
		k: [
			28,
			17
		],
		o: 2
	},
	partying_face: {
		a: "Face with Party Horn and Party Hat",
		b: "1F973",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			8
		],
		o: 11
	},
	"flag-cr": {
		a: "Costa Rica Flag",
		b: "1F1E8-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			25
		],
		o: 2
	},
	white_haired_man: {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F9B3",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f9b3.png",
				sheet_x: 16,
				sheet_y: 42,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F9B3",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f9b3.png",
				sheet_x: 16,
				sheet_y: 43,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F9B3",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f9b3.png",
				sheet_x: 16,
				sheet_y: 44,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F9B3",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f9b3.png",
				sheet_x: 16,
				sheet_y: 45,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F9B3",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f9b3.png",
				sheet_x: 16,
				sheet_y: 46,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "White Haired Man",
		b: "1F468-200D-1F9B3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			41
		],
		o: 11
	},
	headphones: {
		a: "Headphone",
		b: "1F3A7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"music",
			"score",
			"gadgets"
		],
		k: [
			8,
			13
		],
		o: 2
	},
	bald_man: {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F9B2",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f9b2.png",
				sheet_x: 16,
				sheet_y: 36,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F9B2",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f9b2.png",
				sheet_x: 16,
				sheet_y: 37,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F9B2",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f9b2.png",
				sheet_x: 16,
				sheet_y: 38,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F9B2",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f9b2.png",
				sheet_x: 16,
				sheet_y: 39,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F9B2",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f9b2.png",
				sheet_x: 16,
				sheet_y: 40,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Bald Man",
		b: "1F468-200D-1F9B2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			35
		],
		o: 11
	},
	sunglasses: {
		a: "Smiling Face with Sunglasses",
		b: "1F60E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"cool",
			"smile",
			"summer",
			"beach",
			"sunglass"
		],
		k: [
			30,
			49
		],
		l: [
			"8)"
		],
		o: 2
	},
	butter: {
		a: "Butter",
		b: "1F9C8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			16
		],
		o: 12
	},
	roller_coaster: {
		a: "Roller Coaster",
		b: "1F3A2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"carnival",
			"playground",
			"photo",
			"fun"
		],
		k: [
			8,
			8
		],
		o: 2
	},
	turkey: {
		a: "Turkey",
		b: "1F983",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"bird"
		],
		k: [
			42,
			21
		],
		o: 2
	},
	nazar_amulet: {
		a: "Nazar Amulet",
		b: "1F9FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			50
		],
		o: 11
	},
	"flag-cu": {
		a: "Cuba Flag",
		b: "1F1E8-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			26
		],
		o: 2
	},
	aries: {
		a: "Aries",
		b: "2648",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"purple-square",
			"zodiac",
			"astrology"
		],
		k: [
			53,
			20
		],
		o: 2
	},
	"flag-cv": {
		a: "Cape Verde Flag",
		b: "1F1E8-1F1FB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			27
		],
		o: 2
	},
	barber: {
		a: "Barber Pole",
		b: "1F488",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hair",
			"salon",
			"style"
		],
		k: [
			25,
			18
		],
		o: 2
	},
	taurus: {
		a: "Taurus",
		b: "2649",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"purple-square",
			"sign",
			"zodiac",
			"astrology"
		],
		k: [
			53,
			21
		],
		o: 2
	},
	salt: {
		a: "Salt Shaker",
		b: "1F9C2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			10
		],
		o: 11
	},
	woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB",
				non_qualified: null,
				image: "1f469-1f3fb.png",
				sheet_x: 20,
				sheet_y: 10,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC",
				non_qualified: null,
				image: "1f469-1f3fc.png",
				sheet_x: 20,
				sheet_y: 11,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD",
				non_qualified: null,
				image: "1f469-1f3fd.png",
				sheet_x: 20,
				sheet_y: 12,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE",
				non_qualified: null,
				image: "1f469-1f3fe.png",
				sheet_x: 20,
				sheet_y: 13,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF",
				non_qualified: null,
				image: "1f469-1f3ff.png",
				sheet_x: 20,
				sheet_y: 14,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman",
		b: "1F469",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"female",
			"girls",
			"lady"
		],
		k: [
			20,
			9
		],
		o: 2
	},
	video_game: {
		a: "Video Game",
		b: "1F3AE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"play",
			"console",
			"PS4",
			"controller"
		],
		k: [
			8,
			20
		],
		o: 2
	},
	chicken: {
		a: "Chicken",
		b: "1F414",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cluck",
			"nature",
			"bird"
		],
		k: [
			11,
			48
		],
		o: 2
	},
	radio: {
		a: "Radio",
		b: "1F4FB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"communication",
			"music",
			"podcast",
			"program"
		],
		k: [
			27,
			24
		],
		o: 2
	},
	nerd_face: {
		a: "Nerd Face",
		b: "1F913",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"nerdy",
			"geek",
			"dork"
		],
		k: [
			37,
			26
		],
		o: 2
	},
	red_haired_woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F9B0",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f9b0.png",
				sheet_x: 19,
				sheet_y: 9,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F9B0",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f9b0.png",
				sheet_x: 19,
				sheet_y: 10,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F9B0",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f9b0.png",
				sheet_x: 19,
				sheet_y: 11,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F9B0",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f9b0.png",
				sheet_x: 19,
				sheet_y: 12,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F9B0",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f9b0.png",
				sheet_x: 19,
				sheet_y: 13,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Red Haired Woman",
		b: "1F469-200D-1F9B0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			8
		],
		o: 11
	},
	circus_tent: {
		a: "Circus Tent",
		b: "1F3AA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"festival",
			"carnival",
			"party"
		],
		k: [
			8,
			16
		],
		o: 2
	},
	face_with_monocle: {
		a: "Face with Monocle",
		b: "1F9D0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			45,
			16
		],
		o: 5
	},
	canned_food: {
		a: "Canned Food",
		b: "1F96B",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			1
		],
		o: 5
	},
	"flag-cw": {
		a: "Curaçao Flag",
		b: "1F1E8-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			28
		],
		o: 2
	},
	gemini: {
		a: "Gemini",
		b: "264A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		k: [
			53,
			22
		],
		o: 2
	},
	saxophone: {
		a: "Saxophone",
		b: "1F3B7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"music",
			"instrument",
			"jazz",
			"blues"
		],
		k: [
			8,
			29
		],
		o: 2
	},
	rooster: {
		a: "Rooster",
		b: "1F413",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"chicken"
		],
		k: [
			11,
			47
		],
		o: 2
	},
	joystick: {
		a: "Joystick",
		b: "1F579-FE0F",
		c: "1F579",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"game",
			"play"
		],
		k: [
			29,
			36
		],
		o: 2
	},
	guitar: {
		a: "Guitar",
		b: "1F3B8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"music",
			"instrument"
		],
		k: [
			8,
			30
		],
		o: 2
	},
	slot_machine: {
		a: "Slot Machine",
		b: "1F3B0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bet",
			"gamble",
			"vegas",
			"fruit machine",
			"luck",
			"casino"
		],
		k: [
			8,
			22
		],
		o: 2
	},
	bento: {
		a: "Bento Box",
		b: "1F371",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"japanese",
			"box"
		],
		k: [
			7,
			16
		],
		o: 2
	},
	steam_locomotive: {
		a: "Steam Locomotive",
		b: "1F682",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle",
			"train"
		],
		k: [
			34,
			1
		],
		o: 2
	},
	confused: {
		a: "Confused Face",
		b: "1F615",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"indifference",
			"huh",
			"weird",
			"hmmm",
			":/"
		],
		k: [
			30,
			56
		],
		l: [
			":\\",
			":-\\",
			":/",
			":-/"
		],
		o: 2
	},
	"flag-cx": {
		a: "Christmas Island Flag",
		b: "1F1E8-1F1FD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			29
		],
		o: 2
	},
	hatching_chick: {
		a: "Hatching Chick",
		b: "1F423",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"chicken",
			"egg",
			"born",
			"baby",
			"bird"
		],
		k: [
			12,
			7
		],
		o: 2
	},
	cancer: {
		a: "Cancer",
		b: "264B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		k: [
			53,
			23
		],
		o: 2
	},
	red_haired_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F9B0",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f9b0.png",
				sheet_x: 47,
				sheet_y: 14,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F9B0",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f9b0.png",
				sheet_x: 47,
				sheet_y: 15,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F9B0",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f9b0.png",
				sheet_x: 47,
				sheet_y: 16,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F9B0",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f9b0.png",
				sheet_x: 47,
				sheet_y: 17,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F9B0",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f9b0.png",
				sheet_x: 47,
				sheet_y: 18,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Red Haired Person",
		b: "1F9D1-200D-1F9B0",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			13
		],
		o: 12
	},
	"flag-cy": {
		a: "Cyprus Flag",
		b: "1F1E8-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			30
		],
		o: 2
	},
	worried: {
		a: "Worried Face",
		b: "1F61F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"concern",
			"nervous",
			":("
		],
		k: [
			31,
			9
		],
		o: 2
	},
	railway_car: {
		a: "Railway Car",
		b: "1F683",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle"
		],
		k: [
			34,
			2
		],
		o: 2
	},
	leo: {
		a: "Leo",
		b: "264C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"purple-square",
			"zodiac",
			"astrology"
		],
		k: [
			53,
			24
		],
		o: 2
	},
	curly_haired_woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F9B1",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f9b1.png",
				sheet_x: 19,
				sheet_y: 15,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F9B1",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f9b1.png",
				sheet_x: 19,
				sheet_y: 16,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F9B1",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f9b1.png",
				sheet_x: 19,
				sheet_y: 17,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F9B1",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f9b1.png",
				sheet_x: 19,
				sheet_y: 18,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F9B1",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f9b1.png",
				sheet_x: 19,
				sheet_y: 19,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Curly Haired Woman",
		b: "1F469-200D-1F9B1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			14
		],
		o: 11
	},
	baby_chick: {
		a: "Baby Chick",
		b: "1F424",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"chicken",
			"bird"
		],
		k: [
			12,
			8
		],
		o: 2
	},
	musical_keyboard: {
		a: "Musical Keyboard",
		b: "1F3B9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"piano",
			"instrument",
			"compose"
		],
		k: [
			8,
			31
		],
		o: 2
	},
	game_die: {
		a: "Game Die",
		b: "1F3B2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dice",
			"random",
			"tabletop",
			"play",
			"luck"
		],
		k: [
			8,
			24
		],
		o: 2
	},
	rice_cracker: {
		a: "Rice Cracker",
		b: "1F358",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"japanese"
		],
		k: [
			6,
			48
		],
		o: 2
	},
	virgo: {
		a: "Virgo",
		b: "264D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		k: [
			53,
			25
		],
		o: 2
	},
	"flag-cz": {
		a: "Czechia Flag",
		b: "1F1E8-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			31
		],
		o: 2
	},
	curly_haired_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F9B1",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f9b1.png",
				sheet_x: 47,
				sheet_y: 20,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F9B1",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f9b1.png",
				sheet_x: 47,
				sheet_y: 21,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F9B1",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f9b1.png",
				sheet_x: 47,
				sheet_y: 22,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F9B1",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f9b1.png",
				sheet_x: 47,
				sheet_y: 23,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F9B1",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f9b1.png",
				sheet_x: 47,
				sheet_y: 24,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Curly Haired Person",
		b: "1F9D1-200D-1F9B1",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			19
		],
		o: 12
	},
	rice_ball: {
		a: "Rice Ball",
		b: "1F359",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"japanese"
		],
		k: [
			6,
			49
		],
		o: 2
	},
	hatched_chick: {
		a: "Front-Facing Baby Chick",
		b: "1F425",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"chicken",
			"baby",
			"bird"
		],
		k: [
			12,
			9
		],
		o: 2
	},
	jigsaw: {
		a: "Jigsaw Puzzle Piece",
		b: "1F9E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			28
		],
		o: 11
	},
	trumpet: {
		a: "Trumpet",
		b: "1F3BA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"music",
			"brass"
		],
		k: [
			8,
			32
		],
		o: 2
	},
	slightly_frowning_face: {
		a: "Slightly Frowning Face",
		b: "1F641",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"frowning",
			"disappointed",
			"sad",
			"upset"
		],
		k: [
			31,
			43
		],
		o: 2
	},
	bullettrain_side: {
		a: "High-Speed Train",
		b: "1F684",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle"
		],
		k: [
			34,
			3
		],
		o: 2
	},
	libra: {
		a: "Libra",
		b: "264E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"purple-square",
			"zodiac",
			"astrology"
		],
		k: [
			53,
			26
		],
		o: 2
	},
	de: {
		a: "Germany Flag",
		b: "1F1E9-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"german",
			"nation",
			"flag",
			"country",
			"banner"
		],
		k: [
			1,
			32
		],
		n: [
			"flag-de"
		],
		o: 2
	},
	rice: {
		a: "Cooked Rice",
		b: "1F35A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"china",
			"asian"
		],
		k: [
			6,
			50
		],
		o: 2
	},
	violin: {
		a: "Violin",
		b: "1F3BB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"music",
			"instrument",
			"orchestra",
			"symphony"
		],
		k: [
			8,
			33
		],
		o: 2
	},
	white_haired_woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F9B3",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f9b3.png",
				sheet_x: 19,
				sheet_y: 27,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F9B3",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f9b3.png",
				sheet_x: 19,
				sheet_y: 28,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F9B3",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f9b3.png",
				sheet_x: 19,
				sheet_y: 29,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F9B3",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f9b3.png",
				sheet_x: 19,
				sheet_y: 30,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F9B3",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f9b3.png",
				sheet_x: 19,
				sheet_y: 31,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "White Haired Woman",
		b: "1F469-200D-1F9B3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			26
		],
		o: 11
	},
	bird: {
		a: "Bird",
		b: "1F426",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"fly",
			"tweet",
			"spring"
		],
		k: [
			12,
			10
		],
		o: 2
	},
	white_frowning_face: {
		a: "White Frowning Face",
		b: "2639-FE0F",
		c: "2639",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			16
		],
		o: 2
	},
	bullettrain_front: {
		a: "High-Speed Train with Bullet Nose",
		b: "1F685",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle",
			"speed",
			"fast",
			"public",
			"travel"
		],
		k: [
			34,
			4
		],
		o: 2
	},
	teddy_bear: {
		a: "Teddy Bear",
		b: "1F9F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			43
		],
		o: 11
	},
	white_haired_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F9B3",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f9b3.png",
				sheet_x: 47,
				sheet_y: 32,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F9B3",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f9b3.png",
				sheet_x: 47,
				sheet_y: 33,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F9B3",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f9b3.png",
				sheet_x: 47,
				sheet_y: 34,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F9B3",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f9b3.png",
				sheet_x: 47,
				sheet_y: 35,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F9B3",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f9b3.png",
				sheet_x: 47,
				sheet_y: 36,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "White Haired Person",
		b: "1F9D1-200D-1F9B3",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			31
		],
		o: 12
	},
	spades: {
		a: "Black Spade Suit",
		b: "2660-FE0F",
		c: "2660",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"poker",
			"cards",
			"suits",
			"magic"
		],
		k: [
			53,
			33
		],
		o: 2
	},
	banjo: {
		a: "Banjo",
		b: "1FA95",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			9
		],
		o: 12
	},
	train2: {
		a: "Train",
		b: "1F686",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle"
		],
		k: [
			34,
			5
		],
		o: 2
	},
	scorpius: {
		a: "Scorpius",
		b: "264F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"zodiac",
			"purple-square",
			"astrology",
			"scorpio"
		],
		k: [
			53,
			27
		],
		o: 2
	},
	curry: {
		a: "Curry and Rice",
		b: "1F35B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"spicy",
			"hot",
			"indian"
		],
		k: [
			6,
			51
		],
		o: 2
	},
	open_mouth: {
		a: "Face with Open Mouth",
		b: "1F62E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"surprise",
			"impressed",
			"wow",
			"whoa",
			":O"
		],
		k: [
			31,
			24
		],
		l: [
			":o",
			":-o",
			":O",
			":-O"
		],
		o: 2
	},
	"flag-dg": {
		a: "Diego Garcia Flag",
		b: "1F1E9-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			33
		],
		o: 2
	},
	penguin: {
		a: "Penguin",
		b: "1F427",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature"
		],
		k: [
			12,
			11
		],
		o: 2
	},
	hearts: {
		a: "Black Heart Suit",
		b: "2665-FE0F",
		c: "2665",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"poker",
			"cards",
			"magic",
			"suits"
		],
		k: [
			53,
			35
		],
		o: 2
	},
	ramen: {
		a: "Steaming Bowl",
		b: "1F35C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"japanese",
			"noodle",
			"chopsticks"
		],
		k: [
			6,
			52
		],
		o: 2
	},
	sagittarius: {
		a: "Sagittarius",
		b: "2650",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		k: [
			53,
			28
		],
		o: 2
	},
	bald_woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F9B2",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f9b2.png",
				sheet_x: 19,
				sheet_y: 21,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F9B2",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f9b2.png",
				sheet_x: 19,
				sheet_y: 22,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F9B2",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f9b2.png",
				sheet_x: 19,
				sheet_y: 23,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F9B2",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f9b2.png",
				sheet_x: 19,
				sheet_y: 24,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F9B2",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f9b2.png",
				sheet_x: 19,
				sheet_y: 25,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Bald Woman",
		b: "1F469-200D-1F9B2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			20
		],
		o: 11
	},
	dove_of_peace: {
		a: "Dove of Peace",
		b: "1F54A-FE0F",
		c: "1F54A",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			28,
			34
		],
		o: 2
	},
	hushed: {
		a: "Hushed Face",
		b: "1F62F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"woo",
			"shh"
		],
		k: [
			31,
			25
		],
		o: 2
	},
	metro: {
		a: "Metro",
		b: "1F687",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"blue-square",
			"mrt",
			"underground",
			"tube"
		],
		k: [
			34,
			6
		],
		o: 2
	},
	"flag-dj": {
		a: "Djibouti Flag",
		b: "1F1E9-1F1EF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			34
		],
		o: 2
	},
	drum_with_drumsticks: {
		a: "Drum with Drumsticks",
		b: "1F941",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			17
		],
		o: 4
	},
	spaghetti: {
		a: "Spaghetti",
		b: "1F35D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"italian",
			"noodle"
		],
		k: [
			6,
			53
		],
		o: 2
	},
	eagle: {
		a: "Eagle",
		b: "1F985",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"bird"
		],
		k: [
			42,
			23
		],
		o: 4
	},
	astonished: {
		a: "Astonished Face",
		b: "1F632",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"xox",
			"surprised",
			"poisoned"
		],
		k: [
			31,
			28
		],
		o: 2
	},
	capricorn: {
		a: "Capricorn",
		b: "2651",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"zodiac",
			"purple-square",
			"astrology"
		],
		k: [
			53,
			29
		],
		o: 2
	},
	light_rail: {
		a: "Light Rail",
		b: "1F688",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle"
		],
		k: [
			34,
			7
		],
		o: 2
	},
	"flag-dk": {
		a: "Denmark Flag",
		b: "1F1E9-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			35
		],
		o: 2
	},
	iphone: {
		a: "Mobile Phone",
		b: "1F4F1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"apple",
			"gadgets",
			"dial"
		],
		k: [
			27,
			14
		],
		o: 2
	},
	bald_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F9B2",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f9b2.png",
				sheet_x: 47,
				sheet_y: 26,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F9B2",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f9b2.png",
				sheet_x: 47,
				sheet_y: 27,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F9B2",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f9b2.png",
				sheet_x: 47,
				sheet_y: 28,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F9B2",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f9b2.png",
				sheet_x: 47,
				sheet_y: 29,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F9B2",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f9b2.png",
				sheet_x: 47,
				sheet_y: 30,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Bald Person",
		b: "1F9D1-200D-1F9B2",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			25
		],
		o: 12
	},
	diamonds: {
		a: "Black Diamond Suit",
		b: "2666-FE0F",
		c: "2666",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"poker",
			"cards",
			"magic",
			"suits"
		],
		k: [
			53,
			36
		],
		o: 2
	},
	clubs: {
		a: "Black Club Suit",
		b: "2663-FE0F",
		c: "2663",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"poker",
			"cards",
			"magic",
			"suits"
		],
		k: [
			53,
			34
		],
		o: 2
	},
	aquarius: {
		a: "Aquarius",
		b: "2652",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"purple-square",
			"zodiac",
			"astrology"
		],
		k: [
			53,
			30
		],
		o: 2
	},
	sweet_potato: {
		a: "Roasted Sweet Potato",
		b: "1F360",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"nature"
		],
		k: [
			6,
			56
		],
		o: 2
	},
	"flag-dm": {
		a: "Dominica Flag",
		b: "1F1E9-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			36
		],
		o: 2
	},
	duck: {
		a: "Duck",
		b: "1F986",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"bird",
			"mallard"
		],
		k: [
			42,
			24
		],
		o: 4
	},
	calling: {
		a: "Mobile Phone with Rightwards Arrow at Left",
		b: "1F4F2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"iphone",
			"incoming"
		],
		k: [
			27,
			15
		],
		o: 2
	},
	station: {
		a: "Station",
		b: "1F689",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle",
			"public"
		],
		k: [
			34,
			8
		],
		o: 2
	},
	"blond-haired-woman": {
		skin_variations: {
			"1F3FB": {
				unified: "1F471-1F3FB-200D-2640-FE0F",
				non_qualified: "1F471-1F3FB-200D-2640",
				image: "1f471-1f3fb-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 8,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F471-1F3FC-200D-2640-FE0F",
				non_qualified: "1F471-1F3FC-200D-2640",
				image: "1f471-1f3fc-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F471-1F3FD-200D-2640-FE0F",
				non_qualified: "1F471-1F3FD-200D-2640",
				image: "1f471-1f3fd-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F471-1F3FE-200D-2640-FE0F",
				non_qualified: "1F471-1F3FE-200D-2640",
				image: "1f471-1f3fe-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F471-1F3FF-200D-2640-FE0F",
				non_qualified: "1F471-1F3FF-200D-2640",
				image: "1f471-1f3ff-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Blond Haired Woman",
		b: "1F471-200D-2640-FE0F",
		c: "1F471-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			22,
			7
		],
		o: 4
	},
	flushed: {
		a: "Flushed Face",
		b: "1F633",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"blush",
			"shy",
			"flattered"
		],
		k: [
			31,
			29
		],
		o: 2
	},
	pisces: {
		a: "Pisces",
		b: "2653",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"purple-square",
			"sign",
			"zodiac",
			"astrology"
		],
		k: [
			53,
			31
		],
		o: 2
	},
	chess_pawn: {
		a: "Chess Pawn",
		b: "265F-FE0F",
		c: "265F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			32
		],
		o: 11
	},
	"blond-haired-man": {
		skin_variations: {
			"1F3FB": {
				unified: "1F471-1F3FB-200D-2642-FE0F",
				non_qualified: "1F471-1F3FB-200D-2642",
				image: "1f471-1f3fb-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 14,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F471-1F3FC-200D-2642-FE0F",
				non_qualified: "1F471-1F3FC-200D-2642",
				image: "1f471-1f3fc-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F471-1F3FD-200D-2642-FE0F",
				non_qualified: "1F471-1F3FD-200D-2642",
				image: "1f471-1f3fd-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F471-1F3FE-200D-2642-FE0F",
				non_qualified: "1F471-1F3FE-200D-2642",
				image: "1f471-1f3fe-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F471-1F3FF-200D-2642-FE0F",
				non_qualified: "1F471-1F3FF-200D-2642",
				image: "1f471-1f3ff-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F471",
		a: "Blond Haired Man",
		b: "1F471-200D-2642-FE0F",
		c: "1F471-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			22,
			13
		],
		o: 4
	},
	phone: {
		a: "Black Telephone",
		b: "260E-FE0F",
		c: "260E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"communication",
			"dial",
			"telephone"
		],
		k: [
			52,
			54
		],
		n: [
			"telephone"
		],
		o: 2
	},
	oden: {
		a: "Oden",
		b: "1F362",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"japanese"
		],
		k: [
			7,
			1
		],
		o: 2
	},
	"flag-do": {
		a: "Dominican Republic Flag",
		b: "1F1E9-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			37
		],
		o: 2
	},
	tram: {
		a: "Tram",
		b: "1F68A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle"
		],
		k: [
			34,
			9
		],
		o: 2
	},
	swan: {
		a: "Swan",
		b: "1F9A2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			52
		],
		o: 11
	},
	pleading_face: {
		a: "Face with Pleading Eyes",
		b: "1F97A",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			12
		],
		o: 11
	},
	"flag-dz": {
		a: "Algeria Flag",
		b: "1F1E9-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			38
		],
		o: 2
	},
	monorail: {
		a: "Monorail",
		b: "1F69D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle"
		],
		k: [
			34,
			28
		],
		o: 2
	},
	owl: {
		a: "Owl",
		b: "1F989",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"bird",
			"hoot"
		],
		k: [
			42,
			27
		],
		o: 4
	},
	sushi: {
		a: "Sushi",
		b: "1F363",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"fish",
			"japanese",
			"rice"
		],
		k: [
			7,
			2
		],
		o: 2
	},
	telephone_receiver: {
		a: "Telephone Receiver",
		b: "1F4DE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"communication",
			"dial"
		],
		k: [
			26,
			52
		],
		o: 2
	},
	black_joker: {
		a: "Playing Card Black Joker",
		b: "1F0CF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"poker",
			"cards",
			"game",
			"play",
			"magic"
		],
		k: [
			0,
			15
		],
		o: 2
	},
	ophiuchus: {
		a: "Ophiuchus",
		b: "26CE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sign",
			"purple-square",
			"constellation",
			"astrology"
		],
		k: [
			54,
			4
		],
		o: 2
	},
	frowning: {
		a: "Frowning Face with Open Mouth",
		b: "1F626",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"aw",
			"what"
		],
		k: [
			31,
			16
		],
		o: 2
	},
	older_adult: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D3-1F3FB",
				non_qualified: null,
				image: "1f9d3-1f3fb.png",
				sheet_x: 48,
				sheet_y: 23,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9D3-1F3FC",
				non_qualified: null,
				image: "1f9d3-1f3fc.png",
				sheet_x: 48,
				sheet_y: 24,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9D3-1F3FD",
				non_qualified: null,
				image: "1f9d3-1f3fd.png",
				sheet_x: 48,
				sheet_y: 25,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9D3-1F3FE",
				non_qualified: null,
				image: "1f9d3-1f3fe.png",
				sheet_x: 48,
				sheet_y: 26,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9D3-1F3FF",
				non_qualified: null,
				image: "1f9d3-1f3ff.png",
				sheet_x: 48,
				sheet_y: 27,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Older Adult",
		b: "1F9D3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			48,
			22
		],
		o: 5
	},
	"flag-ea": {
		a: "Ceuta & Melilla Flag",
		b: "1F1EA-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			39
		],
		o: 2
	},
	flamingo: {
		a: "Flamingo",
		b: "1F9A9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			0
		],
		o: 12
	},
	pager: {
		a: "Pager",
		b: "1F4DF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bbcall",
			"oldschool",
			"90s"
		],
		k: [
			26,
			53
		],
		o: 2
	},
	mountain_railway: {
		a: "Mountain Railway",
		b: "1F69E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle"
		],
		k: [
			34,
			29
		],
		o: 2
	},
	mahjong: {
		a: "Mahjong Tile Red Dragon",
		b: "1F004",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"game",
			"play",
			"chinese",
			"kanji"
		],
		k: [
			0,
			14
		],
		o: 2
	},
	older_man: {
		skin_variations: {
			"1F3FB": {
				unified: "1F474-1F3FB",
				non_qualified: null,
				image: "1f474-1f3fb.png",
				sheet_x: 22,
				sheet_y: 50,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F474-1F3FC",
				non_qualified: null,
				image: "1f474-1f3fc.png",
				sheet_x: 22,
				sheet_y: 51,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F474-1F3FD",
				non_qualified: null,
				image: "1f474-1f3fd.png",
				sheet_x: 22,
				sheet_y: 52,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F474-1F3FE",
				non_qualified: null,
				image: "1f474-1f3fe.png",
				sheet_x: 22,
				sheet_y: 53,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F474-1F3FF",
				non_qualified: null,
				image: "1f474-1f3ff.png",
				sheet_x: 22,
				sheet_y: 54,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Older Man",
		b: "1F474",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"human",
			"male",
			"men",
			"old",
			"elder",
			"senior"
		],
		k: [
			22,
			49
		],
		o: 2
	},
	twisted_rightwards_arrows: {
		a: "Twisted Rightwards Arrows",
		b: "1F500",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"shuffle",
			"music",
			"random"
		],
		k: [
			27,
			28
		],
		o: 2
	},
	fried_shrimp: {
		a: "Fried Shrimp",
		b: "1F364",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"animal",
			"appetizer",
			"summer"
		],
		k: [
			7,
			3
		],
		o: 2
	},
	anguished: {
		a: "Anguished Face",
		b: "1F627",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"stunned",
			"nervous"
		],
		k: [
			31,
			17
		],
		l: [
			"D:"
		],
		o: 2
	},
	repeat: {
		a: "Clockwise Rightwards and Leftwards Open Circle Arrows",
		b: "1F501",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"loop",
			"record"
		],
		k: [
			27,
			29
		],
		o: 2
	},
	fish_cake: {
		a: "Fish Cake with Swirl Design",
		b: "1F365",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"japan",
			"sea",
			"beach",
			"narutomaki",
			"pink",
			"swirl",
			"kamaboko",
			"surimi",
			"ramen"
		],
		k: [
			7,
			4
		],
		o: 2
	},
	fax: {
		a: "Fax Machine",
		b: "1F4E0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"communication",
			"technology"
		],
		k: [
			26,
			54
		],
		o: 2
	},
	older_woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F475-1F3FB",
				non_qualified: null,
				image: "1f475-1f3fb.png",
				sheet_x: 22,
				sheet_y: 56,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F475-1F3FC",
				non_qualified: null,
				image: "1f475-1f3fc.png",
				sheet_x: 23,
				sheet_y: 0,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F475-1F3FD",
				non_qualified: null,
				image: "1f475-1f3fd.png",
				sheet_x: 23,
				sheet_y: 1,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F475-1F3FE",
				non_qualified: null,
				image: "1f475-1f3fe.png",
				sheet_x: 23,
				sheet_y: 2,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F475-1F3FF",
				non_qualified: null,
				image: "1f475-1f3ff.png",
				sheet_x: 23,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Older Woman",
		b: "1F475",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"human",
			"female",
			"women",
			"lady",
			"old",
			"elder",
			"senior"
		],
		k: [
			22,
			55
		],
		o: 2
	},
	"flag-ec": {
		a: "Ecuador Flag",
		b: "1F1EA-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			40
		],
		o: 2
	},
	peacock: {
		a: "Peacock",
		b: "1F99A",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			44
		],
		o: 11
	},
	fearful: {
		a: "Fearful Face",
		b: "1F628",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"scared",
			"terrified",
			"nervous",
			"oops",
			"huh"
		],
		k: [
			31,
			18
		],
		o: 2
	},
	train: {
		a: "Tram Car",
		b: "1F68B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle",
			"carriage",
			"public",
			"travel"
		],
		k: [
			34,
			10
		],
		o: 2
	},
	flower_playing_cards: {
		a: "Flower Playing Cards",
		b: "1F3B4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"game",
			"sunset",
			"red"
		],
		k: [
			8,
			26
		],
		o: 2
	},
	repeat_one: {
		a: "Clockwise Rightwards and Leftwards Open Circle Arrows with Circled One Overlay",
		b: "1F502",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"loop"
		],
		k: [
			27,
			30
		],
		o: 2
	},
	moon_cake: {
		a: "Moon Cake",
		b: "1F96E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			4
		],
		o: 11
	},
	performing_arts: {
		a: "Performing Arts",
		b: "1F3AD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"acting",
			"theater",
			"drama"
		],
		k: [
			8,
			19
		],
		o: 2
	},
	cold_sweat: {
		a: "Face with Open Mouth and Cold Sweat",
		b: "1F630",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"nervous",
			"sweat"
		],
		k: [
			31,
			26
		],
		o: 2
	},
	person_frowning: {
		skin_variations: {
			"1F3FB": {
				unified: "1F64D-1F3FB",
				non_qualified: null,
				image: "1f64d-1f3fb.png",
				sheet_x: 33,
				sheet_y: 27,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F64D-1F3FC",
				non_qualified: null,
				image: "1f64d-1f3fc.png",
				sheet_x: 33,
				sheet_y: 28,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F64D-1F3FD",
				non_qualified: null,
				image: "1f64d-1f3fd.png",
				sheet_x: 33,
				sheet_y: 29,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F64D-1F3FE",
				non_qualified: null,
				image: "1f64d-1f3fe.png",
				sheet_x: 33,
				sheet_y: 30,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F64D-1F3FF",
				non_qualified: null,
				image: "1f64d-1f3ff.png",
				sheet_x: 33,
				sheet_y: 31,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F64D-200D-2640-FE0F",
		a: "Person Frowning",
		b: "1F64D",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			33,
			26
		],
		o: 2
	},
	"flag-ee": {
		a: "Estonia Flag",
		b: "1F1EA-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			41
		],
		o: 2
	},
	battery: {
		a: "Battery",
		b: "1F50B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"power",
			"energy",
			"sustain"
		],
		k: [
			27,
			39
		],
		o: 2
	},
	parrot: {
		a: "Parrot",
		b: "1F99C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			46
		],
		o: 11
	},
	bus: {
		a: "Bus",
		b: "1F68C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"car",
			"vehicle",
			"transportation"
		],
		k: [
			34,
			11
		],
		o: 2
	},
	"flag-eg": {
		a: "Egypt Flag",
		b: "1F1EA-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			42
		],
		o: 2
	},
	arrow_forward: {
		a: "Black Right-Pointing Triangle",
		b: "25B6-FE0F",
		c: "25B6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"right",
			"direction",
			"play"
		],
		k: [
			52,
			43
		],
		o: 2
	},
	"man-frowning": {
		skin_variations: {
			"1F3FB": {
				unified: "1F64D-1F3FB-200D-2642-FE0F",
				non_qualified: "1F64D-1F3FB-200D-2642",
				image: "1f64d-1f3fb-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 21,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F64D-1F3FC-200D-2642-FE0F",
				non_qualified: "1F64D-1F3FC-200D-2642",
				image: "1f64d-1f3fc-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 22,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F64D-1F3FD-200D-2642-FE0F",
				non_qualified: "1F64D-1F3FD-200D-2642",
				image: "1f64d-1f3fd-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 23,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F64D-1F3FE-200D-2642-FE0F",
				non_qualified: "1F64D-1F3FE-200D-2642",
				image: "1f64d-1f3fe-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 24,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F64D-1F3FF-200D-2642-FE0F",
				non_qualified: "1F64D-1F3FF-200D-2642",
				image: "1f64d-1f3ff-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 25,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Frowning",
		b: "1F64D-200D-2642-FE0F",
		c: "1F64D-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			33,
			20
		],
		o: 4
	},
	disappointed_relieved: {
		a: "Disappointed but Relieved Face",
		b: "1F625",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"phew",
			"sweat",
			"nervous"
		],
		k: [
			31,
			15
		],
		o: 2
	},
	electric_plug: {
		a: "Electric Plug",
		b: "1F50C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"charger",
			"power"
		],
		k: [
			27,
			40
		],
		o: 2
	},
	frame_with_picture: {
		a: "Frame with Picture",
		b: "1F5BC-FE0F",
		c: "1F5BC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			14
		],
		o: 2
	},
	oncoming_bus: {
		a: "Oncoming Bus",
		b: "1F68D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"transportation"
		],
		k: [
			34,
			12
		],
		o: 2
	},
	dango: {
		a: "Dango",
		b: "1F361",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"dessert",
			"sweet",
			"japanese",
			"barbecue",
			"meat"
		],
		k: [
			7,
			0
		],
		o: 2
	},
	frog: {
		a: "Frog Face",
		b: "1F438",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"croak",
			"toad"
		],
		k: [
			12,
			28
		],
		o: 2
	},
	computer: {
		a: "Personal Computer",
		b: "1F4BB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"laptop",
			"screen",
			"display",
			"monitor"
		],
		k: [
			26,
			17
		],
		o: 2
	},
	art: {
		a: "Artist Palette",
		b: "1F3A8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"design",
			"paint",
			"draw",
			"colors"
		],
		k: [
			8,
			14
		],
		o: 2
	},
	"flag-eh": {
		a: "Western Sahara Flag",
		b: "1F1EA-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			43
		],
		o: 2
	},
	fast_forward: {
		a: "Black Right-Pointing Double Triangle",
		b: "23E9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"play",
			"speed",
			"continue"
		],
		k: [
			52,
			26
		],
		o: 2
	},
	cry: {
		a: "Crying Face",
		b: "1F622",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"tears",
			"sad",
			"depressed",
			"upset",
			":'("
		],
		k: [
			31,
			12
		],
		l: [
			":'("
		],
		m: ":'(",
		o: 2
	},
	"woman-frowning": {
		skin_variations: {
			"1F3FB": {
				unified: "1F64D-1F3FB-200D-2640-FE0F",
				non_qualified: "1F64D-1F3FB-200D-2640",
				image: "1f64d-1f3fb-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F64D-1F3FC-200D-2640-FE0F",
				non_qualified: "1F64D-1F3FC-200D-2640",
				image: "1f64d-1f3fc-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F64D-1F3FD-200D-2640-FE0F",
				non_qualified: "1F64D-1F3FD-200D-2640",
				image: "1f64d-1f3fd-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F64D-1F3FE-200D-2640-FE0F",
				non_qualified: "1F64D-1F3FE-200D-2640",
				image: "1f64d-1f3fe-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F64D-1F3FF-200D-2640-FE0F",
				non_qualified: "1F64D-1F3FF-200D-2640",
				image: "1f64d-1f3ff-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F64D",
		a: "Woman Frowning",
		b: "1F64D-200D-2640-FE0F",
		c: "1F64D-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			33,
			14
		],
		o: 4
	},
	trolleybus: {
		a: "Trolleybus",
		b: "1F68E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bart",
			"transportation",
			"vehicle"
		],
		k: [
			34,
			13
		],
		o: 2
	},
	crocodile: {
		a: "Crocodile",
		b: "1F40A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"reptile",
			"lizard",
			"alligator"
		],
		k: [
			11,
			38
		],
		o: 2
	},
	dumpling: {
		a: "Dumpling",
		b: "1F95F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			46
		],
		o: 5
	},
	black_right_pointing_double_triangle_with_vertical_bar: {
		a: "Black Right Pointing Double Triangle with Vertical Bar",
		b: "23ED-FE0F",
		c: "23ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			30
		],
		o: 2
	},
	desktop_computer: {
		a: "Desktop Computer",
		b: "1F5A5-FE0F",
		c: "1F5A5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"computing",
			"screen"
		],
		k: [
			30,
			10
		],
		o: 2
	},
	person_with_pouting_face: {
		skin_variations: {
			"1F3FB": {
				unified: "1F64E-1F3FB",
				non_qualified: null,
				image: "1f64e-1f3fb.png",
				sheet_x: 33,
				sheet_y: 45,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F64E-1F3FC",
				non_qualified: null,
				image: "1f64e-1f3fc.png",
				sheet_x: 33,
				sheet_y: 46,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F64E-1F3FD",
				non_qualified: null,
				image: "1f64e-1f3fd.png",
				sheet_x: 33,
				sheet_y: 47,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F64E-1F3FE",
				non_qualified: null,
				image: "1f64e-1f3fe.png",
				sheet_x: 33,
				sheet_y: 48,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F64E-1F3FF",
				non_qualified: null,
				image: "1f64e-1f3ff.png",
				sheet_x: 33,
				sheet_y: 49,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F64E-200D-2640-FE0F",
		a: "Person with Pouting Face",
		b: "1F64E",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			33,
			44
		],
		o: 2
	},
	turtle: {
		a: "Turtle",
		b: "1F422",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"slow",
			"nature",
			"tortoise"
		],
		k: [
			12,
			6
		],
		o: 2
	},
	sob: {
		a: "Loudly Crying Face",
		b: "1F62D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"cry",
			"tears",
			"sad",
			"upset",
			"depressed"
		],
		k: [
			31,
			23
		],
		m: ":'(",
		o: 2
	},
	"flag-er": {
		a: "Eritrea Flag",
		b: "1F1EA-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			44
		],
		o: 2
	},
	thread: {
		a: "Spool of Thread",
		b: "1F9F5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			40
		],
		o: 11
	},
	minibus: {
		a: "Minibus",
		b: "1F690",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"car",
			"transportation"
		],
		k: [
			34,
			15
		],
		o: 2
	},
	fortune_cookie: {
		a: "Fortune Cookie",
		b: "1F960",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			47
		],
		o: 5
	},
	yarn: {
		a: "Ball of Yarn",
		b: "1F9F6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			41
		],
		o: 11
	},
	takeout_box: {
		a: "Takeout Box",
		b: "1F961",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			48
		],
		o: 5
	},
	"man-pouting": {
		skin_variations: {
			"1F3FB": {
				unified: "1F64E-1F3FB-200D-2642-FE0F",
				non_qualified: "1F64E-1F3FB-200D-2642",
				image: "1f64e-1f3fb-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F64E-1F3FC-200D-2642-FE0F",
				non_qualified: "1F64E-1F3FC-200D-2642",
				image: "1f64e-1f3fc-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F64E-1F3FD-200D-2642-FE0F",
				non_qualified: "1F64E-1F3FD-200D-2642",
				image: "1f64e-1f3fd-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F64E-1F3FE-200D-2642-FE0F",
				non_qualified: "1F64E-1F3FE-200D-2642",
				image: "1f64e-1f3fe-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F64E-1F3FF-200D-2642-FE0F",
				non_qualified: "1F64E-1F3FF-200D-2642",
				image: "1f64e-1f3ff-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Pouting",
		b: "1F64E-200D-2642-FE0F",
		c: "1F64E-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			33,
			38
		],
		o: 4
	},
	printer: {
		a: "Printer",
		b: "1F5A8-FE0F",
		c: "1F5A8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"paper",
			"ink"
		],
		k: [
			30,
			11
		],
		o: 2
	},
	scream: {
		a: "Face Screaming in Fear",
		b: "1F631",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"munch",
			"scared",
			"omg"
		],
		k: [
			31,
			27
		],
		o: 2
	},
	es: {
		a: "Spain Flag",
		b: "1F1EA-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"spain",
			"flag",
			"nation",
			"country",
			"banner"
		],
		k: [
			1,
			45
		],
		n: [
			"flag-es"
		],
		o: 2
	},
	ambulance: {
		a: "Ambulance",
		b: "1F691",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"health",
			"911",
			"hospital"
		],
		k: [
			34,
			16
		],
		o: 2
	},
	black_right_pointing_triangle_with_double_vertical_bar: {
		a: "Black Right Pointing Triangle with Double Vertical Bar",
		b: "23EF-FE0F",
		c: "23EF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			32
		],
		o: 2
	},
	lizard: {
		a: "Lizard",
		b: "1F98E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"reptile"
		],
		k: [
			42,
			32
		],
		o: 4
	},
	"flag-et": {
		a: "Ethiopia Flag",
		b: "1F1EA-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			46
		],
		o: 2
	},
	keyboard: {
		a: "Keyboard",
		b: "2328-FE0F",
		c: "2328",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"computer",
			"type",
			"input",
			"text"
		],
		k: [
			52,
			24
		],
		o: 2
	},
	crab: {
		a: "Crab",
		b: "1F980",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"crustacean"
		],
		k: [
			42,
			18
		],
		o: 2
	},
	confounded: {
		a: "Confounded Face",
		b: "1F616",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"confused",
			"sick",
			"unwell",
			"oops",
			":S"
		],
		k: [
			31,
			0
		],
		o: 2
	},
	snake: {
		a: "Snake",
		b: "1F40D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"evil",
			"nature",
			"hiss",
			"python"
		],
		k: [
			11,
			41
		],
		o: 2
	},
	"woman-pouting": {
		skin_variations: {
			"1F3FB": {
				unified: "1F64E-1F3FB-200D-2640-FE0F",
				non_qualified: "1F64E-1F3FB-200D-2640",
				image: "1f64e-1f3fb-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 33,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F64E-1F3FC-200D-2640-FE0F",
				non_qualified: "1F64E-1F3FC-200D-2640",
				image: "1f64e-1f3fc-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 34,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F64E-1F3FD-200D-2640-FE0F",
				non_qualified: "1F64E-1F3FD-200D-2640",
				image: "1f64e-1f3fd-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 35,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F64E-1F3FE-200D-2640-FE0F",
				non_qualified: "1F64E-1F3FE-200D-2640",
				image: "1f64e-1f3fe-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F64E-1F3FF-200D-2640-FE0F",
				non_qualified: "1F64E-1F3FF-200D-2640",
				image: "1f64e-1f3ff-200d-2640-fe0f.png",
				sheet_x: 33,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F64E",
		a: "Woman Pouting",
		b: "1F64E-200D-2640-FE0F",
		c: "1F64E-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			33,
			32
		],
		o: 4
	},
	arrow_backward: {
		a: "Black Left-Pointing Triangle",
		b: "25C0-FE0F",
		c: "25C0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"left",
			"direction"
		],
		k: [
			52,
			44
		],
		o: 2
	},
	fire_engine: {
		a: "Fire Engine",
		b: "1F692",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"cars",
			"vehicle"
		],
		k: [
			34,
			17
		],
		o: 2
	},
	rewind: {
		a: "Black Left-Pointing Double Triangle",
		b: "23EA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"play",
			"blue-square"
		],
		k: [
			52,
			27
		],
		o: 2
	},
	three_button_mouse: {
		a: "Three Button Mouse",
		b: "1F5B1-FE0F",
		c: "1F5B1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			12
		],
		o: 2
	},
	no_good: {
		skin_variations: {
			"1F3FB": {
				unified: "1F645-1F3FB",
				non_qualified: null,
				image: "1f645-1f3fb.png",
				sheet_x: 32,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F645-1F3FC",
				non_qualified: null,
				image: "1f645-1f3fc.png",
				sheet_x: 32,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F645-1F3FD",
				non_qualified: null,
				image: "1f645-1f3fd.png",
				sheet_x: 32,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F645-1F3FE",
				non_qualified: null,
				image: "1f645-1f3fe.png",
				sheet_x: 32,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F645-1F3FF",
				non_qualified: null,
				image: "1f645-1f3ff.png",
				sheet_x: 32,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F645-200D-2640-FE0F",
		a: "Face with No Good Gesture",
		b: "1F645",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			32,
			2
		],
		o: 2
	},
	police_car: {
		a: "Police Car",
		b: "1F693",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"cars",
			"transportation",
			"law",
			"legal",
			"enforcement"
		],
		k: [
			34,
			18
		],
		o: 2
	},
	dragon_face: {
		a: "Dragon Face",
		b: "1F432",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"myth",
			"nature",
			"chinese",
			"green"
		],
		k: [
			12,
			22
		],
		o: 2
	},
	persevere: {
		a: "Persevering Face",
		b: "1F623",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"sick",
			"no",
			"upset",
			"oops"
		],
		k: [
			31,
			13
		],
		o: 2
	},
	lobster: {
		a: "Lobster",
		b: "1F99E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			48
		],
		o: 11
	},
	"flag-eu": {
		a: "European Union Flag",
		b: "1F1EA-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			47
		],
		o: 2
	},
	disappointed: {
		a: "Disappointed Face",
		b: "1F61E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"sad",
			"upset",
			"depressed",
			":("
		],
		k: [
			31,
			8
		],
		l: [
			"):",
			":(",
			":-("
		],
		m: ":(",
		o: 2
	},
	shrimp: {
		a: "Shrimp",
		b: "1F990",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"ocean",
			"nature",
			"seafood"
		],
		k: [
			42,
			34
		],
		o: 4
	},
	dragon: {
		a: "Dragon",
		b: "1F409",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"myth",
			"nature",
			"chinese",
			"green"
		],
		k: [
			11,
			37
		],
		o: 2
	},
	"man-gesturing-no": {
		skin_variations: {
			"1F3FB": {
				unified: "1F645-1F3FB-200D-2642-FE0F",
				non_qualified: "1F645-1F3FB-200D-2642",
				image: "1f645-1f3fb-200d-2642-fe0f.png",
				sheet_x: 31,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F645-1F3FC-200D-2642-FE0F",
				non_qualified: "1F645-1F3FC-200D-2642",
				image: "1f645-1f3fc-200d-2642-fe0f.png",
				sheet_x: 31,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F645-1F3FD-200D-2642-FE0F",
				non_qualified: "1F645-1F3FD-200D-2642",
				image: "1f645-1f3fd-200d-2642-fe0f.png",
				sheet_x: 31,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F645-1F3FE-200D-2642-FE0F",
				non_qualified: "1F645-1F3FE-200D-2642",
				image: "1f645-1f3fe-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F645-1F3FF-200D-2642-FE0F",
				non_qualified: "1F645-1F3FF-200D-2642",
				image: "1f645-1f3ff-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Gesturing No",
		b: "1F645-200D-2642-FE0F",
		c: "1F645-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			31,
			53
		],
		o: 4
	},
	"flag-fi": {
		a: "Finland Flag",
		b: "1F1EB-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			48
		],
		o: 2
	},
	trackball: {
		a: "Trackball",
		b: "1F5B2-FE0F",
		c: "1F5B2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"trackpad"
		],
		k: [
			30,
			13
		],
		o: 2
	},
	black_left_pointing_double_triangle_with_vertical_bar: {
		a: "Black Left Pointing Double Triangle with Vertical Bar",
		b: "23EE-FE0F",
		c: "23EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			31
		],
		o: 2
	},
	oncoming_police_car: {
		a: "Oncoming Police Car",
		b: "1F694",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"law",
			"legal",
			"enforcement",
			"911"
		],
		k: [
			34,
			19
		],
		o: 2
	},
	minidisc: {
		a: "Minidisc",
		b: "1F4BD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"record",
			"data",
			"disk",
			"90s"
		],
		k: [
			26,
			19
		],
		o: 2
	},
	sweat: {
		a: "Face with Cold Sweat",
		b: "1F613",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"hot",
			"sad",
			"tired",
			"exercise"
		],
		k: [
			30,
			54
		],
		o: 2
	},
	squid: {
		a: "Squid",
		b: "1F991",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"ocean",
			"sea"
		],
		k: [
			42,
			35
		],
		o: 4
	},
	sauropod: {
		a: "Sauropod",
		b: "1F995",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			39
		],
		o: 5
	},
	arrow_up_small: {
		a: "Up-Pointing Small Red Triangle",
		b: "1F53C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"triangle",
			"direction",
			"point",
			"forward",
			"top"
		],
		k: [
			28,
			31
		],
		o: 2
	},
	"flag-fj": {
		a: "Fiji Flag",
		b: "1F1EB-1F1EF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			49
		],
		o: 2
	},
	"woman-gesturing-no": {
		skin_variations: {
			"1F3FB": {
				unified: "1F645-1F3FB-200D-2640-FE0F",
				non_qualified: "1F645-1F3FB-200D-2640",
				image: "1f645-1f3fb-200d-2640-fe0f.png",
				sheet_x: 31,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F645-1F3FC-200D-2640-FE0F",
				non_qualified: "1F645-1F3FC-200D-2640",
				image: "1f645-1f3fc-200d-2640-fe0f.png",
				sheet_x: 31,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F645-1F3FD-200D-2640-FE0F",
				non_qualified: "1F645-1F3FD-200D-2640",
				image: "1f645-1f3fd-200d-2640-fe0f.png",
				sheet_x: 31,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F645-1F3FE-200D-2640-FE0F",
				non_qualified: "1F645-1F3FE-200D-2640",
				image: "1f645-1f3fe-200d-2640-fe0f.png",
				sheet_x: 31,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F645-1F3FF-200D-2640-FE0F",
				non_qualified: "1F645-1F3FF-200D-2640",
				image: "1f645-1f3ff-200d-2640-fe0f.png",
				sheet_x: 31,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F645",
		a: "Woman Gesturing No",
		b: "1F645-200D-2640-FE0F",
		c: "1F645-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			31,
			47
		],
		o: 4
	},
	taxi: {
		a: "Taxi",
		b: "1F695",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"uber",
			"vehicle",
			"cars",
			"transportation"
		],
		k: [
			34,
			20
		],
		o: 2
	},
	"flag-fk": {
		a: "Falkland Islands Flag",
		b: "1F1EB-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			50
		],
		o: 2
	},
	floppy_disk: {
		a: "Floppy Disk",
		b: "1F4BE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"oldschool",
			"technology",
			"save",
			"90s",
			"80s"
		],
		k: [
			26,
			20
		],
		o: 2
	},
	"t-rex": {
		a: "T-Rex",
		b: "1F996",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			40
		],
		o: 5
	},
	oyster: {
		a: "Oyster",
		b: "1F9AA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			1
		],
		o: 12
	},
	arrow_double_up: {
		a: "Black Up-Pointing Double Triangle",
		b: "23EB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"top"
		],
		k: [
			52,
			28
		],
		o: 2
	},
	oncoming_taxi: {
		a: "Oncoming Taxi",
		b: "1F696",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"cars",
			"uber"
		],
		k: [
			34,
			21
		],
		o: 2
	},
	ok_woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F646-1F3FB",
				non_qualified: null,
				image: "1f646-1f3fb.png",
				sheet_x: 32,
				sheet_y: 21,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F646-1F3FC",
				non_qualified: null,
				image: "1f646-1f3fc.png",
				sheet_x: 32,
				sheet_y: 22,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F646-1F3FD",
				non_qualified: null,
				image: "1f646-1f3fd.png",
				sheet_x: 32,
				sheet_y: 23,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F646-1F3FE",
				non_qualified: null,
				image: "1f646-1f3fe.png",
				sheet_x: 32,
				sheet_y: 24,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F646-1F3FF",
				non_qualified: null,
				image: "1f646-1f3ff.png",
				sheet_x: 32,
				sheet_y: 25,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F646-200D-2640-FE0F",
		a: "Face with Ok Gesture",
		b: "1F646",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"women",
			"girl",
			"female",
			"pink",
			"human",
			"woman"
		],
		k: [
			32,
			20
		],
		o: 2
	},
	weary: {
		a: "Weary Face",
		b: "1F629",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"tired",
			"sleepy",
			"sad",
			"frustrated",
			"upset"
		],
		k: [
			31,
			19
		],
		o: 2
	},
	"man-gesturing-ok": {
		skin_variations: {
			"1F3FB": {
				unified: "1F646-1F3FB-200D-2642-FE0F",
				non_qualified: "1F646-1F3FB-200D-2642",
				image: "1f646-1f3fb-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F646-1F3FC-200D-2642-FE0F",
				non_qualified: "1F646-1F3FC-200D-2642",
				image: "1f646-1f3fc-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F646-1F3FD-200D-2642-FE0F",
				non_qualified: "1F646-1F3FD-200D-2642",
				image: "1f646-1f3fd-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F646-1F3FE-200D-2642-FE0F",
				non_qualified: "1F646-1F3FE-200D-2642",
				image: "1f646-1f3fe-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F646-1F3FF-200D-2642-FE0F",
				non_qualified: "1F646-1F3FF-200D-2642",
				image: "1f646-1f3ff-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Gesturing Ok",
		b: "1F646-200D-2642-FE0F",
		c: "1F646-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			32,
			14
		],
		o: 4
	},
	arrow_down_small: {
		a: "Down-Pointing Small Red Triangle",
		b: "1F53D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"bottom"
		],
		k: [
			28,
			32
		],
		o: 2
	},
	tired_face: {
		a: "Tired Face",
		b: "1F62B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sick",
			"whine",
			"upset",
			"frustrated"
		],
		k: [
			31,
			21
		],
		o: 2
	},
	car: {
		a: "Automobile",
		b: "1F697",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			34,
			22
		],
		n: [
			"red_car"
		],
		o: 2
	},
	icecream: {
		a: "Soft Ice Cream",
		b: "1F366",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"hot",
			"dessert",
			"summer"
		],
		k: [
			7,
			5
		],
		o: 2
	},
	cd: {
		a: "Optical Disc",
		b: "1F4BF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"dvd",
			"disk",
			"disc",
			"90s"
		],
		k: [
			26,
			21
		],
		o: 2
	},
	whale: {
		a: "Spouting Whale",
		b: "1F433",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"sea",
			"ocean"
		],
		k: [
			12,
			23
		],
		o: 2
	},
	"flag-fm": {
		a: "Micronesia Flag",
		b: "1F1EB-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			51
		],
		o: 2
	},
	oncoming_automobile: {
		a: "Oncoming Automobile",
		b: "1F698",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"car",
			"vehicle",
			"transportation"
		],
		k: [
			34,
			23
		],
		o: 2
	},
	arrow_double_down: {
		a: "Black Down-Pointing Double Triangle",
		b: "23EC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"direction",
			"bottom"
		],
		k: [
			52,
			29
		],
		o: 2
	},
	"woman-gesturing-ok": {
		skin_variations: {
			"1F3FB": {
				unified: "1F646-1F3FB-200D-2640-FE0F",
				non_qualified: "1F646-1F3FB-200D-2640",
				image: "1f646-1f3fb-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F646-1F3FC-200D-2640-FE0F",
				non_qualified: "1F646-1F3FC-200D-2640",
				image: "1f646-1f3fc-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F646-1F3FD-200D-2640-FE0F",
				non_qualified: "1F646-1F3FD-200D-2640",
				image: "1f646-1f3fd-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F646-1F3FE-200D-2640-FE0F",
				non_qualified: "1F646-1F3FE-200D-2640",
				image: "1f646-1f3fe-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F646-1F3FF-200D-2640-FE0F",
				non_qualified: "1F646-1F3FF-200D-2640",
				image: "1f646-1f3ff-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F646",
		a: "Woman Gesturing Ok",
		b: "1F646-200D-2640-FE0F",
		c: "1F646-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			32,
			8
		],
		o: 4
	},
	yawning_face: {
		a: "Yawning Face",
		b: "1F971",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			7
		],
		o: 12
	},
	dvd: {
		a: "Dvd",
		b: "1F4C0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cd",
			"disk",
			"disc"
		],
		k: [
			26,
			22
		],
		o: 2
	},
	whale2: {
		a: "Whale",
		b: "1F40B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"sea",
			"ocean"
		],
		k: [
			11,
			39
		],
		o: 2
	},
	"flag-fo": {
		a: "Faroe Islands Flag",
		b: "1F1EB-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			52
		],
		o: 2
	},
	shaved_ice: {
		a: "Shaved Ice",
		b: "1F367",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hot",
			"dessert",
			"summer"
		],
		k: [
			7,
			6
		],
		o: 2
	},
	double_vertical_bar: {
		a: "Double Vertical Bar",
		b: "23F8-FE0F",
		c: "23F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			37
		],
		o: 2
	},
	information_desk_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F481-1F3FB",
				non_qualified: null,
				image: "1f481-1f3fb.png",
				sheet_x: 24,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F481-1F3FC",
				non_qualified: null,
				image: "1f481-1f3fc.png",
				sheet_x: 24,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F481-1F3FD",
				non_qualified: null,
				image: "1f481-1f3fd.png",
				sheet_x: 24,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F481-1F3FE",
				non_qualified: null,
				image: "1f481-1f3fe.png",
				sheet_x: 24,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F481-1F3FF",
				non_qualified: null,
				image: "1f481-1f3ff.png",
				sheet_x: 24,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F481-200D-2640-FE0F",
		a: "Information Desk Person",
		b: "1F481",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			24,
			2
		],
		o: 2
	},
	dolphin: {
		a: "Dolphin",
		b: "1F42C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"fish",
			"sea",
			"ocean",
			"flipper",
			"fins",
			"beach"
		],
		k: [
			12,
			16
		],
		n: [
			"flipper"
		],
		o: 2
	},
	blue_car: {
		a: "Recreational Vehicle",
		b: "1F699",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle"
		],
		k: [
			34,
			24
		],
		o: 2
	},
	ice_cream: {
		a: "Ice Cream",
		b: "1F368",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"hot",
			"dessert"
		],
		k: [
			7,
			7
		],
		o: 2
	},
	fr: {
		a: "France Flag",
		b: "1F1EB-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"banner",
			"flag",
			"nation",
			"france",
			"french",
			"country"
		],
		k: [
			1,
			53
		],
		n: [
			"flag-fr"
		],
		o: 2
	},
	triumph: {
		a: "Face with Look of Triumph",
		b: "1F624",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"gas",
			"phew",
			"proud",
			"pride"
		],
		k: [
			31,
			14
		],
		o: 2
	},
	abacus: {
		a: "Abacus",
		b: "1F9EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			33
		],
		o: 11
	},
	"man-tipping-hand": {
		skin_variations: {
			"1F3FB": {
				unified: "1F481-1F3FB-200D-2642-FE0F",
				non_qualified: "1F481-1F3FB-200D-2642",
				image: "1f481-1f3fb-200d-2642-fe0f.png",
				sheet_x: 23,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F481-1F3FC-200D-2642-FE0F",
				non_qualified: "1F481-1F3FC-200D-2642",
				image: "1f481-1f3fc-200d-2642-fe0f.png",
				sheet_x: 23,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F481-1F3FD-200D-2642-FE0F",
				non_qualified: "1F481-1F3FD-200D-2642",
				image: "1f481-1f3fd-200d-2642-fe0f.png",
				sheet_x: 23,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F481-1F3FE-200D-2642-FE0F",
				non_qualified: "1F481-1F3FE-200D-2642",
				image: "1f481-1f3fe-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F481-1F3FF-200D-2642-FE0F",
				non_qualified: "1F481-1F3FF-200D-2642",
				image: "1f481-1f3ff-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Tipping Hand",
		b: "1F481-200D-2642-FE0F",
		c: "1F481-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			23,
			53
		],
		o: 4
	},
	doughnut: {
		a: "Doughnut",
		b: "1F369",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"dessert",
			"snack",
			"sweet",
			"donut"
		],
		k: [
			7,
			8
		],
		o: 2
	},
	fish: {
		a: "Fish",
		b: "1F41F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"food",
			"nature"
		],
		k: [
			12,
			3
		],
		o: 2
	},
	truck: {
		a: "Delivery Truck",
		b: "1F69A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cars",
			"transportation"
		],
		k: [
			34,
			25
		],
		o: 2
	},
	movie_camera: {
		a: "Movie Camera",
		b: "1F3A5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"film",
			"record"
		],
		k: [
			8,
			11
		],
		o: 2
	},
	"flag-ga": {
		a: "Gabon Flag",
		b: "1F1EC-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			54
		],
		o: 2
	},
	rage: {
		a: "Pouting Face",
		b: "1F621",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"angry",
			"mad",
			"hate",
			"despise"
		],
		k: [
			31,
			11
		],
		o: 2
	},
	black_square_for_stop: {
		a: "Black Square for Stop",
		b: "23F9-FE0F",
		c: "23F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			38
		],
		o: 2
	},
	articulated_lorry: {
		a: "Articulated Lorry",
		b: "1F69B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"cars",
			"transportation",
			"express"
		],
		k: [
			34,
			26
		],
		o: 2
	},
	angry: {
		a: "Angry Face",
		b: "1F620",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"mad",
			"face",
			"annoyed",
			"frustrated"
		],
		k: [
			31,
			10
		],
		l: [
			">:(",
			">:-("
		],
		o: 2
	},
	cookie: {
		a: "Cookie",
		b: "1F36A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"snack",
			"oreo",
			"chocolate",
			"sweet",
			"dessert"
		],
		k: [
			7,
			9
		],
		o: 2
	},
	gb: {
		a: "United Kingdom Flag",
		b: "1F1EC-1F1E7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			55
		],
		n: [
			"uk",
			"flag-gb"
		],
		o: 2
	},
	tropical_fish: {
		a: "Tropical Fish",
		b: "1F420",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"swim",
			"ocean",
			"beach",
			"nemo"
		],
		k: [
			12,
			4
		],
		o: 2
	},
	"woman-tipping-hand": {
		skin_variations: {
			"1F3FB": {
				unified: "1F481-1F3FB-200D-2640-FE0F",
				non_qualified: "1F481-1F3FB-200D-2640",
				image: "1f481-1f3fb-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F481-1F3FC-200D-2640-FE0F",
				non_qualified: "1F481-1F3FC-200D-2640",
				image: "1f481-1f3fc-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F481-1F3FD-200D-2640-FE0F",
				non_qualified: "1F481-1F3FD-200D-2640",
				image: "1f481-1f3fd-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F481-1F3FE-200D-2640-FE0F",
				non_qualified: "1F481-1F3FE-200D-2640",
				image: "1f481-1f3fe-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F481-1F3FF-200D-2640-FE0F",
				non_qualified: "1F481-1F3FF-200D-2640",
				image: "1f481-1f3ff-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F481",
		a: "Woman Tipping Hand",
		b: "1F481-200D-2640-FE0F",
		c: "1F481-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			23,
			47
		],
		o: 4
	},
	black_circle_for_record: {
		a: "Black Circle for Record",
		b: "23FA-FE0F",
		c: "23FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			39
		],
		o: 2
	},
	film_frames: {
		a: "Film Frames",
		b: "1F39E-FE0F",
		c: "1F39E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			8,
			4
		],
		o: 2
	},
	film_projector: {
		a: "Film Projector",
		b: "1F4FD-FE0F",
		c: "1F4FD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"video",
			"tape",
			"record",
			"movie"
		],
		k: [
			27,
			26
		],
		o: 2
	},
	"flag-gd": {
		a: "Grenada Flag",
		b: "1F1EC-1F1E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			1,
			56
		],
		o: 2
	},
	blowfish: {
		a: "Blowfish",
		b: "1F421",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"food",
			"sea",
			"ocean"
		],
		k: [
			12,
			5
		],
		o: 2
	},
	face_with_symbols_on_mouth: {
		a: "Serious Face with Symbols Covering Mouth",
		b: "1F92C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			46
		],
		n: [
			"serious_face_with_symbols_covering_mouth"
		],
		o: 5
	},
	birthday: {
		a: "Birthday Cake",
		b: "1F382",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"dessert",
			"cake"
		],
		k: [
			7,
			33
		],
		o: 2
	},
	eject: {
		a: "Eject",
		b: "23CF-FE0F",
		c: "23CF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			25
		],
		o: 2
	},
	raising_hand: {
		skin_variations: {
			"1F3FB": {
				unified: "1F64B-1F3FB",
				non_qualified: null,
				image: "1f64b-1f3fb.png",
				sheet_x: 33,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F64B-1F3FC",
				non_qualified: null,
				image: "1f64b-1f3fc.png",
				sheet_x: 33,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F64B-1F3FD",
				non_qualified: null,
				image: "1f64b-1f3fd.png",
				sheet_x: 33,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F64B-1F3FE",
				non_qualified: null,
				image: "1f64b-1f3fe.png",
				sheet_x: 33,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F64B-1F3FF",
				non_qualified: null,
				image: "1f64b-1f3ff.png",
				sheet_x: 33,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F64B-200D-2640-FE0F",
		a: "Happy Person Raising One Hand",
		b: "1F64B",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			33,
			2
		],
		o: 2
	},
	tractor: {
		a: "Tractor",
		b: "1F69C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"car",
			"farming",
			"agriculture"
		],
		k: [
			34,
			27
		],
		o: 2
	},
	"flag-ge": {
		a: "Georgia Flag",
		b: "1F1EC-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			0
		],
		o: 2
	},
	smiling_imp: {
		a: "Smiling Face with Horns",
		b: "1F608",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"devil",
			"horns"
		],
		k: [
			30,
			43
		],
		o: 2
	},
	racing_car: {
		a: "Racing Car",
		b: "1F3CE-FE0F",
		c: "1F3CE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"race",
			"fast",
			"formula",
			"f1"
		],
		k: [
			10,
			33
		],
		o: 2
	},
	cinema: {
		a: "Cinema",
		b: "1F3A6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"record",
			"film",
			"movie",
			"curtain",
			"stage",
			"theater"
		],
		k: [
			8,
			12
		],
		o: 2
	},
	clapper: {
		a: "Clapper Board",
		b: "1F3AC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"movie",
			"film",
			"record"
		],
		k: [
			8,
			18
		],
		o: 2
	},
	shark: {
		a: "Shark",
		b: "1F988",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"nature",
			"fish",
			"sea",
			"ocean",
			"jaws",
			"fins",
			"beach"
		],
		k: [
			42,
			26
		],
		o: 4
	},
	cake: {
		a: "Shortcake",
		b: "1F370",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"dessert"
		],
		k: [
			7,
			15
		],
		o: 2
	},
	"man-raising-hand": {
		skin_variations: {
			"1F3FB": {
				unified: "1F64B-1F3FB-200D-2642-FE0F",
				non_qualified: "1F64B-1F3FB-200D-2642",
				image: "1f64b-1f3fb-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F64B-1F3FC-200D-2642-FE0F",
				non_qualified: "1F64B-1F3FC-200D-2642",
				image: "1f64b-1f3fc-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F64B-1F3FD-200D-2642-FE0F",
				non_qualified: "1F64B-1F3FD-200D-2642",
				image: "1f64b-1f3fd-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F64B-1F3FE-200D-2642-FE0F",
				non_qualified: "1F64B-1F3FE-200D-2642",
				image: "1f64b-1f3fe-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F64B-1F3FF-200D-2642-FE0F",
				non_qualified: "1F64B-1F3FF-200D-2642",
				image: "1f64b-1f3ff-200d-2642-fe0f.png",
				sheet_x: 33,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Raising Hand",
		b: "1F64B-200D-2642-FE0F",
		c: "1F64B-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			32,
			53
		],
		o: 4
	},
	octopus: {
		a: "Octopus",
		b: "1F419",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"creature",
			"ocean",
			"sea",
			"nature",
			"beach"
		],
		k: [
			11,
			54
		],
		o: 2
	},
	"woman-raising-hand": {
		skin_variations: {
			"1F3FB": {
				unified: "1F64B-1F3FB-200D-2640-FE0F",
				non_qualified: "1F64B-1F3FB-200D-2640",
				image: "1f64b-1f3fb-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F64B-1F3FC-200D-2640-FE0F",
				non_qualified: "1F64B-1F3FC-200D-2640",
				image: "1f64b-1f3fc-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F64B-1F3FD-200D-2640-FE0F",
				non_qualified: "1F64B-1F3FD-200D-2640",
				image: "1f64b-1f3fd-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F64B-1F3FE-200D-2640-FE0F",
				non_qualified: "1F64B-1F3FE-200D-2640",
				image: "1f64b-1f3fe-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F64B-1F3FF-200D-2640-FE0F",
				non_qualified: "1F64B-1F3FF-200D-2640",
				image: "1f64b-1f3ff-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F64B",
		a: "Woman Raising Hand",
		b: "1F64B-200D-2640-FE0F",
		c: "1F64B-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			32,
			47
		],
		o: 4
	},
	"flag-gf": {
		a: "French Guiana Flag",
		b: "1F1EC-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			1
		],
		o: 2
	},
	tv: {
		a: "Television",
		b: "1F4FA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"technology",
			"program",
			"oldschool",
			"show",
			"television"
		],
		k: [
			27,
			23
		],
		o: 2
	},
	imp: {
		a: "Imp",
		b: "1F47F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"devil",
			"angry",
			"horns"
		],
		k: [
			23,
			45
		],
		o: 2
	},
	cupcake: {
		a: "Cupcake",
		b: "1F9C1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			9
		],
		o: 11
	},
	racing_motorcycle: {
		a: "Racing Motorcycle",
		b: "1F3CD-FE0F",
		c: "1F3CD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			10,
			32
		],
		o: 2
	},
	low_brightness: {
		a: "Low Brightness Symbol",
		b: "1F505",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sun",
			"afternoon",
			"warm",
			"summer"
		],
		k: [
			27,
			33
		],
		o: 2
	},
	shell: {
		a: "Spiral Shell",
		b: "1F41A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"sea",
			"beach"
		],
		k: [
			11,
			55
		],
		o: 2
	},
	"flag-gg": {
		a: "Guernsey Flag",
		b: "1F1EC-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			2
		],
		o: 2
	},
	high_brightness: {
		a: "High Brightness Symbol",
		b: "1F506",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sun",
			"light"
		],
		k: [
			27,
			34
		],
		o: 2
	},
	deaf_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CF-1F3FB",
				non_qualified: null,
				image: "1f9cf-1f3fb.png",
				sheet_x: 45,
				sheet_y: 11,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CF-1F3FC",
				non_qualified: null,
				image: "1f9cf-1f3fc.png",
				sheet_x: 45,
				sheet_y: 12,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CF-1F3FD",
				non_qualified: null,
				image: "1f9cf-1f3fd.png",
				sheet_x: 45,
				sheet_y: 13,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CF-1F3FE",
				non_qualified: null,
				image: "1f9cf-1f3fe.png",
				sheet_x: 45,
				sheet_y: 14,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CF-1F3FF",
				non_qualified: null,
				image: "1f9cf-1f3ff.png",
				sheet_x: 45,
				sheet_y: 15,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Deaf Person",
		b: "1F9CF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			45,
			10
		],
		o: 12
	},
	skull: {
		a: "Skull",
		b: "1F480",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dead",
			"skeleton",
			"creepy",
			"death"
		],
		k: [
			23,
			46
		],
		o: 2
	},
	motor_scooter: {
		a: "Motor Scooter",
		b: "1F6F5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"vespa",
			"sasha"
		],
		k: [
			36,
			54
		],
		o: 4
	},
	camera: {
		a: "Camera",
		b: "1F4F7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"gadgets",
			"photography"
		],
		k: [
			27,
			20
		],
		o: 2
	},
	pie: {
		a: "Pie",
		b: "1F967",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			54
		],
		o: 5
	},
	"flag-gh": {
		a: "Ghana Flag",
		b: "1F1EC-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			3
		],
		o: 2
	},
	deaf_man: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CF-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9CF-1F3FB-200D-2642",
				image: "1f9cf-1f3fb-200d-2642-fe0f.png",
				sheet_x: 45,
				sheet_y: 5,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CF-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9CF-1F3FC-200D-2642",
				image: "1f9cf-1f3fc-200d-2642-fe0f.png",
				sheet_x: 45,
				sheet_y: 6,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CF-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9CF-1F3FD-200D-2642",
				image: "1f9cf-1f3fd-200d-2642-fe0f.png",
				sheet_x: 45,
				sheet_y: 7,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CF-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9CF-1F3FE-200D-2642",
				image: "1f9cf-1f3fe-200d-2642-fe0f.png",
				sheet_x: 45,
				sheet_y: 8,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CF-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9CF-1F3FF-200D-2642",
				image: "1f9cf-1f3ff-200d-2642-fe0f.png",
				sheet_x: 45,
				sheet_y: 9,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Deaf Man",
		b: "1F9CF-200D-2642-FE0F",
		c: "1F9CF-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			45,
			4
		],
		o: 12
	},
	skull_and_crossbones: {
		a: "Skull and Crossbones",
		b: "2620-FE0F",
		c: "2620",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"poison",
			"danger",
			"deadly",
			"scary",
			"death",
			"pirate",
			"evil"
		],
		k: [
			53,
			8
		],
		o: 2
	},
	camera_with_flash: {
		a: "Camera with Flash",
		b: "1F4F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			27,
			21
		],
		o: 2
	},
	signal_strength: {
		a: "Antenna with Bars",
		b: "1F4F6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"reception",
			"phone",
			"internet",
			"connection",
			"wifi",
			"bluetooth",
			"bars"
		],
		k: [
			27,
			19
		],
		o: 2
	},
	chocolate_bar: {
		a: "Chocolate Bar",
		b: "1F36B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"snack",
			"dessert",
			"sweet"
		],
		k: [
			7,
			10
		],
		o: 2
	},
	manual_wheelchair: {
		a: "Manual Wheelchair",
		b: "1F9BD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			5
		],
		o: 12
	},
	snail: {
		a: "Snail",
		b: "1F40C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"slow",
			"animal",
			"shell"
		],
		k: [
			11,
			40
		],
		o: 2
	},
	motorized_wheelchair: {
		a: "Motorized Wheelchair",
		b: "1F9BC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			4
		],
		o: 12
	},
	"flag-gi": {
		a: "Gibraltar Flag",
		b: "1F1EC-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			4
		],
		o: 2
	},
	hankey: {
		a: "Pile of Poo",
		b: "1F4A9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			25,
			51
		],
		n: [
			"poop",
			"shit"
		],
		o: 2
	},
	vibration_mode: {
		a: "Vibration Mode",
		b: "1F4F3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"orange-square",
			"phone"
		],
		k: [
			27,
			16
		],
		o: 2
	},
	deaf_woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CF-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9CF-1F3FB-200D-2640",
				image: "1f9cf-1f3fb-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 56,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CF-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9CF-1F3FC-200D-2640",
				image: "1f9cf-1f3fc-200d-2640-fe0f.png",
				sheet_x: 45,
				sheet_y: 0,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CF-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9CF-1F3FD-200D-2640",
				image: "1f9cf-1f3fd-200d-2640-fe0f.png",
				sheet_x: 45,
				sheet_y: 1,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CF-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9CF-1F3FE-200D-2640",
				image: "1f9cf-1f3fe-200d-2640-fe0f.png",
				sheet_x: 45,
				sheet_y: 2,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CF-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9CF-1F3FF-200D-2640",
				image: "1f9cf-1f3ff-200d-2640-fe0f.png",
				sheet_x: 45,
				sheet_y: 3,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Deaf Woman",
		b: "1F9CF-200D-2640-FE0F",
		c: "1F9CF-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			55
		],
		o: 12
	},
	butterfly: {
		a: "Butterfly",
		b: "1F98B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"insect",
			"nature",
			"caterpillar"
		],
		k: [
			42,
			29
		],
		o: 4
	},
	video_camera: {
		a: "Video Camera",
		b: "1F4F9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"film",
			"record"
		],
		k: [
			27,
			22
		],
		o: 2
	},
	candy: {
		a: "Candy",
		b: "1F36C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"snack",
			"dessert",
			"sweet",
			"lolly"
		],
		k: [
			7,
			11
		],
		o: 2
	},
	auto_rickshaw: {
		a: "Auto Rickshaw",
		b: "1F6FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			2
		],
		o: 12
	},
	bow: {
		skin_variations: {
			"1F3FB": {
				unified: "1F647-1F3FB",
				non_qualified: null,
				image: "1f647-1f3fb.png",
				sheet_x: 32,
				sheet_y: 39,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F647-1F3FC",
				non_qualified: null,
				image: "1f647-1f3fc.png",
				sheet_x: 32,
				sheet_y: 40,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F647-1F3FD",
				non_qualified: null,
				image: "1f647-1f3fd.png",
				sheet_x: 32,
				sheet_y: 41,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F647-1F3FE",
				non_qualified: null,
				image: "1f647-1f3fe.png",
				sheet_x: 32,
				sheet_y: 42,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F647-1F3FF",
				non_qualified: null,
				image: "1f647-1f3ff.png",
				sheet_x: 32,
				sheet_y: 43,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F647-200D-2642-FE0F",
		a: "Person Bowing Deeply",
		b: "1F647",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			32,
			38
		],
		o: 2
	},
	mobile_phone_off: {
		a: "Mobile Phone off",
		b: "1F4F4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"mute",
			"orange-square",
			"silence",
			"quiet"
		],
		k: [
			27,
			17
		],
		o: 2
	},
	clown_face: {
		a: "Clown Face",
		b: "1F921",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face"
		],
		k: [
			38,
			18
		],
		o: 4
	},
	lollipop: {
		a: "Lollipop",
		b: "1F36D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"snack",
			"candy",
			"sweet"
		],
		k: [
			7,
			12
		],
		o: 2
	},
	"flag-gl": {
		a: "Greenland Flag",
		b: "1F1EC-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			5
		],
		o: 2
	},
	vhs: {
		a: "Videocassette",
		b: "1F4FC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"record",
			"video",
			"oldschool",
			"90s",
			"80s"
		],
		k: [
			27,
			25
		],
		o: 2
	},
	bug: {
		a: "Bug",
		b: "1F41B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"insect",
			"nature",
			"worm"
		],
		k: [
			11,
			56
		],
		o: 2
	},
	bike: {
		a: "Bicycle",
		b: "1F6B2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"bicycle",
			"exercise",
			"hipster"
		],
		k: [
			35,
			9
		],
		o: 2
	},
	"man-bowing": {
		skin_variations: {
			"1F3FB": {
				unified: "1F647-1F3FB-200D-2642-FE0F",
				non_qualified: "1F647-1F3FB-200D-2642",
				image: "1f647-1f3fb-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 33,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F647-1F3FC-200D-2642-FE0F",
				non_qualified: "1F647-1F3FC-200D-2642",
				image: "1f647-1f3fc-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 34,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F647-1F3FD-200D-2642-FE0F",
				non_qualified: "1F647-1F3FD-200D-2642",
				image: "1f647-1f3fd-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 35,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F647-1F3FE-200D-2642-FE0F",
				non_qualified: "1F647-1F3FE-200D-2642",
				image: "1f647-1f3fe-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F647-1F3FF-200D-2642-FE0F",
				non_qualified: "1F647-1F3FF-200D-2642",
				image: "1f647-1f3ff-200d-2642-fe0f.png",
				sheet_x: 32,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F647",
		a: "Man Bowing",
		b: "1F647-200D-2642-FE0F",
		c: "1F647-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			32,
			32
		],
		o: 4
	},
	female_sign: {
		a: "Female Sign",
		b: "2640-FE0F",
		c: "2640",
		d: false,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			18
		],
		o: 4
	},
	japanese_ogre: {
		a: "Japanese Ogre",
		b: "1F479",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"monster",
			"red",
			"mask",
			"halloween",
			"scary",
			"creepy",
			"devil",
			"demon",
			"japanese",
			"ogre"
		],
		k: [
			23,
			34
		],
		o: 2
	},
	custard: {
		a: "Custard",
		b: "1F36E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dessert",
			"food"
		],
		k: [
			7,
			13
		],
		o: 2
	},
	ant: {
		a: "Ant",
		b: "1F41C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"insect",
			"nature",
			"bug"
		],
		k: [
			12,
			0
		],
		o: 2
	},
	mag: {
		a: "Left-Pointing Magnifying Glass",
		b: "1F50D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"search",
			"zoom",
			"find",
			"detective"
		],
		k: [
			27,
			41
		],
		o: 2
	},
	"flag-gm": {
		a: "Gambia Flag",
		b: "1F1EC-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			6
		],
		o: 2
	},
	honey_pot: {
		a: "Honey Pot",
		b: "1F36F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bees",
			"sweet",
			"kitchen"
		],
		k: [
			7,
			14
		],
		o: 2
	},
	"woman-bowing": {
		skin_variations: {
			"1F3FB": {
				unified: "1F647-1F3FB-200D-2640-FE0F",
				non_qualified: "1F647-1F3FB-200D-2640",
				image: "1f647-1f3fb-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 27,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F647-1F3FC-200D-2640-FE0F",
				non_qualified: "1F647-1F3FC-200D-2640",
				image: "1f647-1f3fc-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 28,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F647-1F3FD-200D-2640-FE0F",
				non_qualified: "1F647-1F3FD-200D-2640",
				image: "1f647-1f3fd-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 29,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F647-1F3FE-200D-2640-FE0F",
				non_qualified: "1F647-1F3FE-200D-2640",
				image: "1f647-1f3fe-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F647-1F3FF-200D-2640-FE0F",
				non_qualified: "1F647-1F3FF-200D-2640",
				image: "1f647-1f3ff-200d-2640-fe0f.png",
				sheet_x: 32,
				sheet_y: 31,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Bowing",
		b: "1F647-200D-2640-FE0F",
		c: "1F647-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			32,
			26
		],
		o: 4
	},
	male_sign: {
		a: "Male Sign",
		b: "2642-FE0F",
		c: "2642",
		d: false,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			19
		],
		o: 4
	},
	mag_right: {
		a: "Right-Pointing Magnifying Glass",
		b: "1F50E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"search",
			"zoom",
			"find",
			"detective"
		],
		k: [
			27,
			42
		],
		o: 2
	},
	japanese_goblin: {
		a: "Japanese Goblin",
		b: "1F47A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"red",
			"evil",
			"mask",
			"monster",
			"scary",
			"creepy",
			"japanese",
			"goblin"
		],
		k: [
			23,
			35
		],
		o: 2
	},
	scooter: {
		a: "Scooter",
		b: "1F6F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			36,
			53
		],
		o: 4
	},
	bee: {
		a: "Honeybee",
		b: "1F41D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			12,
			1
		],
		n: [
			"honeybee"
		],
		o: 2
	},
	"flag-gn": {
		a: "Guinea Flag",
		b: "1F1EC-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			7
		],
		o: 2
	},
	candle: {
		a: "Candle",
		b: "1F56F-FE0F",
		c: "1F56F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fire",
			"wax"
		],
		k: [
			29,
			6
		],
		o: 2
	},
	skateboard: {
		a: "Skateboard",
		b: "1F6F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			1
		],
		o: 11
	},
	medical_symbol: {
		a: "Medical Symbol",
		b: "2695-FE0F",
		c: "2695",
		d: false,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			44
		],
		n: [
			"staff_of_aesculapius"
		],
		o: 4
	},
	ghost: {
		a: "Ghost",
		b: "1F47B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"halloween",
			"spooky",
			"scary"
		],
		k: [
			23,
			36
		],
		o: 2
	},
	beetle: {
		a: "Lady Beetle",
		b: "1F41E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"insect",
			"nature",
			"ladybug"
		],
		k: [
			12,
			2
		],
		o: 2
	},
	face_palm: {
		skin_variations: {
			"1F3FB": {
				unified: "1F926-1F3FB",
				non_qualified: null,
				image: "1f926-1f3fb.png",
				sheet_x: 38,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F926-1F3FC",
				non_qualified: null,
				image: "1f926-1f3fc.png",
				sheet_x: 38,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F926-1F3FD",
				non_qualified: null,
				image: "1f926-1f3fd.png",
				sheet_x: 38,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F926-1F3FE",
				non_qualified: null,
				image: "1f926-1f3fe.png",
				sheet_x: 38,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F926-1F3FF",
				non_qualified: null,
				image: "1f926-1f3ff.png",
				sheet_x: 38,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		a: "Face Palm",
		b: "1F926",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			38,
			35
		],
		o: 4
	},
	"flag-gp": {
		a: "Guadeloupe Flag",
		b: "1F1EC-1F1F5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			8
		],
		o: 2
	},
	baby_bottle: {
		a: "Baby Bottle",
		b: "1F37C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"food",
			"container",
			"milk"
		],
		k: [
			7,
			27
		],
		o: 2
	},
	infinity: {
		a: "Infinity",
		b: "267E-FE0F",
		c: "267E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			39
		],
		o: 11
	},
	glass_of_milk: {
		a: "Glass of Milk",
		b: "1F95B",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			42
		],
		o: 4
	},
	"man-facepalming": {
		skin_variations: {
			"1F3FB": {
				unified: "1F926-1F3FB-200D-2642-FE0F",
				non_qualified: "1F926-1F3FB-200D-2642",
				image: "1f926-1f3fb-200d-2642-fe0f.png",
				sheet_x: 38,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F926-1F3FC-200D-2642-FE0F",
				non_qualified: "1F926-1F3FC-200D-2642",
				image: "1f926-1f3fc-200d-2642-fe0f.png",
				sheet_x: 38,
				sheet_y: 31,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F926-1F3FD-200D-2642-FE0F",
				non_qualified: "1F926-1F3FD-200D-2642",
				image: "1f926-1f3fd-200d-2642-fe0f.png",
				sheet_x: 38,
				sheet_y: 32,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F926-1F3FE-200D-2642-FE0F",
				non_qualified: "1F926-1F3FE-200D-2642",
				image: "1f926-1f3fe-200d-2642-fe0f.png",
				sheet_x: 38,
				sheet_y: 33,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F926-1F3FF-200D-2642-FE0F",
				non_qualified: "1F926-1F3FF-200D-2642",
				image: "1f926-1f3ff-200d-2642-fe0f.png",
				sheet_x: 38,
				sheet_y: 34,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Facepalming",
		b: "1F926-200D-2642-FE0F",
		c: "1F926-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			29
		],
		o: 4
	},
	cricket: {
		a: "Cricket",
		b: "1F997",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports"
		],
		k: [
			42,
			41
		],
		o: 5
	},
	busstop: {
		a: "Bus Stop",
		b: "1F68F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"wait"
		],
		k: [
			34,
			14
		],
		o: 2
	},
	"flag-gq": {
		a: "Equatorial Guinea Flag",
		b: "1F1EC-1F1F6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			9
		],
		o: 2
	},
	alien: {
		a: "Extraterrestrial Alien",
		b: "1F47D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"UFO",
			"paul",
			"weird",
			"outer_space"
		],
		k: [
			23,
			43
		],
		o: 2
	},
	bulb: {
		a: "Electric Light Bulb",
		b: "1F4A1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"light",
			"electricity",
			"idea"
		],
		k: [
			25,
			43
		],
		o: 2
	},
	"woman-facepalming": {
		skin_variations: {
			"1F3FB": {
				unified: "1F926-1F3FB-200D-2640-FE0F",
				non_qualified: "1F926-1F3FB-200D-2640",
				image: "1f926-1f3fb-200d-2640-fe0f.png",
				sheet_x: 38,
				sheet_y: 24,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F926-1F3FC-200D-2640-FE0F",
				non_qualified: "1F926-1F3FC-200D-2640",
				image: "1f926-1f3fc-200d-2640-fe0f.png",
				sheet_x: 38,
				sheet_y: 25,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F926-1F3FD-200D-2640-FE0F",
				non_qualified: "1F926-1F3FD-200D-2640",
				image: "1f926-1f3fd-200d-2640-fe0f.png",
				sheet_x: 38,
				sheet_y: 26,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F926-1F3FE-200D-2640-FE0F",
				non_qualified: "1F926-1F3FE-200D-2640",
				image: "1f926-1f3fe-200d-2640-fe0f.png",
				sheet_x: 38,
				sheet_y: 27,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F926-1F3FF-200D-2640-FE0F",
				non_qualified: "1F926-1F3FF-200D-2640",
				image: "1f926-1f3ff-200d-2640-fe0f.png",
				sheet_x: 38,
				sheet_y: 28,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Facepalming",
		b: "1F926-200D-2640-FE0F",
		c: "1F926-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			23
		],
		o: 4
	},
	spider: {
		a: "Spider",
		b: "1F577-FE0F",
		c: "1F577",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"arachnid"
		],
		k: [
			29,
			34
		],
		o: 2
	},
	space_invader: {
		a: "Alien Monster",
		b: "1F47E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"game",
			"arcade",
			"play"
		],
		k: [
			23,
			44
		],
		o: 2
	},
	motorway: {
		a: "Motorway",
		b: "1F6E3-FE0F",
		c: "1F6E3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"road",
			"cupertino",
			"interstate",
			"highway"
		],
		k: [
			36,
			45
		],
		o: 2
	},
	"flag-gr": {
		a: "Greece Flag",
		b: "1F1EC-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			10
		],
		o: 2
	},
	recycle: {
		a: "Black Universal Recycling Symbol",
		b: "267B-FE0F",
		c: "267B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"arrow",
			"environment",
			"garbage",
			"trash"
		],
		k: [
			53,
			38
		],
		o: 2
	},
	coffee: {
		a: "Hot Beverage",
		b: "2615",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"beverage",
			"caffeine",
			"latte",
			"espresso"
		],
		k: [
			53,
			0
		],
		o: 2
	},
	flashlight: {
		a: "Electric Torch",
		b: "1F526",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dark",
			"camping",
			"sight",
			"night"
		],
		k: [
			28,
			9
		],
		o: 2
	},
	spider_web: {
		a: "Spider Web",
		b: "1F578-FE0F",
		c: "1F578",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"insect",
			"arachnid",
			"silk"
		],
		k: [
			29,
			35
		],
		o: 2
	},
	izakaya_lantern: {
		a: "Izakaya Lantern",
		b: "1F3EE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"light",
			"paper",
			"halloween",
			"spooky"
		],
		k: [
			11,
			8
		],
		n: [
			"lantern"
		],
		o: 2
	},
	"flag-gs": {
		a: "South Georgia & South Sandwich Islands Flag",
		b: "1F1EC-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			11
		],
		o: 2
	},
	shrug: {
		skin_variations: {
			"1F3FB": {
				unified: "1F937-1F3FB",
				non_qualified: null,
				image: "1f937-1f3fb.png",
				sheet_x: 39,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F937-1F3FC",
				non_qualified: null,
				image: "1f937-1f3fc.png",
				sheet_x: 39,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F937-1F3FD",
				non_qualified: null,
				image: "1f937-1f3fd.png",
				sheet_x: 39,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F937-1F3FE",
				non_qualified: null,
				image: "1f937-1f3fe.png",
				sheet_x: 39,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F937-1F3FF",
				non_qualified: null,
				image: "1f937-1f3ff.png",
				sheet_x: 39,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		a: "Shrug",
		b: "1F937",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			39,
			47
		],
		o: 4
	},
	fleur_de_lis: {
		a: "Fleur De Lis",
		b: "269C-FE0F",
		c: "269C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"decorative",
			"scout"
		],
		k: [
			53,
			49
		],
		o: 2
	},
	robot_face: {
		a: "Robot Face",
		b: "1F916",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			29
		],
		o: 2
	},
	railway_track: {
		a: "Railway Track",
		b: "1F6E4-FE0F",
		c: "1F6E4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"train",
			"transportation"
		],
		k: [
			36,
			46
		],
		o: 2
	},
	tea: {
		a: "Teacup Without Handle",
		b: "1F375",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"drink",
			"bowl",
			"breakfast",
			"green",
			"british"
		],
		k: [
			7,
			20
		],
		o: 2
	},
	"flag-gt": {
		a: "Guatemala Flag",
		b: "1F1EC-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			12
		],
		o: 2
	},
	oil_drum: {
		a: "Oil Drum",
		b: "1F6E2-FE0F",
		c: "1F6E2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"barrell"
		],
		k: [
			36,
			44
		],
		o: 2
	},
	diya_lamp: {
		a: "Diya Lamp",
		b: "1FA94",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			8
		],
		o: 12
	},
	sake: {
		a: "Sake Bottle and Cup",
		b: "1F376",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"wine",
			"drink",
			"drunk",
			"beverage",
			"japanese",
			"alcohol",
			"booze"
		],
		k: [
			7,
			21
		],
		o: 2
	},
	trident: {
		a: "Trident Emblem",
		b: "1F531",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weapon",
			"spear"
		],
		k: [
			28,
			20
		],
		o: 2
	},
	"man-shrugging": {
		skin_variations: {
			"1F3FB": {
				unified: "1F937-1F3FB-200D-2642-FE0F",
				non_qualified: "1F937-1F3FB-200D-2642",
				image: "1f937-1f3fb-200d-2642-fe0f.png",
				sheet_x: 39,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F937-1F3FC-200D-2642-FE0F",
				non_qualified: "1F937-1F3FC-200D-2642",
				image: "1f937-1f3fc-200d-2642-fe0f.png",
				sheet_x: 39,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F937-1F3FD-200D-2642-FE0F",
				non_qualified: "1F937-1F3FD-200D-2642",
				image: "1f937-1f3fd-200d-2642-fe0f.png",
				sheet_x: 39,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F937-1F3FE-200D-2642-FE0F",
				non_qualified: "1F937-1F3FE-200D-2642",
				image: "1f937-1f3fe-200d-2642-fe0f.png",
				sheet_x: 39,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F937-1F3FF-200D-2642-FE0F",
				non_qualified: "1F937-1F3FF-200D-2642",
				image: "1f937-1f3ff-200d-2642-fe0f.png",
				sheet_x: 39,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Shrugging",
		b: "1F937-200D-2642-FE0F",
		c: "1F937-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			39,
			41
		],
		o: 4
	},
	smiley_cat: {
		a: "Smiling Cat Face with Open Mouth",
		b: "1F63A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cats",
			"happy",
			"smile"
		],
		k: [
			31,
			36
		],
		o: 2
	},
	scorpion: {
		a: "Scorpion",
		b: "1F982",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"arachnid"
		],
		k: [
			42,
			20
		],
		o: 2
	},
	"woman-shrugging": {
		skin_variations: {
			"1F3FB": {
				unified: "1F937-1F3FB-200D-2640-FE0F",
				non_qualified: "1F937-1F3FB-200D-2640",
				image: "1f937-1f3fb-200d-2640-fe0f.png",
				sheet_x: 39,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F937-1F3FC-200D-2640-FE0F",
				non_qualified: "1F937-1F3FC-200D-2640",
				image: "1f937-1f3fc-200d-2640-fe0f.png",
				sheet_x: 39,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F937-1F3FD-200D-2640-FE0F",
				non_qualified: "1F937-1F3FD-200D-2640",
				image: "1f937-1f3fd-200d-2640-fe0f.png",
				sheet_x: 39,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F937-1F3FE-200D-2640-FE0F",
				non_qualified: "1F937-1F3FE-200D-2640",
				image: "1f937-1f3fe-200d-2640-fe0f.png",
				sheet_x: 39,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F937-1F3FF-200D-2640-FE0F",
				non_qualified: "1F937-1F3FF-200D-2640",
				image: "1f937-1f3ff-200d-2640-fe0f.png",
				sheet_x: 39,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Shrugging",
		b: "1F937-200D-2640-FE0F",
		c: "1F937-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			39,
			35
		],
		o: 4
	},
	notebook_with_decorative_cover: {
		a: "Notebook with Decorative Cover",
		b: "1F4D4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"classroom",
			"notes",
			"record",
			"paper",
			"study"
		],
		k: [
			26,
			42
		],
		o: 2
	},
	fuelpump: {
		a: "Fuel Pump",
		b: "26FD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"gas station",
			"petroleum"
		],
		k: [
			54,
			38
		],
		o: 2
	},
	name_badge: {
		a: "Name Badge",
		b: "1F4DB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"fire",
			"forbid"
		],
		k: [
			26,
			49
		],
		o: 2
	},
	mosquito: {
		a: "Mosquito",
		b: "1F99F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			49
		],
		o: 11
	},
	"flag-gu": {
		a: "Guam Flag",
		b: "1F1EC-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			13
		],
		o: 2
	},
	smile_cat: {
		a: "Grinning Cat Face with Smiling Eyes",
		b: "1F638",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cats",
			"smile"
		],
		k: [
			31,
			34
		],
		o: 2
	},
	champagne: {
		a: "Bottle with Popping Cork",
		b: "1F37E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"drink",
			"wine",
			"bottle",
			"celebration"
		],
		k: [
			7,
			29
		],
		o: 2
	},
	joy_cat: {
		a: "Cat Face with Tears of Joy",
		b: "1F639",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cats",
			"haha",
			"happy",
			"tears"
		],
		k: [
			31,
			35
		],
		o: 2
	},
	closed_book: {
		a: "Closed Book",
		b: "1F4D5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"read",
			"library",
			"knowledge",
			"textbook",
			"learn"
		],
		k: [
			26,
			43
		],
		o: 2
	},
	health_worker: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-2695-FE0F",
				non_qualified: "1F9D1-1F3FB-200D-2695",
				image: "1f9d1-1f3fb-200d-2695-fe0f.png",
				sheet_x: 47,
				sheet_y: 50,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-2695-FE0F",
				non_qualified: "1F9D1-1F3FC-200D-2695",
				image: "1f9d1-1f3fc-200d-2695-fe0f.png",
				sheet_x: 47,
				sheet_y: 51,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-2695-FE0F",
				non_qualified: "1F9D1-1F3FD-200D-2695",
				image: "1f9d1-1f3fd-200d-2695-fe0f.png",
				sheet_x: 47,
				sheet_y: 52,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-2695-FE0F",
				non_qualified: "1F9D1-1F3FE-200D-2695",
				image: "1f9d1-1f3fe-200d-2695-fe0f.png",
				sheet_x: 47,
				sheet_y: 53,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-2695-FE0F",
				non_qualified: "1F9D1-1F3FF-200D-2695",
				image: "1f9d1-1f3ff-200d-2695-fe0f.png",
				sheet_x: 47,
				sheet_y: 54,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Health Worker",
		b: "1F9D1-200D-2695-FE0F",
		c: "1F9D1-200D-2695",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			49
		],
		o: 12
	},
	rotating_light: {
		a: "Police Cars Revolving Light",
		b: "1F6A8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"police",
			"ambulance",
			"911",
			"emergency",
			"alert",
			"error",
			"pinged",
			"law",
			"legal"
		],
		k: [
			34,
			56
		],
		o: 2
	},
	microbe: {
		a: "Microbe",
		b: "1F9A0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			42,
			50
		],
		o: 11
	},
	"flag-gw": {
		a: "Guinea-Bissau Flag",
		b: "1F1EC-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			14
		],
		o: 2
	},
	wine_glass: {
		a: "Wine Glass",
		b: "1F377",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"drink",
			"beverage",
			"drunk",
			"alcohol",
			"booze"
		],
		k: [
			7,
			22
		],
		o: 2
	},
	beginner: {
		a: "Japanese Symbol for Beginner",
		b: "1F530",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"badge",
			"shield"
		],
		k: [
			28,
			19
		],
		o: 2
	},
	bouquet: {
		a: "Bouquet",
		b: "1F490",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"flowers",
			"nature",
			"spring"
		],
		k: [
			25,
			26
		],
		o: 2
	},
	heart_eyes_cat: {
		a: "Smiling Cat Face with Heart-Shaped Eyes",
		b: "1F63B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"love",
			"like",
			"affection",
			"cats",
			"valentines",
			"heart"
		],
		k: [
			31,
			37
		],
		o: 2
	},
	"male-doctor": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-2695-FE0F",
				non_qualified: "1F468-1F3FB-200D-2695",
				image: "1f468-1f3fb-200d-2695-fe0f.png",
				sheet_x: 17,
				sheet_y: 3,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-2695-FE0F",
				non_qualified: "1F468-1F3FC-200D-2695",
				image: "1f468-1f3fc-200d-2695-fe0f.png",
				sheet_x: 17,
				sheet_y: 4,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-2695-FE0F",
				non_qualified: "1F468-1F3FD-200D-2695",
				image: "1f468-1f3fd-200d-2695-fe0f.png",
				sheet_x: 17,
				sheet_y: 5,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-2695-FE0F",
				non_qualified: "1F468-1F3FE-200D-2695",
				image: "1f468-1f3fe-200d-2695-fe0f.png",
				sheet_x: 17,
				sheet_y: 6,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-2695-FE0F",
				non_qualified: "1F468-1F3FF-200D-2695",
				image: "1f468-1f3ff-200d-2695-fe0f.png",
				sheet_x: 17,
				sheet_y: 7,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Doctor",
		b: "1F468-200D-2695-FE0F",
		c: "1F468-200D-2695",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			17,
			2
		],
		o: 4
	},
	book: {
		a: "Open Book",
		b: "1F4D6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			26,
			44
		],
		n: [
			"open_book"
		],
		o: 2
	},
	traffic_light: {
		a: "Horizontal Traffic Light",
		b: "1F6A5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"signal"
		],
		k: [
			34,
			53
		],
		o: 2
	},
	cocktail: {
		a: "Cocktail Glass",
		b: "1F378",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"drink",
			"drunk",
			"alcohol",
			"beverage",
			"booze",
			"mojito"
		],
		k: [
			7,
			23
		],
		o: 2
	},
	o: {
		a: "Heavy Large Circle",
		b: "2B55",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"circle",
			"round"
		],
		k: [
			55,
			43
		],
		o: 2
	},
	"flag-gy": {
		a: "Guyana Flag",
		b: "1F1EC-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			15
		],
		o: 2
	},
	"female-doctor": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-2695-FE0F",
				non_qualified: "1F469-1F3FB-200D-2695",
				image: "1f469-1f3fb-200d-2695-fe0f.png",
				sheet_x: 19,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-2695-FE0F",
				non_qualified: "1F469-1F3FC-200D-2695",
				image: "1f469-1f3fc-200d-2695-fe0f.png",
				sheet_x: 19,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-2695-FE0F",
				non_qualified: "1F469-1F3FD-200D-2695",
				image: "1f469-1f3fd-200d-2695-fe0f.png",
				sheet_x: 19,
				sheet_y: 47,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-2695-FE0F",
				non_qualified: "1F469-1F3FE-200D-2695",
				image: "1f469-1f3fe-200d-2695-fe0f.png",
				sheet_x: 19,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-2695-FE0F",
				non_qualified: "1F469-1F3FF-200D-2695",
				image: "1f469-1f3ff-200d-2695-fe0f.png",
				sheet_x: 19,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Doctor",
		b: "1F469-200D-2695-FE0F",
		c: "1F469-200D-2695",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			44
		],
		o: 4
	},
	smirk_cat: {
		a: "Cat Face with Wry Smile",
		b: "1F63C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cats",
			"smirk"
		],
		k: [
			31,
			38
		],
		o: 2
	},
	green_book: {
		a: "Green Book",
		b: "1F4D7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"read",
			"library",
			"knowledge",
			"study"
		],
		k: [
			26,
			45
		],
		o: 2
	},
	cherry_blossom: {
		a: "Cherry Blossom",
		b: "1F338",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"plant",
			"spring",
			"flower"
		],
		k: [
			6,
			16
		],
		o: 2
	},
	"flag-hk": {
		a: "Hong Kong Sar China Flag",
		b: "1F1ED-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			16
		],
		o: 2
	},
	vertical_traffic_light: {
		a: "Vertical Traffic Light",
		b: "1F6A6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"driving"
		],
		k: [
			34,
			54
		],
		o: 2
	},
	white_check_mark: {
		a: "White Heavy Check Mark",
		b: "2705",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"green-square",
			"ok",
			"agree",
			"vote",
			"election",
			"answer",
			"tick"
		],
		k: [
			54,
			40
		],
		o: 2
	},
	tropical_drink: {
		a: "Tropical Drink",
		b: "1F379",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"beverage",
			"cocktail",
			"summer",
			"beach",
			"alcohol",
			"booze",
			"mojito"
		],
		k: [
			7,
			24
		],
		o: 2
	},
	kissing_cat: {
		a: "Kissing Cat Face with Closed Eyes",
		b: "1F63D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cats",
			"kiss"
		],
		k: [
			31,
			39
		],
		o: 2
	},
	"flag-hm": {
		a: "Heard & Mcdonald Islands Flag",
		b: "1F1ED-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			17
		],
		o: 2
	},
	octagonal_sign: {
		a: "Octagonal Sign",
		b: "1F6D1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			36,
			39
		],
		o: 4
	},
	white_flower: {
		a: "White Flower",
		b: "1F4AE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"japanese",
			"spring"
		],
		k: [
			26,
			4
		],
		o: 2
	},
	ballot_box_with_check: {
		a: "Ballot Box with Check",
		b: "2611-FE0F",
		c: "2611",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"ok",
			"agree",
			"confirm",
			"black-square",
			"vote",
			"election",
			"yes",
			"tick"
		],
		k: [
			52,
			55
		],
		o: 2
	},
	student: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F393",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f393.png",
				sheet_x: 45,
				sheet_y: 30,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F393",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f393.png",
				sheet_x: 45,
				sheet_y: 31,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F393",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f393.png",
				sheet_x: 45,
				sheet_y: 32,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F393",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f393.png",
				sheet_x: 45,
				sheet_y: 33,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F393",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f393.png",
				sheet_x: 45,
				sheet_y: 34,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Student",
		b: "1F9D1-200D-1F393",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			45,
			29
		],
		o: 12
	},
	blue_book: {
		a: "Blue Book",
		b: "1F4D8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"read",
			"library",
			"knowledge",
			"learn",
			"study"
		],
		k: [
			26,
			46
		],
		o: 2
	},
	beer: {
		a: "Beer Mug",
		b: "1F37A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"relax",
			"beverage",
			"drink",
			"drunk",
			"party",
			"pub",
			"summer",
			"alcohol",
			"booze"
		],
		k: [
			7,
			25
		],
		o: 2
	},
	construction: {
		a: "Construction Sign",
		b: "1F6A7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"wip",
			"progress",
			"caution",
			"warning"
		],
		k: [
			34,
			55
		],
		o: 2
	},
	rosette: {
		a: "Rosette",
		b: "1F3F5-FE0F",
		c: "1F3F5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"flower",
			"decoration",
			"military"
		],
		k: [
			11,
			18
		],
		o: 2
	},
	heavy_check_mark: {
		a: "Heavy Check Mark",
		b: "2714-FE0F",
		c: "2714",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"ok",
			"nike",
			"answer",
			"yes",
			"tick"
		],
		k: [
			55,
			12
		],
		o: 2
	},
	scream_cat: {
		a: "Weary Cat Face",
		b: "1F640",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cats",
			"munch",
			"scared",
			"scream"
		],
		k: [
			31,
			42
		],
		o: 2
	},
	orange_book: {
		a: "Orange Book",
		b: "1F4D9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"read",
			"library",
			"knowledge",
			"textbook",
			"study"
		],
		k: [
			26,
			47
		],
		o: 2
	},
	beers: {
		a: "Clinking Beer Mugs",
		b: "1F37B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"relax",
			"beverage",
			"drink",
			"drunk",
			"party",
			"pub",
			"summer",
			"alcohol",
			"booze"
		],
		k: [
			7,
			26
		],
		o: 2
	},
	"male-student": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F393",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f393.png",
				sheet_x: 14,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F393",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f393.png",
				sheet_x: 14,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F393",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f393.png",
				sheet_x: 14,
				sheet_y: 53,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F393",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f393.png",
				sheet_x: 14,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F393",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f393.png",
				sheet_x: 14,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Student",
		b: "1F468-200D-1F393",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			14,
			50
		],
		o: 4
	},
	"flag-hn": {
		a: "Honduras Flag",
		b: "1F1ED-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			18
		],
		o: 2
	},
	crying_cat_face: {
		a: "Crying Cat Face",
		b: "1F63F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"tears",
			"weep",
			"sad",
			"cats",
			"upset",
			"cry"
		],
		k: [
			31,
			41
		],
		o: 2
	},
	anchor: {
		a: "Anchor",
		b: "2693",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"ship",
			"ferry",
			"sea",
			"boat"
		],
		k: [
			53,
			42
		],
		o: 2
	},
	"flag-hr": {
		a: "Croatia Flag",
		b: "1F1ED-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			19
		],
		o: 2
	},
	heavy_multiplication_x: {
		a: "Heavy Multiplication X",
		b: "2716-FE0F",
		c: "2716",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"math",
			"calculation"
		],
		k: [
			55,
			13
		],
		o: 2
	},
	"female-student": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F393",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f393.png",
				sheet_x: 17,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F393",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f393.png",
				sheet_x: 17,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F393",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f393.png",
				sheet_x: 17,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F393",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f393.png",
				sheet_x: 17,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F393",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f393.png",
				sheet_x: 17,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Student",
		b: "1F469-200D-1F393",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			17,
			40
		],
		o: 4
	},
	rose: {
		a: "Rose",
		b: "1F339",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"flowers",
			"valentines",
			"love",
			"spring"
		],
		k: [
			6,
			17
		],
		o: 2
	},
	books: {
		a: "Books",
		b: "1F4DA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"literature",
			"library",
			"study"
		],
		k: [
			26,
			48
		],
		o: 2
	},
	clinking_glasses: {
		a: "Clinking Glasses",
		b: "1F942",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"beverage",
			"drink",
			"party",
			"alcohol",
			"celebrate",
			"cheers"
		],
		k: [
			41,
			18
		],
		o: 4
	},
	teacher: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F3EB",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f3eb.png",
				sheet_x: 45,
				sheet_y: 48,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F3EB",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f3eb.png",
				sheet_x: 45,
				sheet_y: 49,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F3EB",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f3eb.png",
				sheet_x: 45,
				sheet_y: 50,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F3EB",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f3eb.png",
				sheet_x: 45,
				sheet_y: 51,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F3EB",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f3eb.png",
				sheet_x: 45,
				sheet_y: 52,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Teacher",
		b: "1F9D1-200D-1F3EB",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			45,
			47
		],
		o: 12
	},
	x: {
		a: "Cross Mark",
		b: "274C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"no",
			"delete",
			"remove",
			"cancel"
		],
		k: [
			55,
			21
		],
		o: 2
	},
	pouting_cat: {
		a: "Pouting Cat Face",
		b: "1F63E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"cats"
		],
		k: [
			31,
			40
		],
		o: 2
	},
	wilted_flower: {
		a: "Wilted Flower",
		b: "1F940",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"nature",
			"flower"
		],
		k: [
			41,
			16
		],
		o: 4
	},
	boat: {
		a: "Sailboat",
		b: "26F5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			54,
			16
		],
		n: [
			"sailboat"
		],
		o: 2
	},
	"flag-ht": {
		a: "Haiti Flag",
		b: "1F1ED-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			20
		],
		o: 2
	},
	tumbler_glass: {
		a: "Tumbler Glass",
		b: "1F943",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"drink",
			"beverage",
			"drunk",
			"alcohol",
			"liquor",
			"booze",
			"bourbon",
			"scotch",
			"whisky",
			"glass",
			"shot"
		],
		k: [
			41,
			19
		],
		o: 4
	},
	notebook: {
		a: "Notebook",
		b: "1F4D3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stationery",
			"record",
			"notes",
			"paper",
			"study"
		],
		k: [
			26,
			41
		],
		o: 2
	},
	"male-teacher": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F3EB",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f3eb.png",
				sheet_x: 15,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F3EB",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f3eb.png",
				sheet_x: 15,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F3EB",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f3eb.png",
				sheet_x: 15,
				sheet_y: 14,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F3EB",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f3eb.png",
				sheet_x: 15,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F3EB",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f3eb.png",
				sheet_x: 15,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Teacher",
		b: "1F468-200D-1F3EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			15,
			11
		],
		o: 4
	},
	ledger: {
		a: "Ledger",
		b: "1F4D2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"notes",
			"paper"
		],
		k: [
			26,
			40
		],
		o: 2
	},
	"flag-hu": {
		a: "Hungary Flag",
		b: "1F1ED-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			21
		],
		o: 2
	},
	cup_with_straw: {
		a: "Cup with Straw",
		b: "1F964",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			51
		],
		o: 5
	},
	hibiscus: {
		a: "Hibiscus",
		b: "1F33A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"vegetable",
			"flowers",
			"beach"
		],
		k: [
			6,
			18
		],
		o: 2
	},
	see_no_evil: {
		a: "See-No-Evil Monkey",
		b: "1F648",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"monkey",
			"animal",
			"nature",
			"haha"
		],
		k: [
			32,
			44
		],
		o: 2
	},
	canoe: {
		a: "Canoe",
		b: "1F6F6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"boat",
			"paddle",
			"water",
			"ship"
		],
		k: [
			36,
			55
		],
		o: 4
	},
	negative_squared_cross_mark: {
		a: "Negative Squared Cross Mark",
		b: "274E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"x",
			"green-square",
			"no",
			"deny"
		],
		k: [
			55,
			22
		],
		o: 2
	},
	"flag-ic": {
		a: "Canary Islands Flag",
		b: "1F1EE-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			22
		],
		o: 2
	},
	beverage_box: {
		a: "Beverage Box",
		b: "1F9C3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			11
		],
		o: 12
	},
	speedboat: {
		a: "Speedboat",
		b: "1F6A4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"ship",
			"transportation",
			"vehicle",
			"summer"
		],
		k: [
			34,
			52
		],
		o: 2
	},
	heavy_plus_sign: {
		a: "Heavy Plus Sign",
		b: "2795",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"math",
			"calculation",
			"addition",
			"more",
			"increase"
		],
		k: [
			55,
			29
		],
		o: 2
	},
	sunflower: {
		a: "Sunflower",
		b: "1F33B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"plant",
			"fall"
		],
		k: [
			6,
			19
		],
		o: 2
	},
	page_with_curl: {
		a: "Page with Curl",
		b: "1F4C3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"documents",
			"office",
			"paper"
		],
		k: [
			26,
			25
		],
		o: 2
	},
	"female-teacher": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F3EB",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f3eb.png",
				sheet_x: 18,
				sheet_y: 2,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F3EB",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f3eb.png",
				sheet_x: 18,
				sheet_y: 3,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F3EB",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f3eb.png",
				sheet_x: 18,
				sheet_y: 4,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F3EB",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f3eb.png",
				sheet_x: 18,
				sheet_y: 5,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F3EB",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f3eb.png",
				sheet_x: 18,
				sheet_y: 6,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Teacher",
		b: "1F469-200D-1F3EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			18,
			1
		],
		o: 4
	},
	hear_no_evil: {
		a: "Hear-No-Evil Monkey",
		b: "1F649",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"monkey",
			"nature"
		],
		k: [
			32,
			45
		],
		o: 2
	},
	mate_drink: {
		a: "Mate Drink",
		b: "1F9C9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			17
		],
		o: 12
	},
	passenger_ship: {
		a: "Passenger Ship",
		b: "1F6F3-FE0F",
		c: "1F6F3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"yacht",
			"cruise",
			"ferry"
		],
		k: [
			36,
			52
		],
		o: 2
	},
	judge: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-2696-FE0F",
				non_qualified: "1F9D1-1F3FB-200D-2696",
				image: "1f9d1-1f3fb-200d-2696-fe0f.png",
				sheet_x: 47,
				sheet_y: 56,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-2696-FE0F",
				non_qualified: "1F9D1-1F3FC-200D-2696",
				image: "1f9d1-1f3fc-200d-2696-fe0f.png",
				sheet_x: 48,
				sheet_y: 0,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-2696-FE0F",
				non_qualified: "1F9D1-1F3FD-200D-2696",
				image: "1f9d1-1f3fd-200d-2696-fe0f.png",
				sheet_x: 48,
				sheet_y: 1,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-2696-FE0F",
				non_qualified: "1F9D1-1F3FE-200D-2696",
				image: "1f9d1-1f3fe-200d-2696-fe0f.png",
				sheet_x: 48,
				sheet_y: 2,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-2696-FE0F",
				non_qualified: "1F9D1-1F3FF-200D-2696",
				image: "1f9d1-1f3ff-200d-2696-fe0f.png",
				sheet_x: 48,
				sheet_y: 3,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Judge",
		b: "1F9D1-200D-2696-FE0F",
		c: "1F9D1-200D-2696",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			55
		],
		o: 12
	},
	scroll: {
		a: "Scroll",
		b: "1F4DC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"documents",
			"ancient",
			"history",
			"paper"
		],
		k: [
			26,
			50
		],
		o: 2
	},
	blossom: {
		a: "Blossom",
		b: "1F33C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"flowers",
			"yellow"
		],
		k: [
			6,
			20
		],
		o: 2
	},
	"flag-id": {
		a: "Indonesia Flag",
		b: "1F1EE-1F1E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			23
		],
		o: 2
	},
	speak_no_evil: {
		a: "Speak-No-Evil Monkey",
		b: "1F64A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"monkey",
			"animal",
			"nature",
			"omg"
		],
		k: [
			32,
			46
		],
		o: 2
	},
	heavy_minus_sign: {
		a: "Heavy Minus Sign",
		b: "2796",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"math",
			"calculation",
			"subtract",
			"less"
		],
		k: [
			55,
			30
		],
		o: 2
	},
	"flag-ie": {
		a: "Ireland Flag",
		b: "1F1EE-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			24
		],
		o: 2
	},
	ice_cube: {
		a: "Ice Cube",
		b: "1F9CA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			18
		],
		o: 12
	},
	page_facing_up: {
		a: "Page Facing Up",
		b: "1F4C4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"documents",
			"office",
			"paper",
			"information"
		],
		k: [
			26,
			26
		],
		o: 2
	},
	"male-judge": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-2696-FE0F",
				non_qualified: "1F468-1F3FB-200D-2696",
				image: "1f468-1f3fb-200d-2696-fe0f.png",
				sheet_x: 17,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-2696-FE0F",
				non_qualified: "1F468-1F3FC-200D-2696",
				image: "1f468-1f3fc-200d-2696-fe0f.png",
				sheet_x: 17,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-2696-FE0F",
				non_qualified: "1F468-1F3FD-200D-2696",
				image: "1f468-1f3fd-200d-2696-fe0f.png",
				sheet_x: 17,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-2696-FE0F",
				non_qualified: "1F468-1F3FE-200D-2696",
				image: "1f468-1f3fe-200d-2696-fe0f.png",
				sheet_x: 17,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-2696-FE0F",
				non_qualified: "1F468-1F3FF-200D-2696",
				image: "1f468-1f3ff-200d-2696-fe0f.png",
				sheet_x: 17,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Judge",
		b: "1F468-200D-2696-FE0F",
		c: "1F468-200D-2696",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			17,
			8
		],
		o: 4
	},
	tulip: {
		a: "Tulip",
		b: "1F337",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"flowers",
			"plant",
			"nature",
			"summer",
			"spring"
		],
		k: [
			6,
			15
		],
		o: 2
	},
	ferry: {
		a: "Ferry",
		b: "26F4-FE0F",
		c: "26F4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"boat",
			"ship",
			"yacht"
		],
		k: [
			54,
			15
		],
		o: 2
	},
	kiss: {
		a: "Kiss Mark",
		b: "1F48B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"face",
			"lips",
			"love",
			"like",
			"affection",
			"valentines"
		],
		k: [
			25,
			21
		],
		o: 2
	},
	heavy_division_sign: {
		a: "Heavy Division Sign",
		b: "2797",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"divide",
			"math",
			"calculation"
		],
		k: [
			55,
			31
		],
		o: 2
	},
	newspaper: {
		a: "Newspaper",
		b: "1F4F0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"press",
			"headline"
		],
		k: [
			27,
			13
		],
		o: 2
	},
	"female-judge": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-2696-FE0F",
				non_qualified: "1F469-1F3FB-200D-2696",
				image: "1f469-1f3fb-200d-2696-fe0f.png",
				sheet_x: 19,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-2696-FE0F",
				non_qualified: "1F469-1F3FC-200D-2696",
				image: "1f469-1f3fc-200d-2696-fe0f.png",
				sheet_x: 19,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-2696-FE0F",
				non_qualified: "1F469-1F3FD-200D-2696",
				image: "1f469-1f3fd-200d-2696-fe0f.png",
				sheet_x: 19,
				sheet_y: 53,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-2696-FE0F",
				non_qualified: "1F469-1F3FE-200D-2696",
				image: "1f469-1f3fe-200d-2696-fe0f.png",
				sheet_x: 19,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-2696-FE0F",
				non_qualified: "1F469-1F3FF-200D-2696",
				image: "1f469-1f3ff-200d-2696-fe0f.png",
				sheet_x: 19,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Judge",
		b: "1F469-200D-2696-FE0F",
		c: "1F469-200D-2696",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			50
		],
		o: 4
	},
	seedling: {
		a: "Seedling",
		b: "1F331",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"nature",
			"grass",
			"lawn",
			"spring"
		],
		k: [
			6,
			9
		],
		o: 2
	},
	love_letter: {
		a: "Love Letter",
		b: "1F48C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"like",
			"affection",
			"envelope",
			"valentines"
		],
		k: [
			25,
			22
		],
		o: 2
	},
	chopsticks: {
		a: "Chopsticks",
		b: "1F962",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			41,
			49
		],
		o: 5
	},
	motor_boat: {
		a: "Motor Boat",
		b: "1F6E5-FE0F",
		c: "1F6E5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"ship"
		],
		k: [
			36,
			47
		],
		o: 2
	},
	"flag-il": {
		a: "Israel Flag",
		b: "1F1EE-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			25
		],
		o: 2
	},
	curly_loop: {
		a: "Curly Loop",
		b: "27B0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"scribble",
			"draw",
			"shape",
			"squiggle"
		],
		k: [
			55,
			33
		],
		o: 2
	},
	"flag-im": {
		a: "Isle of Man Flag",
		b: "1F1EE-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			26
		],
		o: 2
	},
	evergreen_tree: {
		a: "Evergreen Tree",
		b: "1F332",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"nature"
		],
		k: [
			6,
			10
		],
		o: 2
	},
	cupid: {
		a: "Heart with Arrow",
		b: "1F498",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"heart",
			"affection",
			"valentines"
		],
		k: [
			25,
			34
		],
		o: 2
	},
	loop: {
		a: "Double Curly Loop",
		b: "27BF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"tape",
			"cassette"
		],
		k: [
			55,
			34
		],
		o: 2
	},
	ship: {
		a: "Ship",
		b: "1F6A2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"titanic",
			"deploy"
		],
		k: [
			34,
			33
		],
		o: 2
	},
	farmer: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F33E",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f33e.png",
				sheet_x: 45,
				sheet_y: 18,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F33E",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f33e.png",
				sheet_x: 45,
				sheet_y: 19,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F33E",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f33e.png",
				sheet_x: 45,
				sheet_y: 20,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F33E",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f33e.png",
				sheet_x: 45,
				sheet_y: 21,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F33E",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f33e.png",
				sheet_x: 45,
				sheet_y: 22,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Farmer",
		b: "1F9D1-200D-1F33E",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			45,
			17
		],
		o: 12
	},
	rolled_up_newspaper: {
		a: "Rolled Up Newspaper",
		b: "1F5DE-FE0F",
		c: "1F5DE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			23
		],
		o: 2
	},
	knife_fork_plate: {
		a: "Knife Fork Plate",
		b: "1F37D-FE0F",
		c: "1F37D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			7,
			28
		],
		o: 2
	},
	fork_and_knife: {
		a: "Fork and Knife",
		b: "1F374",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cutlery",
			"kitchen"
		],
		k: [
			7,
			19
		],
		o: 2
	},
	"male-farmer": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F33E",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f33e.png",
				sheet_x: 14,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F33E",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f33e.png",
				sheet_x: 14,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F33E",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f33e.png",
				sheet_x: 14,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F33E",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f33e.png",
				sheet_x: 14,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F33E",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f33e.png",
				sheet_x: 14,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Farmer",
		b: "1F468-200D-1F33E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			14,
			38
		],
		o: 4
	},
	bookmark_tabs: {
		a: "Bookmark Tabs",
		b: "1F4D1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"favorite",
			"save",
			"order",
			"tidy"
		],
		k: [
			26,
			39
		],
		o: 2
	},
	part_alternation_mark: {
		a: "Part Alternation Mark",
		b: "303D-FE0F",
		c: "303D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"graph",
			"presentation",
			"stats",
			"business",
			"economics",
			"bad"
		],
		k: [
			55,
			45
		],
		o: 2
	},
	"flag-in": {
		a: "India Flag",
		b: "1F1EE-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			27
		],
		o: 2
	},
	gift_heart: {
		a: "Heart with Ribbon",
		b: "1F49D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"valentines"
		],
		k: [
			25,
			39
		],
		o: 2
	},
	airplane: {
		a: "Airplane",
		b: "2708-FE0F",
		c: "2708",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"transportation",
			"flight",
			"fly"
		],
		k: [
			54,
			41
		],
		o: 2
	},
	deciduous_tree: {
		a: "Deciduous Tree",
		b: "1F333",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"nature"
		],
		k: [
			6,
			11
		],
		o: 2
	},
	spoon: {
		a: "Spoon",
		b: "1F944",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cutlery",
			"kitchen",
			"tableware"
		],
		k: [
			41,
			20
		],
		o: 4
	},
	"flag-io": {
		a: "British Indian Ocean Territory Flag",
		b: "1F1EE-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			28
		],
		o: 2
	},
	palm_tree: {
		a: "Palm Tree",
		b: "1F334",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"plant",
			"vegetable",
			"nature",
			"summer",
			"beach",
			"mojito",
			"tropical"
		],
		k: [
			6,
			12
		],
		o: 2
	},
	sparkling_heart: {
		a: "Sparkling Heart",
		b: "1F496",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"valentines"
		],
		k: [
			25,
			32
		],
		o: 2
	},
	"female-farmer": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F33E",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f33e.png",
				sheet_x: 17,
				sheet_y: 29,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F33E",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f33e.png",
				sheet_x: 17,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F33E",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f33e.png",
				sheet_x: 17,
				sheet_y: 31,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F33E",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f33e.png",
				sheet_x: 17,
				sheet_y: 32,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F33E",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f33e.png",
				sheet_x: 17,
				sheet_y: 33,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Farmer",
		b: "1F469-200D-1F33E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			17,
			28
		],
		o: 4
	},
	eight_spoked_asterisk: {
		a: "Eight Spoked Asterisk",
		b: "2733-FE0F",
		c: "2733",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"star",
			"sparkle",
			"green-square"
		],
		k: [
			55,
			17
		],
		o: 2
	},
	small_airplane: {
		a: "Small Airplane",
		b: "1F6E9-FE0F",
		c: "1F6E9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"flight",
			"transportation",
			"fly",
			"vehicle"
		],
		k: [
			36,
			48
		],
		o: 2
	},
	bookmark: {
		a: "Bookmark",
		b: "1F516",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"favorite",
			"label",
			"save"
		],
		k: [
			27,
			50
		],
		o: 2
	},
	cook: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F373",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f373.png",
				sheet_x: 45,
				sheet_y: 24,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F373",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f373.png",
				sheet_x: 45,
				sheet_y: 25,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F373",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f373.png",
				sheet_x: 45,
				sheet_y: 26,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F373",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f373.png",
				sheet_x: 45,
				sheet_y: 27,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F373",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f373.png",
				sheet_x: 45,
				sheet_y: 28,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Cook",
		b: "1F9D1-200D-1F373",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			45,
			23
		],
		o: 12
	},
	eight_pointed_black_star: {
		a: "Eight Pointed Black Star",
		b: "2734-FE0F",
		c: "2734",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"orange-square",
			"shape",
			"polygon"
		],
		k: [
			55,
			18
		],
		o: 2
	},
	heartpulse: {
		a: "Growing Heart",
		b: "1F497",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"like",
			"love",
			"affection",
			"valentines",
			"pink"
		],
		k: [
			25,
			33
		],
		o: 2
	},
	label: {
		a: "Label",
		b: "1F3F7-FE0F",
		c: "1F3F7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sale",
			"tag"
		],
		k: [
			11,
			19
		],
		o: 2
	},
	"flag-iq": {
		a: "Iraq Flag",
		b: "1F1EE-1F1F6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			29
		],
		o: 2
	},
	hocho: {
		a: "Hocho",
		b: "1F52A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"knife",
			"blade",
			"cutlery",
			"kitchen",
			"weapon"
		],
		k: [
			28,
			13
		],
		n: [
			"knife"
		],
		o: 2
	},
	cactus: {
		a: "Cactus",
		b: "1F335",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vegetable",
			"plant",
			"nature"
		],
		k: [
			6,
			13
		],
		o: 2
	},
	airplane_departure: {
		a: "Airplane Departure",
		b: "1F6EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			36,
			49
		],
		o: 2
	},
	airplane_arriving: {
		a: "Airplane Arriving",
		b: "1F6EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			36,
			50
		],
		o: 2
	},
	ear_of_rice: {
		a: "Ear of Rice",
		b: "1F33E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"plant"
		],
		k: [
			6,
			22
		],
		o: 2
	},
	"flag-ir": {
		a: "Iran Flag",
		b: "1F1EE-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			30
		],
		o: 2
	},
	moneybag: {
		a: "Money Bag",
		b: "1F4B0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dollar",
			"payment",
			"coins",
			"sale"
		],
		k: [
			26,
			6
		],
		o: 2
	},
	"male-cook": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F373",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f373.png",
				sheet_x: 14,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F373",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f373.png",
				sheet_x: 14,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F373",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f373.png",
				sheet_x: 14,
				sheet_y: 47,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F373",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f373.png",
				sheet_x: 14,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F373",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f373.png",
				sheet_x: 14,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Cook",
		b: "1F468-200D-1F373",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			14,
			44
		],
		o: 4
	},
	heartbeat: {
		a: "Beating Heart",
		b: "1F493",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"valentines",
			"pink",
			"heart"
		],
		k: [
			25,
			29
		],
		o: 2
	},
	sparkle: {
		a: "Sparkle",
		b: "2747-FE0F",
		c: "2747",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stars",
			"green-square",
			"awesome",
			"good",
			"fireworks"
		],
		k: [
			55,
			20
		],
		o: 2
	},
	amphora: {
		a: "Amphora",
		b: "1F3FA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vase",
			"jar"
		],
		k: [
			11,
			22
		],
		o: 2
	},
	yen: {
		a: "Banknote with Yen Sign",
		b: "1F4B4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"money",
			"sales",
			"japanese",
			"dollar",
			"currency"
		],
		k: [
			26,
			10
		],
		o: 2
	},
	revolving_hearts: {
		a: "Revolving Hearts",
		b: "1F49E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"valentines"
		],
		k: [
			25,
			40
		],
		o: 2
	},
	bangbang: {
		a: "Double Exclamation Mark",
		b: "203C-FE0F",
		c: "203C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"exclamation",
			"surprise"
		],
		k: [
			52,
			10
		],
		o: 2
	},
	parachute: {
		a: "Parachute",
		b: "1FA82",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			3
		],
		o: 12
	},
	herb: {
		a: "Herb",
		b: "1F33F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vegetable",
			"plant",
			"medicine",
			"weed",
			"grass",
			"lawn"
		],
		k: [
			6,
			23
		],
		o: 2
	},
	"flag-is": {
		a: "Iceland Flag",
		b: "1F1EE-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			31
		],
		o: 2
	},
	"female-cook": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F373",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f373.png",
				sheet_x: 17,
				sheet_y: 35,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F373",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f373.png",
				sheet_x: 17,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F373",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f373.png",
				sheet_x: 17,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F373",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f373.png",
				sheet_x: 17,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F373",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f373.png",
				sheet_x: 17,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Cook",
		b: "1F469-200D-1F373",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			17,
			34
		],
		o: 4
	},
	mechanic: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F527",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f527.png",
				sheet_x: 46,
				sheet_y: 15,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F527",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f527.png",
				sheet_x: 46,
				sheet_y: 16,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F527",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f527.png",
				sheet_x: 46,
				sheet_y: 17,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F527",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f527.png",
				sheet_x: 46,
				sheet_y: 18,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F527",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f527.png",
				sheet_x: 46,
				sheet_y: 19,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Mechanic",
		b: "1F9D1-200D-1F527",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			46,
			14
		],
		o: 12
	},
	interrobang: {
		a: "Exclamation Question Mark",
		b: "2049-FE0F",
		c: "2049",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"wat",
			"punctuation",
			"surprise"
		],
		k: [
			52,
			11
		],
		o: 2
	},
	seat: {
		a: "Seat",
		b: "1F4BA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sit",
			"airplane",
			"transport",
			"bus",
			"flight",
			"fly"
		],
		k: [
			26,
			16
		],
		o: 2
	},
	dollar: {
		a: "Banknote with Dollar Sign",
		b: "1F4B5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"money",
			"sales",
			"bill",
			"currency"
		],
		k: [
			26,
			11
		],
		o: 2
	},
	two_hearts: {
		a: "Two Hearts",
		b: "1F495",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"valentines",
			"heart"
		],
		k: [
			25,
			31
		],
		o: 2
	},
	it: {
		a: "Italy Flag",
		b: "1F1EE-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"italy",
			"flag",
			"nation",
			"country",
			"banner"
		],
		k: [
			2,
			32
		],
		n: [
			"flag-it"
		],
		o: 2
	},
	shamrock: {
		a: "Shamrock",
		b: "2618-FE0F",
		c: "2618",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vegetable",
			"plant",
			"nature",
			"irish",
			"clover"
		],
		k: [
			53,
			1
		],
		o: 2
	},
	four_leaf_clover: {
		a: "Four Leaf Clover",
		b: "1F340",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vegetable",
			"plant",
			"nature",
			"lucky",
			"irish"
		],
		k: [
			6,
			24
		],
		o: 2
	},
	euro: {
		a: "Banknote with Euro Sign",
		b: "1F4B6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"money",
			"sales",
			"dollar",
			"currency"
		],
		k: [
			26,
			12
		],
		o: 2
	},
	question: {
		a: "Black Question Mark Ornament",
		b: "2753",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"doubt",
			"confused"
		],
		k: [
			55,
			23
		],
		o: 2
	},
	helicopter: {
		a: "Helicopter",
		b: "1F681",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle",
			"fly"
		],
		k: [
			34,
			0
		],
		o: 2
	},
	heart_decoration: {
		a: "Heart Decoration",
		b: "1F49F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"purple-square",
			"love",
			"like"
		],
		k: [
			25,
			41
		],
		o: 2
	},
	"flag-je": {
		a: "Jersey Flag",
		b: "1F1EF-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			33
		],
		o: 2
	},
	"male-mechanic": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F527",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f527.png",
				sheet_x: 15,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F527",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f527.png",
				sheet_x: 15,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F527",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f527.png",
				sheet_x: 15,
				sheet_y: 53,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F527",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f527.png",
				sheet_x: 15,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F527",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f527.png",
				sheet_x: 15,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Mechanic",
		b: "1F468-200D-1F527",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			15,
			50
		],
		o: 4
	},
	suspension_railway: {
		a: "Suspension Railway",
		b: "1F69F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vehicle",
			"transportation"
		],
		k: [
			34,
			30
		],
		o: 2
	},
	heavy_heart_exclamation_mark_ornament: {
		a: "Heavy Heart Exclamation Mark Ornament",
		b: "2763-FE0F",
		c: "2763",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			55,
			27
		],
		o: 2
	},
	"female-mechanic": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F527",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f527.png",
				sheet_x: 18,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F527",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f527.png",
				sheet_x: 18,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F527",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f527.png",
				sheet_x: 18,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F527",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f527.png",
				sheet_x: 18,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F527",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f527.png",
				sheet_x: 18,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Mechanic",
		b: "1F469-200D-1F527",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			18,
			35
		],
		o: 4
	},
	"flag-jm": {
		a: "Jamaica Flag",
		b: "1F1EF-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			34
		],
		o: 2
	},
	grey_question: {
		a: "White Question Mark Ornament",
		b: "2754",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"doubts",
			"gray",
			"huh",
			"confused"
		],
		k: [
			55,
			24
		],
		o: 2
	},
	maple_leaf: {
		a: "Maple Leaf",
		b: "1F341",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"plant",
			"vegetable",
			"ca",
			"fall"
		],
		k: [
			6,
			25
		],
		o: 2
	},
	pound: {
		a: "Banknote with Pound Sign",
		b: "1F4B7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"british",
			"sterling",
			"money",
			"sales",
			"bills",
			"uk",
			"england",
			"currency"
		],
		k: [
			26,
			13
		],
		o: 2
	},
	money_with_wings: {
		a: "Money with Wings",
		b: "1F4B8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dollar",
			"bills",
			"payment",
			"sale"
		],
		k: [
			26,
			14
		],
		o: 2
	},
	"flag-jo": {
		a: "Jordan Flag",
		b: "1F1EF-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			35
		],
		o: 2
	},
	fallen_leaf: {
		a: "Fallen Leaf",
		b: "1F342",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"plant",
			"vegetable",
			"leaves"
		],
		k: [
			6,
			26
		],
		o: 2
	},
	factory_worker: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F3ED",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f3ed.png",
				sheet_x: 45,
				sheet_y: 54,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F3ED",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f3ed.png",
				sheet_x: 45,
				sheet_y: 55,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F3ED",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f3ed.png",
				sheet_x: 45,
				sheet_y: 56,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F3ED",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f3ed.png",
				sheet_x: 46,
				sheet_y: 0,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F3ED",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f3ed.png",
				sheet_x: 46,
				sheet_y: 1,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Factory Worker",
		b: "1F9D1-200D-1F3ED",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			45,
			53
		],
		o: 12
	},
	broken_heart: {
		a: "Broken Heart",
		b: "1F494",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sad",
			"sorry",
			"break",
			"heart",
			"heartbreak"
		],
		k: [
			25,
			30
		],
		l: [
			"</3"
		],
		m: "</3",
		o: 2
	},
	grey_exclamation: {
		a: "White Exclamation Mark Ornament",
		b: "2755",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"surprise",
			"punctuation",
			"gray",
			"wow",
			"warning"
		],
		k: [
			55,
			25
		],
		o: 2
	},
	mountain_cableway: {
		a: "Mountain Cableway",
		b: "1F6A0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle",
			"ski"
		],
		k: [
			34,
			31
		],
		o: 2
	},
	exclamation: {
		a: "Heavy Exclamation Mark Symbol",
		b: "2757",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"heavy_exclamation_mark",
			"danger",
			"surprise",
			"punctuation",
			"wow",
			"warning"
		],
		k: [
			55,
			26
		],
		n: [
			"heavy_exclamation_mark"
		],
		o: 2
	},
	leaves: {
		a: "Leaf Fluttering in Wind",
		b: "1F343",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"plant",
			"tree",
			"vegetable",
			"grass",
			"lawn",
			"spring"
		],
		k: [
			6,
			27
		],
		o: 2
	},
	heart: {
		a: "Heavy Black Heart",
		b: "2764-FE0F",
		c: "2764",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"valentines"
		],
		k: [
			55,
			28
		],
		l: [
			"<3"
		],
		m: "<3",
		o: 2
	},
	jp: {
		a: "Japan Flag",
		b: "1F1EF-1F1F5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"japanese",
			"nation",
			"flag",
			"country",
			"banner"
		],
		k: [
			2,
			36
		],
		n: [
			"flag-jp"
		],
		o: 2
	},
	"male-factory-worker": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F3ED",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f3ed.png",
				sheet_x: 15,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F3ED",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f3ed.png",
				sheet_x: 15,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F3ED",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f3ed.png",
				sheet_x: 15,
				sheet_y: 20,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F3ED",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f3ed.png",
				sheet_x: 15,
				sheet_y: 21,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F3ED",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f3ed.png",
				sheet_x: 15,
				sheet_y: 22,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Factory Worker",
		b: "1F468-200D-1F3ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			15,
			17
		],
		o: 4
	},
	credit_card: {
		a: "Credit Card",
		b: "1F4B3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"money",
			"sales",
			"dollar",
			"bill",
			"payment",
			"shopping"
		],
		k: [
			26,
			9
		],
		o: 2
	},
	aerial_tramway: {
		a: "Aerial Tramway",
		b: "1F6A1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"transportation",
			"vehicle",
			"ski"
		],
		k: [
			34,
			32
		],
		o: 2
	},
	"female-factory-worker": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F3ED",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f3ed.png",
				sheet_x: 18,
				sheet_y: 8,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F3ED",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f3ed.png",
				sheet_x: 18,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F3ED",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f3ed.png",
				sheet_x: 18,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F3ED",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f3ed.png",
				sheet_x: 18,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F3ED",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f3ed.png",
				sheet_x: 18,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Factory Worker",
		b: "1F469-200D-1F3ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			18,
			7
		],
		o: 4
	},
	receipt: {
		a: "Receipt",
		b: "1F9FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			49
		],
		o: 11
	},
	wavy_dash: {
		a: "Wavy Dash",
		b: "3030-FE0F",
		c: "3030",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"draw",
			"line",
			"moustache",
			"mustache",
			"squiggle",
			"scribble"
		],
		k: [
			55,
			44
		],
		o: 2
	},
	"flag-ke": {
		a: "Kenya Flag",
		b: "1F1F0-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			37
		],
		o: 2
	},
	satellite: {
		a: "Satellite",
		b: "1F6F0-FE0F",
		c: "1F6F0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"communication",
			"future",
			"radio",
			"space"
		],
		k: [
			36,
			51
		],
		o: 2
	},
	orange_heart: {
		a: "Orange Heart",
		b: "1F9E1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			20
		],
		o: 5
	},
	yellow_heart: {
		a: "Yellow Heart",
		b: "1F49B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"valentines"
		],
		k: [
			25,
			37
		],
		m: "<3",
		o: 2
	},
	copyright: {
		a: "Copyright Sign",
		b: "00A9-FE0F",
		c: "00A9",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"ip",
			"license",
			"circle",
			"law",
			"legal"
		],
		k: [
			0,
			12
		],
		o: 2
	},
	rocket: {
		a: "Rocket",
		b: "1F680",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"launch",
			"ship",
			"staffmode",
			"NASA",
			"outer space",
			"outer_space",
			"fly"
		],
		k: [
			33,
			56
		],
		o: 2
	},
	chart: {
		a: "Chart with Upwards Trend and Yen Sign",
		b: "1F4B9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"green-square",
			"graph",
			"presentation",
			"stats"
		],
		k: [
			26,
			15
		],
		o: 2
	},
	"flag-kg": {
		a: "Kyrgyzstan Flag",
		b: "1F1F0-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			38
		],
		o: 2
	},
	office_worker: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F4BC",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f4bc.png",
				sheet_x: 46,
				sheet_y: 9,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F4BC",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f4bc.png",
				sheet_x: 46,
				sheet_y: 10,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F4BC",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f4bc.png",
				sheet_x: 46,
				sheet_y: 11,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F4BC",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f4bc.png",
				sheet_x: 46,
				sheet_y: 12,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F4BC",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f4bc.png",
				sheet_x: 46,
				sheet_y: 13,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Office Worker",
		b: "1F9D1-200D-1F4BC",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			46,
			8
		],
		o: 12
	},
	currency_exchange: {
		a: "Currency Exchange",
		b: "1F4B1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"money",
			"sales",
			"dollar",
			"travel"
		],
		k: [
			26,
			7
		],
		o: 2
	},
	registered: {
		a: "Registered Sign",
		b: "00AE-FE0F",
		c: "00AE",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"alphabet",
			"circle"
		],
		k: [
			0,
			13
		],
		o: 2
	},
	green_heart: {
		a: "Green Heart",
		b: "1F49A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"valentines"
		],
		k: [
			25,
			36
		],
		m: "<3",
		o: 2
	},
	flying_saucer: {
		a: "Flying Saucer",
		b: "1F6F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			0
		],
		o: 5
	},
	"flag-kh": {
		a: "Cambodia Flag",
		b: "1F1F0-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			39
		],
		o: 2
	},
	"male-office-worker": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F4BC",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f4bc.png",
				sheet_x: 15,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F4BC",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f4bc.png",
				sheet_x: 15,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F4BC",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f4bc.png",
				sheet_x: 15,
				sheet_y: 47,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F4BC",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f4bc.png",
				sheet_x: 15,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F4BC",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f4bc.png",
				sheet_x: 15,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Office Worker",
		b: "1F468-200D-1F4BC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			15,
			44
		],
		o: 4
	},
	tm: {
		a: "Trade Mark Sign",
		b: "2122-FE0F",
		c: "2122",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"trademark",
			"brand",
			"law",
			"legal"
		],
		k: [
			52,
			12
		],
		o: 2
	},
	bellhop_bell: {
		a: "Bellhop Bell",
		b: "1F6CE-FE0F",
		c: "1F6CE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"service"
		],
		k: [
			36,
			36
		],
		o: 2
	},
	blue_heart: {
		a: "Blue Heart",
		b: "1F499",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"valentines"
		],
		k: [
			25,
			35
		],
		m: "<3",
		o: 2
	},
	"flag-ki": {
		a: "Kiribati Flag",
		b: "1F1F0-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			40
		],
		o: 2
	},
	heavy_dollar_sign: {
		a: "Heavy Dollar Sign",
		b: "1F4B2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"money",
			"sales",
			"payment",
			"currency",
			"buck"
		],
		k: [
			26,
			8
		],
		o: 2
	},
	"female-office-worker": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F4BC",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f4bc.png",
				sheet_x: 18,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F4BC",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f4bc.png",
				sheet_x: 18,
				sheet_y: 31,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F4BC",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f4bc.png",
				sheet_x: 18,
				sheet_y: 32,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F4BC",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f4bc.png",
				sheet_x: 18,
				sheet_y: 33,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F4BC",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f4bc.png",
				sheet_x: 18,
				sheet_y: 34,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Office Worker",
		b: "1F469-200D-1F4BC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			18,
			29
		],
		o: 4
	},
	purple_heart: {
		a: "Purple Heart",
		b: "1F49C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"love",
			"like",
			"affection",
			"valentines"
		],
		k: [
			25,
			38
		],
		m: "<3",
		o: 2
	},
	scientist: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F52C",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f52c.png",
				sheet_x: 46,
				sheet_y: 21,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F52C",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f52c.png",
				sheet_x: 46,
				sheet_y: 22,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F52C",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f52c.png",
				sheet_x: 46,
				sheet_y: 23,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F52C",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f52c.png",
				sheet_x: 46,
				sheet_y: 24,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F52C",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f52c.png",
				sheet_x: 46,
				sheet_y: 25,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Scientist",
		b: "1F9D1-200D-1F52C",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			46,
			20
		],
		o: 12
	},
	luggage: {
		a: "Luggage",
		b: "1F9F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			38
		],
		o: 11
	},
	hash: {
		a: "Hash Key",
		b: "0023-FE0F-20E3",
		c: "0023-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"symbol",
			"blue-square",
			"twitter"
		],
		k: [
			0,
			0
		],
		o: 0
	},
	"flag-km": {
		a: "Comoros Flag",
		b: "1F1F0-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			41
		],
		o: 2
	},
	email: {
		a: "Envelope",
		b: "2709-FE0F",
		c: "2709",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"letter",
			"postal",
			"inbox",
			"communication"
		],
		k: [
			54,
			42
		],
		n: [
			"envelope"
		],
		o: 2
	},
	"e-mail": {
		a: "E-Mail Symbol",
		b: "1F4E7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"communication",
			"inbox"
		],
		k: [
			27,
			4
		],
		o: 2
	},
	keycap_star: {
		a: "Keycap Star",
		b: "002A-FE0F-20E3",
		c: "002A-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			0,
			1
		],
		o: 0
	},
	"flag-kn": {
		a: "St. Kitts & Nevis Flag",
		b: "1F1F0-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			42
		],
		o: 2
	},
	hourglass: {
		a: "Hourglass",
		b: "231B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"clock",
			"oldschool",
			"limit",
			"exam",
			"quiz",
			"test"
		],
		k: [
			52,
			23
		],
		o: 2
	},
	brown_heart: {
		a: "Brown Heart",
		b: "1F90E",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			16
		],
		o: 12
	},
	"male-scientist": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F52C",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f52c.png",
				sheet_x: 16,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F52C",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f52c.png",
				sheet_x: 16,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F52C",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f52c.png",
				sheet_x: 16,
				sheet_y: 2,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F52C",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f52c.png",
				sheet_x: 16,
				sheet_y: 3,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F52C",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f52c.png",
				sheet_x: 16,
				sheet_y: 4,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Scientist",
		b: "1F468-200D-1F52C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			15,
			56
		],
		o: 4
	},
	hourglass_flowing_sand: {
		a: "Hourglass with Flowing Sand",
		b: "23F3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"oldschool",
			"time",
			"countdown"
		],
		k: [
			52,
			36
		],
		o: 2
	},
	black_heart: {
		a: "Black Heart",
		b: "1F5A4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"evil"
		],
		k: [
			30,
			9
		],
		o: 4
	},
	zero: {
		a: "Keycap 0",
		b: "0030-FE0F-20E3",
		c: "0030-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"0",
			"numbers",
			"blue-square",
			"null"
		],
		k: [
			0,
			2
		],
		o: 0
	},
	incoming_envelope: {
		a: "Incoming Envelope",
		b: "1F4E8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"inbox"
		],
		k: [
			27,
			5
		],
		o: 2
	},
	"flag-kp": {
		a: "North Korea Flag",
		b: "1F1F0-1F1F5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			43
		],
		o: 2
	},
	"female-scientist": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F52C",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f52c.png",
				sheet_x: 18,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F52C",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f52c.png",
				sheet_x: 18,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F52C",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f52c.png",
				sheet_x: 18,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F52C",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f52c.png",
				sheet_x: 18,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F52C",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f52c.png",
				sheet_x: 18,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Scientist",
		b: "1F469-200D-1F52C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			18,
			41
		],
		o: 4
	},
	watch: {
		a: "Watch",
		b: "231A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"accessories"
		],
		k: [
			52,
			22
		],
		o: 2
	},
	white_heart: {
		a: "White Heart",
		b: "1F90D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			15
		],
		o: 12
	},
	one: {
		a: "Keycap 1",
		b: "0031-FE0F-20E3",
		c: "0031-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"blue-square",
			"numbers",
			"1"
		],
		k: [
			0,
			3
		],
		o: 0
	},
	kr: {
		a: "South Korea Flag",
		b: "1F1F0-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"south",
			"korea",
			"nation",
			"flag",
			"country",
			"banner"
		],
		k: [
			2,
			44
		],
		n: [
			"flag-kr"
		],
		o: 2
	},
	envelope_with_arrow: {
		a: "Envelope with Downwards Arrow Above",
		b: "1F4E9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"communication"
		],
		k: [
			27,
			6
		],
		o: 2
	},
	technologist: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F4BB",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f4bb.png",
				sheet_x: 46,
				sheet_y: 3,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F4BB",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f4bb.png",
				sheet_x: 46,
				sheet_y: 4,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F4BB",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f4bb.png",
				sheet_x: 46,
				sheet_y: 5,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F4BB",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f4bb.png",
				sheet_x: 46,
				sheet_y: 6,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F4BB",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f4bb.png",
				sheet_x: 46,
				sheet_y: 7,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Technologist",
		b: "1F9D1-200D-1F4BB",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			46,
			2
		],
		o: 12
	},
	outbox_tray: {
		a: "Outbox Tray",
		b: "1F4E4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"inbox",
			"email"
		],
		k: [
			27,
			1
		],
		o: 2
	},
	"male-technologist": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F4BB",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f4bb.png",
				sheet_x: 15,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F4BB",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f4bb.png",
				sheet_x: 15,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F4BB",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f4bb.png",
				sheet_x: 15,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F4BB",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f4bb.png",
				sheet_x: 15,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F4BB",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f4bb.png",
				sheet_x: 15,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Technologist",
		b: "1F468-200D-1F4BB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			15,
			38
		],
		o: 4
	},
	alarm_clock: {
		a: "Alarm Clock",
		b: "23F0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"wake"
		],
		k: [
			52,
			33
		],
		o: 2
	},
	"flag-kw": {
		a: "Kuwait Flag",
		b: "1F1F0-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			45
		],
		o: 2
	},
	two: {
		a: "Keycap 2",
		b: "0032-FE0F-20E3",
		c: "0032-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"numbers",
			"2",
			"prime",
			"blue-square"
		],
		k: [
			0,
			4
		],
		o: 0
	},
	anger: {
		a: "Anger Symbol",
		b: "1F4A2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"angry",
			"mad"
		],
		k: [
			25,
			44
		],
		o: 2
	},
	inbox_tray: {
		a: "Inbox Tray",
		b: "1F4E5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"documents"
		],
		k: [
			27,
			2
		],
		o: 2
	},
	three: {
		a: "Keycap 3",
		b: "0033-FE0F-20E3",
		c: "0033-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"3",
			"numbers",
			"prime",
			"blue-square"
		],
		k: [
			0,
			5
		],
		o: 0
	},
	"flag-ky": {
		a: "Cayman Islands Flag",
		b: "1F1F0-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			46
		],
		o: 2
	},
	stopwatch: {
		a: "Stopwatch",
		b: "23F1-FE0F",
		c: "23F1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"deadline"
		],
		k: [
			52,
			34
		],
		o: 2
	},
	"female-technologist": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F4BB",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f4bb.png",
				sheet_x: 18,
				sheet_y: 24,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F4BB",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f4bb.png",
				sheet_x: 18,
				sheet_y: 25,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F4BB",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f4bb.png",
				sheet_x: 18,
				sheet_y: 26,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F4BB",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f4bb.png",
				sheet_x: 18,
				sheet_y: 27,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F4BB",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f4bb.png",
				sheet_x: 18,
				sheet_y: 28,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Technologist",
		b: "1F469-200D-1F4BB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			18,
			23
		],
		o: 4
	},
	boom: {
		a: "Collision Symbol",
		b: "1F4A5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bomb",
			"explode",
			"explosion",
			"collision",
			"blown"
		],
		k: [
			25,
			47
		],
		n: [
			"collision"
		],
		o: 2
	},
	"flag-kz": {
		a: "Kazakhstan Flag",
		b: "1F1F0-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			47
		],
		o: 2
	},
	four: {
		a: "Keycap 4",
		b: "0034-FE0F-20E3",
		c: "0034-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"4",
			"numbers",
			"blue-square"
		],
		k: [
			0,
			6
		],
		o: 0
	},
	timer_clock: {
		a: "Timer Clock",
		b: "23F2-FE0F",
		c: "23F2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"alarm"
		],
		k: [
			52,
			35
		],
		o: 2
	},
	singer: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F3A4",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f3a4.png",
				sheet_x: 45,
				sheet_y: 36,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F3A4",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f3a4.png",
				sheet_x: 45,
				sheet_y: 37,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F3A4",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f3a4.png",
				sheet_x: 45,
				sheet_y: 38,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F3A4",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f3a4.png",
				sheet_x: 45,
				sheet_y: 39,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F3A4",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f3a4.png",
				sheet_x: 45,
				sheet_y: 40,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Singer",
		b: "1F9D1-200D-1F3A4",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			45,
			35
		],
		o: 12
	},
	"package": {
		a: "Package",
		b: "1F4E6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"mail",
			"gift",
			"cardboard",
			"box",
			"moving"
		],
		k: [
			27,
			3
		],
		o: 2
	},
	mailbox: {
		a: "Closed Mailbox with Raised Flag",
		b: "1F4EB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"inbox",
			"communication"
		],
		k: [
			27,
			8
		],
		o: 2
	},
	"flag-la": {
		a: "Laos Flag",
		b: "1F1F1-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			48
		],
		o: 2
	},
	dizzy: {
		a: "Dizzy Symbol",
		b: "1F4AB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"star",
			"sparkle",
			"shoot",
			"magic"
		],
		k: [
			26,
			1
		],
		o: 2
	},
	five: {
		a: "Keycap 5",
		b: "0035-FE0F-20E3",
		c: "0035-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"5",
			"numbers",
			"blue-square",
			"prime"
		],
		k: [
			0,
			7
		],
		o: 0
	},
	"male-singer": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F3A4",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f3a4.png",
				sheet_x: 15,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F3A4",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f3a4.png",
				sheet_x: 15,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F3A4",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f3a4.png",
				sheet_x: 15,
				sheet_y: 2,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F3A4",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f3a4.png",
				sheet_x: 15,
				sheet_y: 3,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F3A4",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f3a4.png",
				sheet_x: 15,
				sheet_y: 4,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Singer",
		b: "1F468-200D-1F3A4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			14,
			56
		],
		o: 4
	},
	mantelpiece_clock: {
		a: "Mantelpiece Clock",
		b: "1F570-FE0F",
		c: "1F570",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time"
		],
		k: [
			29,
			7
		],
		o: 2
	},
	"female-singer": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F3A4",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f3a4.png",
				sheet_x: 17,
				sheet_y: 47,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F3A4",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f3a4.png",
				sheet_x: 17,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F3A4",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f3a4.png",
				sheet_x: 17,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F3A4",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f3a4.png",
				sheet_x: 17,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F3A4",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f3a4.png",
				sheet_x: 17,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Singer",
		b: "1F469-200D-1F3A4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			17,
			46
		],
		o: 4
	},
	"flag-lb": {
		a: "Lebanon Flag",
		b: "1F1F1-1F1E7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			49
		],
		o: 2
	},
	six: {
		a: "Keycap 6",
		b: "0036-FE0F-20E3",
		c: "0036-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"6",
			"numbers",
			"blue-square"
		],
		k: [
			0,
			8
		],
		o: 0
	},
	mailbox_closed: {
		a: "Closed Mailbox with Lowered Flag",
		b: "1F4EA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"communication",
			"inbox"
		],
		k: [
			27,
			7
		],
		o: 2
	},
	sweat_drops: {
		a: "Splashing Sweat Symbol",
		b: "1F4A6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"water",
			"drip",
			"oops"
		],
		k: [
			25,
			48
		],
		o: 2
	},
	clock12: {
		a: "Clock Face Twelve Oclock",
		b: "1F55B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"noon",
			"midnight",
			"midday",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			50
		],
		o: 2
	},
	seven: {
		a: "Keycap 7",
		b: "0037-FE0F-20E3",
		c: "0037-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"7",
			"numbers",
			"blue-square",
			"prime"
		],
		k: [
			0,
			9
		],
		o: 0
	},
	mailbox_with_mail: {
		a: "Open Mailbox with Raised Flag",
		b: "1F4EC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"inbox",
			"communication"
		],
		k: [
			27,
			9
		],
		o: 2
	},
	clock1230: {
		a: "Clock Face Twelve-Thirty",
		b: "1F567",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			29,
			5
		],
		o: 2
	},
	dash: {
		a: "Dash Symbol",
		b: "1F4A8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"wind",
			"air",
			"fast",
			"shoo",
			"fart",
			"smoke",
			"puff"
		],
		k: [
			25,
			50
		],
		o: 2
	},
	artist: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F3A8",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f3a8.png",
				sheet_x: 45,
				sheet_y: 42,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F3A8",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f3a8.png",
				sheet_x: 45,
				sheet_y: 43,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F3A8",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f3a8.png",
				sheet_x: 45,
				sheet_y: 44,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F3A8",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f3a8.png",
				sheet_x: 45,
				sheet_y: 45,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F3A8",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f3a8.png",
				sheet_x: 45,
				sheet_y: 46,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Artist",
		b: "1F9D1-200D-1F3A8",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			45,
			41
		],
		o: 12
	},
	"flag-lc": {
		a: "St. Lucia Flag",
		b: "1F1F1-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			50
		],
		o: 2
	},
	hole: {
		a: "Hole",
		b: "1F573-FE0F",
		c: "1F573",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"embarrassing"
		],
		k: [
			29,
			8
		],
		o: 2
	},
	"male-artist": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F3A8",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f3a8.png",
				sheet_x: 15,
				sheet_y: 6,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F3A8",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f3a8.png",
				sheet_x: 15,
				sheet_y: 7,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F3A8",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f3a8.png",
				sheet_x: 15,
				sheet_y: 8,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F3A8",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f3a8.png",
				sheet_x: 15,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F3A8",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f3a8.png",
				sheet_x: 15,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Artist",
		b: "1F468-200D-1F3A8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			15,
			5
		],
		o: 4
	},
	clock1: {
		a: "Clock Face One Oclock",
		b: "1F550",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			39
		],
		o: 2
	},
	eight: {
		a: "Keycap 8",
		b: "0038-FE0F-20E3",
		c: "0038-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"8",
			"blue-square",
			"numbers"
		],
		k: [
			0,
			10
		],
		o: 0
	},
	mailbox_with_no_mail: {
		a: "Open Mailbox with Lowered Flag",
		b: "1F4ED",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"inbox"
		],
		k: [
			27,
			10
		],
		o: 2
	},
	"flag-li": {
		a: "Liechtenstein Flag",
		b: "1F1F1-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			51
		],
		o: 2
	},
	bomb: {
		a: "Bomb",
		b: "1F4A3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"boom",
			"explode",
			"explosion",
			"terrorism"
		],
		k: [
			25,
			45
		],
		o: 2
	},
	nine: {
		a: "Keycap 9",
		b: "0039-FE0F-20E3",
		c: "0039-20E3",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"blue-square",
			"numbers",
			"9"
		],
		k: [
			0,
			11
		],
		o: 0
	},
	postbox: {
		a: "Postbox",
		b: "1F4EE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"email",
			"letter",
			"envelope"
		],
		k: [
			27,
			11
		],
		o: 2
	},
	"female-artist": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F3A8",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f3a8.png",
				sheet_x: 17,
				sheet_y: 53,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F3A8",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f3a8.png",
				sheet_x: 17,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F3A8",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f3a8.png",
				sheet_x: 17,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F3A8",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f3a8.png",
				sheet_x: 17,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F3A8",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f3a8.png",
				sheet_x: 18,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Artist",
		b: "1F469-200D-1F3A8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			17,
			52
		],
		o: 4
	},
	clock130: {
		a: "Clock Face One-Thirty",
		b: "1F55C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			51
		],
		o: 2
	},
	"flag-lk": {
		a: "Sri Lanka Flag",
		b: "1F1F1-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			52
		],
		o: 2
	},
	ballot_box_with_ballot: {
		a: "Ballot Box with Ballot",
		b: "1F5F3-FE0F",
		c: "1F5F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			28
		],
		o: 2
	},
	pilot: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-2708-FE0F",
				non_qualified: "1F9D1-1F3FB-200D-2708",
				image: "1f9d1-1f3fb-200d-2708-fe0f.png",
				sheet_x: 48,
				sheet_y: 5,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-2708-FE0F",
				non_qualified: "1F9D1-1F3FC-200D-2708",
				image: "1f9d1-1f3fc-200d-2708-fe0f.png",
				sheet_x: 48,
				sheet_y: 6,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-2708-FE0F",
				non_qualified: "1F9D1-1F3FD-200D-2708",
				image: "1f9d1-1f3fd-200d-2708-fe0f.png",
				sheet_x: 48,
				sheet_y: 7,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-2708-FE0F",
				non_qualified: "1F9D1-1F3FE-200D-2708",
				image: "1f9d1-1f3fe-200d-2708-fe0f.png",
				sheet_x: 48,
				sheet_y: 8,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-2708-FE0F",
				non_qualified: "1F9D1-1F3FF-200D-2708",
				image: "1f9d1-1f3ff-200d-2708-fe0f.png",
				sheet_x: 48,
				sheet_y: 9,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Pilot",
		b: "1F9D1-200D-2708-FE0F",
		c: "1F9D1-200D-2708",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			48,
			4
		],
		o: 12
	},
	keycap_ten: {
		a: "Keycap Ten",
		b: "1F51F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"numbers",
			"10",
			"blue-square"
		],
		k: [
			28,
			2
		],
		o: 2
	},
	clock2: {
		a: "Clock Face Two Oclock",
		b: "1F551",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			40
		],
		o: 2
	},
	"flag-lr": {
		a: "Liberia Flag",
		b: "1F1F1-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			53
		],
		o: 2
	},
	speech_balloon: {
		a: "Speech Balloon",
		b: "1F4AC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bubble",
			"words",
			"message",
			"talk",
			"chatting"
		],
		k: [
			26,
			2
		],
		o: 2
	},
	"eye-in-speech-bubble": {
		a: "Eye in Speech Bubble",
		b: "1F441-FE0F-200D-1F5E8-FE0F",
		d: true,
		e: true,
		f: false,
		h: false,
		k: [
			12,
			37
		],
		o: 2
	},
	"flag-ls": {
		a: "Lesotho Flag",
		b: "1F1F1-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			54
		],
		o: 2
	},
	clock230: {
		a: "Clock Face Two-Thirty",
		b: "1F55D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			52
		],
		o: 2
	},
	"male-pilot": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-2708-FE0F",
				non_qualified: "1F468-1F3FB-200D-2708",
				image: "1f468-1f3fb-200d-2708-fe0f.png",
				sheet_x: 17,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-2708-FE0F",
				non_qualified: "1F468-1F3FC-200D-2708",
				image: "1f468-1f3fc-200d-2708-fe0f.png",
				sheet_x: 17,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-2708-FE0F",
				non_qualified: "1F468-1F3FD-200D-2708",
				image: "1f468-1f3fd-200d-2708-fe0f.png",
				sheet_x: 17,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-2708-FE0F",
				non_qualified: "1F468-1F3FE-200D-2708",
				image: "1f468-1f3fe-200d-2708-fe0f.png",
				sheet_x: 17,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-2708-FE0F",
				non_qualified: "1F468-1F3FF-200D-2708",
				image: "1f468-1f3ff-200d-2708-fe0f.png",
				sheet_x: 17,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Pilot",
		b: "1F468-200D-2708-FE0F",
		c: "1F468-200D-2708",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			17,
			14
		],
		o: 4
	},
	capital_abcd: {
		a: "Input Symbol for Latin Capital Letters",
		b: "1F520",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"alphabet",
			"words",
			"blue-square"
		],
		k: [
			28,
			3
		],
		o: 2
	},
	pencil2: {
		a: "Pencil",
		b: "270F-FE0F",
		c: "270F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stationery",
			"write",
			"paper",
			"writing",
			"school",
			"study"
		],
		k: [
			55,
			10
		],
		o: 2
	},
	"female-pilot": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-2708-FE0F",
				non_qualified: "1F469-1F3FB-200D-2708",
				image: "1f469-1f3fb-200d-2708-fe0f.png",
				sheet_x: 20,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-2708-FE0F",
				non_qualified: "1F469-1F3FC-200D-2708",
				image: "1f469-1f3fc-200d-2708-fe0f.png",
				sheet_x: 20,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-2708-FE0F",
				non_qualified: "1F469-1F3FD-200D-2708",
				image: "1f469-1f3fd-200d-2708-fe0f.png",
				sheet_x: 20,
				sheet_y: 2,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-2708-FE0F",
				non_qualified: "1F469-1F3FE-200D-2708",
				image: "1f469-1f3fe-200d-2708-fe0f.png",
				sheet_x: 20,
				sheet_y: 3,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-2708-FE0F",
				non_qualified: "1F469-1F3FF-200D-2708",
				image: "1f469-1f3ff-200d-2708-fe0f.png",
				sheet_x: 20,
				sheet_y: 4,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Pilot",
		b: "1F469-200D-2708-FE0F",
		c: "1F469-200D-2708",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			56
		],
		o: 4
	},
	black_nib: {
		a: "Black Nib",
		b: "2712-FE0F",
		c: "2712",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"pen",
			"stationery",
			"writing",
			"write"
		],
		k: [
			55,
			11
		],
		o: 2
	},
	left_speech_bubble: {
		a: "Left Speech Bubble",
		b: "1F5E8-FE0F",
		c: "1F5E8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"words",
			"message",
			"talk",
			"chatting"
		],
		k: [
			30,
			26
		],
		o: 2
	},
	clock3: {
		a: "Clock Face Three Oclock",
		b: "1F552",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			41
		],
		o: 2
	},
	abcd: {
		a: "Input Symbol for Latin Small Letters",
		b: "1F521",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"alphabet"
		],
		k: [
			28,
			4
		],
		o: 2
	},
	"flag-lt": {
		a: "Lithuania Flag",
		b: "1F1F1-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			55
		],
		o: 2
	},
	clock330: {
		a: "Clock Face Three-Thirty",
		b: "1F55E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			53
		],
		o: 2
	},
	astronaut: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F680",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f680.png",
				sheet_x: 46,
				sheet_y: 27,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F680",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f680.png",
				sheet_x: 46,
				sheet_y: 28,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F680",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f680.png",
				sheet_x: 46,
				sheet_y: 29,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F680",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f680.png",
				sheet_x: 46,
				sheet_y: 30,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F680",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f680.png",
				sheet_x: 46,
				sheet_y: 31,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Astronaut",
		b: "1F9D1-200D-1F680",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			46,
			26
		],
		o: 12
	},
	"flag-lu": {
		a: "Luxembourg Flag",
		b: "1F1F1-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			2,
			56
		],
		o: 2
	},
	right_anger_bubble: {
		a: "Right Anger Bubble",
		b: "1F5EF-FE0F",
		c: "1F5EF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"caption",
			"speech",
			"thinking",
			"mad"
		],
		k: [
			30,
			27
		],
		o: 2
	},
	lower_left_fountain_pen: {
		a: "Lower Left Fountain Pen",
		b: "1F58B-FE0F",
		c: "1F58B",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			29,
			45
		],
		o: 2
	},
	"male-astronaut": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F680",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f680.png",
				sheet_x: 16,
				sheet_y: 6,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F680",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f680.png",
				sheet_x: 16,
				sheet_y: 7,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F680",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f680.png",
				sheet_x: 16,
				sheet_y: 8,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F680",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f680.png",
				sheet_x: 16,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F680",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f680.png",
				sheet_x: 16,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Astronaut",
		b: "1F468-200D-1F680",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			5
		],
		o: 4
	},
	thought_balloon: {
		a: "Thought Balloon",
		b: "1F4AD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bubble",
			"cloud",
			"speech",
			"thinking",
			"dream"
		],
		k: [
			26,
			3
		],
		o: 2
	},
	symbols: {
		a: "Input Symbol for Symbols",
		b: "1F523",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"music",
			"note",
			"ampersand",
			"percent",
			"glyphs",
			"characters"
		],
		k: [
			28,
			6
		],
		o: 2
	},
	clock4: {
		a: "Clock Face Four Oclock",
		b: "1F553",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			42
		],
		o: 2
	},
	"flag-lv": {
		a: "Latvia Flag",
		b: "1F1F1-1F1FB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			0
		],
		o: 2
	},
	lower_left_ballpoint_pen: {
		a: "Lower Left Ballpoint Pen",
		b: "1F58A-FE0F",
		c: "1F58A",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			29,
			44
		],
		o: 2
	},
	abc: {
		a: "Input Symbol for Latin Letters",
		b: "1F524",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"alphabet"
		],
		k: [
			28,
			7
		],
		o: 2
	},
	zzz: {
		a: "Sleeping Symbol",
		b: "1F4A4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sleepy",
			"tired",
			"dream"
		],
		k: [
			25,
			46
		],
		o: 2
	},
	lower_left_paintbrush: {
		a: "Lower Left Paintbrush",
		b: "1F58C-FE0F",
		c: "1F58C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			29,
			46
		],
		o: 2
	},
	"female-astronaut": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F680",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f680.png",
				sheet_x: 18,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F680",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f680.png",
				sheet_x: 18,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F680",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f680.png",
				sheet_x: 18,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F680",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f680.png",
				sheet_x: 18,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F680",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f680.png",
				sheet_x: 18,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Astronaut",
		b: "1F469-200D-1F680",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			18,
			47
		],
		o: 4
	},
	"flag-ly": {
		a: "Libya Flag",
		b: "1F1F1-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			1
		],
		o: 2
	},
	clock430: {
		a: "Clock Face Four-Thirty",
		b: "1F55F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			54
		],
		o: 2
	},
	"flag-ma": {
		a: "Morocco Flag",
		b: "1F1F2-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			2
		],
		o: 2
	},
	a: {
		a: "Negative Squared Latin Capital Letter a",
		b: "1F170-FE0F",
		c: "1F170",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"red-square",
			"alphabet",
			"letter"
		],
		k: [
			0,
			16
		],
		o: 2
	},
	clock5: {
		a: "Clock Face Five Oclock",
		b: "1F554",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			43
		],
		o: 2
	},
	lower_left_crayon: {
		a: "Lower Left Crayon",
		b: "1F58D-FE0F",
		c: "1F58D",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			29,
			47
		],
		o: 2
	},
	firefighter: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F692",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f692.png",
				sheet_x: 46,
				sheet_y: 33,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F692",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f692.png",
				sheet_x: 46,
				sheet_y: 34,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F692",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f692.png",
				sheet_x: 46,
				sheet_y: 35,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F692",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f692.png",
				sheet_x: 46,
				sheet_y: 36,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F692",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f692.png",
				sheet_x: 46,
				sheet_y: 37,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Firefighter",
		b: "1F9D1-200D-1F692",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			46,
			32
		],
		o: 12
	},
	"male-firefighter": {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F692",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f692.png",
				sheet_x: 16,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F692",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f692.png",
				sheet_x: 16,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F692",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f692.png",
				sheet_x: 16,
				sheet_y: 14,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F692",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f692.png",
				sheet_x: 16,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F692",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f692.png",
				sheet_x: 16,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Firefighter",
		b: "1F468-200D-1F692",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			11
		],
		o: 4
	},
	memo: {
		a: "Memo",
		b: "1F4DD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"write",
			"documents",
			"stationery",
			"pencil",
			"paper",
			"writing",
			"legal",
			"exam",
			"quiz",
			"test",
			"study",
			"compose"
		],
		k: [
			26,
			51
		],
		n: [
			"pencil"
		],
		o: 2
	},
	ab: {
		a: "Negative Squared Ab",
		b: "1F18E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"red-square",
			"alphabet"
		],
		k: [
			0,
			20
		],
		o: 2
	},
	"flag-mc": {
		a: "Monaco Flag",
		b: "1F1F2-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			3
		],
		o: 2
	},
	clock530: {
		a: "Clock Face Five-Thirty",
		b: "1F560",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			55
		],
		o: 2
	},
	briefcase: {
		a: "Briefcase",
		b: "1F4BC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"business",
			"documents",
			"work",
			"law",
			"legal",
			"job",
			"career"
		],
		k: [
			26,
			18
		],
		o: 2
	},
	"female-firefighter": {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F692",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f692.png",
				sheet_x: 18,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F692",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f692.png",
				sheet_x: 18,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F692",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f692.png",
				sheet_x: 18,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F692",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f692.png",
				sheet_x: 19,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F692",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f692.png",
				sheet_x: 19,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Firefighter",
		b: "1F469-200D-1F692",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			18,
			53
		],
		o: 4
	},
	clock6: {
		a: "Clock Face Six Oclock",
		b: "1F555",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule",
			"dawn",
			"dusk"
		],
		k: [
			28,
			44
		],
		o: 2
	},
	b: {
		a: "Negative Squared Latin Capital Letter B",
		b: "1F171-FE0F",
		c: "1F171",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"red-square",
			"alphabet",
			"letter"
		],
		k: [
			0,
			17
		],
		o: 2
	},
	"flag-md": {
		a: "Moldova Flag",
		b: "1F1F2-1F1E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			4
		],
		o: 2
	},
	clock630: {
		a: "Clock Face Six-Thirty",
		b: "1F561",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			56
		],
		o: 2
	},
	cl: {
		a: "Squared Cl",
		b: "1F191",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"alphabet",
			"words",
			"red-square"
		],
		k: [
			0,
			21
		],
		o: 2
	},
	"flag-me": {
		a: "Montenegro Flag",
		b: "1F1F2-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			5
		],
		o: 2
	},
	file_folder: {
		a: "File Folder",
		b: "1F4C1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"documents",
			"business",
			"office"
		],
		k: [
			26,
			23
		],
		o: 2
	},
	cop: {
		skin_variations: {
			"1F3FB": {
				unified: "1F46E-1F3FB",
				non_qualified: null,
				image: "1f46e-1f3fb.png",
				sheet_x: 21,
				sheet_y: 50,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F46E-1F3FC",
				non_qualified: null,
				image: "1f46e-1f3fc.png",
				sheet_x: 21,
				sheet_y: 51,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F46E-1F3FD",
				non_qualified: null,
				image: "1f46e-1f3fd.png",
				sheet_x: 21,
				sheet_y: 52,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F46E-1F3FE",
				non_qualified: null,
				image: "1f46e-1f3fe.png",
				sheet_x: 21,
				sheet_y: 53,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F46E-1F3FF",
				non_qualified: null,
				image: "1f46e-1f3ff.png",
				sheet_x: 21,
				sheet_y: 54,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F46E-200D-2642-FE0F",
		a: "Police Officer",
		b: "1F46E",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			21,
			49
		],
		o: 2
	},
	"male-police-officer": {
		skin_variations: {
			"1F3FB": {
				unified: "1F46E-1F3FB-200D-2642-FE0F",
				non_qualified: "1F46E-1F3FB-200D-2642",
				image: "1f46e-1f3fb-200d-2642-fe0f.png",
				sheet_x: 21,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F46E-1F3FC-200D-2642-FE0F",
				non_qualified: "1F46E-1F3FC-200D-2642",
				image: "1f46e-1f3fc-200d-2642-fe0f.png",
				sheet_x: 21,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F46E-1F3FD-200D-2642-FE0F",
				non_qualified: "1F46E-1F3FD-200D-2642",
				image: "1f46e-1f3fd-200d-2642-fe0f.png",
				sheet_x: 21,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F46E-1F3FE-200D-2642-FE0F",
				non_qualified: "1F46E-1F3FE-200D-2642",
				image: "1f46e-1f3fe-200d-2642-fe0f.png",
				sheet_x: 21,
				sheet_y: 47,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F46E-1F3FF-200D-2642-FE0F",
				non_qualified: "1F46E-1F3FF-200D-2642",
				image: "1f46e-1f3ff-200d-2642-fe0f.png",
				sheet_x: 21,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F46E",
		a: "Male Police Officer",
		b: "1F46E-200D-2642-FE0F",
		c: "1F46E-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			21,
			43
		],
		o: 4
	},
	cool: {
		a: "Squared Cool",
		b: "1F192",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"words",
			"blue-square"
		],
		k: [
			0,
			22
		],
		o: 2
	},
	clock7: {
		a: "Clock Face Seven Oclock",
		b: "1F556",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			45
		],
		o: 2
	},
	"flag-mf": {
		a: "St. Martin Flag",
		b: "1F1F2-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			6
		],
		o: 2
	},
	open_file_folder: {
		a: "Open File Folder",
		b: "1F4C2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"documents",
			"load"
		],
		k: [
			26,
			24
		],
		o: 2
	},
	card_index_dividers: {
		a: "Card Index Dividers",
		b: "1F5C2-FE0F",
		c: "1F5C2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"organizing",
			"business",
			"stationery"
		],
		k: [
			30,
			15
		],
		o: 2
	},
	"flag-mg": {
		a: "Madagascar Flag",
		b: "1F1F2-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			7
		],
		o: 2
	},
	free: {
		a: "Squared Free",
		b: "1F193",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"words"
		],
		k: [
			0,
			23
		],
		o: 2
	},
	"female-police-officer": {
		skin_variations: {
			"1F3FB": {
				unified: "1F46E-1F3FB-200D-2640-FE0F",
				non_qualified: "1F46E-1F3FB-200D-2640",
				image: "1f46e-1f3fb-200d-2640-fe0f.png",
				sheet_x: 21,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F46E-1F3FC-200D-2640-FE0F",
				non_qualified: "1F46E-1F3FC-200D-2640",
				image: "1f46e-1f3fc-200d-2640-fe0f.png",
				sheet_x: 21,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F46E-1F3FD-200D-2640-FE0F",
				non_qualified: "1F46E-1F3FD-200D-2640",
				image: "1f46e-1f3fd-200d-2640-fe0f.png",
				sheet_x: 21,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F46E-1F3FE-200D-2640-FE0F",
				non_qualified: "1F46E-1F3FE-200D-2640",
				image: "1f46e-1f3fe-200d-2640-fe0f.png",
				sheet_x: 21,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F46E-1F3FF-200D-2640-FE0F",
				non_qualified: "1F46E-1F3FF-200D-2640",
				image: "1f46e-1f3ff-200d-2640-fe0f.png",
				sheet_x: 21,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Police Officer",
		b: "1F46E-200D-2640-FE0F",
		c: "1F46E-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			21,
			37
		],
		o: 4
	},
	clock730: {
		a: "Clock Face Seven-Thirty",
		b: "1F562",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			29,
			0
		],
		o: 2
	},
	date: {
		a: "Calendar",
		b: "1F4C5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"calendar",
			"schedule"
		],
		k: [
			26,
			27
		],
		o: 2
	},
	clock8: {
		a: "Clock Face Eight Oclock",
		b: "1F557",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			46
		],
		o: 2
	},
	information_source: {
		a: "Information Source",
		b: "2139-FE0F",
		c: "2139",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"alphabet",
			"letter"
		],
		k: [
			52,
			13
		],
		o: 2
	},
	sleuth_or_spy: {
		skin_variations: {
			"1F3FB": {
				unified: "1F575-1F3FB",
				non_qualified: null,
				image: "1f575-1f3fb.png",
				sheet_x: 29,
				sheet_y: 28,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F575-1F3FC",
				non_qualified: null,
				image: "1f575-1f3fc.png",
				sheet_x: 29,
				sheet_y: 29,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F575-1F3FD",
				non_qualified: null,
				image: "1f575-1f3fd.png",
				sheet_x: 29,
				sheet_y: 30,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F575-1F3FE",
				non_qualified: null,
				image: "1f575-1f3fe.png",
				sheet_x: 29,
				sheet_y: 31,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F575-1F3FF",
				non_qualified: null,
				image: "1f575-1f3ff.png",
				sheet_x: 29,
				sheet_y: 32,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F575-FE0F-200D-2642-FE0F",
		a: "Sleuth or Spy",
		b: "1F575-FE0F",
		c: "1F575",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			29,
			27
		],
		o: 2
	},
	"flag-mh": {
		a: "Marshall Islands Flag",
		b: "1F1F2-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			8
		],
		o: 2
	},
	clock830: {
		a: "Clock Face Eight-Thirty",
		b: "1F563",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			29,
			1
		],
		o: 2
	},
	calendar: {
		a: "Tear-off Calendar",
		b: "1F4C6",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"schedule",
			"date",
			"planning"
		],
		k: [
			26,
			28
		],
		o: 2
	},
	"male-detective": {
		skin_variations: {
			"1F3FB": {
				unified: "1F575-1F3FB-200D-2642-FE0F",
				non_qualified: "1F575-1F3FB-200D-2642",
				image: "1f575-1f3fb-200d-2642-fe0f.png",
				sheet_x: 29,
				sheet_y: 22,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F575-1F3FC-200D-2642-FE0F",
				non_qualified: "1F575-1F3FC-200D-2642",
				image: "1f575-1f3fc-200d-2642-fe0f.png",
				sheet_x: 29,
				sheet_y: 23,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F575-1F3FD-200D-2642-FE0F",
				non_qualified: "1F575-1F3FD-200D-2642",
				image: "1f575-1f3fd-200d-2642-fe0f.png",
				sheet_x: 29,
				sheet_y: 24,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F575-1F3FE-200D-2642-FE0F",
				non_qualified: "1F575-1F3FE-200D-2642",
				image: "1f575-1f3fe-200d-2642-fe0f.png",
				sheet_x: 29,
				sheet_y: 25,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F575-1F3FF-200D-2642-FE0F",
				non_qualified: "1F575-1F3FF-200D-2642",
				image: "1f575-1f3ff-200d-2642-fe0f.png",
				sheet_x: 29,
				sheet_y: 26,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F575-FE0F",
		a: "Male Detective",
		b: "1F575-FE0F-200D-2642-FE0F",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			29,
			21
		],
		o: 4
	},
	"flag-mk": {
		a: "North Macedonia Flag",
		b: "1F1F2-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			9
		],
		o: 2
	},
	id: {
		a: "Squared Id",
		b: "1F194",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"purple-square",
			"words"
		],
		k: [
			0,
			24
		],
		o: 2
	},
	spiral_note_pad: {
		a: "Spiral Note Pad",
		b: "1F5D2-FE0F",
		c: "1F5D2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			19
		],
		o: 2
	},
	"female-detective": {
		skin_variations: {
			"1F3FB": {
				unified: "1F575-1F3FB-200D-2640-FE0F",
				non_qualified: "1F575-1F3FB-200D-2640",
				image: "1f575-1f3fb-200d-2640-fe0f.png",
				sheet_x: 29,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F575-1F3FC-200D-2640-FE0F",
				non_qualified: "1F575-1F3FC-200D-2640",
				image: "1f575-1f3fc-200d-2640-fe0f.png",
				sheet_x: 29,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F575-1F3FD-200D-2640-FE0F",
				non_qualified: "1F575-1F3FD-200D-2640",
				image: "1f575-1f3fd-200d-2640-fe0f.png",
				sheet_x: 29,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F575-1F3FE-200D-2640-FE0F",
				non_qualified: "1F575-1F3FE-200D-2640",
				image: "1f575-1f3fe-200d-2640-fe0f.png",
				sheet_x: 29,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F575-1F3FF-200D-2640-FE0F",
				non_qualified: "1F575-1F3FF-200D-2640",
				image: "1f575-1f3ff-200d-2640-fe0f.png",
				sheet_x: 29,
				sheet_y: 20,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Detective",
		b: "1F575-FE0F-200D-2640-FE0F",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			29,
			15
		],
		o: 4
	},
	clock9: {
		a: "Clock Face Nine Oclock",
		b: "1F558",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			47
		],
		o: 2
	},
	"flag-ml": {
		a: "Mali Flag",
		b: "1F1F2-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			10
		],
		o: 2
	},
	m: {
		a: "Circled Latin Capital Letter M",
		b: "24C2-FE0F",
		c: "24C2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"alphabet",
			"blue-circle",
			"letter"
		],
		k: [
			52,
			40
		],
		o: 2
	},
	"flag-mm": {
		a: "Myanmar (burma) Flag",
		b: "1F1F2-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			11
		],
		o: 2
	},
	clock930: {
		a: "Clock Face Nine-Thirty",
		b: "1F564",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			29,
			2
		],
		o: 2
	},
	guardsman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F482-1F3FB",
				non_qualified: null,
				image: "1f482-1f3fb.png",
				sheet_x: 24,
				sheet_y: 21,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F482-1F3FC",
				non_qualified: null,
				image: "1f482-1f3fc.png",
				sheet_x: 24,
				sheet_y: 22,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F482-1F3FD",
				non_qualified: null,
				image: "1f482-1f3fd.png",
				sheet_x: 24,
				sheet_y: 23,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F482-1F3FE",
				non_qualified: null,
				image: "1f482-1f3fe.png",
				sheet_x: 24,
				sheet_y: 24,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F482-1F3FF",
				non_qualified: null,
				image: "1f482-1f3ff.png",
				sheet_x: 24,
				sheet_y: 25,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F482-200D-2642-FE0F",
		a: "Guardsman",
		b: "1F482",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"uk",
			"gb",
			"british",
			"male",
			"guy",
			"royal"
		],
		k: [
			24,
			20
		],
		o: 2
	},
	"new": {
		a: "Squared New",
		b: "1F195",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"words",
			"start"
		],
		k: [
			0,
			25
		],
		o: 2
	},
	spiral_calendar_pad: {
		a: "Spiral Calendar Pad",
		b: "1F5D3-FE0F",
		c: "1F5D3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			20
		],
		o: 2
	},
	ng: {
		a: "Squared Ng",
		b: "1F196",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"words",
			"shape",
			"icon"
		],
		k: [
			0,
			26
		],
		o: 2
	},
	card_index: {
		a: "Card Index",
		b: "1F4C7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"business",
			"stationery"
		],
		k: [
			26,
			29
		],
		o: 2
	},
	clock10: {
		a: "Clock Face Ten Oclock",
		b: "1F559",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			48
		],
		o: 2
	},
	"flag-mn": {
		a: "Mongolia Flag",
		b: "1F1F2-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			12
		],
		o: 2
	},
	"male-guard": {
		skin_variations: {
			"1F3FB": {
				unified: "1F482-1F3FB-200D-2642-FE0F",
				non_qualified: "1F482-1F3FB-200D-2642",
				image: "1f482-1f3fb-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F482-1F3FC-200D-2642-FE0F",
				non_qualified: "1F482-1F3FC-200D-2642",
				image: "1f482-1f3fc-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F482-1F3FD-200D-2642-FE0F",
				non_qualified: "1F482-1F3FD-200D-2642",
				image: "1f482-1f3fd-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F482-1F3FE-200D-2642-FE0F",
				non_qualified: "1F482-1F3FE-200D-2642",
				image: "1f482-1f3fe-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F482-1F3FF-200D-2642-FE0F",
				non_qualified: "1F482-1F3FF-200D-2642",
				image: "1f482-1f3ff-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F482",
		a: "Male Guard",
		b: "1F482-200D-2642-FE0F",
		c: "1F482-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			24,
			14
		],
		o: 4
	},
	"flag-mo": {
		a: "Macao Sar China Flag",
		b: "1F1F2-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			13
		],
		o: 2
	},
	clock1030: {
		a: "Clock Face Ten-Thirty",
		b: "1F565",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			29,
			3
		],
		o: 2
	},
	chart_with_upwards_trend: {
		a: "Chart with Upwards Trend",
		b: "1F4C8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"graph",
			"presentation",
			"stats",
			"recovery",
			"business",
			"economics",
			"money",
			"sales",
			"good",
			"success"
		],
		k: [
			26,
			30
		],
		o: 2
	},
	o2: {
		a: "Negative Squared Latin Capital Letter O",
		b: "1F17E-FE0F",
		c: "1F17E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"alphabet",
			"red-square",
			"letter"
		],
		k: [
			0,
			18
		],
		o: 2
	},
	"female-guard": {
		skin_variations: {
			"1F3FB": {
				unified: "1F482-1F3FB-200D-2640-FE0F",
				non_qualified: "1F482-1F3FB-200D-2640",
				image: "1f482-1f3fb-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F482-1F3FC-200D-2640-FE0F",
				non_qualified: "1F482-1F3FC-200D-2640",
				image: "1f482-1f3fc-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F482-1F3FD-200D-2640-FE0F",
				non_qualified: "1F482-1F3FD-200D-2640",
				image: "1f482-1f3fd-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F482-1F3FE-200D-2640-FE0F",
				non_qualified: "1F482-1F3FE-200D-2640",
				image: "1f482-1f3fe-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F482-1F3FF-200D-2640-FE0F",
				non_qualified: "1F482-1F3FF-200D-2640",
				image: "1f482-1f3ff-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Guard",
		b: "1F482-200D-2640-FE0F",
		c: "1F482-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			24,
			8
		],
		o: 4
	},
	chart_with_downwards_trend: {
		a: "Chart with Downwards Trend",
		b: "1F4C9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"graph",
			"presentation",
			"stats",
			"recession",
			"business",
			"economics",
			"money",
			"sales",
			"bad",
			"failure"
		],
		k: [
			26,
			31
		],
		o: 2
	},
	"flag-mp": {
		a: "Northern Mariana Islands Flag",
		b: "1F1F2-1F1F5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			14
		],
		o: 2
	},
	ok: {
		a: "Squared Ok",
		b: "1F197",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"good",
			"agree",
			"yes",
			"blue-square"
		],
		k: [
			0,
			27
		],
		o: 2
	},
	clock11: {
		a: "Clock Face Eleven Oclock",
		b: "1F55A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			28,
			49
		],
		o: 2
	},
	construction_worker: {
		skin_variations: {
			"1F3FB": {
				unified: "1F477-1F3FB",
				non_qualified: null,
				image: "1f477-1f3fb.png",
				sheet_x: 23,
				sheet_y: 23,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F477-1F3FC",
				non_qualified: null,
				image: "1f477-1f3fc.png",
				sheet_x: 23,
				sheet_y: 24,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F477-1F3FD",
				non_qualified: null,
				image: "1f477-1f3fd.png",
				sheet_x: 23,
				sheet_y: 25,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F477-1F3FE",
				non_qualified: null,
				image: "1f477-1f3fe.png",
				sheet_x: 23,
				sheet_y: 26,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F477-1F3FF",
				non_qualified: null,
				image: "1f477-1f3ff.png",
				sheet_x: 23,
				sheet_y: 27,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F477-200D-2642-FE0F",
		a: "Construction Worker",
		b: "1F477",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			23,
			22
		],
		o: 2
	},
	"male-construction-worker": {
		skin_variations: {
			"1F3FB": {
				unified: "1F477-1F3FB-200D-2642-FE0F",
				non_qualified: "1F477-1F3FB-200D-2642",
				image: "1f477-1f3fb-200d-2642-fe0f.png",
				sheet_x: 23,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F477-1F3FC-200D-2642-FE0F",
				non_qualified: "1F477-1F3FC-200D-2642",
				image: "1f477-1f3fc-200d-2642-fe0f.png",
				sheet_x: 23,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F477-1F3FD-200D-2642-FE0F",
				non_qualified: "1F477-1F3FD-200D-2642",
				image: "1f477-1f3fd-200d-2642-fe0f.png",
				sheet_x: 23,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F477-1F3FE-200D-2642-FE0F",
				non_qualified: "1F477-1F3FE-200D-2642",
				image: "1f477-1f3fe-200d-2642-fe0f.png",
				sheet_x: 23,
				sheet_y: 20,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F477-1F3FF-200D-2642-FE0F",
				non_qualified: "1F477-1F3FF-200D-2642",
				image: "1f477-1f3ff-200d-2642-fe0f.png",
				sheet_x: 23,
				sheet_y: 21,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F477",
		a: "Male Construction Worker",
		b: "1F477-200D-2642-FE0F",
		c: "1F477-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			23,
			16
		],
		o: 4
	},
	clock1130: {
		a: "Clock Face Eleven-Thirty",
		b: "1F566",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"time",
			"late",
			"early",
			"schedule"
		],
		k: [
			29,
			4
		],
		o: 2
	},
	"flag-mq": {
		a: "Martinique Flag",
		b: "1F1F2-1F1F6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			15
		],
		o: 2
	},
	bar_chart: {
		a: "Bar Chart",
		b: "1F4CA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"graph",
			"presentation",
			"stats"
		],
		k: [
			26,
			32
		],
		o: 2
	},
	parking: {
		a: "Negative Squared Latin Capital Letter P",
		b: "1F17F-FE0F",
		c: "1F17F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cars",
			"blue-square",
			"alphabet",
			"letter"
		],
		k: [
			0,
			19
		],
		o: 2
	},
	new_moon: {
		a: "New Moon Symbol",
		b: "1F311",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			36
		],
		o: 2
	},
	"female-construction-worker": {
		skin_variations: {
			"1F3FB": {
				unified: "1F477-1F3FB-200D-2640-FE0F",
				non_qualified: "1F477-1F3FB-200D-2640",
				image: "1f477-1f3fb-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F477-1F3FC-200D-2640-FE0F",
				non_qualified: "1F477-1F3FC-200D-2640",
				image: "1f477-1f3fc-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F477-1F3FD-200D-2640-FE0F",
				non_qualified: "1F477-1F3FD-200D-2640",
				image: "1f477-1f3fd-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F477-1F3FE-200D-2640-FE0F",
				non_qualified: "1F477-1F3FE-200D-2640",
				image: "1f477-1f3fe-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 14,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F477-1F3FF-200D-2640-FE0F",
				non_qualified: "1F477-1F3FF-200D-2640",
				image: "1f477-1f3ff-200d-2640-fe0f.png",
				sheet_x: 23,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Construction Worker",
		b: "1F477-200D-2640-FE0F",
		c: "1F477-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			23,
			10
		],
		o: 4
	},
	sos: {
		a: "Squared Sos",
		b: "1F198",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"help",
			"red-square",
			"words",
			"emergency",
			"911"
		],
		k: [
			0,
			28
		],
		o: 2
	},
	clipboard: {
		a: "Clipboard",
		b: "1F4CB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stationery",
			"documents"
		],
		k: [
			26,
			33
		],
		o: 2
	},
	"flag-mr": {
		a: "Mauritania Flag",
		b: "1F1F2-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			16
		],
		o: 2
	},
	prince: {
		skin_variations: {
			"1F3FB": {
				unified: "1F934-1F3FB",
				non_qualified: null,
				image: "1f934-1f3fb.png",
				sheet_x: 39,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F934-1F3FC",
				non_qualified: null,
				image: "1f934-1f3fc.png",
				sheet_x: 39,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F934-1F3FD",
				non_qualified: null,
				image: "1f934-1f3fd.png",
				sheet_x: 39,
				sheet_y: 20,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F934-1F3FE",
				non_qualified: null,
				image: "1f934-1f3fe.png",
				sheet_x: 39,
				sheet_y: 21,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F934-1F3FF",
				non_qualified: null,
				image: "1f934-1f3ff.png",
				sheet_x: 39,
				sheet_y: 22,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Prince",
		b: "1F934",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"boy",
			"man",
			"male",
			"crown",
			"royal",
			"king"
		],
		k: [
			39,
			17
		],
		o: 4
	},
	waxing_crescent_moon: {
		a: "Waxing Crescent Moon Symbol",
		b: "1F312",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			37
		],
		o: 2
	},
	"flag-ms": {
		a: "Montserrat Flag",
		b: "1F1F2-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			17
		],
		o: 2
	},
	pushpin: {
		a: "Pushpin",
		b: "1F4CC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stationery",
			"mark",
			"here"
		],
		k: [
			26,
			34
		],
		o: 2
	},
	up: {
		a: "Squared Up with Exclamation Mark",
		b: "1F199",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"above",
			"high"
		],
		k: [
			0,
			29
		],
		o: 2
	},
	"flag-mt": {
		a: "Malta Flag",
		b: "1F1F2-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			18
		],
		o: 2
	},
	princess: {
		skin_variations: {
			"1F3FB": {
				unified: "1F478-1F3FB",
				non_qualified: null,
				image: "1f478-1f3fb.png",
				sheet_x: 23,
				sheet_y: 29,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F478-1F3FC",
				non_qualified: null,
				image: "1f478-1f3fc.png",
				sheet_x: 23,
				sheet_y: 30,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F478-1F3FD",
				non_qualified: null,
				image: "1f478-1f3fd.png",
				sheet_x: 23,
				sheet_y: 31,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F478-1F3FE",
				non_qualified: null,
				image: "1f478-1f3fe.png",
				sheet_x: 23,
				sheet_y: 32,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F478-1F3FF",
				non_qualified: null,
				image: "1f478-1f3ff.png",
				sheet_x: 23,
				sheet_y: 33,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Princess",
		b: "1F478",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"girl",
			"woman",
			"female",
			"blond",
			"crown",
			"royal",
			"queen"
		],
		k: [
			23,
			28
		],
		o: 2
	},
	round_pushpin: {
		a: "Round Pushpin",
		b: "1F4CD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stationery",
			"location",
			"map",
			"here"
		],
		k: [
			26,
			35
		],
		o: 2
	},
	first_quarter_moon: {
		a: "First Quarter Moon Symbol",
		b: "1F313",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			38
		],
		o: 2
	},
	vs: {
		a: "Squared Vs",
		b: "1F19A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"words",
			"orange-square"
		],
		k: [
			0,
			30
		],
		o: 2
	},
	"flag-mu": {
		a: "Mauritius Flag",
		b: "1F1F2-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			19
		],
		o: 2
	},
	koko: {
		a: "Squared Katakana Koko",
		b: "1F201",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"blue-square",
			"here",
			"katakana",
			"japanese",
			"destination"
		],
		k: [
			5,
			4
		],
		o: 2
	},
	man_with_turban: {
		skin_variations: {
			"1F3FB": {
				unified: "1F473-1F3FB",
				non_qualified: null,
				image: "1f473-1f3fb.png",
				sheet_x: 22,
				sheet_y: 44,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F473-1F3FC",
				non_qualified: null,
				image: "1f473-1f3fc.png",
				sheet_x: 22,
				sheet_y: 45,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F473-1F3FD",
				non_qualified: null,
				image: "1f473-1f3fd.png",
				sheet_x: 22,
				sheet_y: 46,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F473-1F3FE",
				non_qualified: null,
				image: "1f473-1f3fe.png",
				sheet_x: 22,
				sheet_y: 47,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F473-1F3FF",
				non_qualified: null,
				image: "1f473-1f3ff.png",
				sheet_x: 22,
				sheet_y: 48,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F473-200D-2642-FE0F",
		a: "Man with Turban",
		b: "1F473",
		d: true,
		e: true,
		f: true,
		h: false,
		j: [
			"male",
			"indian",
			"hinduism",
			"arabs"
		],
		k: [
			22,
			43
		],
		o: 2
	},
	moon: {
		a: "Waxing Gibbous Moon Symbol",
		b: "1F314",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			39
		],
		n: [
			"waxing_gibbous_moon"
		],
		o: 2
	},
	paperclip: {
		a: "Paperclip",
		b: "1F4CE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"documents",
			"stationery"
		],
		k: [
			26,
			36
		],
		o: 2
	},
	linked_paperclips: {
		a: "Linked Paperclips",
		b: "1F587-FE0F",
		c: "1F587",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			29,
			43
		],
		o: 2
	},
	"man-wearing-turban": {
		skin_variations: {
			"1F3FB": {
				unified: "1F473-1F3FB-200D-2642-FE0F",
				non_qualified: "1F473-1F3FB-200D-2642",
				image: "1f473-1f3fb-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F473-1F3FC-200D-2642-FE0F",
				non_qualified: "1F473-1F3FC-200D-2642",
				image: "1f473-1f3fc-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F473-1F3FD-200D-2642-FE0F",
				non_qualified: "1F473-1F3FD-200D-2642",
				image: "1f473-1f3fd-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F473-1F3FE-200D-2642-FE0F",
				non_qualified: "1F473-1F3FE-200D-2642",
				image: "1f473-1f3fe-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F473-1F3FF-200D-2642-FE0F",
				non_qualified: "1F473-1F3FF-200D-2642",
				image: "1f473-1f3ff-200d-2642-fe0f.png",
				sheet_x: 22,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F473",
		a: "Man Wearing Turban",
		b: "1F473-200D-2642-FE0F",
		c: "1F473-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			22,
			37
		],
		o: 4
	},
	sa: {
		a: "Squared Katakana Sa",
		b: "1F202-FE0F",
		c: "1F202",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"japanese",
			"blue-square",
			"katakana"
		],
		k: [
			5,
			5
		],
		o: 2
	},
	full_moon: {
		a: "Full Moon Symbol",
		b: "1F315",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"yellow",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			40
		],
		o: 2
	},
	"flag-mv": {
		a: "Maldives Flag",
		b: "1F1F2-1F1FB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			20
		],
		o: 2
	},
	"flag-mw": {
		a: "Malawi Flag",
		b: "1F1F2-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			21
		],
		o: 2
	},
	waning_gibbous_moon: {
		a: "Waning Gibbous Moon Symbol",
		b: "1F316",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep",
			"waxing_gibbous_moon"
		],
		k: [
			5,
			41
		],
		o: 2
	},
	"woman-wearing-turban": {
		skin_variations: {
			"1F3FB": {
				unified: "1F473-1F3FB-200D-2640-FE0F",
				non_qualified: "1F473-1F3FB-200D-2640",
				image: "1f473-1f3fb-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 32,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F473-1F3FC-200D-2640-FE0F",
				non_qualified: "1F473-1F3FC-200D-2640",
				image: "1f473-1f3fc-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 33,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F473-1F3FD-200D-2640-FE0F",
				non_qualified: "1F473-1F3FD-200D-2640",
				image: "1f473-1f3fd-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 34,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F473-1F3FE-200D-2640-FE0F",
				non_qualified: "1F473-1F3FE-200D-2640",
				image: "1f473-1f3fe-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 35,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F473-1F3FF-200D-2640-FE0F",
				non_qualified: "1F473-1F3FF-200D-2640",
				image: "1f473-1f3ff-200d-2640-fe0f.png",
				sheet_x: 22,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Wearing Turban",
		b: "1F473-200D-2640-FE0F",
		c: "1F473-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			22,
			31
		],
		o: 4
	},
	u6708: {
		a: "Squared Cjk Unified Ideograph-6708",
		b: "1F237-FE0F",
		c: "1F237",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"chinese",
			"month",
			"moon",
			"japanese",
			"orange-square",
			"kanji"
		],
		k: [
			5,
			13
		],
		o: 2
	},
	straight_ruler: {
		a: "Straight Ruler",
		b: "1F4CF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stationery",
			"calculate",
			"length",
			"math",
			"school",
			"drawing",
			"architect",
			"sketch"
		],
		k: [
			26,
			37
		],
		o: 2
	},
	u6709: {
		a: "Squared Cjk Unified Ideograph-6709",
		b: "1F236",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"orange-square",
			"chinese",
			"have",
			"kanji"
		],
		k: [
			5,
			12
		],
		o: 2
	},
	triangular_ruler: {
		a: "Triangular Ruler",
		b: "1F4D0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stationery",
			"math",
			"architect",
			"sketch"
		],
		k: [
			26,
			38
		],
		o: 2
	},
	man_with_gua_pi_mao: {
		skin_variations: {
			"1F3FB": {
				unified: "1F472-1F3FB",
				non_qualified: null,
				image: "1f472-1f3fb.png",
				sheet_x: 22,
				sheet_y: 26,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F472-1F3FC",
				non_qualified: null,
				image: "1f472-1f3fc.png",
				sheet_x: 22,
				sheet_y: 27,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F472-1F3FD",
				non_qualified: null,
				image: "1f472-1f3fd.png",
				sheet_x: 22,
				sheet_y: 28,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F472-1F3FE",
				non_qualified: null,
				image: "1f472-1f3fe.png",
				sheet_x: 22,
				sheet_y: 29,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F472-1F3FF",
				non_qualified: null,
				image: "1f472-1f3ff.png",
				sheet_x: 22,
				sheet_y: 30,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man with Gua Pi Mao",
		b: "1F472",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"male",
			"boy",
			"chinese"
		],
		k: [
			22,
			25
		],
		o: 2
	},
	"flag-mx": {
		a: "Mexico Flag",
		b: "1F1F2-1F1FD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			22
		],
		o: 2
	},
	last_quarter_moon: {
		a: "Last Quarter Moon Symbol",
		b: "1F317",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			42
		],
		o: 2
	},
	person_with_headscarf: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D5-1F3FB",
				non_qualified: null,
				image: "1f9d5-1f3fb.png",
				sheet_x: 48,
				sheet_y: 35,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9D5-1F3FC",
				non_qualified: null,
				image: "1f9d5-1f3fc.png",
				sheet_x: 48,
				sheet_y: 36,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9D5-1F3FD",
				non_qualified: null,
				image: "1f9d5-1f3fd.png",
				sheet_x: 48,
				sheet_y: 37,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9D5-1F3FE",
				non_qualified: null,
				image: "1f9d5-1f3fe.png",
				sheet_x: 48,
				sheet_y: 38,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9D5-1F3FF",
				non_qualified: null,
				image: "1f9d5-1f3ff.png",
				sheet_x: 48,
				sheet_y: 39,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Person with Headscarf",
		b: "1F9D5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			48,
			34
		],
		o: 5
	},
	waning_crescent_moon: {
		a: "Waning Crescent Moon Symbol",
		b: "1F318",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			43
		],
		o: 2
	},
	u6307: {
		a: "Squared Cjk Unified Ideograph-6307",
		b: "1F22F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"chinese",
			"point",
			"green-square",
			"kanji"
		],
		k: [
			5,
			7
		],
		o: 2
	},
	scissors: {
		a: "Black Scissors",
		b: "2702-FE0F",
		c: "2702",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stationery",
			"cut"
		],
		k: [
			54,
			39
		],
		o: 2
	},
	"flag-my": {
		a: "Malaysia Flag",
		b: "1F1F2-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			23
		],
		o: 2
	},
	ideograph_advantage: {
		a: "Circled Ideograph Advantage",
		b: "1F250",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"chinese",
			"kanji",
			"obtain",
			"get",
			"circle"
		],
		k: [
			5,
			17
		],
		o: 2
	},
	man_in_tuxedo: {
		skin_variations: {
			"1F3FB": {
				unified: "1F935-1F3FB",
				non_qualified: null,
				image: "1f935-1f3fb.png",
				sheet_x: 39,
				sheet_y: 24,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F935-1F3FC",
				non_qualified: null,
				image: "1f935-1f3fc.png",
				sheet_x: 39,
				sheet_y: 25,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F935-1F3FD",
				non_qualified: null,
				image: "1f935-1f3fd.png",
				sheet_x: 39,
				sheet_y: 26,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F935-1F3FE",
				non_qualified: null,
				image: "1f935-1f3fe.png",
				sheet_x: 39,
				sheet_y: 27,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F935-1F3FF",
				non_qualified: null,
				image: "1f935-1f3ff.png",
				sheet_x: 39,
				sheet_y: 28,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man in Tuxedo",
		b: "1F935",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"couple",
			"marriage",
			"wedding",
			"groom"
		],
		k: [
			39,
			23
		],
		o: 4
	},
	"flag-mz": {
		a: "Mozambique Flag",
		b: "1F1F2-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			24
		],
		o: 2
	},
	card_file_box: {
		a: "Card File Box",
		b: "1F5C3-FE0F",
		c: "1F5C3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"business",
			"stationery"
		],
		k: [
			30,
			16
		],
		o: 2
	},
	crescent_moon: {
		a: "Crescent Moon",
		b: "1F319",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"night",
			"sleep",
			"sky",
			"evening",
			"magic"
		],
		k: [
			5,
			44
		],
		o: 2
	},
	"flag-na": {
		a: "Namibia Flag",
		b: "1F1F3-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			25
		],
		o: 2
	},
	bride_with_veil: {
		skin_variations: {
			"1F3FB": {
				unified: "1F470-1F3FB",
				non_qualified: null,
				image: "1f470-1f3fb.png",
				sheet_x: 22,
				sheet_y: 2,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F470-1F3FC",
				non_qualified: null,
				image: "1f470-1f3fc.png",
				sheet_x: 22,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F470-1F3FD",
				non_qualified: null,
				image: "1f470-1f3fd.png",
				sheet_x: 22,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F470-1F3FE",
				non_qualified: null,
				image: "1f470-1f3fe.png",
				sheet_x: 22,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F470-1F3FF",
				non_qualified: null,
				image: "1f470-1f3ff.png",
				sheet_x: 22,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Bride with Veil",
		b: "1F470",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"couple",
			"marriage",
			"wedding",
			"woman",
			"bride"
		],
		k: [
			22,
			1
		],
		o: 2
	},
	new_moon_with_face: {
		a: "New Moon with Face",
		b: "1F31A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			45
		],
		o: 2
	},
	file_cabinet: {
		a: "File Cabinet",
		b: "1F5C4-FE0F",
		c: "1F5C4",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"filing",
			"organizing"
		],
		k: [
			30,
			17
		],
		o: 2
	},
	u5272: {
		a: "Squared Cjk Unified Ideograph-5272",
		b: "1F239",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cut",
			"divide",
			"chinese",
			"kanji",
			"pink-square"
		],
		k: [
			5,
			15
		],
		o: 2
	},
	wastebasket: {
		a: "Wastebasket",
		b: "1F5D1-FE0F",
		c: "1F5D1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"bin",
			"trash",
			"rubbish",
			"garbage",
			"toss"
		],
		k: [
			30,
			18
		],
		o: 2
	},
	pregnant_woman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F930-1F3FB",
				non_qualified: null,
				image: "1f930-1f3fb.png",
				sheet_x: 38,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F930-1F3FC",
				non_qualified: null,
				image: "1f930-1f3fc.png",
				sheet_x: 38,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F930-1F3FD",
				non_qualified: null,
				image: "1f930-1f3fd.png",
				sheet_x: 38,
				sheet_y: 53,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F930-1F3FE",
				non_qualified: null,
				image: "1f930-1f3fe.png",
				sheet_x: 38,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F930-1F3FF",
				non_qualified: null,
				image: "1f930-1f3ff.png",
				sheet_x: 38,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Pregnant Woman",
		b: "1F930",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"baby"
		],
		k: [
			38,
			50
		],
		o: 4
	},
	first_quarter_moon_with_face: {
		a: "First Quarter Moon with Face",
		b: "1F31B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			46
		],
		o: 2
	},
	"flag-nc": {
		a: "New Caledonia Flag",
		b: "1F1F3-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			26
		],
		o: 2
	},
	u7121: {
		a: "Squared Cjk Unified Ideograph-7121",
		b: "1F21A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nothing",
			"chinese",
			"kanji",
			"japanese",
			"orange-square"
		],
		k: [
			5,
			6
		],
		o: 2
	},
	lock: {
		a: "Lock",
		b: "1F512",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"security",
			"password",
			"padlock"
		],
		k: [
			27,
			46
		],
		o: 2
	},
	"flag-ne": {
		a: "Niger Flag",
		b: "1F1F3-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			27
		],
		o: 2
	},
	last_quarter_moon_with_face: {
		a: "Last Quarter Moon with Face",
		b: "1F31C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			47
		],
		o: 2
	},
	"breast-feeding": {
		skin_variations: {
			"1F3FB": {
				unified: "1F931-1F3FB",
				non_qualified: null,
				image: "1f931-1f3fb.png",
				sheet_x: 39,
				sheet_y: 0,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F931-1F3FC",
				non_qualified: null,
				image: "1f931-1f3fc.png",
				sheet_x: 39,
				sheet_y: 1,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F931-1F3FD",
				non_qualified: null,
				image: "1f931-1f3fd.png",
				sheet_x: 39,
				sheet_y: 2,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F931-1F3FE",
				non_qualified: null,
				image: "1f931-1f3fe.png",
				sheet_x: 39,
				sheet_y: 3,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F931-1F3FF",
				non_qualified: null,
				image: "1f931-1f3ff.png",
				sheet_x: 39,
				sheet_y: 4,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Breast-Feeding",
		b: "1F931",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			38,
			56
		],
		o: 5
	},
	u7981: {
		a: "Squared Cjk Unified Ideograph-7981",
		b: "1F232",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"kanji",
			"japanese",
			"chinese",
			"forbidden",
			"limit",
			"restricted",
			"red-square"
		],
		k: [
			5,
			8
		],
		o: 2
	},
	accept: {
		a: "Circled Ideograph Accept",
		b: "1F251",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"ok",
			"good",
			"chinese",
			"kanji",
			"agree",
			"yes",
			"orange-circle"
		],
		k: [
			5,
			18
		],
		o: 2
	},
	angel: {
		skin_variations: {
			"1F3FB": {
				unified: "1F47C-1F3FB",
				non_qualified: null,
				image: "1f47c-1f3fb.png",
				sheet_x: 23,
				sheet_y: 38,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F47C-1F3FC",
				non_qualified: null,
				image: "1f47c-1f3fc.png",
				sheet_x: 23,
				sheet_y: 39,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F47C-1F3FD",
				non_qualified: null,
				image: "1f47c-1f3fd.png",
				sheet_x: 23,
				sheet_y: 40,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F47C-1F3FE",
				non_qualified: null,
				image: "1f47c-1f3fe.png",
				sheet_x: 23,
				sheet_y: 41,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F47C-1F3FF",
				non_qualified: null,
				image: "1f47c-1f3ff.png",
				sheet_x: 23,
				sheet_y: 42,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Baby Angel",
		b: "1F47C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"heaven",
			"wings",
			"halo"
		],
		k: [
			23,
			37
		],
		o: 2
	},
	unlock: {
		a: "Open Lock",
		b: "1F513",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"privacy",
			"security"
		],
		k: [
			27,
			47
		],
		o: 2
	},
	"flag-nf": {
		a: "Norfolk Island Flag",
		b: "1F1F3-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			28
		],
		o: 2
	},
	thermometer: {
		a: "Thermometer",
		b: "1F321-FE0F",
		c: "1F321",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weather",
			"temperature",
			"hot",
			"cold"
		],
		k: [
			5,
			52
		],
		o: 2
	},
	"flag-ng": {
		a: "Nigeria Flag",
		b: "1F1F3-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			29
		],
		o: 2
	},
	u7533: {
		a: "Squared Cjk Unified Ideograph-7533",
		b: "1F238",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"chinese",
			"japanese",
			"kanji",
			"orange-square"
		],
		k: [
			5,
			14
		],
		o: 2
	},
	sunny: {
		a: "Black Sun with Rays",
		b: "2600-FE0F",
		c: "2600",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weather",
			"nature",
			"brightness",
			"summer",
			"beach",
			"spring"
		],
		k: [
			52,
			49
		],
		o: 2
	},
	lock_with_ink_pen: {
		a: "Lock with Ink Pen",
		b: "1F50F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"security",
			"secret"
		],
		k: [
			27,
			43
		],
		o: 2
	},
	santa: {
		skin_variations: {
			"1F3FB": {
				unified: "1F385-1F3FB",
				non_qualified: null,
				image: "1f385-1f3fb.png",
				sheet_x: 7,
				sheet_y: 37,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F385-1F3FC",
				non_qualified: null,
				image: "1f385-1f3fc.png",
				sheet_x: 7,
				sheet_y: 38,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F385-1F3FD",
				non_qualified: null,
				image: "1f385-1f3fd.png",
				sheet_x: 7,
				sheet_y: 39,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F385-1F3FE",
				non_qualified: null,
				image: "1f385-1f3fe.png",
				sheet_x: 7,
				sheet_y: 40,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F385-1F3FF",
				non_qualified: null,
				image: "1f385-1f3ff.png",
				sheet_x: 7,
				sheet_y: 41,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Father Christmas",
		b: "1F385",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"festival",
			"man",
			"male",
			"xmas",
			"father christmas"
		],
		k: [
			7,
			36
		],
		o: 2
	},
	closed_lock_with_key: {
		a: "Closed Lock with Key",
		b: "1F510",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"security",
			"privacy"
		],
		k: [
			27,
			44
		],
		o: 2
	},
	u5408: {
		a: "Squared Cjk Unified Ideograph-5408",
		b: "1F234",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"japanese",
			"chinese",
			"join",
			"kanji",
			"red-square"
		],
		k: [
			5,
			10
		],
		o: 2
	},
	"flag-ni": {
		a: "Nicaragua Flag",
		b: "1F1F3-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			30
		],
		o: 2
	},
	mrs_claus: {
		skin_variations: {
			"1F3FB": {
				unified: "1F936-1F3FB",
				non_qualified: null,
				image: "1f936-1f3fb.png",
				sheet_x: 39,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F936-1F3FC",
				non_qualified: null,
				image: "1f936-1f3fc.png",
				sheet_x: 39,
				sheet_y: 31,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F936-1F3FD",
				non_qualified: null,
				image: "1f936-1f3fd.png",
				sheet_x: 39,
				sheet_y: 32,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F936-1F3FE",
				non_qualified: null,
				image: "1f936-1f3fe.png",
				sheet_x: 39,
				sheet_y: 33,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F936-1F3FF",
				non_qualified: null,
				image: "1f936-1f3ff.png",
				sheet_x: 39,
				sheet_y: 34,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Mother Christmas",
		b: "1F936",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"woman",
			"female",
			"xmas",
			"mother christmas"
		],
		k: [
			39,
			29
		],
		n: [
			"mother_christmas"
		],
		o: 4
	},
	full_moon_with_face: {
		a: "Full Moon with Face",
		b: "1F31D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"twilight",
			"planet",
			"space",
			"night",
			"evening",
			"sleep"
		],
		k: [
			5,
			48
		],
		o: 2
	},
	key: {
		a: "Key",
		b: "1F511",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"lock",
			"door",
			"password"
		],
		k: [
			27,
			45
		],
		o: 2
	},
	superhero: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9B8-1F3FB",
				non_qualified: null,
				image: "1f9b8-1f3fb.png",
				sheet_x: 43,
				sheet_y: 31,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9B8-1F3FC",
				non_qualified: null,
				image: "1f9b8-1f3fc.png",
				sheet_x: 43,
				sheet_y: 32,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9B8-1F3FD",
				non_qualified: null,
				image: "1f9b8-1f3fd.png",
				sheet_x: 43,
				sheet_y: 33,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9B8-1F3FE",
				non_qualified: null,
				image: "1f9b8-1f3fe.png",
				sheet_x: 43,
				sheet_y: 34,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9B8-1F3FF",
				non_qualified: null,
				image: "1f9b8-1f3ff.png",
				sheet_x: 43,
				sheet_y: 35,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Superhero",
		b: "1F9B8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			30
		],
		o: 11
	},
	"flag-nl": {
		a: "Netherlands Flag",
		b: "1F1F3-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			31
		],
		o: 2
	},
	u7a7a: {
		a: "Squared Cjk Unified Ideograph-7a7a",
		b: "1F233",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"kanji",
			"japanese",
			"chinese",
			"empty",
			"sky",
			"blue-square"
		],
		k: [
			5,
			9
		],
		o: 2
	},
	sun_with_face: {
		a: "Sun with Face",
		b: "1F31E",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"morning",
			"sky"
		],
		k: [
			5,
			49
		],
		o: 2
	},
	male_superhero: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9B8-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9B8-1F3FB-200D-2642",
				image: "1f9b8-1f3fb-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 25,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9B8-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9B8-1F3FC-200D-2642",
				image: "1f9b8-1f3fc-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 26,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9B8-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9B8-1F3FD-200D-2642",
				image: "1f9b8-1f3fd-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 27,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9B8-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9B8-1F3FE-200D-2642",
				image: "1f9b8-1f3fe-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 28,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9B8-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9B8-1F3FF-200D-2642",
				image: "1f9b8-1f3ff-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 29,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Superhero",
		b: "1F9B8-200D-2642-FE0F",
		c: "1F9B8-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			24
		],
		o: 11
	},
	ringed_planet: {
		a: "Ringed Planet",
		b: "1FA90",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			4
		],
		o: 12
	},
	old_key: {
		a: "Old Key",
		b: "1F5DD-FE0F",
		c: "1F5DD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"lock",
			"door",
			"password"
		],
		k: [
			30,
			22
		],
		o: 2
	},
	congratulations: {
		a: "Circled Ideograph Congratulation",
		b: "3297-FE0F",
		c: "3297",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"chinese",
			"kanji",
			"japanese",
			"red-circle"
		],
		k: [
			55,
			46
		],
		o: 2
	},
	"flag-no": {
		a: "Norway Flag",
		b: "1F1F3-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			32
		],
		o: 2
	},
	star: {
		a: "White Medium Star",
		b: "2B50",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"night",
			"yellow"
		],
		k: [
			55,
			42
		],
		o: 2
	},
	secret: {
		a: "Circled Ideograph Secret",
		b: "3299-FE0F",
		c: "3299",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"privacy",
			"chinese",
			"sshh",
			"kanji",
			"red-circle"
		],
		k: [
			55,
			47
		],
		o: 2
	},
	"flag-np": {
		a: "Nepal Flag",
		b: "1F1F3-1F1F5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			33
		],
		o: 2
	},
	female_superhero: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9B8-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9B8-1F3FB-200D-2640",
				image: "1f9b8-1f3fb-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 19,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9B8-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9B8-1F3FC-200D-2640",
				image: "1f9b8-1f3fc-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 20,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9B8-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9B8-1F3FD-200D-2640",
				image: "1f9b8-1f3fd-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 21,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9B8-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9B8-1F3FE-200D-2640",
				image: "1f9b8-1f3fe-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 22,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9B8-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9B8-1F3FF-200D-2640",
				image: "1f9b8-1f3ff-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 23,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Superhero",
		b: "1F9B8-200D-2640-FE0F",
		c: "1F9B8-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			18
		],
		o: 11
	},
	hammer: {
		a: "Hammer",
		b: "1F528",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"tools",
			"build",
			"create"
		],
		k: [
			28,
			11
		],
		o: 2
	},
	star2: {
		a: "Glowing Star",
		b: "1F31F",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"night",
			"sparkle",
			"awesome",
			"good",
			"magic"
		],
		k: [
			5,
			50
		],
		o: 2
	},
	"flag-nr": {
		a: "Nauru Flag",
		b: "1F1F3-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			34
		],
		o: 2
	},
	axe: {
		a: "Axe",
		b: "1FA93",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			7
		],
		o: 12
	},
	u55b6: {
		a: "Squared Cjk Unified Ideograph-55b6",
		b: "1F23A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"japanese",
			"opening hours",
			"orange-square"
		],
		k: [
			5,
			16
		],
		o: 2
	},
	supervillain: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9B9-1F3FB",
				non_qualified: null,
				image: "1f9b9-1f3fb.png",
				sheet_x: 43,
				sheet_y: 49,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9B9-1F3FC",
				non_qualified: null,
				image: "1f9b9-1f3fc.png",
				sheet_x: 43,
				sheet_y: 50,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9B9-1F3FD",
				non_qualified: null,
				image: "1f9b9-1f3fd.png",
				sheet_x: 43,
				sheet_y: 51,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9B9-1F3FE",
				non_qualified: null,
				image: "1f9b9-1f3fe.png",
				sheet_x: 43,
				sheet_y: 52,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9B9-1F3FF",
				non_qualified: null,
				image: "1f9b9-1f3ff.png",
				sheet_x: 43,
				sheet_y: 53,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Supervillain",
		b: "1F9B9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			48
		],
		o: 11
	},
	stars: {
		a: "Shooting Star",
		b: "1F320",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"night",
			"photo"
		],
		k: [
			5,
			51
		],
		o: 2
	},
	u6e80: {
		a: "Squared Cjk Unified Ideograph-6e80",
		b: "1F235",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"full",
			"chinese",
			"japanese",
			"red-square",
			"kanji"
		],
		k: [
			5,
			11
		],
		o: 2
	},
	"flag-nu": {
		a: "Niue Flag",
		b: "1F1F3-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			35
		],
		o: 2
	},
	pick: {
		a: "Pick",
		b: "26CF-FE0F",
		c: "26CF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"tools",
			"dig"
		],
		k: [
			54,
			5
		],
		o: 2
	},
	male_supervillain: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9B9-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9B9-1F3FB-200D-2642",
				image: "1f9b9-1f3fb-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 43,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9B9-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9B9-1F3FC-200D-2642",
				image: "1f9b9-1f3fc-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 44,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9B9-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9B9-1F3FD-200D-2642",
				image: "1f9b9-1f3fd-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 45,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9B9-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9B9-1F3FE-200D-2642",
				image: "1f9b9-1f3fe-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 46,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9B9-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9B9-1F3FF-200D-2642",
				image: "1f9b9-1f3ff-200d-2642-fe0f.png",
				sheet_x: 43,
				sheet_y: 47,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Supervillain",
		b: "1F9B9-200D-2642-FE0F",
		c: "1F9B9-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			42
		],
		o: 11
	},
	female_supervillain: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9B9-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9B9-1F3FB-200D-2640",
				image: "1f9b9-1f3fb-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 37,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9B9-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9B9-1F3FC-200D-2640",
				image: "1f9b9-1f3fc-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 38,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9B9-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9B9-1F3FD-200D-2640",
				image: "1f9b9-1f3fd-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 39,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9B9-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9B9-1F3FE-200D-2640",
				image: "1f9b9-1f3fe-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 40,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9B9-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9B9-1F3FF-200D-2640",
				image: "1f9b9-1f3ff-200d-2640-fe0f.png",
				sheet_x: 43,
				sheet_y: 41,
				added_in: "11.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Supervillain",
		b: "1F9B9-200D-2640-FE0F",
		c: "1F9B9-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			36
		],
		o: 11
	},
	hammer_and_pick: {
		a: "Hammer and Pick",
		b: "2692-FE0F",
		c: "2692",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"tools",
			"build",
			"create"
		],
		k: [
			53,
			41
		],
		o: 2
	},
	milky_way: {
		a: "Milky Way",
		b: "1F30C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"photo",
			"space",
			"stars"
		],
		k: [
			5,
			31
		],
		o: 2
	},
	red_circle: {
		a: "Large Red Circle",
		b: "1F534",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"error",
			"danger"
		],
		k: [
			28,
			23
		],
		o: 2
	},
	"flag-nz": {
		a: "New Zealand Flag",
		b: "1F1F3-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			36
		],
		o: 2
	},
	large_orange_circle: {
		a: "Large Orange Circle",
		b: "1F7E0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			3
		],
		o: 12
	},
	hammer_and_wrench: {
		a: "Hammer and Wrench",
		b: "1F6E0-FE0F",
		c: "1F6E0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"tools",
			"build",
			"create"
		],
		k: [
			36,
			42
		],
		o: 2
	},
	"flag-om": {
		a: "Oman Flag",
		b: "1F1F4-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			37
		],
		o: 2
	},
	cloud: {
		a: "Cloud",
		b: "2601-FE0F",
		c: "2601",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weather",
			"sky"
		],
		k: [
			52,
			50
		],
		o: 2
	},
	mage: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D9-1F3FB",
				non_qualified: null,
				image: "1f9d9-1f3fb.png",
				sheet_x: 49,
				sheet_y: 50,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D9-1F3FB-200D-2640-FE0F"
			},
			"1F3FC": {
				unified: "1F9D9-1F3FC",
				non_qualified: null,
				image: "1f9d9-1f3fc.png",
				sheet_x: 49,
				sheet_y: 51,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D9-1F3FC-200D-2640-FE0F"
			},
			"1F3FD": {
				unified: "1F9D9-1F3FD",
				non_qualified: null,
				image: "1f9d9-1f3fd.png",
				sheet_x: 49,
				sheet_y: 52,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D9-1F3FD-200D-2640-FE0F"
			},
			"1F3FE": {
				unified: "1F9D9-1F3FE",
				non_qualified: null,
				image: "1f9d9-1f3fe.png",
				sheet_x: 49,
				sheet_y: 53,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D9-1F3FE-200D-2640-FE0F"
			},
			"1F3FF": {
				unified: "1F9D9-1F3FF",
				non_qualified: null,
				image: "1f9d9-1f3ff.png",
				sheet_x: 49,
				sheet_y: 54,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D9-1F3FF-200D-2640-FE0F"
			}
		},
		obsoleted_by: "1F9D9-200D-2640-FE0F",
		a: "Mage",
		b: "1F9D9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			49,
			49
		],
		o: 5
	},
	dagger_knife: {
		a: "Dagger Knife",
		b: "1F5E1-FE0F",
		c: "1F5E1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			24
		],
		o: 2
	},
	partly_sunny: {
		a: "Sun Behind Cloud",
		b: "26C5",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weather",
			"nature",
			"cloudy",
			"morning",
			"fall",
			"spring"
		],
		k: [
			54,
			2
		],
		o: 2
	},
	large_yellow_circle: {
		a: "Large Yellow Circle",
		b: "1F7E1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			4
		],
		o: 12
	},
	male_mage: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D9-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9D9-1F3FB-200D-2642",
				image: "1f9d9-1f3fb-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 44,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9D9-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9D9-1F3FC-200D-2642",
				image: "1f9d9-1f3fc-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 45,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9D9-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9D9-1F3FD-200D-2642",
				image: "1f9d9-1f3fd-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 46,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9D9-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9D9-1F3FE-200D-2642",
				image: "1f9d9-1f3fe-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 47,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9D9-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9D9-1F3FF-200D-2642",
				image: "1f9d9-1f3ff-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 48,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Mage",
		b: "1F9D9-200D-2642-FE0F",
		c: "1F9D9-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			49,
			43
		],
		o: 5
	},
	"flag-pa": {
		a: "Panama Flag",
		b: "1F1F5-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			38
		],
		o: 2
	},
	thunder_cloud_and_rain: {
		a: "Thunder Cloud and Rain",
		b: "26C8-FE0F",
		c: "26C8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			54,
			3
		],
		o: 2
	},
	large_green_circle: {
		a: "Large Green Circle",
		b: "1F7E2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			5
		],
		o: 12
	},
	female_mage: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D9-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9D9-1F3FB-200D-2640",
				image: "1f9d9-1f3fb-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 38,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D9-1F3FB"
			},
			"1F3FC": {
				unified: "1F9D9-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9D9-1F3FC-200D-2640",
				image: "1f9d9-1f3fc-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 39,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D9-1F3FC"
			},
			"1F3FD": {
				unified: "1F9D9-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9D9-1F3FD-200D-2640",
				image: "1f9d9-1f3fd-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 40,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D9-1F3FD"
			},
			"1F3FE": {
				unified: "1F9D9-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9D9-1F3FE-200D-2640",
				image: "1f9d9-1f3fe-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 41,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D9-1F3FE"
			},
			"1F3FF": {
				unified: "1F9D9-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9D9-1F3FF-200D-2640",
				image: "1f9d9-1f3ff-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 42,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D9-1F3FF"
			}
		},
		obsoletes: "1F9D9",
		a: "Female Mage",
		b: "1F9D9-200D-2640-FE0F",
		c: "1F9D9-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			49,
			37
		],
		o: 5
	},
	crossed_swords: {
		a: "Crossed Swords",
		b: "2694-FE0F",
		c: "2694",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weapon"
		],
		k: [
			53,
			43
		],
		o: 2
	},
	"flag-pe": {
		a: "Peru Flag",
		b: "1F1F5-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			39
		],
		o: 2
	},
	gun: {
		a: "Pistol",
		b: "1F52B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"violence",
			"weapon",
			"pistol",
			"revolver"
		],
		k: [
			28,
			14
		],
		o: 2
	},
	mostly_sunny: {
		a: "Mostly Sunny",
		b: "1F324-FE0F",
		c: "1F324",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			53
		],
		n: [
			"sun_small_cloud"
		],
		o: 2
	},
	fairy: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DA-1F3FB",
				non_qualified: null,
				image: "1f9da-1f3fb.png",
				sheet_x: 50,
				sheet_y: 11,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoleted_by: "1F9DA-1F3FB-200D-2640-FE0F"
			},
			"1F3FC": {
				unified: "1F9DA-1F3FC",
				non_qualified: null,
				image: "1f9da-1f3fc.png",
				sheet_x: 50,
				sheet_y: 12,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoleted_by: "1F9DA-1F3FC-200D-2640-FE0F"
			},
			"1F3FD": {
				unified: "1F9DA-1F3FD",
				non_qualified: null,
				image: "1f9da-1f3fd.png",
				sheet_x: 50,
				sheet_y: 13,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoleted_by: "1F9DA-1F3FD-200D-2640-FE0F"
			},
			"1F3FE": {
				unified: "1F9DA-1F3FE",
				non_qualified: null,
				image: "1f9da-1f3fe.png",
				sheet_x: 50,
				sheet_y: 14,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoleted_by: "1F9DA-1F3FE-200D-2640-FE0F"
			},
			"1F3FF": {
				unified: "1F9DA-1F3FF",
				non_qualified: null,
				image: "1f9da-1f3ff.png",
				sheet_x: 50,
				sheet_y: 15,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoleted_by: "1F9DA-1F3FF-200D-2640-FE0F"
			}
		},
		obsoleted_by: "1F9DA-200D-2640-FE0F",
		a: "Fairy",
		b: "1F9DA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			10
		],
		o: 5
	},
	"flag-pf": {
		a: "French Polynesia Flag",
		b: "1F1F5-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			40
		],
		o: 2
	},
	large_blue_circle: {
		a: "Large Blue Circle",
		b: "1F535",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"icon",
			"button"
		],
		k: [
			28,
			24
		],
		o: 2
	},
	large_purple_circle: {
		a: "Large Purple Circle",
		b: "1F7E3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			6
		],
		o: 12
	},
	bow_and_arrow: {
		a: "Bow and Arrow",
		b: "1F3F9",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports"
		],
		k: [
			11,
			21
		],
		o: 2
	},
	male_fairy: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DA-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9DA-1F3FB-200D-2642",
				image: "1f9da-1f3fb-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 5,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9DA-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9DA-1F3FC-200D-2642",
				image: "1f9da-1f3fc-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 6,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9DA-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9DA-1F3FD-200D-2642",
				image: "1f9da-1f3fd-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 7,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9DA-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9DA-1F3FE-200D-2642",
				image: "1f9da-1f3fe-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 8,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9DA-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9DA-1F3FF-200D-2642",
				image: "1f9da-1f3ff-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 9,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		a: "Male Fairy",
		b: "1F9DA-200D-2642-FE0F",
		c: "1F9DA-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			4
		],
		o: 5
	},
	barely_sunny: {
		a: "Barely Sunny",
		b: "1F325-FE0F",
		c: "1F325",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			54
		],
		n: [
			"sun_behind_cloud"
		],
		o: 2
	},
	"flag-pg": {
		a: "Papua New Guinea Flag",
		b: "1F1F5-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			41
		],
		o: 2
	},
	shield: {
		a: "Shield",
		b: "1F6E1-FE0F",
		c: "1F6E1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"protection",
			"security"
		],
		k: [
			36,
			43
		],
		o: 2
	},
	partly_sunny_rain: {
		a: "Partly Sunny Rain",
		b: "1F326-FE0F",
		c: "1F326",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			55
		],
		n: [
			"sun_behind_rain_cloud"
		],
		o: 2
	},
	large_brown_circle: {
		a: "Large Brown Circle",
		b: "1F7E4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			7
		],
		o: 12
	},
	female_fairy: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DA-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9DA-1F3FB-200D-2640",
				image: "1f9da-1f3fb-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 56,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoletes: "1F9DA-1F3FB"
			},
			"1F3FC": {
				unified: "1F9DA-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9DA-1F3FC-200D-2640",
				image: "1f9da-1f3fc-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 0,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoletes: "1F9DA-1F3FC"
			},
			"1F3FD": {
				unified: "1F9DA-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9DA-1F3FD-200D-2640",
				image: "1f9da-1f3fd-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 1,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoletes: "1F9DA-1F3FD"
			},
			"1F3FE": {
				unified: "1F9DA-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9DA-1F3FE-200D-2640",
				image: "1f9da-1f3fe-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 2,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoletes: "1F9DA-1F3FE"
			},
			"1F3FF": {
				unified: "1F9DA-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9DA-1F3FF-200D-2640",
				image: "1f9da-1f3ff-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 3,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false,
				obsoletes: "1F9DA-1F3FF"
			}
		},
		obsoletes: "1F9DA",
		a: "Female Fairy",
		b: "1F9DA-200D-2640-FE0F",
		c: "1F9DA-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			49,
			55
		],
		o: 5
	},
	"flag-ph": {
		a: "Philippines Flag",
		b: "1F1F5-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			42
		],
		o: 2
	},
	"flag-pk": {
		a: "Pakistan Flag",
		b: "1F1F5-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			43
		],
		o: 2
	},
	black_circle: {
		a: "Medium Black Circle",
		b: "26AB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"button",
			"round"
		],
		k: [
			53,
			53
		],
		o: 2
	},
	wrench: {
		a: "Wrench",
		b: "1F527",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"tools",
			"diy",
			"ikea",
			"fix",
			"maintainer"
		],
		k: [
			28,
			10
		],
		o: 2
	},
	vampire: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DB-1F3FB",
				non_qualified: null,
				image: "1f9db-1f3fb.png",
				sheet_x: 50,
				sheet_y: 29,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DB-1F3FB-200D-2640-FE0F"
			},
			"1F3FC": {
				unified: "1F9DB-1F3FC",
				non_qualified: null,
				image: "1f9db-1f3fc.png",
				sheet_x: 50,
				sheet_y: 30,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DB-1F3FC-200D-2640-FE0F"
			},
			"1F3FD": {
				unified: "1F9DB-1F3FD",
				non_qualified: null,
				image: "1f9db-1f3fd.png",
				sheet_x: 50,
				sheet_y: 31,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DB-1F3FD-200D-2640-FE0F"
			},
			"1F3FE": {
				unified: "1F9DB-1F3FE",
				non_qualified: null,
				image: "1f9db-1f3fe.png",
				sheet_x: 50,
				sheet_y: 32,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DB-1F3FE-200D-2640-FE0F"
			},
			"1F3FF": {
				unified: "1F9DB-1F3FF",
				non_qualified: null,
				image: "1f9db-1f3ff.png",
				sheet_x: 50,
				sheet_y: 33,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DB-1F3FF-200D-2640-FE0F"
			}
		},
		obsoleted_by: "1F9DB-200D-2640-FE0F",
		a: "Vampire",
		b: "1F9DB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			28
		],
		o: 5
	},
	rain_cloud: {
		a: "Rain Cloud",
		b: "1F327-FE0F",
		c: "1F327",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			56
		],
		o: 2
	},
	snow_cloud: {
		a: "Snow Cloud",
		b: "1F328-FE0F",
		c: "1F328",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			6,
			0
		],
		o: 2
	},
	"flag-pl": {
		a: "Poland Flag",
		b: "1F1F5-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			44
		],
		o: 2
	},
	male_vampire: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DB-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9DB-1F3FB-200D-2642",
				image: "1f9db-1f3fb-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 23,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9DB-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9DB-1F3FC-200D-2642",
				image: "1f9db-1f3fc-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 24,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9DB-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9DB-1F3FD-200D-2642",
				image: "1f9db-1f3fd-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 25,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9DB-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9DB-1F3FE-200D-2642",
				image: "1f9db-1f3fe-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 26,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9DB-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9DB-1F3FF-200D-2642",
				image: "1f9db-1f3ff-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 27,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Male Vampire",
		b: "1F9DB-200D-2642-FE0F",
		c: "1F9DB-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			22
		],
		o: 5
	},
	nut_and_bolt: {
		a: "Nut and Bolt",
		b: "1F529",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"handy",
			"tools",
			"fix"
		],
		k: [
			28,
			12
		],
		o: 2
	},
	white_circle: {
		a: "Medium White Circle",
		b: "26AA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"round"
		],
		k: [
			53,
			52
		],
		o: 2
	},
	female_vampire: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DB-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9DB-1F3FB-200D-2640",
				image: "1f9db-1f3fb-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 17,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DB-1F3FB"
			},
			"1F3FC": {
				unified: "1F9DB-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9DB-1F3FC-200D-2640",
				image: "1f9db-1f3fc-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 18,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DB-1F3FC"
			},
			"1F3FD": {
				unified: "1F9DB-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9DB-1F3FD-200D-2640",
				image: "1f9db-1f3fd-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 19,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DB-1F3FD"
			},
			"1F3FE": {
				unified: "1F9DB-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9DB-1F3FE-200D-2640",
				image: "1f9db-1f3fe-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 20,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DB-1F3FE"
			},
			"1F3FF": {
				unified: "1F9DB-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9DB-1F3FF-200D-2640",
				image: "1f9db-1f3ff-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 21,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DB-1F3FF"
			}
		},
		obsoletes: "1F9DB",
		a: "Female Vampire",
		b: "1F9DB-200D-2640-FE0F",
		c: "1F9DB-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			16
		],
		o: 5
	},
	"flag-pm": {
		a: "St. Pierre & Miquelon Flag",
		b: "1F1F5-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			45
		],
		o: 2
	},
	large_red_square: {
		a: "Large Red Square",
		b: "1F7E5",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			8
		],
		o: 12
	},
	lightning: {
		a: "Lightning",
		b: "1F329-FE0F",
		c: "1F329",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			6,
			1
		],
		n: [
			"lightning_cloud"
		],
		o: 2
	},
	gear: {
		a: "Gear",
		b: "2699-FE0F",
		c: "2699",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"cog"
		],
		k: [
			53,
			47
		],
		o: 2
	},
	merperson: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DC-1F3FB",
				non_qualified: null,
				image: "1f9dc-1f3fb.png",
				sheet_x: 50,
				sheet_y: 47,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DC-1F3FB-200D-2642-FE0F"
			},
			"1F3FC": {
				unified: "1F9DC-1F3FC",
				non_qualified: null,
				image: "1f9dc-1f3fc.png",
				sheet_x: 50,
				sheet_y: 48,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DC-1F3FC-200D-2642-FE0F"
			},
			"1F3FD": {
				unified: "1F9DC-1F3FD",
				non_qualified: null,
				image: "1f9dc-1f3fd.png",
				sheet_x: 50,
				sheet_y: 49,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DC-1F3FD-200D-2642-FE0F"
			},
			"1F3FE": {
				unified: "1F9DC-1F3FE",
				non_qualified: null,
				image: "1f9dc-1f3fe.png",
				sheet_x: 50,
				sheet_y: 50,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DC-1F3FE-200D-2642-FE0F"
			},
			"1F3FF": {
				unified: "1F9DC-1F3FF",
				non_qualified: null,
				image: "1f9dc-1f3ff.png",
				sheet_x: 50,
				sheet_y: 51,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DC-1F3FF-200D-2642-FE0F"
			}
		},
		obsoleted_by: "1F9DC-200D-2642-FE0F",
		a: "Merperson",
		b: "1F9DC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			46
		],
		o: 5
	},
	tornado: {
		a: "Tornado",
		b: "1F32A-FE0F",
		c: "1F32A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weather",
			"cyclone",
			"twister"
		],
		k: [
			6,
			2
		],
		n: [
			"tornado_cloud"
		],
		o: 2
	},
	large_orange_square: {
		a: "Large Orange Square",
		b: "1F7E7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			10
		],
		o: 12
	},
	"flag-pn": {
		a: "Pitcairn Islands Flag",
		b: "1F1F5-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			46
		],
		o: 2
	},
	compression: {
		a: "Compression",
		b: "1F5DC-FE0F",
		c: "1F5DC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			30,
			21
		],
		o: 2
	},
	merman: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DC-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9DC-1F3FB-200D-2642",
				image: "1f9dc-1f3fb-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 41,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DC-1F3FB"
			},
			"1F3FC": {
				unified: "1F9DC-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9DC-1F3FC-200D-2642",
				image: "1f9dc-1f3fc-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 42,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DC-1F3FC"
			},
			"1F3FD": {
				unified: "1F9DC-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9DC-1F3FD-200D-2642",
				image: "1f9dc-1f3fd-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 43,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DC-1F3FD"
			},
			"1F3FE": {
				unified: "1F9DC-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9DC-1F3FE-200D-2642",
				image: "1f9dc-1f3fe-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 44,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DC-1F3FE"
			},
			"1F3FF": {
				unified: "1F9DC-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9DC-1F3FF-200D-2642",
				image: "1f9dc-1f3ff-200d-2642-fe0f.png",
				sheet_x: 50,
				sheet_y: 45,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DC-1F3FF"
			}
		},
		obsoletes: "1F9DC",
		a: "Merman",
		b: "1F9DC-200D-2642-FE0F",
		c: "1F9DC-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			40
		],
		o: 5
	},
	large_yellow_square: {
		a: "Large Yellow Square",
		b: "1F7E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			11
		],
		o: 12
	},
	fog: {
		a: "Fog",
		b: "1F32B-FE0F",
		c: "1F32B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weather"
		],
		k: [
			6,
			3
		],
		o: 2
	},
	scales: {
		a: "Scales",
		b: "2696-FE0F",
		c: "2696",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			53,
			45
		],
		o: 2
	},
	"flag-pr": {
		a: "Puerto Rico Flag",
		b: "1F1F5-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			47
		],
		o: 2
	},
	wind_blowing_face: {
		a: "Wind Blowing Face",
		b: "1F32C-FE0F",
		c: "1F32C",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			6,
			4
		],
		o: 2
	},
	"flag-ps": {
		a: "Palestinian Territories Flag",
		b: "1F1F5-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			48
		],
		o: 2
	},
	mermaid: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DC-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9DC-1F3FB-200D-2640",
				image: "1f9dc-1f3fb-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 35,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9DC-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9DC-1F3FC-200D-2640",
				image: "1f9dc-1f3fc-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 36,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9DC-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9DC-1F3FD-200D-2640",
				image: "1f9dc-1f3fd-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 37,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9DC-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9DC-1F3FE-200D-2640",
				image: "1f9dc-1f3fe-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 38,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9DC-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9DC-1F3FF-200D-2640",
				image: "1f9dc-1f3ff-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 39,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Mermaid",
		b: "1F9DC-200D-2640-FE0F",
		c: "1F9DC-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			34
		],
		o: 5
	},
	probing_cane: {
		a: "Probing Cane",
		b: "1F9AF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			43,
			3
		],
		o: 12
	},
	large_green_square: {
		a: "Large Green Square",
		b: "1F7E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			12
		],
		o: 12
	},
	"flag-pt": {
		a: "Portugal Flag",
		b: "1F1F5-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			49
		],
		o: 2
	},
	link: {
		a: "Link Symbol",
		b: "1F517",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"rings",
			"url"
		],
		k: [
			27,
			51
		],
		o: 2
	},
	large_blue_square: {
		a: "Large Blue Square",
		b: "1F7E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			9
		],
		o: 12
	},
	elf: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DD-1F3FB",
				non_qualified: null,
				image: "1f9dd-1f3fb.png",
				sheet_x: 51,
				sheet_y: 8,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DD-1F3FB-200D-2642-FE0F"
			},
			"1F3FC": {
				unified: "1F9DD-1F3FC",
				non_qualified: null,
				image: "1f9dd-1f3fc.png",
				sheet_x: 51,
				sheet_y: 9,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DD-1F3FC-200D-2642-FE0F"
			},
			"1F3FD": {
				unified: "1F9DD-1F3FD",
				non_qualified: null,
				image: "1f9dd-1f3fd.png",
				sheet_x: 51,
				sheet_y: 10,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DD-1F3FD-200D-2642-FE0F"
			},
			"1F3FE": {
				unified: "1F9DD-1F3FE",
				non_qualified: null,
				image: "1f9dd-1f3fe.png",
				sheet_x: 51,
				sheet_y: 11,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DD-1F3FE-200D-2642-FE0F"
			},
			"1F3FF": {
				unified: "1F9DD-1F3FF",
				non_qualified: null,
				image: "1f9dd-1f3ff.png",
				sheet_x: 51,
				sheet_y: 12,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9DD-1F3FF-200D-2642-FE0F"
			}
		},
		obsoleted_by: "1F9DD-200D-2642-FE0F",
		a: "Elf",
		b: "1F9DD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			7
		],
		o: 5
	},
	cyclone: {
		a: "Cyclone",
		b: "1F300",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weather",
			"swirl",
			"blue",
			"cloud",
			"vortex",
			"spiral",
			"whirlpool",
			"spin",
			"tornado",
			"hurricane",
			"typhoon"
		],
		k: [
			5,
			19
		],
		o: 2
	},
	rainbow: {
		a: "Rainbow",
		b: "1F308",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"nature",
			"happy",
			"unicorn_face",
			"photo",
			"sky",
			"spring"
		],
		k: [
			5,
			27
		],
		o: 2
	},
	male_elf: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DD-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9DD-1F3FB-200D-2642",
				image: "1f9dd-1f3fb-200d-2642-fe0f.png",
				sheet_x: 51,
				sheet_y: 2,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DD-1F3FB"
			},
			"1F3FC": {
				unified: "1F9DD-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9DD-1F3FC-200D-2642",
				image: "1f9dd-1f3fc-200d-2642-fe0f.png",
				sheet_x: 51,
				sheet_y: 3,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DD-1F3FC"
			},
			"1F3FD": {
				unified: "1F9DD-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9DD-1F3FD-200D-2642",
				image: "1f9dd-1f3fd-200d-2642-fe0f.png",
				sheet_x: 51,
				sheet_y: 4,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DD-1F3FD"
			},
			"1F3FE": {
				unified: "1F9DD-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9DD-1F3FE-200D-2642",
				image: "1f9dd-1f3fe-200d-2642-fe0f.png",
				sheet_x: 51,
				sheet_y: 5,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DD-1F3FE"
			},
			"1F3FF": {
				unified: "1F9DD-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9DD-1F3FF-200D-2642",
				image: "1f9dd-1f3ff-200d-2642-fe0f.png",
				sheet_x: 51,
				sheet_y: 6,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9DD-1F3FF"
			}
		},
		obsoletes: "1F9DD",
		a: "Male Elf",
		b: "1F9DD-200D-2642-FE0F",
		c: "1F9DD-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			1
		],
		o: 5
	},
	"flag-pw": {
		a: "Palau Flag",
		b: "1F1F5-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			50
		],
		o: 2
	},
	chains: {
		a: "Chains",
		b: "26D3-FE0F",
		c: "26D3",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"lock",
			"arrest"
		],
		k: [
			54,
			7
		],
		o: 2
	},
	large_purple_square: {
		a: "Large Purple Square",
		b: "1F7EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			13
		],
		o: 12
	},
	female_elf: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9DD-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9DD-1F3FB-200D-2640",
				image: "1f9dd-1f3fb-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 53,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9DD-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9DD-1F3FC-200D-2640",
				image: "1f9dd-1f3fc-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 54,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9DD-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9DD-1F3FD-200D-2640",
				image: "1f9dd-1f3fd-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 55,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9DD-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9DD-1F3FE-200D-2640",
				image: "1f9dd-1f3fe-200d-2640-fe0f.png",
				sheet_x: 50,
				sheet_y: 56,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9DD-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9DD-1F3FF-200D-2640",
				image: "1f9dd-1f3ff-200d-2640-fe0f.png",
				sheet_x: 51,
				sheet_y: 0,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Female Elf",
		b: "1F9DD-200D-2640-FE0F",
		c: "1F9DD-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			50,
			52
		],
		o: 5
	},
	"flag-py": {
		a: "Paraguay Flag",
		b: "1F1F5-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			51
		],
		o: 2
	},
	closed_umbrella: {
		a: "Closed Umbrella",
		b: "1F302",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"weather",
			"rain",
			"drizzle"
		],
		k: [
			5,
			21
		],
		o: 2
	},
	toolbox: {
		a: "Toolbox",
		b: "1F9F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			35
		],
		o: 11
	},
	large_brown_square: {
		a: "Large Brown Square",
		b: "1F7EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			37,
			14
		],
		o: 12
	},
	magnet: {
		a: "Magnet",
		b: "1F9F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			37
		],
		o: 11
	},
	genie: {
		obsoleted_by: "1F9DE-200D-2642-FE0F",
		a: "Genie",
		b: "1F9DE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			15
		],
		o: 5
	},
	"flag-qa": {
		a: "Qatar Flag",
		b: "1F1F6-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			52
		],
		o: 2
	},
	umbrella: {
		a: "Umbrella",
		b: "2602-FE0F",
		c: "2602",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"rainy",
			"weather",
			"spring"
		],
		k: [
			52,
			51
		],
		o: 2
	},
	black_large_square: {
		a: "Black Large Square",
		b: "2B1B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"icon",
			"button"
		],
		k: [
			55,
			40
		],
		o: 2
	},
	male_genie: {
		obsoletes: "1F9DE",
		a: "Male Genie",
		b: "1F9DE-200D-2642-FE0F",
		c: "1F9DE-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			14
		],
		o: 5
	},
	umbrella_with_rain_drops: {
		a: "Umbrella with Rain Drops",
		b: "2614",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			56
		],
		o: 2
	},
	"flag-re": {
		a: "Réunion Flag",
		b: "1F1F7-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			53
		],
		o: 2
	},
	white_large_square: {
		a: "White Large Square",
		b: "2B1C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"icon",
			"stone",
			"button"
		],
		k: [
			55,
			41
		],
		o: 2
	},
	alembic: {
		a: "Alembic",
		b: "2697-FE0F",
		c: "2697",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"distilling",
			"science",
			"experiment",
			"chemistry"
		],
		k: [
			53,
			46
		],
		o: 2
	},
	black_medium_square: {
		a: "Black Medium Square",
		b: "25FC-FE0F",
		c: "25FC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"button",
			"icon"
		],
		k: [
			52,
			46
		],
		o: 2
	},
	test_tube: {
		a: "Test Tube",
		b: "1F9EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			29
		],
		o: 11
	},
	"flag-ro": {
		a: "Romania Flag",
		b: "1F1F7-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			54
		],
		o: 2
	},
	female_genie: {
		a: "Female Genie",
		b: "1F9DE-200D-2640-FE0F",
		c: "1F9DE-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			13
		],
		o: 5
	},
	umbrella_on_ground: {
		a: "Umbrella on Ground",
		b: "26F1-FE0F",
		c: "26F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			54,
			12
		],
		o: 2
	},
	zombie: {
		obsoleted_by: "1F9DF-200D-2642-FE0F",
		a: "Zombie",
		b: "1F9DF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			18
		],
		o: 5
	},
	zap: {
		a: "High Voltage Sign",
		b: "26A1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"thunder",
			"weather",
			"lightning bolt",
			"fast"
		],
		k: [
			53,
			51
		],
		o: 2
	},
	white_medium_square: {
		a: "White Medium Square",
		b: "25FB-FE0F",
		c: "25FB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"stone",
			"icon"
		],
		k: [
			52,
			45
		],
		o: 2
	},
	"flag-rs": {
		a: "Serbia Flag",
		b: "1F1F7-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			3,
			55
		],
		o: 2
	},
	petri_dish: {
		a: "Petri Dish",
		b: "1F9EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			30
		],
		o: 11
	},
	snowflake: {
		a: "Snowflake",
		b: "2744-FE0F",
		c: "2744",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"winter",
			"season",
			"cold",
			"weather",
			"christmas",
			"xmas"
		],
		k: [
			55,
			19
		],
		o: 2
	},
	dna: {
		a: "Dna Double Helix",
		b: "1F9EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			31
		],
		o: 11
	},
	male_zombie: {
		obsoletes: "1F9DF",
		a: "Male Zombie",
		b: "1F9DF-200D-2642-FE0F",
		c: "1F9DF-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			17
		],
		o: 5
	},
	black_medium_small_square: {
		a: "Black Medium Small Square",
		b: "25FE",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"icon",
			"shape",
			"button"
		],
		k: [
			52,
			48
		],
		o: 2
	},
	ru: {
		a: "Russia Flag",
		b: "1F1F7-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"russian",
			"federation",
			"flag",
			"nation",
			"country",
			"banner"
		],
		k: [
			3,
			56
		],
		n: [
			"flag-ru"
		],
		o: 2
	},
	female_zombie: {
		a: "Female Zombie",
		b: "1F9DF-200D-2640-FE0F",
		c: "1F9DF-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			16
		],
		o: 5
	},
	"flag-rw": {
		a: "Rwanda Flag",
		b: "1F1F7-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			0
		],
		o: 2
	},
	snowman: {
		a: "Snowman",
		b: "2603-FE0F",
		c: "2603",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"winter",
			"season",
			"cold",
			"weather",
			"christmas",
			"xmas",
			"frozen",
			"without_snow"
		],
		k: [
			52,
			52
		],
		o: 2
	},
	white_medium_small_square: {
		a: "White Medium Small Square",
		b: "25FD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"stone",
			"icon",
			"button"
		],
		k: [
			52,
			47
		],
		o: 2
	},
	microscope: {
		a: "Microscope",
		b: "1F52C",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"laboratory",
			"experiment",
			"zoomin",
			"science",
			"study"
		],
		k: [
			28,
			15
		],
		o: 2
	},
	snowman_without_snow: {
		a: "Snowman Without Snow",
		b: "26C4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			54,
			1
		],
		o: 2
	},
	telescope: {
		a: "Telescope",
		b: "1F52D",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"stars",
			"space",
			"zoom",
			"science",
			"astronomy"
		],
		k: [
			28,
			16
		],
		o: 2
	},
	massage: {
		skin_variations: {
			"1F3FB": {
				unified: "1F486-1F3FB",
				non_qualified: null,
				image: "1f486-1f3fb.png",
				sheet_x: 24,
				sheet_y: 52,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F486-1F3FC",
				non_qualified: null,
				image: "1f486-1f3fc.png",
				sheet_x: 24,
				sheet_y: 53,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F486-1F3FD",
				non_qualified: null,
				image: "1f486-1f3fd.png",
				sheet_x: 24,
				sheet_y: 54,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F486-1F3FE",
				non_qualified: null,
				image: "1f486-1f3fe.png",
				sheet_x: 24,
				sheet_y: 55,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F486-1F3FF",
				non_qualified: null,
				image: "1f486-1f3ff.png",
				sheet_x: 24,
				sheet_y: 56,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F486-200D-2640-FE0F",
		a: "Face Massage",
		b: "1F486",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			24,
			51
		],
		o: 2
	},
	black_small_square: {
		a: "Black Small Square",
		b: "25AA-FE0F",
		c: "25AA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"icon"
		],
		k: [
			52,
			41
		],
		o: 2
	},
	"flag-sa": {
		a: "Saudi Arabia Flag",
		b: "1F1F8-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			1
		],
		o: 2
	},
	"man-getting-massage": {
		skin_variations: {
			"1F3FB": {
				unified: "1F486-1F3FB-200D-2642-FE0F",
				non_qualified: "1F486-1F3FB-200D-2642",
				image: "1f486-1f3fb-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F486-1F3FC-200D-2642-FE0F",
				non_qualified: "1F486-1F3FC-200D-2642",
				image: "1f486-1f3fc-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 47,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F486-1F3FD-200D-2642-FE0F",
				non_qualified: "1F486-1F3FD-200D-2642",
				image: "1f486-1f3fd-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F486-1F3FE-200D-2642-FE0F",
				non_qualified: "1F486-1F3FE-200D-2642",
				image: "1f486-1f3fe-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F486-1F3FF-200D-2642-FE0F",
				non_qualified: "1F486-1F3FF-200D-2642",
				image: "1f486-1f3ff-200d-2642-fe0f.png",
				sheet_x: 24,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Getting Massage",
		b: "1F486-200D-2642-FE0F",
		c: "1F486-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			24,
			45
		],
		o: 4
	},
	comet: {
		a: "Comet",
		b: "2604-FE0F",
		c: "2604",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"space"
		],
		k: [
			52,
			53
		],
		o: 2
	},
	white_small_square: {
		a: "White Small Square",
		b: "25AB-FE0F",
		c: "25AB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"icon"
		],
		k: [
			52,
			42
		],
		o: 2
	},
	"flag-sb": {
		a: "Solomon Islands Flag",
		b: "1F1F8-1F1E7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			2
		],
		o: 2
	},
	satellite_antenna: {
		a: "Satellite Antenna",
		b: "1F4E1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			26,
			55
		],
		o: 2
	},
	large_orange_diamond: {
		a: "Large Orange Diamond",
		b: "1F536",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"jewel",
			"gem"
		],
		k: [
			28,
			25
		],
		o: 2
	},
	"woman-getting-massage": {
		skin_variations: {
			"1F3FB": {
				unified: "1F486-1F3FB-200D-2640-FE0F",
				non_qualified: "1F486-1F3FB-200D-2640",
				image: "1f486-1f3fb-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F486-1F3FC-200D-2640-FE0F",
				non_qualified: "1F486-1F3FC-200D-2640",
				image: "1f486-1f3fc-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F486-1F3FD-200D-2640-FE0F",
				non_qualified: "1F486-1F3FD-200D-2640",
				image: "1f486-1f3fd-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F486-1F3FE-200D-2640-FE0F",
				non_qualified: "1F486-1F3FE-200D-2640",
				image: "1f486-1f3fe-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F486-1F3FF-200D-2640-FE0F",
				non_qualified: "1F486-1F3FF-200D-2640",
				image: "1f486-1f3ff-200d-2640-fe0f.png",
				sheet_x: 24,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F486",
		a: "Woman Getting Massage",
		b: "1F486-200D-2640-FE0F",
		c: "1F486-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			24,
			39
		],
		o: 4
	},
	fire: {
		a: "Fire",
		b: "1F525",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"hot",
			"cook",
			"flame"
		],
		k: [
			28,
			8
		],
		o: 2
	},
	syringe: {
		a: "Syringe",
		b: "1F489",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"health",
			"hospital",
			"drugs",
			"blood",
			"medicine",
			"needle",
			"doctor",
			"nurse"
		],
		k: [
			25,
			19
		],
		o: 2
	},
	"flag-sc": {
		a: "Seychelles Flag",
		b: "1F1F8-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			3
		],
		o: 2
	},
	large_blue_diamond: {
		a: "Large Blue Diamond",
		b: "1F537",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"jewel",
			"gem"
		],
		k: [
			28,
			26
		],
		o: 2
	},
	"flag-sd": {
		a: "Sudan Flag",
		b: "1F1F8-1F1E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			4
		],
		o: 2
	},
	droplet: {
		a: "Droplet",
		b: "1F4A7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"water",
			"drip",
			"faucet",
			"spring"
		],
		k: [
			25,
			49
		],
		o: 2
	},
	drop_of_blood: {
		a: "Drop of Blood",
		b: "1FA78",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			55
		],
		o: 12
	},
	haircut: {
		skin_variations: {
			"1F3FB": {
				unified: "1F487-1F3FB",
				non_qualified: null,
				image: "1f487-1f3fb.png",
				sheet_x: 25,
				sheet_y: 13,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F487-1F3FC",
				non_qualified: null,
				image: "1f487-1f3fc.png",
				sheet_x: 25,
				sheet_y: 14,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F487-1F3FD",
				non_qualified: null,
				image: "1f487-1f3fd.png",
				sheet_x: 25,
				sheet_y: 15,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F487-1F3FE",
				non_qualified: null,
				image: "1f487-1f3fe.png",
				sheet_x: 25,
				sheet_y: 16,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F487-1F3FF",
				non_qualified: null,
				image: "1f487-1f3ff.png",
				sheet_x: 25,
				sheet_y: 17,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F487-200D-2640-FE0F",
		a: "Haircut",
		b: "1F487",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			25,
			12
		],
		o: 2
	},
	ocean: {
		a: "Water Wave",
		b: "1F30A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sea",
			"water",
			"wave",
			"nature",
			"tsunami",
			"disaster"
		],
		k: [
			5,
			29
		],
		o: 2
	},
	"flag-se": {
		a: "Sweden Flag",
		b: "1F1F8-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			5
		],
		o: 2
	},
	"man-getting-haircut": {
		skin_variations: {
			"1F3FB": {
				unified: "1F487-1F3FB-200D-2642-FE0F",
				non_qualified: "1F487-1F3FB-200D-2642",
				image: "1f487-1f3fb-200d-2642-fe0f.png",
				sheet_x: 25,
				sheet_y: 7,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F487-1F3FC-200D-2642-FE0F",
				non_qualified: "1F487-1F3FC-200D-2642",
				image: "1f487-1f3fc-200d-2642-fe0f.png",
				sheet_x: 25,
				sheet_y: 8,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F487-1F3FD-200D-2642-FE0F",
				non_qualified: "1F487-1F3FD-200D-2642",
				image: "1f487-1f3fd-200d-2642-fe0f.png",
				sheet_x: 25,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F487-1F3FE-200D-2642-FE0F",
				non_qualified: "1F487-1F3FE-200D-2642",
				image: "1f487-1f3fe-200d-2642-fe0f.png",
				sheet_x: 25,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F487-1F3FF-200D-2642-FE0F",
				non_qualified: "1F487-1F3FF-200D-2642",
				image: "1f487-1f3ff-200d-2642-fe0f.png",
				sheet_x: 25,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Getting Haircut",
		b: "1F487-200D-2642-FE0F",
		c: "1F487-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			25,
			6
		],
		o: 4
	},
	small_orange_diamond: {
		a: "Small Orange Diamond",
		b: "1F538",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"jewel",
			"gem"
		],
		k: [
			28,
			27
		],
		o: 2
	},
	pill: {
		a: "Pill",
		b: "1F48A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"health",
			"medicine",
			"doctor",
			"pharmacy",
			"drug"
		],
		k: [
			25,
			20
		],
		o: 2
	},
	"woman-getting-haircut": {
		skin_variations: {
			"1F3FB": {
				unified: "1F487-1F3FB-200D-2640-FE0F",
				non_qualified: "1F487-1F3FB-200D-2640",
				image: "1f487-1f3fb-200d-2640-fe0f.png",
				sheet_x: 25,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F487-1F3FC-200D-2640-FE0F",
				non_qualified: "1F487-1F3FC-200D-2640",
				image: "1f487-1f3fc-200d-2640-fe0f.png",
				sheet_x: 25,
				sheet_y: 2,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F487-1F3FD-200D-2640-FE0F",
				non_qualified: "1F487-1F3FD-200D-2640",
				image: "1f487-1f3fd-200d-2640-fe0f.png",
				sheet_x: 25,
				sheet_y: 3,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F487-1F3FE-200D-2640-FE0F",
				non_qualified: "1F487-1F3FE-200D-2640",
				image: "1f487-1f3fe-200d-2640-fe0f.png",
				sheet_x: 25,
				sheet_y: 4,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F487-1F3FF-200D-2640-FE0F",
				non_qualified: "1F487-1F3FF-200D-2640",
				image: "1f487-1f3ff-200d-2640-fe0f.png",
				sheet_x: 25,
				sheet_y: 5,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F487",
		a: "Woman Getting Haircut",
		b: "1F487-200D-2640-FE0F",
		c: "1F487-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			25,
			0
		],
		o: 4
	},
	small_blue_diamond: {
		a: "Small Blue Diamond",
		b: "1F539",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"jewel",
			"gem"
		],
		k: [
			28,
			28
		],
		o: 2
	},
	"flag-sg": {
		a: "Singapore Flag",
		b: "1F1F8-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			6
		],
		o: 2
	},
	adhesive_bandage: {
		a: "Adhesive Bandage",
		b: "1FA79",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			56
		],
		o: 12
	},
	walking: {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B6-1F3FB",
				non_qualified: null,
				image: "1f6b6-1f3fb.png",
				sheet_x: 36,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F6B6-1F3FC",
				non_qualified: null,
				image: "1f6b6-1f3fc.png",
				sheet_x: 36,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F6B6-1F3FD",
				non_qualified: null,
				image: "1f6b6-1f3fd.png",
				sheet_x: 36,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F6B6-1F3FE",
				non_qualified: null,
				image: "1f6b6-1f3fe.png",
				sheet_x: 36,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F6B6-1F3FF",
				non_qualified: null,
				image: "1f6b6-1f3ff.png",
				sheet_x: 36,
				sheet_y: 7,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F6B6-200D-2642-FE0F",
		a: "Pedestrian",
		b: "1F6B6",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			36,
			2
		],
		o: 2
	},
	small_red_triangle: {
		a: "Up-Pointing Red Triangle",
		b: "1F53A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"direction",
			"up",
			"top"
		],
		k: [
			28,
			29
		],
		o: 2
	},
	"flag-sh": {
		a: "St. Helena Flag",
		b: "1F1F8-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			7
		],
		o: 2
	},
	stethoscope: {
		a: "Stethoscope",
		b: "1FA7A",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			0
		],
		o: 12
	},
	"man-walking": {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B6-1F3FB-200D-2642-FE0F",
				non_qualified: "1F6B6-1F3FB-200D-2642",
				image: "1f6b6-1f3fb-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F6B6-1F3FC-200D-2642-FE0F",
				non_qualified: "1F6B6-1F3FC-200D-2642",
				image: "1f6b6-1f3fc-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F6B6-1F3FD-200D-2642-FE0F",
				non_qualified: "1F6B6-1F3FD-200D-2642",
				image: "1f6b6-1f3fd-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F6B6-1F3FE-200D-2642-FE0F",
				non_qualified: "1F6B6-1F3FE-200D-2642",
				image: "1f6b6-1f3fe-200d-2642-fe0f.png",
				sheet_x: 36,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F6B6-1F3FF-200D-2642-FE0F",
				non_qualified: "1F6B6-1F3FF-200D-2642",
				image: "1f6b6-1f3ff-200d-2642-fe0f.png",
				sheet_x: 36,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F6B6",
		a: "Man Walking",
		b: "1F6B6-200D-2642-FE0F",
		c: "1F6B6-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			35,
			53
		],
		o: 4
	},
	"flag-si": {
		a: "Slovenia Flag",
		b: "1F1F8-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			8
		],
		o: 2
	},
	door: {
		a: "Door",
		b: "1F6AA",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"house",
			"entry",
			"exit"
		],
		k: [
			35,
			1
		],
		o: 2
	},
	small_red_triangle_down: {
		a: "Down-Pointing Red Triangle",
		b: "1F53B",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"direction",
			"bottom"
		],
		k: [
			28,
			30
		],
		o: 2
	},
	"flag-sj": {
		a: "Svalbard & Jan Mayen Flag",
		b: "1F1F8-1F1EF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			9
		],
		o: 2
	},
	diamond_shape_with_a_dot_inside: {
		a: "Diamond Shape with a Dot Inside",
		b: "1F4A0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"jewel",
			"blue",
			"gem",
			"crystal",
			"fancy"
		],
		k: [
			25,
			42
		],
		o: 2
	},
	"woman-walking": {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B6-1F3FB-200D-2640-FE0F",
				non_qualified: "1F6B6-1F3FB-200D-2640",
				image: "1f6b6-1f3fb-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F6B6-1F3FC-200D-2640-FE0F",
				non_qualified: "1F6B6-1F3FC-200D-2640",
				image: "1f6b6-1f3fc-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F6B6-1F3FD-200D-2640-FE0F",
				non_qualified: "1F6B6-1F3FD-200D-2640",
				image: "1f6b6-1f3fd-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F6B6-1F3FE-200D-2640-FE0F",
				non_qualified: "1F6B6-1F3FE-200D-2640",
				image: "1f6b6-1f3fe-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F6B6-1F3FF-200D-2640-FE0F",
				non_qualified: "1F6B6-1F3FF-200D-2640",
				image: "1f6b6-1f3ff-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 52,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Walking",
		b: "1F6B6-200D-2640-FE0F",
		c: "1F6B6-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			35,
			47
		],
		o: 4
	},
	bed: {
		a: "Bed",
		b: "1F6CF-FE0F",
		c: "1F6CF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sleep",
			"rest"
		],
		k: [
			36,
			37
		],
		o: 2
	},
	radio_button: {
		a: "Radio Button",
		b: "1F518",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"input",
			"old",
			"music",
			"circle"
		],
		k: [
			27,
			52
		],
		o: 2
	},
	"flag-sk": {
		a: "Slovakia Flag",
		b: "1F1F8-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			10
		],
		o: 2
	},
	standing_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CD-1F3FB",
				non_qualified: null,
				image: "1f9cd-1f3fb.png",
				sheet_x: 44,
				sheet_y: 32,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CD-1F3FC",
				non_qualified: null,
				image: "1f9cd-1f3fc.png",
				sheet_x: 44,
				sheet_y: 33,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CD-1F3FD",
				non_qualified: null,
				image: "1f9cd-1f3fd.png",
				sheet_x: 44,
				sheet_y: 34,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CD-1F3FE",
				non_qualified: null,
				image: "1f9cd-1f3fe.png",
				sheet_x: 44,
				sheet_y: 35,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CD-1F3FF",
				non_qualified: null,
				image: "1f9cd-1f3ff.png",
				sheet_x: 44,
				sheet_y: 36,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Standing Person",
		b: "1F9CD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			31
		],
		o: 12
	},
	couch_and_lamp: {
		a: "Couch and Lamp",
		b: "1F6CB-FE0F",
		c: "1F6CB",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"read",
			"chill"
		],
		k: [
			36,
			28
		],
		o: 2
	},
	man_standing: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CD-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9CD-1F3FB-200D-2642",
				image: "1f9cd-1f3fb-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 26,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CD-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9CD-1F3FC-200D-2642",
				image: "1f9cd-1f3fc-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 27,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CD-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9CD-1F3FD-200D-2642",
				image: "1f9cd-1f3fd-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 28,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CD-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9CD-1F3FE-200D-2642",
				image: "1f9cd-1f3fe-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 29,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CD-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9CD-1F3FF-200D-2642",
				image: "1f9cd-1f3ff-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 30,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Standing",
		b: "1F9CD-200D-2642-FE0F",
		c: "1F9CD-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			25
		],
		o: 12
	},
	white_square_button: {
		a: "White Square Button",
		b: "1F533",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"input"
		],
		k: [
			28,
			22
		],
		o: 2
	},
	"flag-sl": {
		a: "Sierra Leone Flag",
		b: "1F1F8-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			11
		],
		o: 2
	},
	chair: {
		a: "Chair",
		b: "1FA91",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			5
		],
		o: 12
	},
	toilet: {
		a: "Toilet",
		b: "1F6BD",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"restroom",
			"wc",
			"washroom",
			"bathroom",
			"potty"
		],
		k: [
			36,
			14
		],
		o: 2
	},
	black_square_button: {
		a: "Black Square Button",
		b: "1F532",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"shape",
			"input",
			"frame"
		],
		k: [
			28,
			21
		],
		o: 2
	},
	"flag-sm": {
		a: "San Marino Flag",
		b: "1F1F8-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			12
		],
		o: 2
	},
	woman_standing: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CD-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9CD-1F3FB-200D-2640",
				image: "1f9cd-1f3fb-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 20,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CD-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9CD-1F3FC-200D-2640",
				image: "1f9cd-1f3fc-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 21,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CD-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9CD-1F3FD-200D-2640",
				image: "1f9cd-1f3fd-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 22,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CD-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9CD-1F3FE-200D-2640",
				image: "1f9cd-1f3fe-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 23,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CD-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9CD-1F3FF-200D-2640",
				image: "1f9cd-1f3ff-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 24,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Standing",
		b: "1F9CD-200D-2640-FE0F",
		c: "1F9CD-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			19
		],
		o: 12
	},
	kneeling_person: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CE-1F3FB",
				non_qualified: null,
				image: "1f9ce-1f3fb.png",
				sheet_x: 44,
				sheet_y: 50,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CE-1F3FC",
				non_qualified: null,
				image: "1f9ce-1f3fc.png",
				sheet_x: 44,
				sheet_y: 51,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CE-1F3FD",
				non_qualified: null,
				image: "1f9ce-1f3fd.png",
				sheet_x: 44,
				sheet_y: 52,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CE-1F3FE",
				non_qualified: null,
				image: "1f9ce-1f3fe.png",
				sheet_x: 44,
				sheet_y: 53,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CE-1F3FF",
				non_qualified: null,
				image: "1f9ce-1f3ff.png",
				sheet_x: 44,
				sheet_y: 54,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Kneeling Person",
		b: "1F9CE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			49
		],
		o: 12
	},
	shower: {
		a: "Shower",
		b: "1F6BF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"clean",
			"water",
			"bathroom"
		],
		k: [
			36,
			16
		],
		o: 2
	},
	"flag-sn": {
		a: "Senegal Flag",
		b: "1F1F8-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			13
		],
		o: 2
	},
	bathtub: {
		a: "Bathtub",
		b: "1F6C1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"clean",
			"shower",
			"bathroom"
		],
		k: [
			36,
			23
		],
		o: 2
	},
	"flag-so": {
		a: "Somalia Flag",
		b: "1F1F8-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			14
		],
		o: 2
	},
	man_kneeling: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CE-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9CE-1F3FB-200D-2642",
				image: "1f9ce-1f3fb-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 44,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CE-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9CE-1F3FC-200D-2642",
				image: "1f9ce-1f3fc-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 45,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CE-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9CE-1F3FD-200D-2642",
				image: "1f9ce-1f3fd-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 46,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CE-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9CE-1F3FE-200D-2642",
				image: "1f9ce-1f3fe-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 47,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CE-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9CE-1F3FF-200D-2642",
				image: "1f9ce-1f3ff-200d-2642-fe0f.png",
				sheet_x: 44,
				sheet_y: 48,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Kneeling",
		b: "1F9CE-200D-2642-FE0F",
		c: "1F9CE-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			43
		],
		o: 12
	},
	"flag-sr": {
		a: "Suriname Flag",
		b: "1F1F8-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			15
		],
		o: 2
	},
	woman_kneeling: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9CE-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9CE-1F3FB-200D-2640",
				image: "1f9ce-1f3fb-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 38,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9CE-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9CE-1F3FC-200D-2640",
				image: "1f9ce-1f3fc-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 39,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9CE-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9CE-1F3FD-200D-2640",
				image: "1f9ce-1f3fd-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 40,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9CE-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9CE-1F3FE-200D-2640",
				image: "1f9ce-1f3fe-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 41,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9CE-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9CE-1F3FF-200D-2640",
				image: "1f9ce-1f3ff-200d-2640-fe0f.png",
				sheet_x: 44,
				sheet_y: 42,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Kneeling",
		b: "1F9CE-200D-2640-FE0F",
		c: "1F9CE-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			44,
			37
		],
		o: 12
	},
	razor: {
		a: "Razor",
		b: "1FA92",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			52,
			6
		],
		o: 12
	},
	person_with_probing_cane: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F9AF",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f9af.png",
				sheet_x: 47,
				sheet_y: 8,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F9AF",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f9af.png",
				sheet_x: 47,
				sheet_y: 9,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F9AF",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f9af.png",
				sheet_x: 47,
				sheet_y: 10,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F9AF",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f9af.png",
				sheet_x: 47,
				sheet_y: 11,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F9AF",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f9af.png",
				sheet_x: 47,
				sheet_y: 12,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Person with Probing Cane",
		b: "1F9D1-200D-1F9AF",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			7
		],
		o: 12
	},
	"flag-ss": {
		a: "South Sudan Flag",
		b: "1F1F8-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			16
		],
		o: 2
	},
	lotion_bottle: {
		a: "Lotion Bottle",
		b: "1F9F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			39
		],
		o: 11
	},
	"flag-st": {
		a: "São Tomé & Príncipe Flag",
		b: "1F1F8-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			17
		],
		o: 2
	},
	safety_pin: {
		a: "Safety Pin",
		b: "1F9F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			42
		],
		o: 11
	},
	man_with_probing_cane: {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F9AF",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f9af.png",
				sheet_x: 16,
				sheet_y: 18,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F9AF",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f9af.png",
				sheet_x: 16,
				sheet_y: 19,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F9AF",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f9af.png",
				sheet_x: 16,
				sheet_y: 20,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F9AF",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f9af.png",
				sheet_x: 16,
				sheet_y: 21,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F9AF",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f9af.png",
				sheet_x: 16,
				sheet_y: 22,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man with Probing Cane",
		b: "1F468-200D-1F9AF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			17
		],
		o: 12
	},
	broom: {
		a: "Broom",
		b: "1F9F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			44
		],
		o: 11
	},
	woman_with_probing_cane: {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F9AF",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f9af.png",
				sheet_x: 19,
				sheet_y: 3,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F9AF",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f9af.png",
				sheet_x: 19,
				sheet_y: 4,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F9AF",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f9af.png",
				sheet_x: 19,
				sheet_y: 5,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F9AF",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f9af.png",
				sheet_x: 19,
				sheet_y: 6,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F9AF",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f9af.png",
				sheet_x: 19,
				sheet_y: 7,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman with Probing Cane",
		b: "1F469-200D-1F9AF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			2
		],
		o: 12
	},
	"flag-sv": {
		a: "El Salvador Flag",
		b: "1F1F8-1F1FB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			18
		],
		o: 2
	},
	"flag-sx": {
		a: "Sint Maarten Flag",
		b: "1F1F8-1F1FD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			19
		],
		o: 2
	},
	basket: {
		a: "Basket",
		b: "1F9FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			45
		],
		o: 11
	},
	person_in_motorized_wheelchair: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F9BC",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f9bc.png",
				sheet_x: 47,
				sheet_y: 38,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F9BC",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f9bc.png",
				sheet_x: 47,
				sheet_y: 39,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F9BC",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f9bc.png",
				sheet_x: 47,
				sheet_y: 40,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F9BC",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f9bc.png",
				sheet_x: 47,
				sheet_y: 41,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F9BC",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f9bc.png",
				sheet_x: 47,
				sheet_y: 42,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Person in Motorized Wheelchair",
		b: "1F9D1-200D-1F9BC",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			37
		],
		o: 12
	},
	man_in_motorized_wheelchair: {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F9BC",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f9bc.png",
				sheet_x: 16,
				sheet_y: 48,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F9BC",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f9bc.png",
				sheet_x: 16,
				sheet_y: 49,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F9BC",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f9bc.png",
				sheet_x: 16,
				sheet_y: 50,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F9BC",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f9bc.png",
				sheet_x: 16,
				sheet_y: 51,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F9BC",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f9bc.png",
				sheet_x: 16,
				sheet_y: 52,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man in Motorized Wheelchair",
		b: "1F468-200D-1F9BC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			47
		],
		o: 12
	},
	"flag-sy": {
		a: "Syria Flag",
		b: "1F1F8-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			20
		],
		o: 2
	},
	roll_of_paper: {
		a: "Roll of Paper",
		b: "1F9FB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			46
		],
		o: 11
	},
	woman_in_motorized_wheelchair: {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F9BC",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f9bc.png",
				sheet_x: 19,
				sheet_y: 33,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F9BC",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f9bc.png",
				sheet_x: 19,
				sheet_y: 34,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F9BC",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f9bc.png",
				sheet_x: 19,
				sheet_y: 35,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F9BC",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f9bc.png",
				sheet_x: 19,
				sheet_y: 36,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F9BC",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f9bc.png",
				sheet_x: 19,
				sheet_y: 37,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman in Motorized Wheelchair",
		b: "1F469-200D-1F9BC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			32
		],
		o: 12
	},
	"flag-sz": {
		a: "Eswatini Flag",
		b: "1F1F8-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			21
		],
		o: 2
	},
	soap: {
		a: "Bar of Soap",
		b: "1F9FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			47
		],
		o: 11
	},
	"flag-ta": {
		a: "Tristan Da Cunha Flag",
		b: "1F1F9-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			22
		],
		o: 2
	},
	sponge: {
		a: "Sponge",
		b: "1F9FD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			48
		],
		o: 11
	},
	person_in_manual_wheelchair: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D1-1F3FB-200D-1F9BD",
				non_qualified: null,
				image: "1f9d1-1f3fb-200d-1f9bd.png",
				sheet_x: 47,
				sheet_y: 44,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F9D1-1F3FC-200D-1F9BD",
				non_qualified: null,
				image: "1f9d1-1f3fc-200d-1f9bd.png",
				sheet_x: 47,
				sheet_y: 45,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F9D1-1F3FD-200D-1F9BD",
				non_qualified: null,
				image: "1f9d1-1f3fd-200d-1f9bd.png",
				sheet_x: 47,
				sheet_y: 46,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F9D1-1F3FE-200D-1F9BD",
				non_qualified: null,
				image: "1f9d1-1f3fe-200d-1f9bd.png",
				sheet_x: 47,
				sheet_y: 47,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F9D1-1F3FF-200D-1F9BD",
				non_qualified: null,
				image: "1f9d1-1f3ff-200d-1f9bd.png",
				sheet_x: 47,
				sheet_y: 48,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: false,
				has_img_twitter: false,
				has_img_facebook: false
			}
		},
		a: "Person in Manual Wheelchair",
		b: "1F9D1-200D-1F9BD",
		d: true,
		e: false,
		f: false,
		h: false,
		k: [
			47,
			43
		],
		o: 12
	},
	fire_extinguisher: {
		a: "Fire Extinguisher",
		b: "1F9EF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			51,
			34
		],
		o: 11
	},
	man_in_manual_wheelchair: {
		skin_variations: {
			"1F3FB": {
				unified: "1F468-1F3FB-200D-1F9BD",
				non_qualified: null,
				image: "1f468-1f3fb-200d-1f9bd.png",
				sheet_x: 16,
				sheet_y: 54,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F468-1F3FC-200D-1F9BD",
				non_qualified: null,
				image: "1f468-1f3fc-200d-1f9bd.png",
				sheet_x: 16,
				sheet_y: 55,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F468-1F3FD-200D-1F9BD",
				non_qualified: null,
				image: "1f468-1f3fd-200d-1f9bd.png",
				sheet_x: 16,
				sheet_y: 56,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F468-1F3FE-200D-1F9BD",
				non_qualified: null,
				image: "1f468-1f3fe-200d-1f9bd.png",
				sheet_x: 17,
				sheet_y: 0,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F468-1F3FF-200D-1F9BD",
				non_qualified: null,
				image: "1f468-1f3ff-200d-1f9bd.png",
				sheet_x: 17,
				sheet_y: 1,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man in Manual Wheelchair",
		b: "1F468-200D-1F9BD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			16,
			53
		],
		o: 12
	},
	"flag-tc": {
		a: "Turks & Caicos Islands Flag",
		b: "1F1F9-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			23
		],
		o: 2
	},
	woman_in_manual_wheelchair: {
		skin_variations: {
			"1F3FB": {
				unified: "1F469-1F3FB-200D-1F9BD",
				non_qualified: null,
				image: "1f469-1f3fb-200d-1f9bd.png",
				sheet_x: 19,
				sheet_y: 39,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F469-1F3FC-200D-1F9BD",
				non_qualified: null,
				image: "1f469-1f3fc-200d-1f9bd.png",
				sheet_x: 19,
				sheet_y: 40,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F469-1F3FD-200D-1F9BD",
				non_qualified: null,
				image: "1f469-1f3fd-200d-1f9bd.png",
				sheet_x: 19,
				sheet_y: 41,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F469-1F3FE-200D-1F9BD",
				non_qualified: null,
				image: "1f469-1f3fe-200d-1f9bd.png",
				sheet_x: 19,
				sheet_y: 42,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F469-1F3FF-200D-1F9BD",
				non_qualified: null,
				image: "1f469-1f3ff-200d-1f9bd.png",
				sheet_x: 19,
				sheet_y: 43,
				added_in: "12.1",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman in Manual Wheelchair",
		b: "1F469-200D-1F9BD",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			19,
			38
		],
		o: 12
	},
	"flag-td": {
		a: "Chad Flag",
		b: "1F1F9-1F1E9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			24
		],
		o: 2
	},
	shopping_trolley: {
		a: "Shopping Trolley",
		b: "1F6D2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			36,
			40
		],
		o: 4
	},
	runner: {
		skin_variations: {
			"1F3FB": {
				unified: "1F3C3-1F3FB",
				non_qualified: null,
				image: "1f3c3-1f3fb.png",
				sheet_x: 9,
				sheet_y: 2,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F3C3-1F3FC",
				non_qualified: null,
				image: "1f3c3-1f3fc.png",
				sheet_x: 9,
				sheet_y: 3,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F3C3-1F3FD",
				non_qualified: null,
				image: "1f3c3-1f3fd.png",
				sheet_x: 9,
				sheet_y: 4,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F3C3-1F3FE",
				non_qualified: null,
				image: "1f3c3-1f3fe.png",
				sheet_x: 9,
				sheet_y: 5,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F3C3-1F3FF",
				non_qualified: null,
				image: "1f3c3-1f3ff.png",
				sheet_x: 9,
				sheet_y: 6,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F3C3-200D-2642-FE0F",
		a: "Runner",
		b: "1F3C3",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			9,
			1
		],
		n: [
			"running"
		],
		o: 2
	},
	"flag-tf": {
		a: "French Southern Territories Flag",
		b: "1F1F9-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			25
		],
		o: 2
	},
	smoking: {
		a: "Smoking Symbol",
		b: "1F6AC",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"kills",
			"tobacco",
			"cigarette",
			"joint",
			"smoke"
		],
		k: [
			35,
			3
		],
		o: 2
	},
	coffin: {
		a: "Coffin",
		b: "26B0-FE0F",
		c: "26B0",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"vampire",
			"dead",
			"die",
			"death",
			"rip",
			"graveyard",
			"cemetery",
			"casket",
			"funeral",
			"box"
		],
		k: [
			53,
			54
		],
		o: 2
	},
	"man-running": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3C3-1F3FB-200D-2642-FE0F",
				non_qualified: "1F3C3-1F3FB-200D-2642",
				image: "1f3c3-1f3fb-200d-2642-fe0f.png",
				sheet_x: 8,
				sheet_y: 53,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3C3-1F3FC-200D-2642-FE0F",
				non_qualified: "1F3C3-1F3FC-200D-2642",
				image: "1f3c3-1f3fc-200d-2642-fe0f.png",
				sheet_x: 8,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3C3-1F3FD-200D-2642-FE0F",
				non_qualified: "1F3C3-1F3FD-200D-2642",
				image: "1f3c3-1f3fd-200d-2642-fe0f.png",
				sheet_x: 8,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3C3-1F3FE-200D-2642-FE0F",
				non_qualified: "1F3C3-1F3FE-200D-2642",
				image: "1f3c3-1f3fe-200d-2642-fe0f.png",
				sheet_x: 8,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3C3-1F3FF-200D-2642-FE0F",
				non_qualified: "1F3C3-1F3FF-200D-2642",
				image: "1f3c3-1f3ff-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F3C3",
		a: "Man Running",
		b: "1F3C3-200D-2642-FE0F",
		c: "1F3C3-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			8,
			52
		],
		o: 4
	},
	"flag-tg": {
		a: "Togo Flag",
		b: "1F1F9-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			26
		],
		o: 2
	},
	"woman-running": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3C3-1F3FB-200D-2640-FE0F",
				non_qualified: "1F3C3-1F3FB-200D-2640",
				image: "1f3c3-1f3fb-200d-2640-fe0f.png",
				sheet_x: 8,
				sheet_y: 47,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3C3-1F3FC-200D-2640-FE0F",
				non_qualified: "1F3C3-1F3FC-200D-2640",
				image: "1f3c3-1f3fc-200d-2640-fe0f.png",
				sheet_x: 8,
				sheet_y: 48,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3C3-1F3FD-200D-2640-FE0F",
				non_qualified: "1F3C3-1F3FD-200D-2640",
				image: "1f3c3-1f3fd-200d-2640-fe0f.png",
				sheet_x: 8,
				sheet_y: 49,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3C3-1F3FE-200D-2640-FE0F",
				non_qualified: "1F3C3-1F3FE-200D-2640",
				image: "1f3c3-1f3fe-200d-2640-fe0f.png",
				sheet_x: 8,
				sheet_y: 50,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3C3-1F3FF-200D-2640-FE0F",
				non_qualified: "1F3C3-1F3FF-200D-2640",
				image: "1f3c3-1f3ff-200d-2640-fe0f.png",
				sheet_x: 8,
				sheet_y: 51,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Running",
		b: "1F3C3-200D-2640-FE0F",
		c: "1F3C3-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			8,
			46
		],
		o: 4
	},
	funeral_urn: {
		a: "Funeral Urn",
		b: "26B1-FE0F",
		c: "26B1",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"dead",
			"die",
			"death",
			"rip",
			"ashes"
		],
		k: [
			53,
			55
		],
		o: 2
	},
	"flag-th": {
		a: "Thailand Flag",
		b: "1F1F9-1F1ED",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			27
		],
		o: 2
	},
	moyai: {
		a: "Moyai",
		b: "1F5FF",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"rock",
			"easter island",
			"moai"
		],
		k: [
			30,
			34
		],
		o: 2
	},
	"flag-tj": {
		a: "Tajikistan Flag",
		b: "1F1F9-1F1EF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			28
		],
		o: 2
	},
	dancer: {
		skin_variations: {
			"1F3FB": {
				unified: "1F483-1F3FB",
				non_qualified: null,
				image: "1f483-1f3fb.png",
				sheet_x: 24,
				sheet_y: 27,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F483-1F3FC",
				non_qualified: null,
				image: "1f483-1f3fc.png",
				sheet_x: 24,
				sheet_y: 28,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F483-1F3FD",
				non_qualified: null,
				image: "1f483-1f3fd.png",
				sheet_x: 24,
				sheet_y: 29,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F483-1F3FE",
				non_qualified: null,
				image: "1f483-1f3fe.png",
				sheet_x: 24,
				sheet_y: 30,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F483-1F3FF",
				non_qualified: null,
				image: "1f483-1f3ff.png",
				sheet_x: 24,
				sheet_y: 31,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Dancer",
		b: "1F483",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"female",
			"girl",
			"woman",
			"fun"
		],
		k: [
			24,
			26
		],
		o: 2
	},
	"flag-tk": {
		a: "Tokelau Flag",
		b: "1F1F9-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			29
		],
		o: 2
	},
	man_dancing: {
		skin_variations: {
			"1F3FB": {
				unified: "1F57A-1F3FB",
				non_qualified: null,
				image: "1f57a-1f3fb.png",
				sheet_x: 29,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F57A-1F3FC",
				non_qualified: null,
				image: "1f57a-1f3fc.png",
				sheet_x: 29,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F57A-1F3FD",
				non_qualified: null,
				image: "1f57a-1f3fd.png",
				sheet_x: 29,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F57A-1F3FE",
				non_qualified: null,
				image: "1f57a-1f3fe.png",
				sheet_x: 29,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F57A-1F3FF",
				non_qualified: null,
				image: "1f57a-1f3ff.png",
				sheet_x: 29,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Dancing",
		b: "1F57A",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"male",
			"boy",
			"fun",
			"dancer"
		],
		k: [
			29,
			37
		],
		o: 4
	},
	"flag-tl": {
		a: "Timor-Leste Flag",
		b: "1F1F9-1F1F1",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			30
		],
		o: 2
	},
	man_in_business_suit_levitating: {
		skin_variations: {
			"1F3FB": {
				unified: "1F574-1F3FB",
				non_qualified: null,
				image: "1f574-1f3fb.png",
				sheet_x: 29,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F574-1F3FC",
				non_qualified: null,
				image: "1f574-1f3fc.png",
				sheet_x: 29,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F574-1F3FD",
				non_qualified: null,
				image: "1f574-1f3fd.png",
				sheet_x: 29,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F574-1F3FE",
				non_qualified: null,
				image: "1f574-1f3fe.png",
				sheet_x: 29,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F574-1F3FF",
				non_qualified: null,
				image: "1f574-1f3ff.png",
				sheet_x: 29,
				sheet_y: 14,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man in Business Suit Levitating",
		b: "1F574-FE0F",
		c: "1F574",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			29,
			9
		],
		o: 2
	},
	"flag-tm": {
		a: "Turkmenistan Flag",
		b: "1F1F9-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			31
		],
		o: 2
	},
	dancers: {
		obsoleted_by: "1F46F-200D-2640-FE0F",
		a: "Woman with Bunny Ears",
		b: "1F46F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			22,
			0
		],
		o: 2
	},
	"man-with-bunny-ears-partying": {
		a: "Man with Bunny Ears Partying",
		b: "1F46F-200D-2642-FE0F",
		c: "1F46F-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			21,
			56
		],
		o: 4
	},
	"flag-tn": {
		a: "Tunisia Flag",
		b: "1F1F9-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			32
		],
		o: 2
	},
	"flag-to": {
		a: "Tonga Flag",
		b: "1F1F9-1F1F4",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			33
		],
		o: 2
	},
	"woman-with-bunny-ears-partying": {
		obsoletes: "1F46F",
		a: "Woman with Bunny Ears Partying",
		b: "1F46F-200D-2640-FE0F",
		c: "1F46F-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			21,
			55
		],
		o: 4
	},
	"flag-tr": {
		a: "Turkey Flag",
		b: "1F1F9-1F1F7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			34
		],
		o: 2
	},
	person_in_steamy_room: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D6-1F3FB",
				non_qualified: null,
				image: "1f9d6-1f3fb.png",
				sheet_x: 48,
				sheet_y: 53,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D6-1F3FB-200D-2642-FE0F"
			},
			"1F3FC": {
				unified: "1F9D6-1F3FC",
				non_qualified: null,
				image: "1f9d6-1f3fc.png",
				sheet_x: 48,
				sheet_y: 54,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D6-1F3FC-200D-2642-FE0F"
			},
			"1F3FD": {
				unified: "1F9D6-1F3FD",
				non_qualified: null,
				image: "1f9d6-1f3fd.png",
				sheet_x: 48,
				sheet_y: 55,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D6-1F3FD-200D-2642-FE0F"
			},
			"1F3FE": {
				unified: "1F9D6-1F3FE",
				non_qualified: null,
				image: "1f9d6-1f3fe.png",
				sheet_x: 48,
				sheet_y: 56,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D6-1F3FE-200D-2642-FE0F"
			},
			"1F3FF": {
				unified: "1F9D6-1F3FF",
				non_qualified: null,
				image: "1f9d6-1f3ff.png",
				sheet_x: 49,
				sheet_y: 0,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D6-1F3FF-200D-2642-FE0F"
			}
		},
		obsoleted_by: "1F9D6-200D-2642-FE0F",
		a: "Person in Steamy Room",
		b: "1F9D6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			48,
			52
		],
		o: 5
	},
	man_in_steamy_room: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D6-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9D6-1F3FB-200D-2642",
				image: "1f9d6-1f3fb-200d-2642-fe0f.png",
				sheet_x: 48,
				sheet_y: 47,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D6-1F3FB"
			},
			"1F3FC": {
				unified: "1F9D6-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9D6-1F3FC-200D-2642",
				image: "1f9d6-1f3fc-200d-2642-fe0f.png",
				sheet_x: 48,
				sheet_y: 48,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D6-1F3FC"
			},
			"1F3FD": {
				unified: "1F9D6-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9D6-1F3FD-200D-2642",
				image: "1f9d6-1f3fd-200d-2642-fe0f.png",
				sheet_x: 48,
				sheet_y: 49,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D6-1F3FD"
			},
			"1F3FE": {
				unified: "1F9D6-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9D6-1F3FE-200D-2642",
				image: "1f9d6-1f3fe-200d-2642-fe0f.png",
				sheet_x: 48,
				sheet_y: 50,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D6-1F3FE"
			},
			"1F3FF": {
				unified: "1F9D6-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9D6-1F3FF-200D-2642",
				image: "1f9d6-1f3ff-200d-2642-fe0f.png",
				sheet_x: 48,
				sheet_y: 51,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D6-1F3FF"
			}
		},
		obsoletes: "1F9D6",
		a: "Man in Steamy Room",
		b: "1F9D6-200D-2642-FE0F",
		c: "1F9D6-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			48,
			46
		],
		o: 5
	},
	"flag-tt": {
		a: "Trinidad & Tobago Flag",
		b: "1F1F9-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			35
		],
		o: 2
	},
	woman_in_steamy_room: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D6-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9D6-1F3FB-200D-2640",
				image: "1f9d6-1f3fb-200d-2640-fe0f.png",
				sheet_x: 48,
				sheet_y: 41,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9D6-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9D6-1F3FC-200D-2640",
				image: "1f9d6-1f3fc-200d-2640-fe0f.png",
				sheet_x: 48,
				sheet_y: 42,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9D6-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9D6-1F3FD-200D-2640",
				image: "1f9d6-1f3fd-200d-2640-fe0f.png",
				sheet_x: 48,
				sheet_y: 43,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9D6-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9D6-1F3FE-200D-2640",
				image: "1f9d6-1f3fe-200d-2640-fe0f.png",
				sheet_x: 48,
				sheet_y: 44,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9D6-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9D6-1F3FF-200D-2640",
				image: "1f9d6-1f3ff-200d-2640-fe0f.png",
				sheet_x: 48,
				sheet_y: 45,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman in Steamy Room",
		b: "1F9D6-200D-2640-FE0F",
		c: "1F9D6-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			48,
			40
		],
		o: 5
	},
	"flag-tv": {
		a: "Tuvalu Flag",
		b: "1F1F9-1F1FB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			36
		],
		o: 2
	},
	"flag-tw": {
		a: "Taiwan Flag",
		b: "1F1F9-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			37
		],
		o: 2
	},
	person_climbing: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D7-1F3FB",
				non_qualified: null,
				image: "1f9d7-1f3fb.png",
				sheet_x: 49,
				sheet_y: 14,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D7-1F3FB-200D-2640-FE0F"
			},
			"1F3FC": {
				unified: "1F9D7-1F3FC",
				non_qualified: null,
				image: "1f9d7-1f3fc.png",
				sheet_x: 49,
				sheet_y: 15,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D7-1F3FC-200D-2640-FE0F"
			},
			"1F3FD": {
				unified: "1F9D7-1F3FD",
				non_qualified: null,
				image: "1f9d7-1f3fd.png",
				sheet_x: 49,
				sheet_y: 16,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D7-1F3FD-200D-2640-FE0F"
			},
			"1F3FE": {
				unified: "1F9D7-1F3FE",
				non_qualified: null,
				image: "1f9d7-1f3fe.png",
				sheet_x: 49,
				sheet_y: 17,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D7-1F3FE-200D-2640-FE0F"
			},
			"1F3FF": {
				unified: "1F9D7-1F3FF",
				non_qualified: null,
				image: "1f9d7-1f3ff.png",
				sheet_x: 49,
				sheet_y: 18,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoleted_by: "1F9D7-1F3FF-200D-2640-FE0F"
			}
		},
		obsoleted_by: "1F9D7-200D-2640-FE0F",
		a: "Person Climbing",
		b: "1F9D7",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			49,
			13
		],
		o: 5
	},
	man_climbing: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D7-1F3FB-200D-2642-FE0F",
				non_qualified: "1F9D7-1F3FB-200D-2642",
				image: "1f9d7-1f3fb-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 8,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F9D7-1F3FC-200D-2642-FE0F",
				non_qualified: "1F9D7-1F3FC-200D-2642",
				image: "1f9d7-1f3fc-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 9,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F9D7-1F3FD-200D-2642-FE0F",
				non_qualified: "1F9D7-1F3FD-200D-2642",
				image: "1f9d7-1f3fd-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 10,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F9D7-1F3FE-200D-2642-FE0F",
				non_qualified: "1F9D7-1F3FE-200D-2642",
				image: "1f9d7-1f3fe-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 11,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F9D7-1F3FF-200D-2642-FE0F",
				non_qualified: "1F9D7-1F3FF-200D-2642",
				image: "1f9d7-1f3ff-200d-2642-fe0f.png",
				sheet_x: 49,
				sheet_y: 12,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Man Climbing",
		b: "1F9D7-200D-2642-FE0F",
		c: "1F9D7-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			49,
			7
		],
		o: 5
	},
	"flag-tz": {
		a: "Tanzania Flag",
		b: "1F1F9-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			38
		],
		o: 2
	},
	"flag-ua": {
		a: "Ukraine Flag",
		b: "1F1FA-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			39
		],
		o: 2
	},
	woman_climbing: {
		skin_variations: {
			"1F3FB": {
				unified: "1F9D7-1F3FB-200D-2640-FE0F",
				non_qualified: "1F9D7-1F3FB-200D-2640",
				image: "1f9d7-1f3fb-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 2,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D7-1F3FB"
			},
			"1F3FC": {
				unified: "1F9D7-1F3FC-200D-2640-FE0F",
				non_qualified: "1F9D7-1F3FC-200D-2640",
				image: "1f9d7-1f3fc-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 3,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D7-1F3FC"
			},
			"1F3FD": {
				unified: "1F9D7-1F3FD-200D-2640-FE0F",
				non_qualified: "1F9D7-1F3FD-200D-2640",
				image: "1f9d7-1f3fd-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 4,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D7-1F3FD"
			},
			"1F3FE": {
				unified: "1F9D7-1F3FE-200D-2640-FE0F",
				non_qualified: "1F9D7-1F3FE-200D-2640",
				image: "1f9d7-1f3fe-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 5,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D7-1F3FE"
			},
			"1F3FF": {
				unified: "1F9D7-1F3FF-200D-2640-FE0F",
				non_qualified: "1F9D7-1F3FF-200D-2640",
				image: "1f9d7-1f3ff-200d-2640-fe0f.png",
				sheet_x: 49,
				sheet_y: 6,
				added_in: "5.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true,
				obsoletes: "1F9D7-1F3FF"
			}
		},
		obsoletes: "1F9D7",
		a: "Woman Climbing",
		b: "1F9D7-200D-2640-FE0F",
		c: "1F9D7-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			49,
			1
		],
		o: 5
	},
	"flag-ug": {
		a: "Uganda Flag",
		b: "1F1FA-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			40
		],
		o: 2
	},
	fencer: {
		a: "Fencer",
		b: "1F93A",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			40,
			32
		],
		o: 4
	},
	"flag-um": {
		a: "U.s. Outlying Islands Flag",
		b: "1F1FA-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			41
		],
		o: 2
	},
	horse_racing: {
		skin_variations: {
			"1F3FB": {
				unified: "1F3C7-1F3FB",
				non_qualified: null,
				image: "1f3c7-1f3fb.png",
				sheet_x: 9,
				sheet_y: 28,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3C7-1F3FC",
				non_qualified: null,
				image: "1f3c7-1f3fc.png",
				sheet_x: 9,
				sheet_y: 29,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3C7-1F3FD",
				non_qualified: null,
				image: "1f3c7-1f3fd.png",
				sheet_x: 9,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3C7-1F3FE",
				non_qualified: null,
				image: "1f3c7-1f3fe.png",
				sheet_x: 9,
				sheet_y: 31,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3C7-1F3FF",
				non_qualified: null,
				image: "1f3c7-1f3ff.png",
				sheet_x: 9,
				sheet_y: 32,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Horse Racing",
		b: "1F3C7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"animal",
			"betting",
			"competition",
			"gambling",
			"luck"
		],
		k: [
			9,
			27
		],
		o: 2
	},
	skier: {
		a: "Skier",
		b: "26F7-FE0F",
		c: "26F7",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"winter",
			"snow"
		],
		k: [
			54,
			17
		],
		o: 2
	},
	"flag-un": {
		a: "United Nations Flag",
		b: "1F1FA-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			42
		],
		o: 4
	},
	us: {
		a: "United States Flag",
		b: "1F1FA-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"united",
			"states",
			"america",
			"flag",
			"nation",
			"country",
			"banner"
		],
		k: [
			4,
			43
		],
		n: [
			"flag-us"
		],
		o: 2
	},
	snowboarder: {
		skin_variations: {
			"1F3FB": {
				unified: "1F3C2-1F3FB",
				non_qualified: null,
				image: "1f3c2-1f3fb.png",
				sheet_x: 8,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3C2-1F3FC",
				non_qualified: null,
				image: "1f3c2-1f3fc.png",
				sheet_x: 8,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3C2-1F3FD",
				non_qualified: null,
				image: "1f3c2-1f3fd.png",
				sheet_x: 8,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3C2-1F3FE",
				non_qualified: null,
				image: "1f3c2-1f3fe.png",
				sheet_x: 8,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3C2-1F3FF",
				non_qualified: null,
				image: "1f3c2-1f3ff.png",
				sheet_x: 8,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Snowboarder",
		b: "1F3C2",
		d: true,
		e: true,
		f: true,
		h: true,
		j: [
			"sports",
			"winter"
		],
		k: [
			8,
			40
		],
		o: 2
	},
	golfer: {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CC-1F3FB",
				non_qualified: null,
				image: "1f3cc-1f3fb.png",
				sheet_x: 10,
				sheet_y: 27,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F3CC-1F3FC",
				non_qualified: null,
				image: "1f3cc-1f3fc.png",
				sheet_x: 10,
				sheet_y: 28,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F3CC-1F3FD",
				non_qualified: null,
				image: "1f3cc-1f3fd.png",
				sheet_x: 10,
				sheet_y: 29,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F3CC-1F3FE",
				non_qualified: null,
				image: "1f3cc-1f3fe.png",
				sheet_x: 10,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F3CC-1F3FF",
				non_qualified: null,
				image: "1f3cc-1f3ff.png",
				sheet_x: 10,
				sheet_y: 31,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F3CC-FE0F-200D-2642-FE0F",
		a: "Golfer",
		b: "1F3CC-FE0F",
		c: "1F3CC",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			10,
			26
		],
		o: 2
	},
	"flag-uy": {
		a: "Uruguay Flag",
		b: "1F1FA-1F1FE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			44
		],
		o: 2
	},
	"flag-uz": {
		a: "Uzbekistan Flag",
		b: "1F1FA-1F1FF",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			45
		],
		o: 2
	},
	"man-golfing": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CC-1F3FB-200D-2642-FE0F",
				non_qualified: "1F3CC-1F3FB-200D-2642",
				image: "1f3cc-1f3fb-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 21,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3CC-1F3FC-200D-2642-FE0F",
				non_qualified: "1F3CC-1F3FC-200D-2642",
				image: "1f3cc-1f3fc-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 22,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3CC-1F3FD-200D-2642-FE0F",
				non_qualified: "1F3CC-1F3FD-200D-2642",
				image: "1f3cc-1f3fd-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 23,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3CC-1F3FE-200D-2642-FE0F",
				non_qualified: "1F3CC-1F3FE-200D-2642",
				image: "1f3cc-1f3fe-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 24,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3CC-1F3FF-200D-2642-FE0F",
				non_qualified: "1F3CC-1F3FF-200D-2642",
				image: "1f3cc-1f3ff-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 25,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F3CC-FE0F",
		a: "Man Golfing",
		b: "1F3CC-FE0F-200D-2642-FE0F",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			10,
			20
		],
		o: 4
	},
	"flag-va": {
		a: "Vatican City Flag",
		b: "1F1FB-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			46
		],
		o: 2
	},
	"woman-golfing": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CC-1F3FB-200D-2640-FE0F",
				non_qualified: "1F3CC-1F3FB-200D-2640",
				image: "1f3cc-1f3fb-200d-2640-fe0f.png",
				sheet_x: 10,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3CC-1F3FC-200D-2640-FE0F",
				non_qualified: "1F3CC-1F3FC-200D-2640",
				image: "1f3cc-1f3fc-200d-2640-fe0f.png",
				sheet_x: 10,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3CC-1F3FD-200D-2640-FE0F",
				non_qualified: "1F3CC-1F3FD-200D-2640",
				image: "1f3cc-1f3fd-200d-2640-fe0f.png",
				sheet_x: 10,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3CC-1F3FE-200D-2640-FE0F",
				non_qualified: "1F3CC-1F3FE-200D-2640",
				image: "1f3cc-1f3fe-200d-2640-fe0f.png",
				sheet_x: 10,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3CC-1F3FF-200D-2640-FE0F",
				non_qualified: "1F3CC-1F3FF-200D-2640",
				image: "1f3cc-1f3ff-200d-2640-fe0f.png",
				sheet_x: 10,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Golfing",
		b: "1F3CC-FE0F-200D-2640-FE0F",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			10,
			14
		],
		o: 4
	},
	"flag-vc": {
		a: "St. Vincent & Grenadines Flag",
		b: "1F1FB-1F1E8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			47
		],
		o: 2
	},
	surfer: {
		skin_variations: {
			"1F3FB": {
				unified: "1F3C4-1F3FB",
				non_qualified: null,
				image: "1f3c4-1f3fb.png",
				sheet_x: 9,
				sheet_y: 20,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F3C4-1F3FC",
				non_qualified: null,
				image: "1f3c4-1f3fc.png",
				sheet_x: 9,
				sheet_y: 21,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F3C4-1F3FD",
				non_qualified: null,
				image: "1f3c4-1f3fd.png",
				sheet_x: 9,
				sheet_y: 22,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F3C4-1F3FE",
				non_qualified: null,
				image: "1f3c4-1f3fe.png",
				sheet_x: 9,
				sheet_y: 23,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F3C4-1F3FF",
				non_qualified: null,
				image: "1f3c4-1f3ff.png",
				sheet_x: 9,
				sheet_y: 24,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F3C4-200D-2642-FE0F",
		a: "Surfer",
		b: "1F3C4",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			9,
			19
		],
		o: 2
	},
	"man-surfing": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3C4-1F3FB-200D-2642-FE0F",
				non_qualified: "1F3C4-1F3FB-200D-2642",
				image: "1f3c4-1f3fb-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 14,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3C4-1F3FC-200D-2642-FE0F",
				non_qualified: "1F3C4-1F3FC-200D-2642",
				image: "1f3c4-1f3fc-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3C4-1F3FD-200D-2642-FE0F",
				non_qualified: "1F3C4-1F3FD-200D-2642",
				image: "1f3c4-1f3fd-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3C4-1F3FE-200D-2642-FE0F",
				non_qualified: "1F3C4-1F3FE-200D-2642",
				image: "1f3c4-1f3fe-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 17,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3C4-1F3FF-200D-2642-FE0F",
				non_qualified: "1F3C4-1F3FF-200D-2642",
				image: "1f3c4-1f3ff-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F3C4",
		a: "Man Surfing",
		b: "1F3C4-200D-2642-FE0F",
		c: "1F3C4-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			9,
			13
		],
		o: 4
	},
	"flag-ve": {
		a: "Venezuela Flag",
		b: "1F1FB-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			48
		],
		o: 2
	},
	"flag-vg": {
		a: "British Virgin Islands Flag",
		b: "1F1FB-1F1EC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			49
		],
		o: 2
	},
	"woman-surfing": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3C4-1F3FB-200D-2640-FE0F",
				non_qualified: "1F3C4-1F3FB-200D-2640",
				image: "1f3c4-1f3fb-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 8,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3C4-1F3FC-200D-2640-FE0F",
				non_qualified: "1F3C4-1F3FC-200D-2640",
				image: "1f3c4-1f3fc-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 9,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3C4-1F3FD-200D-2640-FE0F",
				non_qualified: "1F3C4-1F3FD-200D-2640",
				image: "1f3c4-1f3fd-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 10,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3C4-1F3FE-200D-2640-FE0F",
				non_qualified: "1F3C4-1F3FE-200D-2640",
				image: "1f3c4-1f3fe-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 11,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3C4-1F3FF-200D-2640-FE0F",
				non_qualified: "1F3C4-1F3FF-200D-2640",
				image: "1f3c4-1f3ff-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Surfing",
		b: "1F3C4-200D-2640-FE0F",
		c: "1F3C4-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			9,
			7
		],
		o: 4
	},
	rowboat: {
		skin_variations: {
			"1F3FB": {
				unified: "1F6A3-1F3FB",
				non_qualified: null,
				image: "1f6a3-1f3fb.png",
				sheet_x: 34,
				sheet_y: 47,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F6A3-1F3FC",
				non_qualified: null,
				image: "1f6a3-1f3fc.png",
				sheet_x: 34,
				sheet_y: 48,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F6A3-1F3FD",
				non_qualified: null,
				image: "1f6a3-1f3fd.png",
				sheet_x: 34,
				sheet_y: 49,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F6A3-1F3FE",
				non_qualified: null,
				image: "1f6a3-1f3fe.png",
				sheet_x: 34,
				sheet_y: 50,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F6A3-1F3FF",
				non_qualified: null,
				image: "1f6a3-1f3ff.png",
				sheet_x: 34,
				sheet_y: 51,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F6A3-200D-2642-FE0F",
		a: "Rowboat",
		b: "1F6A3",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			34,
			46
		],
		o: 2
	},
	"flag-vi": {
		a: "U.s. Virgin Islands Flag",
		b: "1F1FB-1F1EE",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			50
		],
		o: 2
	},
	"man-rowing-boat": {
		skin_variations: {
			"1F3FB": {
				unified: "1F6A3-1F3FB-200D-2642-FE0F",
				non_qualified: "1F6A3-1F3FB-200D-2642",
				image: "1f6a3-1f3fb-200d-2642-fe0f.png",
				sheet_x: 34,
				sheet_y: 41,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F6A3-1F3FC-200D-2642-FE0F",
				non_qualified: "1F6A3-1F3FC-200D-2642",
				image: "1f6a3-1f3fc-200d-2642-fe0f.png",
				sheet_x: 34,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F6A3-1F3FD-200D-2642-FE0F",
				non_qualified: "1F6A3-1F3FD-200D-2642",
				image: "1f6a3-1f3fd-200d-2642-fe0f.png",
				sheet_x: 34,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F6A3-1F3FE-200D-2642-FE0F",
				non_qualified: "1F6A3-1F3FE-200D-2642",
				image: "1f6a3-1f3fe-200d-2642-fe0f.png",
				sheet_x: 34,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F6A3-1F3FF-200D-2642-FE0F",
				non_qualified: "1F6A3-1F3FF-200D-2642",
				image: "1f6a3-1f3ff-200d-2642-fe0f.png",
				sheet_x: 34,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F6A3",
		a: "Man Rowing Boat",
		b: "1F6A3-200D-2642-FE0F",
		c: "1F6A3-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			34,
			40
		],
		o: 4
	},
	"flag-vn": {
		a: "Vietnam Flag",
		b: "1F1FB-1F1F3",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			51
		],
		o: 2
	},
	"flag-vu": {
		a: "Vanuatu Flag",
		b: "1F1FB-1F1FA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			52
		],
		o: 2
	},
	"woman-rowing-boat": {
		skin_variations: {
			"1F3FB": {
				unified: "1F6A3-1F3FB-200D-2640-FE0F",
				non_qualified: "1F6A3-1F3FB-200D-2640",
				image: "1f6a3-1f3fb-200d-2640-fe0f.png",
				sheet_x: 34,
				sheet_y: 35,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F6A3-1F3FC-200D-2640-FE0F",
				non_qualified: "1F6A3-1F3FC-200D-2640",
				image: "1f6a3-1f3fc-200d-2640-fe0f.png",
				sheet_x: 34,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F6A3-1F3FD-200D-2640-FE0F",
				non_qualified: "1F6A3-1F3FD-200D-2640",
				image: "1f6a3-1f3fd-200d-2640-fe0f.png",
				sheet_x: 34,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F6A3-1F3FE-200D-2640-FE0F",
				non_qualified: "1F6A3-1F3FE-200D-2640",
				image: "1f6a3-1f3fe-200d-2640-fe0f.png",
				sheet_x: 34,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F6A3-1F3FF-200D-2640-FE0F",
				non_qualified: "1F6A3-1F3FF-200D-2640",
				image: "1f6a3-1f3ff-200d-2640-fe0f.png",
				sheet_x: 34,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Rowing Boat",
		b: "1F6A3-200D-2640-FE0F",
		c: "1F6A3-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			34,
			34
		],
		o: 4
	},
	swimmer: {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CA-1F3FB",
				non_qualified: null,
				image: "1f3ca-1f3fb.png",
				sheet_x: 9,
				sheet_y: 48,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F3CA-1F3FC",
				non_qualified: null,
				image: "1f3ca-1f3fc.png",
				sheet_x: 9,
				sheet_y: 49,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F3CA-1F3FD",
				non_qualified: null,
				image: "1f3ca-1f3fd.png",
				sheet_x: 9,
				sheet_y: 50,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F3CA-1F3FE",
				non_qualified: null,
				image: "1f3ca-1f3fe.png",
				sheet_x: 9,
				sheet_y: 51,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F3CA-1F3FF",
				non_qualified: null,
				image: "1f3ca-1f3ff.png",
				sheet_x: 9,
				sheet_y: 52,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F3CA-200D-2642-FE0F",
		a: "Swimmer",
		b: "1F3CA",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			9,
			47
		],
		o: 2
	},
	"flag-wf": {
		a: "Wallis & Futuna Flag",
		b: "1F1FC-1F1EB",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			53
		],
		o: 2
	},
	"man-swimming": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CA-1F3FB-200D-2642-FE0F",
				non_qualified: "1F3CA-1F3FB-200D-2642",
				image: "1f3ca-1f3fb-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 42,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3CA-1F3FC-200D-2642-FE0F",
				non_qualified: "1F3CA-1F3FC-200D-2642",
				image: "1f3ca-1f3fc-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 43,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3CA-1F3FD-200D-2642-FE0F",
				non_qualified: "1F3CA-1F3FD-200D-2642",
				image: "1f3ca-1f3fd-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 44,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3CA-1F3FE-200D-2642-FE0F",
				non_qualified: "1F3CA-1F3FE-200D-2642",
				image: "1f3ca-1f3fe-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 45,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3CA-1F3FF-200D-2642-FE0F",
				non_qualified: "1F3CA-1F3FF-200D-2642",
				image: "1f3ca-1f3ff-200d-2642-fe0f.png",
				sheet_x: 9,
				sheet_y: 46,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F3CA",
		a: "Man Swimming",
		b: "1F3CA-200D-2642-FE0F",
		c: "1F3CA-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			9,
			41
		],
		o: 4
	},
	"flag-ws": {
		a: "Samoa Flag",
		b: "1F1FC-1F1F8",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			54
		],
		o: 2
	},
	"woman-swimming": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CA-1F3FB-200D-2640-FE0F",
				non_qualified: "1F3CA-1F3FB-200D-2640",
				image: "1f3ca-1f3fb-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3CA-1F3FC-200D-2640-FE0F",
				non_qualified: "1F3CA-1F3FC-200D-2640",
				image: "1f3ca-1f3fc-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3CA-1F3FD-200D-2640-FE0F",
				non_qualified: "1F3CA-1F3FD-200D-2640",
				image: "1f3ca-1f3fd-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3CA-1F3FE-200D-2640-FE0F",
				non_qualified: "1F3CA-1F3FE-200D-2640",
				image: "1f3ca-1f3fe-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3CA-1F3FF-200D-2640-FE0F",
				non_qualified: "1F3CA-1F3FF-200D-2640",
				image: "1f3ca-1f3ff-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Swimming",
		b: "1F3CA-200D-2640-FE0F",
		c: "1F3CA-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			9,
			35
		],
		o: 4
	},
	"flag-xk": {
		a: "Kosovo Flag",
		b: "1F1FD-1F1F0",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			55
		],
		o: 2
	},
	person_with_ball: {
		skin_variations: {
			"1F3FB": {
				unified: "26F9-1F3FB",
				non_qualified: null,
				image: "26f9-1f3fb.png",
				sheet_x: 54,
				sheet_y: 32,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "26F9-1F3FC",
				non_qualified: null,
				image: "26f9-1f3fc.png",
				sheet_x: 54,
				sheet_y: 33,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "26F9-1F3FD",
				non_qualified: null,
				image: "26f9-1f3fd.png",
				sheet_x: 54,
				sheet_y: 34,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "26F9-1F3FE",
				non_qualified: null,
				image: "26f9-1f3fe.png",
				sheet_x: 54,
				sheet_y: 35,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "26F9-1F3FF",
				non_qualified: null,
				image: "26f9-1f3ff.png",
				sheet_x: 54,
				sheet_y: 36,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "26F9-FE0F-200D-2642-FE0F",
		a: "Person with Ball",
		b: "26F9-FE0F",
		c: "26F9",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			54,
			31
		],
		o: 2
	},
	"flag-ye": {
		a: "Yemen Flag",
		b: "1F1FE-1F1EA",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			4,
			56
		],
		o: 2
	},
	"man-bouncing-ball": {
		skin_variations: {
			"1F3FB": {
				unified: "26F9-1F3FB-200D-2642-FE0F",
				non_qualified: "26F9-1F3FB-200D-2642",
				image: "26f9-1f3fb-200d-2642-fe0f.png",
				sheet_x: 54,
				sheet_y: 26,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "26F9-1F3FC-200D-2642-FE0F",
				non_qualified: "26F9-1F3FC-200D-2642",
				image: "26f9-1f3fc-200d-2642-fe0f.png",
				sheet_x: 54,
				sheet_y: 27,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "26F9-1F3FD-200D-2642-FE0F",
				non_qualified: "26F9-1F3FD-200D-2642",
				image: "26f9-1f3fd-200d-2642-fe0f.png",
				sheet_x: 54,
				sheet_y: 28,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "26F9-1F3FE-200D-2642-FE0F",
				non_qualified: "26F9-1F3FE-200D-2642",
				image: "26f9-1f3fe-200d-2642-fe0f.png",
				sheet_x: 54,
				sheet_y: 29,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "26F9-1F3FF-200D-2642-FE0F",
				non_qualified: "26F9-1F3FF-200D-2642",
				image: "26f9-1f3ff-200d-2642-fe0f.png",
				sheet_x: 54,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "26F9-FE0F",
		a: "Man Bouncing Ball",
		b: "26F9-FE0F-200D-2642-FE0F",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			54,
			25
		],
		o: 4
	},
	"flag-yt": {
		a: "Mayotte Flag",
		b: "1F1FE-1F1F9",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			0
		],
		o: 2
	},
	"woman-bouncing-ball": {
		skin_variations: {
			"1F3FB": {
				unified: "26F9-1F3FB-200D-2640-FE0F",
				non_qualified: "26F9-1F3FB-200D-2640",
				image: "26f9-1f3fb-200d-2640-fe0f.png",
				sheet_x: 54,
				sheet_y: 20,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "26F9-1F3FC-200D-2640-FE0F",
				non_qualified: "26F9-1F3FC-200D-2640",
				image: "26f9-1f3fc-200d-2640-fe0f.png",
				sheet_x: 54,
				sheet_y: 21,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "26F9-1F3FD-200D-2640-FE0F",
				non_qualified: "26F9-1F3FD-200D-2640",
				image: "26f9-1f3fd-200d-2640-fe0f.png",
				sheet_x: 54,
				sheet_y: 22,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "26F9-1F3FE-200D-2640-FE0F",
				non_qualified: "26F9-1F3FE-200D-2640",
				image: "26f9-1f3fe-200d-2640-fe0f.png",
				sheet_x: 54,
				sheet_y: 23,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "26F9-1F3FF-200D-2640-FE0F",
				non_qualified: "26F9-1F3FF-200D-2640",
				image: "26f9-1f3ff-200d-2640-fe0f.png",
				sheet_x: 54,
				sheet_y: 24,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Bouncing Ball",
		b: "26F9-FE0F-200D-2640-FE0F",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			54,
			19
		],
		o: 4
	},
	"flag-za": {
		a: "South Africa Flag",
		b: "1F1FF-1F1E6",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			1
		],
		o: 2
	},
	"flag-zm": {
		a: "Zambia Flag",
		b: "1F1FF-1F1F2",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			2
		],
		o: 2
	},
	weight_lifter: {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CB-1F3FB",
				non_qualified: null,
				image: "1f3cb-1f3fb.png",
				sheet_x: 10,
				sheet_y: 9,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F3CB-1F3FC",
				non_qualified: null,
				image: "1f3cb-1f3fc.png",
				sheet_x: 10,
				sheet_y: 10,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F3CB-1F3FD",
				non_qualified: null,
				image: "1f3cb-1f3fd.png",
				sheet_x: 10,
				sheet_y: 11,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F3CB-1F3FE",
				non_qualified: null,
				image: "1f3cb-1f3fe.png",
				sheet_x: 10,
				sheet_y: 12,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F3CB-1F3FF",
				non_qualified: null,
				image: "1f3cb-1f3ff.png",
				sheet_x: 10,
				sheet_y: 13,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F3CB-FE0F-200D-2642-FE0F",
		a: "Weight Lifter",
		b: "1F3CB-FE0F",
		c: "1F3CB",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			10,
			8
		],
		o: 2
	},
	"man-lifting-weights": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CB-1F3FB-200D-2642-FE0F",
				non_qualified: "1F3CB-1F3FB-200D-2642",
				image: "1f3cb-1f3fb-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 3,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3CB-1F3FC-200D-2642-FE0F",
				non_qualified: "1F3CB-1F3FC-200D-2642",
				image: "1f3cb-1f3fc-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 4,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3CB-1F3FD-200D-2642-FE0F",
				non_qualified: "1F3CB-1F3FD-200D-2642",
				image: "1f3cb-1f3fd-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 5,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3CB-1F3FE-200D-2642-FE0F",
				non_qualified: "1F3CB-1F3FE-200D-2642",
				image: "1f3cb-1f3fe-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 6,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3CB-1F3FF-200D-2642-FE0F",
				non_qualified: "1F3CB-1F3FF-200D-2642",
				image: "1f3cb-1f3ff-200d-2642-fe0f.png",
				sheet_x: 10,
				sheet_y: 7,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F3CB-FE0F",
		a: "Man Lifting Weights",
		b: "1F3CB-FE0F-200D-2642-FE0F",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			10,
			2
		],
		o: 4
	},
	"flag-zw": {
		a: "Zimbabwe Flag",
		b: "1F1FF-1F1FC",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			5,
			3
		],
		o: 2
	},
	"woman-lifting-weights": {
		skin_variations: {
			"1F3FB": {
				unified: "1F3CB-1F3FB-200D-2640-FE0F",
				non_qualified: "1F3CB-1F3FB-200D-2640",
				image: "1f3cb-1f3fb-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 54,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F3CB-1F3FC-200D-2640-FE0F",
				non_qualified: "1F3CB-1F3FC-200D-2640",
				image: "1f3cb-1f3fc-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 55,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F3CB-1F3FD-200D-2640-FE0F",
				non_qualified: "1F3CB-1F3FD-200D-2640",
				image: "1f3cb-1f3fd-200d-2640-fe0f.png",
				sheet_x: 9,
				sheet_y: 56,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F3CB-1F3FE-200D-2640-FE0F",
				non_qualified: "1F3CB-1F3FE-200D-2640",
				image: "1f3cb-1f3fe-200d-2640-fe0f.png",
				sheet_x: 10,
				sheet_y: 0,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F3CB-1F3FF-200D-2640-FE0F",
				non_qualified: "1F3CB-1F3FF-200D-2640",
				image: "1f3cb-1f3ff-200d-2640-fe0f.png",
				sheet_x: 10,
				sheet_y: 1,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Lifting Weights",
		b: "1F3CB-FE0F-200D-2640-FE0F",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			9,
			53
		],
		o: 4
	},
	"flag-england": {
		a: "England Flag",
		b: "1F3F4-E0067-E0062-E0065-E006E-E0067-E007F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			14
		],
		o: 5
	},
	bicyclist: {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B4-1F3FB",
				non_qualified: null,
				image: "1f6b4-1f3fb.png",
				sheet_x: 35,
				sheet_y: 24,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F6B4-1F3FC",
				non_qualified: null,
				image: "1f6b4-1f3fc.png",
				sheet_x: 35,
				sheet_y: 25,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F6B4-1F3FD",
				non_qualified: null,
				image: "1f6b4-1f3fd.png",
				sheet_x: 35,
				sheet_y: 26,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F6B4-1F3FE",
				non_qualified: null,
				image: "1f6b4-1f3fe.png",
				sheet_x: 35,
				sheet_y: 27,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F6B4-1F3FF",
				non_qualified: null,
				image: "1f6b4-1f3ff.png",
				sheet_x: 35,
				sheet_y: 28,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F6B4-200D-2642-FE0F",
		a: "Bicyclist",
		b: "1F6B4",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			35,
			23
		],
		o: 2
	},
	"flag-scotland": {
		a: "Scotland Flag",
		b: "1F3F4-E0067-E0062-E0073-E0063-E0074-E007F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			15
		],
		o: 5
	},
	"flag-wales": {
		a: "Wales Flag",
		b: "1F3F4-E0067-E0062-E0077-E006C-E0073-E007F",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			11,
			16
		],
		o: 5
	},
	"man-biking": {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B4-1F3FB-200D-2642-FE0F",
				non_qualified: "1F6B4-1F3FB-200D-2642",
				image: "1f6b4-1f3fb-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 18,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F6B4-1F3FC-200D-2642-FE0F",
				non_qualified: "1F6B4-1F3FC-200D-2642",
				image: "1f6b4-1f3fc-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 19,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F6B4-1F3FD-200D-2642-FE0F",
				non_qualified: "1F6B4-1F3FD-200D-2642",
				image: "1f6b4-1f3fd-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 20,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F6B4-1F3FE-200D-2642-FE0F",
				non_qualified: "1F6B4-1F3FE-200D-2642",
				image: "1f6b4-1f3fe-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 21,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F6B4-1F3FF-200D-2642-FE0F",
				non_qualified: "1F6B4-1F3FF-200D-2642",
				image: "1f6b4-1f3ff-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 22,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F6B4",
		a: "Man Biking",
		b: "1F6B4-200D-2642-FE0F",
		c: "1F6B4-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			35,
			17
		],
		o: 4
	},
	"woman-biking": {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B4-1F3FB-200D-2640-FE0F",
				non_qualified: "1F6B4-1F3FB-200D-2640",
				image: "1f6b4-1f3fb-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 12,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F6B4-1F3FC-200D-2640-FE0F",
				non_qualified: "1F6B4-1F3FC-200D-2640",
				image: "1f6b4-1f3fc-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 13,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F6B4-1F3FD-200D-2640-FE0F",
				non_qualified: "1F6B4-1F3FD-200D-2640",
				image: "1f6b4-1f3fd-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 14,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F6B4-1F3FE-200D-2640-FE0F",
				non_qualified: "1F6B4-1F3FE-200D-2640",
				image: "1f6b4-1f3fe-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 15,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F6B4-1F3FF-200D-2640-FE0F",
				non_qualified: "1F6B4-1F3FF-200D-2640",
				image: "1f6b4-1f3ff-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 16,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		a: "Woman Biking",
		b: "1F6B4-200D-2640-FE0F",
		c: "1F6B4-200D-2640",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			35,
			11
		],
		o: 4
	},
	mountain_bicyclist: {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B5-1F3FB",
				non_qualified: null,
				image: "1f6b5-1f3fb.png",
				sheet_x: 35,
				sheet_y: 42,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FC": {
				unified: "1F6B5-1F3FC",
				non_qualified: null,
				image: "1f6b5-1f3fc.png",
				sheet_x: 35,
				sheet_y: 43,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FD": {
				unified: "1F6B5-1F3FD",
				non_qualified: null,
				image: "1f6b5-1f3fd.png",
				sheet_x: 35,
				sheet_y: 44,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FE": {
				unified: "1F6B5-1F3FE",
				non_qualified: null,
				image: "1f6b5-1f3fe.png",
				sheet_x: 35,
				sheet_y: 45,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			},
			"1F3FF": {
				unified: "1F6B5-1F3FF",
				non_qualified: null,
				image: "1f6b5-1f3ff.png",
				sheet_x: 35,
				sheet_y: 46,
				added_in: "2.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: false
			}
		},
		obsoleted_by: "1F6B5-200D-2642-FE0F",
		a: "Mountain Bicyclist",
		b: "1F6B5",
		d: true,
		e: true,
		f: true,
		h: false,
		k: [
			35,
			41
		],
		o: 2
	},
	"man-mountain-biking": {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B5-1F3FB-200D-2642-FE0F",
				non_qualified: "1F6B5-1F3FB-200D-2642",
				image: "1f6b5-1f3fb-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 36,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F6B5-1F3FC-200D-2642-FE0F",
				non_qualified: "1F6B5-1F3FC-200D-2642",
				image: "1f6b5-1f3fc-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 37,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F6B5-1F3FD-200D-2642-FE0F",
				non_qualified: "1F6B5-1F3FD-200D-2642",
				image: "1f6b5-1f3fd-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 38,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F6B5-1F3FE-200D-2642-FE0F",
				non_qualified: "1F6B5-1F3FE-200D-2642",
				image: "1f6b5-1f3fe-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 39,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F6B5-1F3FF-200D-2642-FE0F",
				non_qualified: "1F6B5-1F3FF-200D-2642",
				image: "1f6b5-1f3ff-200d-2642-fe0f.png",
				sheet_x: 35,
				sheet_y: 40,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			}
		},
		obsoletes: "1F6B5",
		a: "Man Mountain Biking",
		b: "1F6B5-200D-2642-FE0F",
		c: "1F6B5-200D-2642",
		d: true,
		e: true,
		f: true,
		h: true,
		k: [
			35,
			35
		],
		o: 4
	},
	"woman-mountain-biking": {
		skin_variations: {
			"1F3FB": {
				unified: "1F6B5-1F3FB-200D-2640-FE0F",
				non_qualified: "1F6B5-1F3FB-200D-2640",
				image: "1f6b5-1f3fb-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 30,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FC": {
				unified: "1F6B5-1F3FC-200D-2640-FE0F",
				non_qualified: "1F6B5-1F3FC-200D-2640",
				image: "1f6b5-1f3fc-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 31,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FD": {
				unified: "1F6B5-1F3FD-200D-2640-FE0F",
				non_qualified: "1F6B5-1F3FD-200D-2640",
				image: "1f6b5-1f3fd-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 32,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FE": {
				unified: "1F6B5-1F3FE-200D-2640-FE0F",
				non_qualified: "1F6B5-1F3FE-200D-2640",
				image: "1f6b5-1f3fe-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 33,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
				has_img_facebook: true
			},
			"1F3FF": {
				unified: "1F6B5-1F3FF-200D-2640-FE0F",
				non_qualified: "1F6B5-1F3FF-200D-2640",
				image: "1f6b5-1f3ff-200d-2640-fe0f.png",
				sheet_x: 35,
				sheet_y: 34,
				added_in: "4.0",
				has_img_apple: true,
				has_img_google: true,
				has_img_twitter: true,
			}
		},
