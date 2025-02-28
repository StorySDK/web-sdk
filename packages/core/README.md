## Introduction

StorySDK is an open-source SDK and web service that makes it easy to create and integrate video stories and onboarding into mobile apps and websites. It provides a powerful solution for implementing story-based experiences similar to those found in major banking and social media apps, but accessible to indie developers without contracts, sales calls, or unnecessary hassle.

This SDK is part of the StorySDK platform, which is available at [storysdk.com](https://storysdk.com).

## Features

- **Open-source SDK**: Fully customizable and extendable solution
- **Powerful Web Editor**: Create engaging stories through an intuitive web interface
- **Multiple Integration Options**: 
  - Story widget for embedded experiences
  - Complete onboarding flows
  - Available for Web & iOS (React Native & Android coming soon)
- **Rich Media Support**: 
  - Photos
  - Videos
  - GIFs
- **Interactive Elements**: 
  - Buttons
  - Links
  - Polls
  - Other interactive components
- **Pre-made Templates**: Ready-to-use templates for onboarding and stories
- **Analytics**: 
  - Built-in analytics capabilities
  - Google Analytics integration
- **Team Collaboration**: Tools for team-based content creation and management
- **Content Delivery**: CDN for photos & videos
- **Localization Support**: Multi-language capabilities for global audiences
- **Transparent Pricing**: Clear pricing model without hidden costs

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
   - [React](#react)
   - [Next.js](#nextjs)
   - [JavaScript (ES6)](#javascript-es6)
   - [Static HTML](#static-html)
3. [API Reference](#api-reference)
4. [Event Handling](#event-handling)
5. [Styling & Customization](#styling--customization)
6. [Troubleshooting](#troubleshooting)

## Installation

### NPM

```bash
npm install @storysdk/core
```

### Yarn

```bash
yarn add @storysdk/core
```

## Basic Usage

### React

To integrate StorySDK in a React application:

```jsx
import { Story } from "@storysdk/core"; 
import "@storysdk/core/dist/bundle.css";
import { useRef, useEffect } from "react";

function StoryComponent() {
  const ref = useRef(null);

  useEffect(() => {
    const story = new Story("<APP_TOKEN_HERE>");

    const element = ref.current;
    story.renderGroups(element);
    
    // Cleanup function
    return () => {
      story.destroy();
    };
  }, []);

  return <div ref={ref} style={{ minHeight: "100px" }}></div>;
}

export default StoryComponent;
```

### Next.js

When using StorySDK with Next.js, you need to load the component dynamically without server-side rendering:

```jsx
// In your page or component file
import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import CSS statically
import '@storysdk/core/dist/bundle.css';

// Dynamically import the StoryComponent with SSR disabled
const StoryComponent = dynamic(
  () => import('../components/StoryComponent'),
  { ssr: false }
);

function HomePage() {
  return (
    <div>
      <h1>My Next.js App</h1>
      <StoryComponent token="<APP_TOKEN_HERE>" />
    </div>
  );
}

export default HomePage;
```

Then in your component file (`components/StoryComponent.js`):

```jsx
import { useRef, useEffect } from 'react';

function StoryComponent({ token, options = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    // Only import and initialize the Story SDK on the client side
    const { Story } = require('@storysdk/core');
    const story = new Story(token, options);
    
    const element = ref.current;
    if (element) {
      story.renderGroups(element);
    }
    
    return () => {
      story.destroy();
    };
  }, [token, options]);

  return <div ref={ref} style={{ minHeight: "100px" }}></div>;
}

export default StoryComponent;
```

### JavaScript (ES6)

For vanilla JavaScript applications:

```javascript
import { Story } from "@storysdk/core"; 
import "@storysdk/core/dist/bundle.css";

document.addEventListener("DOMContentLoaded", () => {
  const story = new Story("<APP_TOKEN_HERE>");

  const element = document.querySelector("<SELECTOR_HERE>");
  story.renderGroups(element);
});
```

### Static HTML

For static HTML pages:

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.min.js"></script>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.css">
</head>
<body>
  <div 
    data-storysdk-token="<APP_TOKEN_HERE>" 
    style="min-height: 100px;" 
    id="storysdk"
  ></div>
  
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      // The SDK will automatically initialize using the data-storysdk-token attribute
    });
  </script>
</body>
```

## API Reference

### `Story` Class

The main class for interacting with the StorySDK.

#### Constructor

```javascript
const story = new Story(token, options);
```

**Parameters:**

- `token` (string, required): Your application token provided by StorySDK
- `options` (object, optional): Configuration options for StorySDK

#### Options

```typescript
{
  // Appearance options
  groupImageWidth?: number;           // Width of group thumbnail images
  groupImageHeight?: number;          // Height of group thumbnail images
  groupTitleSize?: number;            // Font size for group titles
  activeGroupOutlineColor?: string;   // Color of the outline for active group
  groupsOutlineColor?: string;        // Color of the outline for inactive groups
  arrowsColor?: string;               // Color of navigation arrows
  backgroundColor?: string;           // Background color
  
  // Layout options
  storyWidth?: number;                // Width of story viewer (only 360 is supported)
  storyHeight?: number;               // Height of story viewer (only 640 or 780 are supported)
  isShowMockup?: boolean;             // Show device mockup around story
  isShowLabel?: boolean;              // Show labels
  isStatusBarActive?: boolean;        // Show status bar
  
  // Behavior options
  autoplay?: boolean;                 // Automatically play stories
  forbidClose?: boolean;              // Prevent user from closing the story
  openInExternalModal?: boolean;      // Open stories in a modal
  
  // Selection options
  groupId?: string;                   // Initial group ID to display
  startStoryId?: string;              // Initial story ID to display
  
  // CSS classes
  groupClassName?: string;            // Custom CSS class for individual groups
  groupsClassName?: string;           // Custom CSS class for the groups container
  
  // Development options
  isDebugMode?: boolean;              // Enable debug mode
}
```

#### Methods

##### `renderGroups(container)`

Renders story groups in the specified element.

**Parameters:**
- `container` (HTMLElement, optional): The DOM element to render stories in. If not provided, the container specified during initialization will be used.

**Returns:** void

##### `destroy()`

Cleans up resources used by the Story instance, unmounting React components.

**Returns:** void

##### `on<T = any>(eventName, listener)`

Subscribes to a story event.

**Parameters:**
- `eventName` (StoryEventTypes): Name of the event to subscribe to
- `listener` (function): Callback function to execute when the event occurs

**Returns:** Function to unsubscribe from the event

##### `off<T = any>(eventName, listener)`

Removes a specific event listener.

**Parameters:**
- `eventName` (StoryEventTypes): Name of the event
- `listener` (function): The listener function to remove

**Returns:** void

##### `once<T = any>(eventName, listener)`

Subscribes to an event for one time only. The listener automatically unsubscribes after being called once.

**Parameters:**
- `eventName` (StoryEventTypes): Name of the event to subscribe to
- `listener` (function): Callback function to execute when the event occurs

**Returns:** Function to unsubscribe from the event

## Event Handling

StorySDK uses a TypeScript-based event system for handling interactions with stories. You can subscribe to these events using the `on` method:

```typescript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Subscribe to widget click events
story.on(StoryEventTypes.WIDGET_CLICK, (event) => {
  console.log("Widget clicked:", event);
});

// Subscribe to story open events - using once for one-time handling
story.once(StoryEventTypes.STORY_OPEN, (event) => {
  console.log("Story opened (will only log once):", event);
});

// You can also store the unsubscribe function
const unsubscribe = story.on(StoryEventTypes.STORY_NEXT, (event) => {
  console.log("Next story:", event);
});

// Later, you can unsubscribe
unsubscribe();

// Alternatively, use the off method directly
const onPrevHandler = (event) => {
  console.log("Previous story:", event);
};
story.on(StoryEventTypes.STORY_PREV, onPrevHandler);
// Later, remove the handler
story.off(StoryEventTypes.STORY_PREV, onPrevHandler);
```

### Available Events

StorySDK provides the following event types:

```typescript
enum StoryEventTypes {
  GROUP_CLOSE = 'groupClose',
  GROUP_OPEN = 'groupOpen',
  STORY_CLOSE = 'storyClose',
  STORY_OPEN = 'storyOpen',
  STORY_NEXT = 'storyNext',
  STORY_PREV = 'storyPrev',
  WINDGET_ANSWER = 'widgetAnswer',
  WIDGET_CLICK = 'widgetClick'
}
```

- `groupClose`: When a story group is closed
- `groupOpen`: When a story group is opened
- `storyClose`: When a story is closed
- `storyOpen`: When a specific story is opened
- `storyNext`: When navigating to the next story
- `storyPrev`: When navigating to the previous story
- `widgetAnswer`: When a user answers an interactive widget
- `widgetClick`: When a widget within a story is clicked

## Styling & Customization

### HTML Data Attributes

You can configure StorySDK using HTML data attributes in static HTML implementations:

```html
<div 
  data-storysdk-token="<APP_TOKEN_HERE>"
  data-storysdk-group-image-width="60"
  data-storysdk-group-image-height="60" 
  data-storysdk-group-title-size="12"
  data-storysdk-active-group-outline-color="#FF5500"
  data-storysdk-groups-outline-color="#CCCCCC"
  data-storysdk-group-class-name="custom-group"
  data-storysdk-groups-class-name="custom-groups"
  data-storysdk-autoplay="true"
  data-storysdk-arrows-color="#000000"
  data-storysdk-background-color="#FFFFFF"
></div>
```

### Custom CSS Classes

Apply custom styling using the provided class name options:

```javascript
const story = new Story("<APP_TOKEN_HERE>", {
  groupClassName: "my-custom-group",
  groupsClassName: "my-custom-groups-container"
});
```

Then in your CSS:

```css
.my-custom-group {
  margin: 0 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.my-custom-groups-container {
  padding: 10px;
  background-color: #f9f9f9;
}
```



## Troubleshooting

### Debug Mode

Enable debug mode to see detailed logging of API requests and responses:

```javascript
const story = new Story("<APP_TOKEN_HERE>", {
  isDebugMode: true
});
```

With debug mode enabled:
- API requests and responses will be logged to the console
- If a `#storysdk-debug` element exists in your DOM, debug information will be appended there

### Common Issues

1. **Stories not appearing**
   - Verify your app token is correct
   - Ensure the target element has sufficient height (min-height: 100px recommended)
   - Check browser console for errors
   - Make sure you've imported the CSS: `import "@storysdk/core/dist/bundle.css";`

2. **Initialization issues**
   - When using the static HTML approach, make sure the `data-storysdk-token` attribute is correctly set
   - If manually initializing, ensure the container element exists in the DOM before calling `renderGroups()`

3. **Cleanup issues**
   - Always call `destroy()` when unmounting your component to prevent memory leaks

### Browser Support

StorySDK supports all modern browsers:
- Chrome (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Edge (latest versions)

## License and Support

StorySDK is an open-source software available for developers. For technical support, more information, or to explore the powerful web editor and other features, please visit [storysdk.com](https://storysdk.com) or refer to the GitHub repository at `@storysdk/core`.

StorySDK offers transparent pricing without hidden costs. Visit the website for current pricing information.

For comprehensive documentation, including advanced usage guides, API references, and tutorials, visit [docs.storysdk.com](https://docs.storysdk.com/).