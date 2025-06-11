# @storysdk/react

React components and hooks for StorySDK. This package provides a comprehensive set of React components for rendering interactive stories and onboarding experiences with full TypeScript support.

## Installation

```bash
npm install @storysdk/react
```

**Note**: This package automatically includes `@storysdk/types` as a dependency. If you're using the full SDK, install `@storysdk/core` instead, which includes this package.

## Overview

`@storysdk/react` offers:
- **React Components** for rendering stories and individual widgets
- **TypeScript Support** with full type definitions from `@storysdk/types`
- **Hooks** for story state management and interactions
- **Styling** with customizable CSS and themes
- **Performance** optimized rendering with React best practices

## Package Architecture

This package depends on `@storysdk/types` for TypeScript definitions and provides the React layer for the StorySDK ecosystem:

```
@storysdk/react
└── @storysdk/types (TypeScript definitions)
```

## Basic Usage

### Simple Story Rendering

```jsx
import { GroupsList } from "@storysdk/react"; 
import "@storysdk/react/dist/bundle.css";

function StoryComponent() {
  const groups = [
    {
      id: 'group-1',
      name: 'Welcome Stories',
      // ... group configuration
    }
  ];

  return (
    <GroupsList 
      groups={groups}
      token="your-app-token"
    />
  );
}

export default StoryComponent;
```

### With TypeScript

```tsx
import { GroupsList, GroupType } from "@storysdk/react";
import "@storysdk/react/dist/bundle.css";

interface StoryComponentProps {
  groups: GroupType[];
  token: string;
  onStoryComplete?: (groupId: string) => void;
}

function StoryComponent({ groups, token, onStoryComplete }: StoryComponentProps) {
  return (
    <GroupsList 
      groups={groups}
      token={token}
      onStoryComplete={onStoryComplete}
    />
  );
}

export default StoryComponent;
```

## Components

### GroupsList

Main component for rendering multiple story groups with comprehensive customization options:

```jsx
import { GroupsList } from "@storysdk/react";

<GroupsList
  // Required props
  groups={groupsArray}                    // Array of GroupType
  groupView="circle"                      // 'circle' | 'square' | 'bigSquare' | 'rectangle'
  
  // Authentication
  token="your-token"                      // Your StorySDK token
  
  // Appearance customization
  groupImageWidth={68}                    // Width of group images (default: 68)
  groupImageHeight={68}                   // Height of group images (default: 68)
  groupTitleSize={16}                     // Font size for group titles (default: 16)
  activeGroupOutlineColor="#ff6b35"       // Color for active group outline
  groupsOutlineColor="#cccccc"            // Color for inactive group outlines
  backgroundColor="#ffffff"               // Background color for stories
  arrowsColor="#000000"                   // Color for navigation arrows
  
  // CSS customization
  groupClassName="custom-group"           // CSS class for individual groups
  groupsClassName="custom-groups"         // CSS class for groups container
  
  // Story display options
  storyWidth={320}                        // Story modal width
  storyHeight={568}                       // Story modal height
  isShowMockup={true}                     // Show device mockup
  isShowLabel={true}                      // Show story labels
  isStatusBarActive={true}                // Show status bar in stories
  
  // Behavior options
  autoplay={false}                        // Auto-open first story
  startGroupId="group-id"                 // ID of group to start with
  startStoryId="story-id"                 // ID of story to start with
  forbidClose={false}                     // Prevent closing stories
  isForceCloseAvailable={true}            // Show force close button
  preventCloseOnGroupClick={false}        // Prevent closing on group click
  openInExternalModal={false}             // Open in external modal
  isOnlyGroups={false}                    // Show only groups, no stories
  
  // Environment options
  isInReactNativeWebView={false}          // React Native WebView mode
  
  // Loading state
  isLoading={false}                       // Show loading state
  
  // Container reference
  container={elementRef.current}          // Container element reference
  
  // Event handlers
  onOpenGroup={(groupId) => console.log('Group opened:', groupId)}
  onCloseGroup={(groupId) => console.log('Group closed:', groupId)}
  onOpenStory={(groupId, storyId) => console.log('Story opened:', storyId)}
  onCloseStory={(groupId, storyId, duration) => console.log('Story closed:', storyId, 'Duration:', duration)}
  onNextStory={(groupId, storyId) => console.log('Next story:', storyId)}
  onPrevStory={(groupId, storyId) => console.log('Previous story:', storyId)}
  onModalOpen={(groupId, storyId) => console.log('Modal opened:', storyId)}
  onModalClose={(groupId, storyId) => console.log('Modal closed:', storyId)}
  onStartQuiz={(groupId, storyId) => console.log('Quiz started')}
  onFinishQuiz={(groupId, storyId) => console.log('Quiz finished')}
/>
```

#### GroupsList Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `groups` | `Group[]` | **required** | Array of story groups to display |
| `groupView` | `'circle' \| 'square' \| 'bigSquare' \| 'rectangle'` | **required** | Visual style for group items |
| `token` | `string` | `undefined` | StorySDK authentication token |
| `groupImageWidth` | `number` | `68` | Width of group thumbnails in pixels |
| `groupImageHeight` | `number` | `68` | Height of group thumbnails in pixels |
| `groupTitleSize` | `number` | `16` | Font size for group titles |
| `activeGroupOutlineColor` | `string` | `undefined` | Hex color for active group border |
| `groupsOutlineColor` | `string` | `undefined` | Hex color for inactive group borders |
| `backgroundColor` | `string` | `undefined` | Background color for story modal |
| `arrowsColor` | `string` | `undefined` | Color for navigation arrows |
| `groupClassName` | `string` | `undefined` | CSS class for individual group items |
| `groupsClassName` | `string` | `undefined` | CSS class for groups container |
| `storyWidth` | `number` | `undefined` | Width of story modal |
| `storyHeight` | `number` | `undefined` | Height of story modal |
| `isShowMockup` | `boolean` | `false` | Display device mockup around stories |
| `isShowLabel` | `boolean` | `false` | Show story title labels |
| `isStatusBarActive` | `boolean` | `false` | Show status bar in story view |
| `autoplay` | `boolean` | `false` | Automatically open first story |
| `startGroupId` | `string` | `undefined` | ID of group to highlight initially |
| `startStoryId` | `string` | `undefined` | ID of story to open initially |
| `forbidClose` | `boolean` | `false` | Prevent users from closing stories |
| `isForceCloseAvailable` | `boolean` | `true` | Show force close button |
| `preventCloseOnGroupClick` | `boolean` | `false` | Don't close modal when clicking group |
| `openInExternalModal` | `boolean` | `false` | Open stories in external modal |
| `isOnlyGroups` | `boolean` | `false` | Only render groups, no story modal |
| `isInReactNativeWebView` | `boolean` | `false` | Enable React Native WebView mode |
| `isLoading` | `boolean` | `false` | Show loading state |
| `container` | `Element \| HTMLDivElement \| null` | `null` | Container element reference |

### Individual Widget Components

For custom layouts, you can use individual widget components:

```jsx
import { 
  TextWidget, 
  ImageWidget, 
  VideoWidget, 
  QuizWidget 
} from "@storysdk/react";

// Custom story layout
function CustomStoryLayout({ story }) {
  return (
    <div className="custom-story">
      {story.widgets.map(widget => {
        switch (widget.type) {
          case 'text':
            return <TextWidget key={widget.id} {...widget.params} />;
          case 'image':
            return <ImageWidget key={widget.id} {...widget.params} />;
          case 'video':
            return <VideoWidget key={widget.id} {...widget.params} />;
          case 'quiz':
            return <QuizWidget key={widget.id} {...widget.params} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
```

## Hooks

The package includes several utility hooks for enhanced React integration:

### Available Hooks

- **`useInterval`** - Provides interval functionality with React lifecycle
- **`useAdaptiveValue`** - Adapts values based on screen size or conditions
- **`useAnswersCache`** - Caches user answers for better performance
- **`useLocalStorage`** - Local storage integration with React state
- **`useStoryCache`** - Caches story data for improved loading
- **`useGroupCache`** - Caches group data for better performance
- **`useSwipe`** - Touch/swipe gesture handling
- **`useDebounced`** - Debounced value updates
- **`useElementSize`** - Track element size changes

### Example Usage

```jsx
import { 
  useLocalStorage, 
  useDebounced, 
  useSwipe 
} from "@storysdk/react";

function CustomStoryComponent() {
  const [viewedStories, setViewedStories] = useLocalStorage('viewedStories', []);
  const debouncedSearch = useDebounced(searchTerm, 300);
  
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => console.log('Swiped left'),
    onSwipeRight: () => console.log('Swiped right'),
  });

  return (
    <div {...swipeHandlers}>
      {/* Your story content */}
    </div>
  );
}
```

## Framework Integration

### Next.js

For Next.js applications, use dynamic imports to avoid SSR issues:

```jsx
import dynamic from 'next/dynamic';
import '@storysdk/react/dist/bundle.css';

// Component file (components/StoryComponent.tsx)
const StoryComponent = dynamic(
  () => import('../components/StoryComponent'),
  { 
    ssr: false,
    loading: () => <div>Loading stories...</div>
  }
);

// Page file
export default function HomePage() {
  return (
    <div>
      <h1>My Next.js App</h1>
      <StoryComponent />
    </div>
  );
}
```

### Gatsby

```jsx
// gatsby-ssr.js and gatsby-browser.js
import '@storysdk/react/dist/bundle.css';

// Component
import React from 'react';

const StoryComponent = React.lazy(() => import('../components/StoryComponent'));

function MyPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <StoryComponent />
    </React.Suspense>
  );
}
```

## Styling and Customization

### CSS Custom Properties

Override default styling with CSS variables:

```css
:root {
  --storysdk-primary-color: #your-brand-color;
  --storysdk-secondary-color: #your-secondary-color;
  --storysdk-border-radius: 12px;
  --storysdk-font-family: 'Your Font', sans-serif;
}
```

### Theme Configuration

```jsx
import { GroupsList, ThemeProvider } from "@storysdk/react";

const customTheme = {
  colors: {
    primary: '#ff6b35',
    secondary: '#004e64',
    background: '#ffffff',
    text: '#333333'
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      small: '14px',
      medium: '16px',
      large: '18px'
    }
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  }
};

function ThemedStories() {
  return (
    <ThemeProvider theme={customTheme}>
      <GroupsList groups={groups} token={token} />
    </ThemeProvider>
  );
}
```

## Performance

### Code Splitting

```jsx
import { lazy, Suspense } from 'react';

// Lazy load story components
const StoryComponent = lazy(() => 
  import('@storysdk/react').then(module => ({ 
    default: module.GroupsList 
  }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading stories...</div>}>
      <StoryComponent groups={groups} token={token} />
    </Suspense>
  );
}
```

### Memory Management

```jsx
import { useEffect, useRef } from 'react';
import { GroupsList } from '@storysdk/react';

function OptimizedStoryComponent({ groups, token }) {
  const storyRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (storyRef.current) {
        storyRef.current.destroy();
      }
    };
  }, []);

  return (
    <GroupsList
      ref={storyRef}
      groups={groups}
      token={token}
      preloadNextStory={false} // Disable preloading for memory optimization
      maxCacheSize={5}         // Limit cached stories
    />
  );
}
```

## TypeScript Support

Full TypeScript support with types from `@storysdk/types`:

```typescript
import { 
  GroupType, 
  WidgetType, 
  GroupsListProps,
  StoryEventHandler 
} from '@storysdk/react';

// All props are fully typed
const storyProps: GroupsListProps = {
  groups: groupsArray,  // GroupType[]
  token: 'your-token',  // string
  onStoryStart: (groupId: string) => void,
  onStoryComplete: (groupId: string) => void
};
```

## Migration from @storysdk/core

If you're using the high-level `Story` class from `@storysdk/core`, you can optionally migrate to React components for better React integration:

```jsx
// Current approach (with @storysdk/core)
import { Story } from '@storysdk/core';
import { useRef, useEffect } from 'react';

function StoryComponent({ token }) {
  const ref = useRef(null);

  useEffect(() => {
    const story = new Story(token);
    story.renderGroups(ref.current);
    
    return () => story.destroy();
  }, [token]);

  return <div ref={ref} />;
}

// Alternative approach (with @storysdk/react)
import { GroupsList } from '@storysdk/react';

function StoryComponent({ groups, token }) {
  return <GroupsList groups={groups} token={token} />;
}
```

**Note**: The `@storysdk/core` approach is still the recommended method for most use cases. Use `@storysdk/react` components directly only when you need custom layouts or fine-grained control over individual story elements.

## Related Packages

- **[@storysdk/types](../types)** - TypeScript definitions (included automatically)
- **[@storysdk/core](../core)** - Complete SDK with this package included

## Resources

- [StorySDK Website](https://storysdk.com)
- [Full Documentation](https://docs.storysdk.com)
- [TypeScript Examples](https://github.com/storysdk/examples)
