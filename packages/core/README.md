# @storysdk/core

The complete StorySDK package that provides a high-level `Story` class for easy integration of interactive stories and onboarding experiences. This is the main package that most developers should use.

## Introduction

StorySDK is an open-source SDK and web service that makes it easy to create and integrate video stories and onboarding into mobile apps and websites. It provides a powerful solution for implementing story-based experiences similar to those found in major banking and social media apps, but accessible to indie developers without contracts, sales calls, or unnecessary hassle.

> **Please note:** StorySDK Core is built on React and requires it to be present in your project. React is NOT bundled with the library, including the CDN version. Detailed information is in the [Installation](#installation) section.

This package is part of the StorySDK monorepo and includes:
- **[@storysdk/react](../react)** - React components for rendering stories
- **[@storysdk/types](../types)** - TypeScript definitions and interfaces

For more information about the platform, visit [storysdk.com](https://storysdk.com).

## Features

- 🔓 **Open-source SDK**: Fully customizable and extendable solution
- 🎨 **Powerful Web Editor**: Create engaging stories through an intuitive web interface
- 🔌 **Multiple Integration Options**: 
  - Story widget for embedded experiences
  - Complete onboarding flows
  - Available for Web & iOS (React Native & Android coming soon)
- 📱 **Rich Media Support**: 
  - Photos
  - Videos
  - GIFs
- 🖱️ **Interactive Elements**: 
  - Buttons
  - Links
  - Polls
  - Other interactive components
- 📋 **Pre-made Templates**: Ready-to-use templates for onboarding and stories
- 📊 **Analytics**: 
  - Built-in analytics capabilities
  - Google Analytics integration
- 👥 **Team Collaboration**: Tools for team-based content creation and management
- ☁️ **Content Delivery**: CDN for photos & videos
- 🌐 **Localization Support**: Multi-language capabilities for global audiences
- 💰 **Transparent Pricing**: Clear pricing model without hidden costs

## Table of Contents

1. [Package Overview](#package-overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
   - [React](#react)
   - [Next.js](#nextjs)
   - [JavaScript (ES6)](#javascript-es6)
   - [Static HTML](#static-html)
   - [Shopify (Liquid)](#shopify-liquid)
4. [API Reference](#api-reference)
5. [Event Handling](#event-handling)
6. [Styling & Customization](#styling--customization)
7. [Troubleshooting](#troubleshooting)
8. [Performance Optimizations](#performance-optimizations)

## Package Overview

`@storysdk/core` is the main entry point for StorySDK and provides a complete, batteries-included solution for integrating interactive stories. This package follows a layered architecture:

### Package Dependencies

```
@storysdk/core
├── @storysdk/react     # React components and hooks
│   └── @storysdk/types # TypeScript definitions
└── @storysdk/types     # TypeScript definitions (direct dependency)
```

### What's Included

- **Story Class**: High-level API for story initialization and control
- **React Components**: All UI components via `@storysdk/react`
- **TypeScript Support**: Full type definitions via `@storysdk/types`
- **CSS Styling**: Pre-built styles and themes
- **Event System**: Comprehensive event handling and analytics
- **Performance Features**: Lazy loading, caching, and optimization

### When to Use This Package

Choose `@storysdk/core` when you:
- Want a simple, all-in-one solution
- Are new to StorySDK and want to get started quickly
- Need the high-level `Story` class API
- Want automatic dependency management
- Are building a standard web application or React app

### Alternative Packages

If you need more granular control, consider using individual packages:

- **[@storysdk/react](../react)** - For React-specific implementations with custom layouts
- **[@storysdk/types](../types)** - For custom integrations or when building extensions

### Core Features

The `Story` class provides these main methods:

```javascript
import { Story } from '@storysdk/core';

const story = new Story(token, options);

// Core methods
story.renderGroups(element);           // Render all story groups
story.updateToken(newToken);           // Update authentication token
story.destroy();                       // Clean up resources and unmount

// Event handling
story.on(eventType, callback);         // Listen to story events
story.off(eventType, callback);        // Remove event listeners
story.once(eventType, callback);       // Listen to event once

// Event emission (internal)
story.emit(eventType, data);           // Emit events (internal use)
```

## Installation

`@storysdk/core` is the recommended way to install StorySDK. It automatically includes all necessary dependencies (`@storysdk/react` and `@storysdk/types`) for a complete installation.

> **Important:** `@storysdk/core` uses React as a peer dependency. You need to install React in your project before using StorySDK.

### Dependencies

StorySDK will not work without React. It relies on React for rendering components and uses React hooks internally.

```bash
# Install React if it's not already installed in your project
npm install react react-dom

# Recommended versions: React 17.0.0 and above
# Minimum supported React version: 17.0.0 (with hooks support)
# Support for React 18 and React 19 (latest versions)
```

### Installing the Core Package

#### NPM

```bash
npm install @storysdk/core
```

#### Yarn

```bash
yarn add @storysdk/core
```

This single installation gives you access to:
- The main `Story` class from `@storysdk/core`
- All React components from `@storysdk/react`
- Complete TypeScript definitions from `@storysdk/types`

### Alternative: Individual Package Installation

If you prefer to manage dependencies manually or only need specific functionality:

```bash
# Install all packages individually
npm install @storysdk/types @storysdk/react @storysdk/core

# Or use only what you need
npm install @storysdk/types  # For TypeScript definitions only
npm install @storysdk/react  # For React components only
```

### CDN Installation

For static HTML projects, you can use the CDN version:

```html
<!-- Include React first (required dependency) -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Include StorySDK -->
<script src="https://unpkg.com/@storysdk/core@latest/dist/bundle.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@storysdk/core@latest/dist/bundle.css">
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

For use in vanilla JavaScript applications:

> **Important:** Even in pure JS applications, React is still required as a dependency, since StorySDK internally uses React for rendering components. You must include React separately or install it via npm/yarn.

```javascript
// First import React (if using npm/yarn)
import React from 'react';
import ReactDOM from 'react-dom';

// Then import StorySDK
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

> **Important:** React is NOT included in the CDN bundle. You need to include React and ReactDOM separately before loading StorySDK.

```html
<head>
  <!-- First include React -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  
  <!-- Then include StorySDK -->
  <script src="https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.min.js"></script>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.css"/>
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
      // The SDK instance is automatically created and available globally as window.storysdk
      
      // You can access the story instance methods directly:
      console.log(window.storysdk); // Access the Story instance
      
      // Example: Subscribe to events using the global instance
      window.storysdk.on('storyOpen', function(event) {
        console.log('Story opened:', event);
      });
    });
  </script>
</body>
```

### Shopify (Liquid)

StorySDK can be easily integrated into your Shopify store using theme sections. Follow these steps:

1. Add the following code to the `<head>` tag of your Shopify theme:

```html
<!-- First include React -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>

<!-- Then include StorySDK -->
<script src="https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.umd.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.css"/>
```

2. Create a section for StorySDK integration in your theme customizer:

```liquid
{% schema %}
{
  "name": "StorySDK Stories",
  "settings": [
    {
      "type": "text",
      "id": "sdk_token",
      "label": "StorySDK Token",
      "default": "<SDK_TOKEN_HERE>"
    },
    {
      "type": "number",
      "id": "container_height",
      "label": "Container Height (px)",
      "default": 100
    }
  ],
  "presets": [
    {
      "name": "StorySDK Stories",
      "category": "Interactive"
    }
  ]
}
{% endschema %}

<!-- StorySDK container -->
<div
  data-storysdk-token="{{ section.settings.sdk_token }}"
  style="min-height: {{ section.settings.container_height }}px;"
  id="storysdk"
></div>
```

This implementation allows you to:
- Add StorySDK to your Shopify theme through the theme customizer
- Configure your StorySDK token and container height directly from the Shopify admin
- Place the StorySDK container anywhere in your store through the theme editor

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
  GROUP_CLICK = 'groupClick',
  STORY_CLOSE = 'storyClose',
  STORY_OPEN = 'storyOpen',
  STORY_NEXT = 'storyNext',
  STORY_PREV = 'storyPrev',
  WIDGET_ANSWER = 'widgetAnswer',
  WIDGET_CLICK = 'widgetClick',
  MODAL_OPEN = 'storyModalOpen',
  MODAL_CLOSE = 'storyModalClose',
  DATA_LOADED = 'dataLoaded'
}
```

- `groupClose`: When a story group is closed (provides group ID, user ID, viewing duration in seconds, and language)
- `groupOpen`: When a story group is opened (provides user ID, group ID, start time, and language)
- `groupClick`: When a story group item is clicked (provides group ID, user ID)
- `storyClose`: When a story is closed (provides group ID, story ID, user ID, viewing duration, and language)
- `storyOpen`: When a specific story is opened (provides group ID, story ID, user ID, and language)
- `storyNext`: When navigating to the next story (provides group ID, story ID, user ID, and language)
- `storyPrev`: When navigating to the previous story (provides group ID, story ID, user ID, and language)
- `widgetAnswer`: When a user responds to an interactive widget (polls, quizzes, etc.)
- `widgetClick`: When a widget within a story is clicked (buttons, links, swipe up actions)
- `storyModalOpen`: When the story modal/fullscreen view is opened
- `storyModalClose`: When the story modal/fullscreen view is closed
- `dataLoaded`: When story groups data has been loaded from the API

### Widget Click Event

The `widgetClick` event is fired when a user interacts with clickable elements in a story. The event provides detailed information about the interaction through its payload.

#### Event Structure

```typescript
interface WidgetClickEvent {
  detail: {
    widget: 'button' | 'link' | 'swipe_up';  // Type of widget that was clicked
    actionType?: string;                     // Present for button widgets, indicates the action type
    userId: string;                          // Unique user identifier
    storyId: string;                         // ID of the story containing the widget
    widgetId: string;                        // ID of the clicked widget
    data: {
      url?: string;                          // URL to navigate to (if applicable)
      storyId?: string;                      // Target story ID (for navigation between stories)
      customFields?: Record<string, any>;    // Additional custom data (for buttons only)
    }
  }
}
```

#### Example Usage

```javascript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Listen for widget click events
story.on(StoryEventTypes.WIDGET_CLICK, (event) => {
  console.log("Widget type:", event.detail.widget);
  
  // Handle different widget types
  switch(event.detail.widget) {
    case 'button':
      console.log("Button clicked:", event.detail.widgetId);
      console.log("Action type:", event.detail.actionType);
      console.log("Custom fields:", event.detail.data.customFields);
      break;
    
    case 'link':
      console.log("Link clicked:", event.detail.widgetId);
      console.log("URL:", event.detail.data.url);
      break;
      
    case 'swipe_up':
      console.log("Swipe up action triggered");
      console.log("URL:", event.detail.data.url);
      break;
  }
  
  // You can also track these events in your analytics system
  trackWidgetInteraction(event.detail);
});
```

#### Implementation Notes

- Button widgets include an `actionType` field and may contain `customFields` for additional context
- Link widgets provide the target URL in the `data.url` field
- Swipe up actions are similar to links but represent a different user interaction pattern
- All widget events include user, story, and widget identifiers for comprehensive tracking

### Widget Answer Event

The `widgetAnswer` event is fired when a user responds to an interactive widget. This event provides data about the user's response.

#### Supported Widget Types

The `widgetAnswer` event is available for the following widget types:

```typescript
enum WidgetTypes {
  SLIDER = 'slider',
  QUESTION = 'question',
  TALK_ABOUT = 'talk_about',
  EMOJI_REACTION = 'emoji_reaction',
  CHOOSE_ANSWER = 'choose_answer',
  QUIZ_ONE_ANSWER = 'quiz_one_answer',
  QUIZ_MULTIPLE_ANSWERS = 'quiz_multiple_answers',
  QUIZ_OPEN_ANSWER = 'quiz_open_answer',
  QUIZ_MULTIPLE_ANSWER_WITH_IMAGE = 'quiz_one_multiple_with_image',
  QUIZ_RATE = 'quiz_rate'
}
```

#### Event Structure

```typescript
interface WidgetAnswerEvent {
  detail: {
    widget: WidgetTypes;           // Type of interactive widget from the enum above
    userId: string;                // Unique user identifier
    storyId: string;               // ID of the story containing the widget
    widgetId: string;              // ID of the widget that received the answer
    data: {
      answer: any;                 // The user's response/selection
    }
  }
}
```

#### Example Usage

```javascript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Listen for widget answer events
story.on(StoryEventTypes.WIDGET_ANSWER, (event) => {
  console.log("Widget type:", event.detail.widget);
  console.log("User's answer:", event.detail.data.answer);
  
  // You can handle different widget types
  switch(event.detail.widget) {
    case 'slider':
      console.log("Slider value selected:", event.detail.data.answer);
      break;
      
    case 'quiz_one_answer':
      console.log("Quiz answer submitted:", event.detail.data.answer);
      // Check if answer is correct and provide feedback
      break;
      
    case 'emoji_reaction':
      console.log("Emoji reaction:", event.detail.data.answer);
      break;
      
    // Handle other interactive widget types
  }
  
  // Store user response for analytics or personalization
  saveUserResponse(event.detail.userId, event.detail.widgetId, event.detail.data.answer);
});
```

#### Implementation Notes

- The `widget` field identifies the specific type of interactive element from the `WidgetTypes` enum
- The `answer` field can contain various data types depending on the widget (string, number, object, array)
- This event is useful for:
  - Collecting user feedback
  - Building personalization features
  - Creating dynamic, interactive story experiences
  - Analyzing user engagement with interactive elements

### Group Open Event

The `groupOpen` event is fired when a user opens a story group. This event provides information about which group was opened and by whom.

#### Event Structure

```typescript
interface GroupOpenEvent {
  detail: {
    uniqUserId: string;          // Unique identifier for the user
    groupId: string;             // ID of the story group that was opened
    startTime: number;           // Timestamp when the group was opened
    language: string;            // Language setting for the content
  }
}
```

#### Example Usage

```javascript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Listen for group open events
story.on(StoryEventTypes.GROUP_OPEN, (event) => {
  console.log("Group opened:", event.detail.groupId);
  console.log("User:", event.detail.uniqUserId);
  console.log("Time:", new Date(event.detail.startTime).toLocaleString());
  console.log("Language:", event.detail.language);
  
  // You can use this event to:
  
  // 1. Track user engagement
  trackGroupView(event.detail.uniqUserId, event.detail.groupId);
  
  // 2. Calculate viewing session duration (when combined with GROUP_CLOSE)
  startViewingSession(event.detail.groupId, event.detail.startTime);
  
  // 3. Adapt content based on language
  if (event.detail.language !== userPreferredLanguage) {
    // Suggest language change or record language preference
  }
});
```

#### Implementation Notes

- The `startTime` is provided as a numeric timestamp which can be converted to a Date object
- The `language` field can be used for analytics or to ensure proper localization
- This event is typically paired with `groupClose` to track complete interaction sessions
- This event is useful for:
  - Monitoring which story groups are most popular
  - Analyzing user behavior patterns
  - Building recommendation engines based on user preferences

### Group Close Event

The `groupClose` event is fired when a user closes a story group. This event provides information about which group was closed and how long the user interacted with it.

#### Event Structure

```typescript
interface GroupCloseEvent {
  detail: {
    groupId: string;             // ID of the story group that was closed
    uniqUserId: string;          // Unique identifier for the user
    duration: number;            // Duration in seconds that the group was viewed
    language: string;            // Language setting for the content
  }
}
```

#### Example Usage

```javascript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Listen for group close events
story.on(StoryEventTypes.GROUP_CLOSE, (event) => {
  console.log("Group closed:", event.detail.groupId);
  console.log("User:", event.detail.uniqUserId);
  console.log("Viewing duration (seconds):", event.detail.duration);
  console.log("Language:", event.detail.language);
  
  // You can use this event to:
  
  // 1. Track engagement metrics
  updateEngagementMetrics(
    event.detail.groupId, 
    event.detail.uniqUserId, 
    event.detail.duration
  );
  
  // 2. Identify popular content
  if (event.detail.duration > 30) {
    markAsHighEngagement(event.detail.groupId);
  }
  
  // 3. Complete user session tracking (when combined with GROUP_OPEN)
  completeViewingSession(
    event.detail.groupId, 
    event.detail.uniqUserId, 
    event.detail.duration
  );
});
```

#### Implementation Notes

- The `duration` is provided in seconds, useful for calculating engagement metrics
- This event complements the `groupOpen` event for complete session analysis
- Comparing duration across different groups can help identify the most engaging content
- This event is useful for:
  - Measuring content effectiveness
  - Identifying drop-off points in user flows
  - Optimizing story sequences based on engagement patterns
  - Building analytics dashboards for content performance

### Story Open Event

The `storyOpen` event is fired when a user opens an individual story within a group. This event provides information about which specific story was opened.

#### Event Structure

```typescript
interface StoryOpenEvent {
  detail: {
    groupId: string;             // ID of the parent story group
    storyId: string;             // ID of the specific story that was opened
    uniqUserId: string;          // Unique identifier for the user
    language: string;            // Language setting for the content
  }
}
```

#### Example Usage

```javascript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Listen for story open events
story.on(StoryEventTypes.STORY_OPEN, (event) => {
  console.log("Story opened:", event.detail.storyId);
  console.log("In group:", event.detail.groupId);
  console.log("User:", event.detail.uniqUserId);
  console.log("Language:", event.detail.language);
  
  // You can use this event to:
  
  // 1. Track individual story views
  trackStoryView(
    event.detail.storyId, 
    event.detail.groupId, 
    event.detail.uniqUserId
  );
  
  // 2. Record story sequence progression
  updateUserProgress(
    event.detail.uniqUserId,
    event.detail.groupId,
    event.detail.storyId
  );
  
  // 3. Trigger external integrations based on specific story views
  if (isKeyStory(event.detail.storyId)) {
    triggerExternalEvent(event.detail.storyId, event.detail.uniqUserId);
  }
});
```

#### Implementation Notes

- This event is fired at the individual story level, as opposed to the group level
- It contains both the story ID and its parent group ID for hierarchical tracking
- A single user session will typically trigger multiple story open events as the user progresses
- This event is useful for:
  - Analyzing navigation patterns within story groups
  - Building progression funnels to identify drop-off points
  - Tracking which individual stories drive user engagement
  - Creating personalized experiences based on story viewing history

### Story Close Event

The `storyClose` event is fired when a user finishes viewing an individual story. This event provides information about which story was viewed and for how long.

#### Event Structure

```typescript
interface StoryCloseEvent {
  detail: {
    groupId: string;             // ID of the parent story group
    storyId: string;             // ID of the story that was closed
    uniqUserId: string;          // Unique identifier for the user
    duration: number;            // Duration in seconds that the story was viewed
    language: string;            // Language setting for the content
  }
}
```

#### Example Usage

```javascript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Listen for story close events
story.on(StoryEventTypes.STORY_CLOSE, (event) => {
  console.log("Story closed:", event.detail.storyId);
  console.log("In group:", event.detail.groupId);
  console.log("User:", event.detail.uniqUserId);
  console.log("Viewing duration (seconds):", event.detail.duration);
  console.log("Language:", event.detail.language);
  
  // You can use this event to:
  
  // 1. Track individual story engagement
  trackStoryEngagement(
    event.detail.storyId,
    event.detail.duration,
    event.detail.uniqUserId
  );
  
  // 2. Identify stories with high completion rates
  if (event.detail.duration >= getExpectedDuration(event.detail.storyId)) {
    markAsFullyViewed(event.detail.storyId, event.detail.uniqUserId);
  }
  
  // 3. Complete story view tracking (when combined with STORY_OPEN)
  completeStoryViewSession(
    event.detail.storyId, 
    event.detail.uniqUserId, 
    event.detail.duration
  );
});
```

#### Implementation Notes

- The `duration` field indicates how long the user viewed the story in seconds
- This event complements the `storyOpen` event for complete story viewing analysis
- Short durations may indicate skipped or unengaging content
- This event is useful for:
  - Determining which stories hold user attention the longest
  - Calculating completion rates for individual stories
  - Refining content based on viewing patterns
  - Building detailed analytics for story-level engagement

### Story Next Event

The `storyNext` event is fired when a user navigates to the next story in a sequence. This event helps track user navigation patterns.

#### Event Structure

```typescript
interface StoryNextEvent {
  detail: {
    groupId: string;             // ID of the parent story group
    storyId: string;             // ID of the story being navigated to
    uniqUserId: string;          // Unique identifier for the user
    language: string;            // Language setting for the content
  }
}
```

#### Example Usage

```javascript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Listen for story next navigation events
story.on(StoryEventTypes.STORY_NEXT, (event) => {
  console.log("Navigated to next story:", event.detail.storyId);
  console.log("In group:", event.detail.groupId);
  console.log("User:", event.detail.uniqUserId);
  console.log("Language:", event.detail.language);
  
  // You can use this event to:
  
  // 1. Track forward navigation patterns
  trackForwardNavigation(
    event.detail.groupId,
    event.detail.storyId,
    event.detail.uniqUserId
  );
  
  // 2. Analyze user flow through stories
  updateUserFlowAnalytics(
    event.detail.uniqUserId,
    'next',
    event.detail.storyId
  );
  
  // 3. Log sequential story viewing behavior
  logSequentialProgress(event.detail.uniqUserId, event.detail.storyId);
});
```

### Story Previous Event

The `storyPrev` event is fired when a user navigates to the previous story in a sequence. This event helps identify when users revisit content.

#### Event Structure

```typescript
interface StoryPrevEvent {
  detail: {
    groupId: string;             // ID of the parent story group
    storyId: string;             // ID of the story being navigated to
    uniqUserId: string;          // Unique identifier for the user
    language: string;            // Language setting for the content
  }
}
```

#### Example Usage

```javascript
import { Story, StoryEventTypes } from "@storysdk/core";

const story = new Story("<APP_TOKEN_HERE>");

// Listen for story previous navigation events
story.on(StoryEventTypes.STORY_PREV, (event) => {
  console.log("Navigated to previous story:", event.detail.storyId);
  console.log("In group:", event.detail.groupId);
  console.log("User:", event.detail.uniqUserId);
  console.log("Language:", event.detail.language);
  
  // You can use this event to:
  
  // 1. Track backward navigation patterns
  trackBackwardNavigation(
    event.detail.groupId,
    event.detail.storyId,
    event.detail.uniqUserId
  );
  
  // 2. Identify potentially confusing content
  if (isHighBackwardNavigationRate(event.detail.storyId)) {
    flagForContentReview(event.detail.storyId);
  }
  
  // 3. Analyze user review behavior
  updateUserFlowAnalytics(
    event.detail.uniqUserId,
    'previous',
    event.detail.storyId
  );
});
```

#### Implementation Notes for Navigation Events

- Both `storyNext` and `storyPrev` events have identical structures but represent different navigation actions
- The `storyId` in these events refers to the story being navigated TO (not from)
- High rates of backward navigation may indicate confusing content or users reviewing important information
- These events are useful for:
  - Creating flow diagrams of user navigation patterns
  - Identifying content that users frequently revisit
  - Optimizing story sequences based on navigation behavior
  - Understanding how users interact with story sequences

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

2. **React not found / Invalid hook call errors**
   - StorySDK requires React as a peer dependency
   - Make sure you have installed React: `npm install react react-dom`
   - When using the CDN version, ensure you've included React and ReactDOM before loading StorySDK:
     ```html
     <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
     <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
     ```
   - Check that the React version you're using is compatible with StorySDK (17.0.0 or higher, including React 19)
   - If you have multiple instances of React in your application, this may cause issues with hooks

3. **Initialization issues**
   - When using the static HTML approach, make sure the `data-storysdk-token` attribute is correctly set
   - If manually initializing, ensure the container element exists in the DOM before calling `renderGroups()`

4. **Cleanup issues**
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

## Performance Optimizations

The StorySDK has been optimized for fast initial rendering. Key optimizations include:

### Skeleton Loader
The SDK now uses a two-phase rendering strategy:
1. First, it renders a lightweight skeleton loader for immediate visual feedback
2. Then it loads the actual content progressively

### Progressive Loading Strategy
- App data is loaded first
- Group placeholders are shown immediately 
- Stories are loaded in batches, prioritizing the active group
- Font loading is non-blocking
- Analytics initialization is deferred

### Developer Options
You can improve first render performance by:
- Pre-caching key API responses
- Adding the critical CSS to your page's `<head>`
- Using the `preconnect` hint for API endpoints

```html
<!-- Add these to your HTML head for even faster loading -->
<link rel="preconnect" href="https://api.storysdk.com">
<style>
  /* Critical skeleton styles */
  .critical-skeleton-styles {
    width: 100%;
    animation: pulse 1.5s infinite;
    background: linear-gradient(
      90deg,
      rgba(190, 190, 190, 0.2) 25%,
      rgba(129, 129, 129, 0.24) 37%,
      rgba(190, 190, 190, 0.2) 63%
    );
    background-size: 400% 100%;
  }
  
  @keyframes pulse {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
  }
</style>
```
